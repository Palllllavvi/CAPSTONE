import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="card auth-card">
        <div class="auth-header">
          <div class="auth-icon">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <h2>Join Secure<span class="text-gradient">360</span></h2>
          <p>Protect your gear, contracts, and revenue stream in minutes</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ successMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              [(ngModel)]="formData.fullName"
              name="fullName"
              required
              class="form-control"
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="email">Work Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="formData.email"
              name="email"
              required
              class="form-control"
              placeholder="priya@example.com"
            />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="formData.password"
                name="password"
                required
                class="form-control"
                placeholder="••••••••"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="role">Account Role</label>
              <select id="role" [(ngModel)]="formData.role" name="role" class="form-select">
                <option value="FREELANCER">Freelancer (Contractor)</option>
                <option value="CLIENT">Client (Enterprise)</option>
              </select>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="hourlyRate">Hourly Rate (USD)</label>
              <input
                type="number"
                id="hourlyRate"
                [(ngModel)]="formData.hourlyRate"
                name="hourlyRate"
                class="form-control"
                placeholder="75"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                [(ngModel)]="formData.phoneNumber"
                name="phoneNumber"
                class="form-control"
                placeholder="+1 555-0199"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="bio">Primary Freelance Discipline</label>
            <input
              type="text"
              id="bio"
              [(ngModel)]="formData.bio"
              name="bio"
              class="form-control"
              placeholder="e.g. Senior Mobile Engineer, Video Producer, Cloud Architect"
            />
          </div>

          <button type="submit" [disabled]="loading" class="btn btn-primary w-100 btn-submit">
            <i *ngIf="loading" class="fa-solid fa-spinner fa-spin"></i>
            <span *ngIf="!loading">Create Protected Account</span>
            <span *ngIf="loading">Creating Account...</span>
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/auth/login">Sign In</a>
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
      padding: 2.5rem 1rem;
    }

    .auth-card {
      width: 100%;
      max-width: 520px;
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  formData: RegisterRequest = {
    email: '',
    password: '',
    fullName: '',
    role: 'FREELANCER',
    hourlyRate: 75,
    bio: '',
    phoneNumber: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  onSubmit(): void {
    if (!this.formData.email || !this.formData.password || !this.formData.fullName) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Account created successfully! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1200);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed. That email might already be registered.';
      }
    });
  }
}
