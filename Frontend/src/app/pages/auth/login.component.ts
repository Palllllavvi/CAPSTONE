import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="card auth-card">
        <div class="auth-header">
          <div class="auth-icon">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2>Sign in to Secure<span class="text-gradient">360</span></h2>
          <p>Access your equipment policies, income protections & claims</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Quick Demo Credentials Box -->
        <div class="demo-box">
          <div class="demo-title">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Quick Demo Logins
          </div>
          <div class="demo-buttons">
            <button type="button" (click)="fillDemo('freelancer')" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-laptop"></i> Freelancer (Priya)
            </button>
            <button type="button" (click)="fillDemo('admin')" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-shield-halved"></i> Underwriter Admin
            </button>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Work Email Address</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="credentials.email"
              name="email"
              required
              class="form-control"
              placeholder="e.g. priya@example.com"
            />
          </div>

          <div class="form-group">
            <div class="form-label">
              <label for="password">Password</label>
              <a href="javascript:void(0)" class="forgot-link">Forgot?</a>
            </div>
            <input
              type="password"
              id="password"
              [(ngModel)]="credentials.password"
              name="password"
              required
              class="form-control"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" [disabled]="loading" class="btn btn-primary w-100 btn-submit">
            <i *ngIf="loading" class="fa-solid fa-spinner fa-spin"></i>
            <span *ngIf="!loading">Sign In to Dashboard</span>
            <span *ngIf="loading">Authenticating...</span>
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a routerLink="/auth/register">Create Freelancer Account</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 200px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: var(--grad-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #fff;
      margin: 0 auto 1.25rem;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
    }

    .auth-header h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }

    .auth-header p {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .demo-box {
      background: rgba(59, 130, 246, 0.08);
      border: 1px dashed rgba(59, 130, 246, 0.3);
      border-radius: var(--radius-md);
      padding: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .demo-title {
      font-size: 0.78rem;
      font-weight: 600;
      color: #93c5fd;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .demo-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .demo-buttons button {
      flex: 1;
      font-size: 0.78rem;
      padding: 0.4rem;
    }

    .forgot-link {
      font-size: 0.8rem;
      color: var(--primary);
    }

    .btn-submit {
      margin-top: 1rem;
      padding: 0.85rem;
      font-size: 1rem;
    }

    .w-100 {
      width: 100%;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.88rem;
      color: var(--text-secondary);
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.5rem;
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginRequest = {
    email: '',
    password: ''
  };

  loading = false;
  errorMessage = '';

  fillDemo(role: 'freelancer' | 'admin'): void {
    if (role === 'freelancer') {
      this.credentials.email = 'priya@example.com';
      this.credentials.password = 'Secure@123';
    } else {
      this.credentials.email = 'admin@secure360.com';
      this.credentials.password = 'Admin@123';
    }
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.data.role === 'ADMIN' || response.data.role === 'UNDERWRITER') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Invalid credentials. Please verify your email and password.';
      }
    });
  }
}
