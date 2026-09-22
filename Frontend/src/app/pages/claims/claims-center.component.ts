import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClaimService } from '../../services/claim.service';
import { EquipmentClaim, IncomeClaim } from '../../models/claim.model';

@Component({
  selector: 'app-claims-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="claims-page container animate-fade-in">
      <!-- HEADER -->
      <div class="claims-header">
        <div>
          <h1 class="page-title">Claims & Settlement Center</h1>
          <p class="page-subtitle">Track, file, and review payments for client equipment losses and income interruptions</p>
        </div>
        <div class="claims-actions">
          <a routerLink="/claims/equipment/new" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-laptop-medical"></i> File Equipment Claim
          </a>
          <a routerLink="/claims/income/new" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-hand-holding-dollar"></i> File Income Claim
          </a>
        </div>
      </div>

      <!-- TABS -->
      <div class="tabs-nav">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'equipment'"
          (click)="activeTab = 'equipment'"
        >
          <i class="fa-solid fa-laptop-code"></i> Equipment Claims ({{ equipmentClaims.length }})
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'income'"
          (click)="activeTab = 'income'"
        >
          <i class="fa-solid fa-shield-heart"></i> Income & Medical Claims ({{ incomeClaims.length }})
        </button>
      </div>

      <!-- TAB 1: EQUIPMENT CLAIMS -->
      <div *ngIf="activeTab === 'equipment'" class="animate-fade-in">
        <div *ngIf="equipmentClaims.length === 0" class="card empty-state">
          <i class="fa-solid fa-shield-cat empty-icon"></i>
          <h3>No Equipment Claims Recorded</h3>
          <p>No claims have been submitted under your equipment liability policies.</p>
          <a routerLink="/claims/equipment/new" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-plus"></i> Submit Damage or Theft Claim
          </a>
        </div>

        <div *ngIf="equipmentClaims.length > 0" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Claim #</th>
                <th>Incident Date</th>
                <th>Incident Type</th>
                <th>Damage Description</th>
                <th>Claim Amount</th>
                <th>Approved Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of equipmentClaims">
                <td><strong class="font-mono">{{ c.claimNumber }}</strong></td>
                <td>{{ c.incidentDate | date:'mediumDate' }}</td>
                <td>
                  <span class="incident-badge">{{ c.incidentType }}</span>
                </td>
                <td class="desc-cell" [title]="c.description">
                  {{ c.description | slice:0:45 }}{{ c.description.length > 45 ? '...' : '' }}
                </td>
                <td>{{ c.claimAmount | currency }}</td>
                <td>
                  <strong *ngIf="c.approvedAmount" class="text-success">{{ c.approvedAmount | currency }}</strong>
                  <span *ngIf="!c.approvedAmount" class="text-dim">—</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + c.status.toLowerCase()">
                    {{ c.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: INCOME CLAIMS -->
      <div *ngIf="activeTab === 'income'" class="animate-fade-in">
        <div *ngIf="incomeClaims.length === 0" class="card empty-state">
          <i class="fa-solid fa-hand-holding-dollar empty-icon"></i>
          <h3>No Income Claims Filed</h3>
          <p>If you experience unexpected client termination or medical incapacity, submit documentation here.</p>
          <a routerLink="/claims/income/new" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-plus"></i> Submit Income Claim
          </a>
        </div>

        <div *ngIf="incomeClaims.length > 0" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Claim #</th>
                <th>Termination Date</th>
                <th>Event Type</th>
                <th>Client / Reason</th>
                <th>Months Claimed</th>
                <th>Total Claim</th>
                <th>Approved Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ic of incomeClaims">
                <td><strong class="font-mono">{{ ic.claimNumber }}</strong></td>
                <td>{{ ic.terminationDate | date:'mediumDate' }}</td>
                <td>
                  <span class="incident-badge" [class.med-badge]="ic.terminationType === 'MEDICAL_INCAPACITY'">
                    {{ ic.terminationType }}
                  </span>
                </td>
                <td class="desc-cell">
                  <div><strong>{{ ic.clientName || 'General Client' }}</strong></div>
                  <small class="text-dim">{{ ic.reason | slice:0:35 }}</small>
                </td>
                <td>{{ ic.monthsClaimed }} mo</td>
                <td>{{ ic.totalClaimAmount | currency }}</td>
                <td>
                  <strong *ngIf="ic.approvedAmount" class="text-success">{{ ic.approvedAmount | currency }}</strong>
                  <span *ngIf="!ic.approvedAmount" class="text-dim">—</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + ic.status.toLowerCase()">
                    {{ ic.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .claims-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
    }

    .claims-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 2.2rem;
      margin-bottom: 0.35rem;
    }

    .page-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .claims-actions {
      display: flex;
      gap: 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 3.5rem 1.5rem;
    }

    .empty-icon {
      font-size: 2.5rem;
      color: var(--text-dim);
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .font-mono {
      font-family: monospace;
      color: #93c5fd;
    }

    .desc-cell {
      max-width: 250px;
    }

    .incident-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #93c5fd;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      display: inline-block;
    }

    .med-badge {
      color: #6ee7b7;
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.25);
    }

    .text-success {
      color: #34d399;
    }
  `]
})
export class ClaimsCenterComponent implements OnInit {
  private claimService = inject(ClaimService);

  activeTab: 'equipment' | 'income' = 'equipment';
  equipmentClaims: EquipmentClaim[] = [];
  incomeClaims: IncomeClaim[] = [];

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.claimService.getEquipmentClaims().subscribe({
      next: (res) => {
        if (res.data) {
          this.equipmentClaims = res.data;
        }
      }
    });

    this.claimService.getIncomeClaims().subscribe({
      next: (res) => {
        if (res.data) {
          this.incomeClaims = res.data;
        }
      }
    });
  }
}
