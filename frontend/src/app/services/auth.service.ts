import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'tenant' | 'owner' | 'admin';
  phone?: string;
  avatar?: string;
  employment?: string;
  annualIncome?: string;
  creditScore?: number;
}

export interface AuthResponse {
  status: string;
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
  isTenant = computed(() => this.currentUser()?.role === 'tenant');
  isOwner = computed(() => this.currentUser()?.role === 'owner');
  userRole = computed(() => this.currentUser()?.role || 'guest');

  canAccessOwnerFeatures = computed(() => this.isOwner());
  canAccessTenantFeatures = computed(() => this.isTenant());

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const savedUser = localStorage.getItem('renteasy_user');
    const savedToken = localStorage.getItem('renteasy_token');
    if (savedUser && savedToken) {
      try {
        this.currentUser.set(JSON.parse(savedUser));
        this.token.set(savedToken);
      } catch {
        this.logout();
      }
    }
  }

  register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'tenant' | 'owner';
    phone?: string;
    employment?: string;
    annualIncome?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap((res) => {
        this.handleAuthSuccess(res.data.user, res.data.token);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        this.handleAuthSuccess(res.data.user, res.data.token);
      })
    );
  }

  quickLoginAs(role: 'tenant' | 'owner'): Observable<AuthResponse> {
    const email = role === 'tenant' ? 'sophie@renteasy.com' : 'alexander@renteasy.com';
    const password = 'password123';
    return this.login(email, password);
  }

  logout(): void {
    this.currentUser.set(null);
    this.token.set(null);
    localStorage.removeItem('renteasy_user');
    localStorage.removeItem('renteasy_token');
  }

  private handleAuthSuccess(user: User, token: string): void {
    this.currentUser.set(user);
    this.token.set(token);
    localStorage.setItem('renteasy_user', JSON.stringify(user));
    localStorage.setItem('renteasy_token', token);
  }
}
