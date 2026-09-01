import { Component, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent {
  authService = inject(AuthService);

  onClose = output<void>();
  onSuccess = output<void>();

  mode = signal<'login' | 'register' | 'forgot'>('login');
  role = signal<'TENANT' | 'LANDLORD' | 'ADMIN'>('TENANT');

  // Password Visibility Toggle
  showPassword = signal<boolean>(false);

  // Form State
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');
  phone = signal<string>('');
  employment = signal<string>('');
  annualIncome = signal<string>('');

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successInfoMessage = signal<string | null>(null);

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  setMode(newMode: 'login' | 'register' | 'forgot', defaultRole?: 'TENANT' | 'LANDLORD' | 'ADMIN' | 'tenant' | 'owner'): void {
    this.mode.set(newMode);
    if (defaultRole) {
      const r = defaultRole.toUpperCase();
      this.role.set(r === 'OWNER' ? 'LANDLORD' : (r as any));
    }
    this.errorMessage.set(null);
    this.successInfoMessage.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successInfoMessage.set(null);

    if (this.mode() === 'forgot') {
      if (!this.email().trim()) {
        this.errorMessage.set('Please enter your account email.');
        return;
      }
      this.isLoading.set(true);
      this.authService.forgotPassword(this.email().trim()).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.successInfoMessage.set('Password reset instructions generated! For development, reset token ready.');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Error requesting password reset.');
        }
      });
      return;
    }

    if (!this.email().trim() || !this.password().trim()) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    this.isLoading.set(true);

    if (this.mode() === 'login') {
      this.authService.login(this.email().trim(), this.password().trim()).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.onSuccess.emit();
          this.onClose.emit();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Invalid email or password. Please try again.');
        }
      });
    } else {
      if (!this.name().trim()) {
        this.isLoading.set(false);
        this.errorMessage.set('Please enter your full name.');
        return;
      }

      if (this.confirmPassword().trim() && this.password().trim() !== this.confirmPassword().trim()) {
        this.isLoading.set(false);
        this.errorMessage.set('Password and Confirmation Password do not match.');
        return;
      }

      this.authService.register({
        fullName: this.name().trim(),
        name: this.name().trim(),
        email: this.email().trim(),
        password: this.password().trim(),
        confirmPassword: this.confirmPassword().trim(),
        role: this.role(),
        phone: this.phone().trim(),
        employment: this.employment().trim(),
        annualIncome: this.annualIncome().trim()
      }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.onSuccess.emit();
          this.onClose.emit();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.message || 'Registration failed. Email might already exist.');
        }
      });
    }
  }

  fillCredentials(targetRole: 'ADMIN' | 'LANDLORD' | 'TENANT' | 'owner' | 'tenant' | 'admin'): void {
    this.mode.set('login');
    this.errorMessage.set(null);
    this.successInfoMessage.set(null);

    const r = targetRole.toUpperCase();
    if (r === 'ADMIN') {
      this.email.set('admin@renteasy.com');
      this.password.set('Admin123!');
    } else if (r === 'LANDLORD' || r === 'OWNER') {
      this.email.set('landlord@renteasy.com');
      this.password.set('Landlord123!');
    } else {
      this.email.set('tenant@renteasy.com');
      this.password.set('Tenant123!');
    }
  }
}
