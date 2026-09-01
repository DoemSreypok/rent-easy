import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/flowchart.model';

export interface AuthResponse {
  success?: boolean;
  status?: string;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());
  userRole = computed(() => (this.currentUser()?.role || 'GUEST').toUpperCase());

  isAdmin = computed(() => {
    const r = this.userRole();
    return r === 'ADMIN';
  });

  isLandlord = computed(() => {
    const r = this.userRole();
    return r === 'LANDLORD' || r === 'OWNER';
  });

  isOwner = computed(() => this.isLandlord());

  isTenant = computed(() => {
    const r = this.userRole();
    return r === 'TENANT';
  });

  canAccessOwnerFeatures = computed(() => this.isLandlord() || this.isAdmin());
  canAccessTenantFeatures = computed(() => this.isTenant() || this.isAdmin());
  canAccessAdminFeatures = computed(() => this.isAdmin());

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const savedUser = localStorage.getItem('renteasy_user');
    const savedToken = localStorage.getItem('renteasy_token');
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUser.set(user);
        this.token.set(savedToken);
      } catch {
        this.logout();
      }
    }
  }

  register(payload: {
    fullName?: string;
    name?: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
    role: 'ADMIN' | 'LANDLORD' | 'TENANT' | 'owner' | 'tenant' | string;
    employment?: string;
    annualIncome?: string;
  }): Observable<AuthResponse> {
    const body = {
      ...payload,
      fullName: payload.fullName || payload.name,
      name: payload.name || payload.fullName,
      role: (payload.role || 'TENANT').toUpperCase() === 'OWNER' ? 'LANDLORD' : (payload.role || 'TENANT').toUpperCase()
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, body).pipe(
      tap((res) => {
        if (res?.data?.user && res?.data?.token) {
          this.handleAuthSuccess(res.data.user, res.data.token);
        }
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        if (res?.data?.user && res?.data?.token) {
          this.handleAuthSuccess(res.data.user, res.data.token);
        }
      })
    );
  }

  quickLoginAs(role: 'ADMIN' | 'LANDLORD' | 'TENANT' | 'owner' | 'tenant' | 'admin'): Observable<AuthResponse> {
    const r = role.toUpperCase();
    let email = 'tenant@renteasy.com';
    let password = 'Tenant123!';

    if (r === 'ADMIN') {
      email = 'admin@renteasy.com';
      password = 'Admin123!';
    } else if (r === 'LANDLORD' || r === 'OWNER') {
      email = 'landlord@renteasy.com';
      password = 'Landlord123!';
    } else if (r === 'TENANT') {
      email = 'tenant@renteasy.com';
      password = 'Tenant123!';
    }

    return this.login(email, password);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/change-password`, { currentPassword, newPassword });
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('renteasy_user');
    localStorage.removeItem('renteasy_token');
  }

  handleAuthSuccess(user: User, token: string): void {
    this.currentUser.set(user);
    this.token.set(token);
    localStorage.setItem('renteasy_user', JSON.stringify(user));
    localStorage.setItem('renteasy_token', token);
  }
}
