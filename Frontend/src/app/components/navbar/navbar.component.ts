import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar-wrapper">
      <div class="container navbar-content">
        <a routerLink="/" class="logo">
          <div class="logo-icon">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <span class="logo-text">Secure<span class="logo-highlight">360</span></span>
          <span class="logo-tag">Freelance Protect</span>
        </a>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            <i class="fa-solid fa-house"></i> Home
          </a>
          <a routerLink="/equipment" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-laptop-code"></i> Equipment Liability
          </a>
          <a routerLink="/income" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-sack-dollar"></i> Income Assurance
          </a>
          <a *ngIf="auth.isAuthenticated()" routerLink="/claims" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-file-shield"></i> Claims Center
          </a>
          <a *ngIf="auth.isAuthenticated()" routerLink="/dashboard" routerLinkActive="active" class="nav-link">
            <i class="fa-solid fa-gauge-high"></i> Dashboard
          </a>
          <a *ngIf="auth.isUnderwriter() || auth.isAdmin()" routerLink="/admin" routerLinkActive="active" class="nav-link nav-link-admin">
            <i class="fa-solid fa-user-shield"></i> Admin Portal
          </a>
        </nav>

        <div class="nav-actions">
          <ng-container *ngIf="auth.currentUser() as user; else guestActions">
            <div class="user-badge">
              <div class="avatar">{{ user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U' }}</div>
              <div class="user-info">
                <span class="user-name">{{ user.fullName }}</span>
                <span class="user-role">{{ user.role }}</span>
              </div>
            </div>
            <button (click)="logout()" class="btn btn-secondary btn-sm" title="Log Out">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </ng-container>
          <ng-template #guestActions>
            <a routerLink="/auth/login" class="btn btn-secondary btn-sm">Log In</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm">Get Covered</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      background: rgba(13, 18, 31, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
    }

    .logo-icon {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: var(--grad-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1.15rem;
      box-shadow: 0 0 14px rgba(59, 130, 246, 0.4);
    }

    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.03em;
    }

    .logo-highlight {
      color: var(--primary);
    }

    .logo-tag {
      font-size: 0.7rem;
      background: rgba(59, 130, 246, 0.12);
      color: var(--accent-cyan);
      border: 1px solid rgba(6, 182, 212, 0.25);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 0.25rem;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.9rem;
      border-radius: var(--radius-md);
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      text-decoration: none;
    }

    .nav-link:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.04);
    }

    .nav-link.active {
      color: var(--primary);
      background: rgba(59, 130, 246, 0.1);
      font-weight: 600;
    }

    .nav-link-admin {
      color: #c084fc;
    }

    .nav-link-admin.active {
      color: #d8b4fe;
      background: rgba(168, 85, 247, 0.12);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.35rem 0.75rem;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--grad-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }

    .user-name {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .user-role {
      font-size: 0.68rem;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    @media (max-width: 992px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
