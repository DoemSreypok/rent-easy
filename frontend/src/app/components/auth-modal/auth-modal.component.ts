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

  mode = signal<'login' | 'register'>('login');
  role = signal<'tenant' | 'owner'>('tenant');

  // Password Visibility Toggle
  showPassword = signal<boolean>(false);

  // Form State
  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  phone = signal<string>('');
  employment = signal<string>('');
  annualIncome = signal<string>('');

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  setMode(newMode: 'login' | 'register', defaultRole?: 'tenant' | 'owner'): void {
    this.mode.set(newMode);
    if (defaultRole) this.role.set(defaultRole);
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

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

      this.authService.register({
        name: this.name().trim(),
        email: this.email().trim(),
        password: this.password().trim(),
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

  fillCredentials(role: 'tenant' | 'owner'): void {
    this.mode.set('login');
    this.errorMessage.set(null);
    if (role === 'tenant') {
      this.email.set('pinky@renteasy.com');
      this.password.set('password123');
    } else {
      this.email.set('lyden@renteasy.com');
      this.password.set('password123');
    }
  }
}
