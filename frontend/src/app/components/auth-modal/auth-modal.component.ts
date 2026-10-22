import { Component, signal, output, inject, input, OnInit } from '@angular/core';
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
export class AuthModalComponent implements OnInit {
  authService = inject(AuthService);

  initialMode = input<'login' | 'register' | 'forgot'>('login');
  initialRole = input<'TENANT' | 'LANDLORD' | 'ADMIN' | 'tenant' | 'owner'>('TENANT');

  onClose = output<void>();
  onSuccess = output<void>();

  mode = signal<'login' | 'register' | 'forgot'>('login');
  role = signal<'TENANT' | 'LANDLORD' | 'ADMIN'>('TENANT');

  // Password Visibility Toggles
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  // Form Fields
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  confirmPassword = signal<string>('');
  phone = signal<string>('');
  employment = signal<string>('');
  annualIncome = signal<string>('');
  rememberMe = signal<boolean>(true);

  // Forgot / Reset Password Flow State
  forgotStep = signal<1 | 2>(1);
  resetToken = signal<string>('');
  newPassword = signal<string>('');
  confirmNewPassword = signal<string>('');

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successInfoMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (this.initialMode()) {
      this.mode.set(this.initialMode());
    }
    if (this.initialRole()) {
      const r = (this.initialRole() || '').toUpperCase();
      this.role.set(r === 'OWNER' ? 'LANDLORD' : (r as any) || 'TENANT');
    }
  }

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  setMode(newMode: 'login' | 'register' | 'forgot', defaultRole?: 'TENANT' | 'LANDLORD' | 'ADMIN' | 'tenant' | 'owner'): void {
    this.mode.set(newMode);
    if (defaultRole) {
      const r = defaultRole.toUpperCase();
      this.role.set(r === 'OWNER' ? 'LANDLORD' : (r as any));
    }
    this.errorMessage.set(null);
    this.successInfoMessage.set(null);
    this.forgotStep.set(1);
  }

  // Real-time password strength calculation
  getPasswordStrength(): { score: number; label: string; color: string; width: string } {
    const pwd = this.password();
    if (!pwd) return { score: 0, label: '', color: '#cbd5e1', width: '0%' };

    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: '#ef4444', width: '25%' };
    if (score <= 50) return { score, label: 'Fair', color: '#f59e0b', width: '50%' };
    if (score <= 75) return { score, label: 'Good', color: '#3b82f6', width: '75%' };
    return { score, label: 'Strong', color: '#10b981', width: '100%' };
  }

  isEmailValid(): boolean {
    const em = this.email().trim();
    if (!em) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
  }

  doPasswordsMatch(): boolean {
    if (!this.password() || !this.confirmPassword()) return true;
    return this.password() === this.confirmPassword();
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successInfoMessage.set(null);

    // FORGOT / RESET FLOW
    if (this.mode() === 'forgot') {
      if (this.forgotStep() === 1) {
        if (!this.email().trim()) {
          this.errorMessage.set('Please enter your account email.');
          return;
        }
        this.isLoading.set(true);
        this.authService.forgotPassword(this.email().trim()).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            if (res?.data?.resetToken || res?.resetToken) {
              const token = res.data?.resetToken || res.resetToken;
              this.resetToken.set(token);
              this.forgotStep.set(2);
              this.successInfoMessage.set('Reset token generated! Enter your new password below.');
            } else {
              this.successInfoMessage.set('If an account exists with this email, instructions have been sent.');
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(err.error?.message || 'Error requesting password reset.');
          }
        });
        return;
      } else {
        // Step 2: Reset Password
        if (!this.newPassword().trim()) {
          this.errorMessage.set('Please enter a new password.');
          return;
        }
        if (this.newPassword() !== this.confirmNewPassword()) {
          this.errorMessage.set('Passwords do not match.');
          return;
        }
        this.isLoading.set(true);
        this.authService.resetPassword(this.resetToken().trim(), this.newPassword().trim()).subscribe({
          next: () => {
            this.isLoading.set(false);
            this.successInfoMessage.set('Password reset successful! You are now logged in.');
            setTimeout(() => {
              this.onSuccess.emit();
              this.onClose.emit();
            }, 800);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.errorMessage.set(err.error?.message || 'Failed to reset password.');
          }
        });
        return;
      }
    }

    // LOGIN FLOW
    if (this.mode() === 'login') {
      if (!this.email().trim() || !this.password().trim()) {
        this.errorMessage.set('Please enter your email and password.');
        return;
      }

      this.isLoading.set(true);
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
      return;
    }

    // REGISTER FLOW
    if (this.mode() === 'register') {
      if (!this.name().trim()) {
        this.errorMessage.set('Please provide your full name.');
        return;
      }
      if (!this.email().trim()) {
        this.errorMessage.set('Please provide a valid email address.');
        return;
      }
      if (!this.password().trim()) {
        this.errorMessage.set('Please provide a password.');
        return;
      }
      if (this.password().length < 6) {
        this.errorMessage.set('Password should be at least 6 characters long.');
        return;
      }
      if (this.confirmPassword().trim() && this.password() !== this.confirmPassword()) {
        this.errorMessage.set('Password and Confirmation Password do not match.');
        return;
      }

      this.isLoading.set(true);
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
}
