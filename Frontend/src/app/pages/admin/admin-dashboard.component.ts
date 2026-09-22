import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClaimService } from '../../services/claim.service';
import { EquipmentClaim, IncomeClaim, ReviewClaimRequest } from '../../models/claim.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page container animate-fade-in">
      <!-- HEADER -->
      <div class="admin-header">
        <div>
          <div class="admin-tag">
            <i class="fa-solid fa-user-shield"></i> Underwriter Operations Portal
          </div>
          <h1 class="page-title">Claims Triage & Settlement Console</h1>
          <p class="page-subtitle">Review incoming freelancer loss notices, assess liability proof, and authorize payouts</p>
        </div>
        <button (click)="loadAllClaims()" class="btn btn-secondary btn-sm">
          <i class="fa-solid fa-arrows-rotate"></i> Refresh Queue
        </button>
      </div>

      <!-- METRICS -->
      <div class="grid-3 metrics-row">
        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">
            <i class="fa-solid fa-inbox"></i>
          </div>
          <div>
            <div class="stat-value">{{ pendingClaimsCount }}</div>
            <div class="stat-label">Pending Triage Review</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <i class="fa-solid fa-scale-unbalanced"></i>
          </div>
          <div>
            <div class="stat-value">{{ totalExposure | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Total Claims Exposure</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-emerald">
            <i class="fa-solid fa-circle-dollar-to-slot"></i>
          </div>
          <div>
            <div class="stat-value">{{ totalSettled | currency:'USD':'symbol':'1.0-0' }}</div>
            <div class="stat-label">Authorized Payouts Settled</div>
          </div>
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

      <!-- EQUIPMENT CLAIMS TABLE -->
      <div *ngIf="activeTab === 'equipment'" class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Claim #</th>
              <th>Incident Date</th>
              <th>Incident Type</th>
              <th>Damage Description</th>
              <th>Claimed Amount</th>
              <th>Approved Payout</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of equipmentClaims">
              <td><strong class="font-mono">{{ c.claimNumber }}</strong></td>
              <td>{{ c.incidentDate | date:'mediumDate' }}</td>
              <td><span class="incident-badge">{{ c.incidentType }}</span></td>
              <td>{{ c.description | slice:0:40 }}...</td>
              <td>{{ c.claimAmount | currency }}</td>
              <td>
                <span *ngIf="c.approvedAmount" class="text-success font-bold">{{ c.approvedAmount | currency }}</span>
                <span *ngIf="!c.approvedAmount" class="text-dim">—</span>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge-' + c.status.toLowerCase()">
                  {{ c.status }}
                </span>
              </td>
              <td>
                <button (click)="openReviewModal(c, 'equipment')" class="btn btn-outline-primary btn-sm">
                  <i class="fa-solid fa-gavel"></i> Triage
                </button>
              </td>
            </tr>
            <tr *ngIf="equipmentClaims.length === 0">
              <td colspan="8" class="text-center text-muted py-4">No equipment claims in system</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- INCOME CLAIMS TABLE -->
      <div *ngIf="activeTab === 'income'" class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Claim #</th>
              <th>Event Date</th>
              <th>Event Type</th>
              <th>Terminating Client</th>
              <th>Months</th>
              <th>Total Claim</th>
              <th>Approved Payout</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ic of incomeClaims">
              <td><strong class="font-mono">{{ ic.claimNumber }}</strong></td>
              <td>{{ ic.terminationDate | date:'mediumDate' }}</td>
              <td><span class="incident-badge">{{ ic.terminationType }}</span></td>
              <td>{{ ic.clientName || 'Direct Client' }}</td>
              <td>{{ ic.monthsClaimed }} mo</td>
              <td>{{ ic.totalClaimAmount | currency }}</td>
              <td>
                <span *ngIf="ic.approvedAmount" class="text-success font-bold">{{ ic.approvedAmount | currency }}</span>
                <span *ngIf="!ic.approvedAmount" class="text-dim">—</span>
              </td>
              <td>
                <span class="badge" [ngClass]="'badge-' + ic.status.toLowerCase()">
                  {{ ic.status }}
                </span>
              </td>
              <td>
                <button (click)="openReviewModal(ic, 'income')" class="btn btn-outline-primary btn-sm">
                  <i class="fa-solid fa-gavel"></i> Triage
                </button>
              </td>
            </tr>
            <tr *ngIf="incomeClaims.length === 0">
              <td colspan="9" class="text-center text-muted py-4">No income claims in system</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- REVIEW / TRIAGE MODAL OVERLAY -->
      <div *ngIf="selectedClaim" class="modal-overlay" (click)="closeModal($event)">
        <div class="card modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h3>Triage Claim #{{ selectedClaim.claimNumber }}</h3>
              <p class="modal-sub">Product: {{ selectedClaimType === 'equipment' ? 'Equipment Liability' : 'Income Assurance' }}</p>
            </div>
            <button (click)="selectedClaim = null" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div *ngIf="modalError" class="alert alert-danger">
            {{ modalError }}
          </div>

          <div class="claim-specs-box">
            <div>
              <span>Claimed Amount:</span>
              <strong>{{ (selectedClaimType === 'equipment' ? selectedClaim.claimAmount : selectedClaim.totalClaimAmount) | currency }}</strong>
            </div>
            <div>
              <span>Freelancer ID:</span>
              <strong>#{{ selectedClaim.freelancerId }}</strong>
            </div>
            <div *ngIf="selectedClaim.doctorName">
              <span>Medical Doctor:</span>
              <strong>{{ selectedClaim.doctorName }}</strong>
            </div>
          </div>

          <form (ngSubmit)="submitReview()" class="review-form">
            <div class="form-group">
              <label class="form-label" for="decision">Underwriter Decision</label>
              <select id="decision" [(ngModel)]="reviewData.status" name="status" class="form-select" required>
                <option value="UNDER_REVIEW">Keep In Under Review</option>
                <option value="APPROVED">Approve for Settlement Payout</option>
                <option value="SETTLED">Authorize & Mark Settled</option>
                <option value="REJECTED">Reject Claim</option>
              </select>
            </div>

            <div class="form-group" *ngIf="reviewData.status === 'APPROVED' || reviewData.status === 'SETTLED'">
              <label class="form-label" for="appAmount">Authorized Settlement Amount ($)</label>
              <input
                type="number"
                id="appAmount"
                [(ngModel)]="reviewData.approvedAmount"
                name="approvedAmount"
                class="form-control"
                required
              />
            </div>

            <div class="form-group" *ngIf="reviewData.status === 'REJECTED'">
              <label class="form-label" for="rejReason">Rejection Clause & Reason</label>
              <input
                type="text"
                id="rejReason"
                [(ngModel)]="reviewData.rejectionReason"
                name="rejectionReason"
                class="form-control"
                placeholder="e.g. Non-covered intentional damage / incomplete medical cert"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="adjusterNotes">Adjuster Assessment Notes</label>
              <textarea
                id="adjusterNotes"
                [(ngModel)]="reviewData.notes"
                name="notes"
                class="form-control"
                rows="3"
                placeholder="Underwriter notes, verification details, police report confirmation..."
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" (click)="selectedClaim = null" class="btn btn-secondary">Cancel</button>
              <button type="submit" [disabled]="submittingReview" class="btn btn-primary">
                <i *ngIf="submittingReview" class="fa-solid fa-spinner fa-spin"></i>
                <span *ngIf="!submittingReview">Commit Determination</span>
                <span *ngIf="submittingReview">Committing...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .admin-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #c084fc;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }

    .page-title {
      font-size: 2.2rem;
      margin-bottom: 0.25rem;
    }

    .page-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .metrics-row {
      margin-bottom: 2rem;
    }

    .font-mono {
      font-family: monospace;
      color: #93c5fd;
    }

    .font-bold {
      font-weight: 700;
    }

    .text-success {
      color: #34d399;
    }

    .incident-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #93c5fd;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(7, 9, 14, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      width: 100%;
      max-width: 540px;
      padding: 2rem;
      background: #0f172a;
      border: 1px solid var(--border-bright);
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }

    .modal-header h3 {
      font-size: 1.35rem;
      margin-bottom: 0.2rem;
    }

    .modal-sub {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .claim-specs-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.85rem 1.25rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private claimService = inject(ClaimService);

  activeTab: 'equipment' | 'income' = 'equipment';
  equipmentClaims: EquipmentClaim[] = [];
  incomeClaims: IncomeClaim[] = [];

  pendingClaimsCount = 0;
  totalExposure = 0;
  totalSettled = 0;

  selectedClaim: any = null;
  selectedClaimType: 'equipment' | 'income' = 'equipment';
  reviewData: ReviewClaimRequest = {
    status: 'APPROVED',
    approvedAmount: 0,
    rejectionReason: '',
    notes: ''
  };
  submittingReview = false;
  modalError = '';

  ngOnInit(): void {
    this.loadAllClaims();
  }

  loadAllClaims(): void {
    this.claimService.getAllClaims().subscribe({
      next: (res) => {
        if (res.data) {
          this.equipmentClaims = res.data.equipmentClaims || [];
          this.incomeClaims = res.data.incomeClaims || [];
          this.computeMetrics();
        }
      }
    });
  }

  computeMetrics(): void {
    let pending = 0;
    let exposure = 0;
    let settled = 0;

    this.equipmentClaims.forEach(c => {
      exposure += (c.claimAmount || 0);
      if (c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW') pending++;
      if (c.status === 'SETTLED' || c.status === 'APPROVED') settled += (c.approvedAmount || 0);
    });

    this.incomeClaims.forEach(ic => {
      exposure += (ic.totalClaimAmount || 0);
      if (ic.status === 'SUBMITTED' || ic.status === 'UNDER_REVIEW') pending++;
      if (ic.status === 'SETTLED' || ic.status === 'APPROVED') settled += (ic.approvedAmount || 0);
    });

    this.pendingClaimsCount = pending;
    this.totalExposure = exposure;
    this.totalSettled = settled;
  }

  openReviewModal(claim: any, type: 'equipment' | 'income'): void {
    this.selectedClaim = claim;
    this.selectedClaimType = type;
    this.reviewData = {
      status: 'APPROVED',
      approvedAmount: type === 'equipment' ? claim.claimAmount : claim.totalClaimAmount,
      rejectionReason: '',
      notes: ''
    };
    this.modalError = '';
  }

  closeModal(event: MouseEvent): void {
    this.selectedClaim = null;
  }

  submitReview(): void {
    if (!this.selectedClaim) return;

    this.submittingReview = true;
    this.modalError = '';

    const req$: Observable<any> = this.selectedClaimType === 'equipment'
      ? this.claimService.reviewEquipmentClaim(this.selectedClaim.id, this.reviewData)
      : this.claimService.reviewIncomeClaim(this.selectedClaim.id, this.reviewData);

    req$.subscribe({
      next: () => {
        this.submittingReview = false;
        this.selectedClaim = null;
        this.loadAllClaims();
      },
      error: (err: any) => {
        this.submittingReview = false;
        this.modalError = err.error?.message || 'Failed to commit review.';
      }
    });
  }
}
