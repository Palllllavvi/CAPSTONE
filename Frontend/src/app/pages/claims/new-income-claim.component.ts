import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../services/claim.service';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { IncomeAssurancePolicy } from '../../models/policy.model';
import { TerminationType } from '../../models/claim.model';

@Component({
  selector: 'app-new-income-claim',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="new-claim-page container animate-fade-in">
      <div class="card form-card">
        <div class="form-header">
          <a routerLink="/claims" class="back-link">
            <i class="fa-solid fa-arrow-left"></i> Back to Claims
          </a>
          <h2>File Income Assurance Claim</h2>
          <p>Submit claim for unexpected contract termination or medical incapacity interruption</p>
        </div>

        <div *ngIf="errorMessage" class="alert alert-danger">
          <i class="fa-solid fa-circle-exclamation"></i>
          <span>{{ errorMessage }}</span>
        </div>

        <div *ngIf="successMessage" class="alert alert-success">
          <i class="fa-solid fa-circle-check"></i>
          <span>{{ successMessage }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" class="claim-form">
          <!-- Policy Selection -->
          <div class="form-group">
            <label class="form-label" for="policy">Active Annual Income Policy</label>
            <select
              id="policy"
              [(ngModel)]="selectedPolicyId"
              (ngModelChange)="onPolicyChange()"
              name="policy"
              class="form-select"
              required
            >
              <option [ngValue]="null">-- Select Income Policy --</option>
              <option *ngFor="let p of policies" [ngValue]="p.id">
                Policy #{{ p.policyNumber }} - Tier {{ p.coverageTier }} ({{ p.monthlyBenefit | currency }}/mo, Max: {{ p.totalBenefitCap | currency }})
              </option>
            </select>
          </div>

          <div class="grid-2">
            <!-- Event Date -->
            <div class="form-group">
              <label class="form-label" for="termDate">Date of Termination or Incapacity</label>
              <input
                type="date"
                id="termDate"
                [(ngModel)]="formData.terminationDate"
                name="termDate"
                required
                class="form-control"
              />
            </div>

            <!-- Event Type -->
            <div class="form-group">
              <label class="form-label" for="termType">Covered Event Type</label>
              <select
                id="termType"
                [(ngModel)]="formData.terminationType"
                name="termType"
                class="form-select"
                required
              >
                <option value="UNEXPECTED_TERMINATION">Unexpected Contract Cancellation</option>
                <option value="CLIENT_INSOLVENCY">Client Insolvency / Non-Payment</option>
                <option value="MEDICAL_INCAPACITY">Medical Incapacity (Illness / Injury)</option>
                <option value="OTHER_COVERED">Other Covered Contractual Event</option>
              </select>
            </div>
          </div>

          <!-- Medical Incapacity Details -->
          <div *ngIf="formData.terminationType === 'MEDICAL_INCAPACITY'" class="medical-section animate-fade-in">
            <div class="medical-section-title">
              <i class="fa-solid fa-notes-medical"></i> Medical Incapacity Documentation
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="doctorName">Attending Physician / Clinic</label>
                <input
                  type="text"
                  id="doctorName"
                  [(ngModel)]="formData.doctorName"
                  name="docName"
                  class="form-control"
                  placeholder="e.g. Dr. Arthur Vance, MD"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">Medical Verification</label>
                <label class="medical-checkbox">
                  <input type="checkbox" [(ngModel)]="formData.medicalCertProvided" name="medCert" required />
                  <span>Physician Disability Certificate On File</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Client & Contract details -->
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="clientName">Terminating Client / Enterprise Name</label>
              <input
                type="text"
                id="clientName"
                [(ngModel)]="formData.clientName"
                name="clientName"
                class="form-control"
                placeholder="e.g. Apex Global Media"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="monthsClaimed">Benefit Months Claimed</label>
              <select
                id="monthsClaimed"
                [(ngModel)]="formData.monthsClaimed"
                (ngModelChange)="updateTotalClaim()"
                name="monthsClaimed"
                class="form-select"
                required
              >
                <option [value]="1">1 Month</option>
                <option [value]="2">2 Months</option>
                <option [value]="3">3 Months</option>
                <option [value]="4" *ngIf="(selectedPolicy?.benefitDurationMonths || 3) >= 4">4 Months</option>
                <option [value]="6" *ngIf="(selectedPolicy?.benefitDurationMonths || 3) >= 6">6 Months</option>
              </select>
            </div>
          </div>

          <!-- Computed Total Claim Box -->
          <div class="claim-calc-box">
            <div class="calc-row">
              <span>Monthly Benefit Rate:</span>
              <strong>{{ (selectedPolicy?.monthlyBenefit || 0) | currency }}/mo</strong>
            </div>
            <div class="calc-row">
              <span>Months Requested:</span>
              <strong>{{ formData.monthsClaimed }} Month(s)</strong>
            </div>
            <div class="calc-row total-calc-row">
              <span>Total Payout Requested:</span>
              <strong class="text-gradient">{{ computedTotalClaim | currency }}</strong>
            </div>
          </div>

          <!-- Statement Narrative -->
          <div class="form-group">
            <label class="form-label" for="reason">Circumstances Narrative</label>
            <textarea
              id="reason"
              [(ngModel)]="formData.reason"
              name="reason"
              class="form-control"
              rows="4"
              placeholder="State the circumstances leading to the early contract cancellation or medical incapacity, including client notification date..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            [disabled]="loading || !selectedPolicyId || !formData.reason"
            class="btn btn-primary w-100 btn-submit"
          >
            <i *ngIf="loading" class="fa-solid fa-spinner fa-spin"></i>
            <span *ngIf="!loading">
              <i class="fa-solid fa-paper-plane"></i> Submit Income Claim for Fast Settlement
            </span>
            <span *ngIf="loading">Submitting Income Claim...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .new-claim-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
      display: flex;
      justify-content: center;
    }

    .form-card {
      width: 100%;
      max-width: 680px;
      padding: 2.5rem;
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .back-link:hover {
      color: var(--primary);
    }

    .form-header h2 {
      font-size: 1.85rem;
      margin-bottom: 0.4rem;
    }

    .form-header p {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .medical-section {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .medical-section-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: #6ee7b7;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .medical-checkbox {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding-top: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-main);
      cursor: pointer;
    }

    .claim-calc-box {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.88rem;
      color: var(--text-secondary);
    }

    .total-calc-row {
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.75rem;
      margin-top: 0.25rem;
      font-size: 1.05rem;
    }

    .total-calc-row strong {
      font-size: 1.45rem;
      font-family: 'Outfit', sans-serif;
    }

    .btn-submit {
      margin-top: 1.5rem;
      padding: 0.95rem;
      font-size: 1rem;
    }

    .w-100 {
      width: 100%;
    }
  `]
})
export class NewIncomeClaimComponent implements OnInit {
  private claimService = inject(ClaimService);
  private policyService = inject(PolicyService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  policies: IncomeAssurancePolicy[] = [];
  selectedPolicyId: number | null = null;
  selectedPolicy: IncomeAssurancePolicy | null = null;

  formData = {
    terminationDate: new Date().toISOString().split('T')[0],
    terminationType: 'UNEXPECTED_TERMINATION' as TerminationType,
    clientName: '',
    reason: '',
    monthsClaimed: 1,
    medicalCertProvided: false,
    doctorName: ''
  };

  computedTotalClaim = 0;
  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.policyService.getIncomePolicies().subscribe({
      next: (res) => {
        if (res.data) {
          this.policies = res.data;
          this.route.queryParams.subscribe(params => {
            if (params['policyId']) {
              this.selectedPolicyId = Number(params['policyId']);
              this.onPolicyChange();
            } else if (this.policies.length > 0) {
              this.selectedPolicyId = this.policies[0].id;
              this.onPolicyChange();
            }
          });
        }
      }
    });
  }

  onPolicyChange(): void {
    this.selectedPolicy = this.policies.find(p => p.id === this.selectedPolicyId) || null;
    this.updateTotalClaim();
  }

  updateTotalClaim(): void {
    const monthly = this.selectedPolicy?.monthlyBenefit || 3000;
    this.computedTotalClaim = monthly * this.formData.monthsClaimed;
  }

  onSubmit(): void {
    if (!this.selectedPolicyId || !this.selectedPolicy) {
      this.errorMessage = 'Please select a valid income assurance policy.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      policyId: this.selectedPolicyId,
      freelancerId: this.auth.currentUser()?.id || 1,
      terminationDate: this.formData.terminationDate,
      terminationType: this.formData.terminationType,
      reason: this.formData.reason,
      clientName: this.formData.clientName,
      monthlyBenefit: this.selectedPolicy.monthlyBenefit,
      monthsClaimed: this.formData.monthsClaimed,
      totalClaimAmount: this.computedTotalClaim,
      medicalCertProvided: this.formData.medicalCertProvided,
      doctorName: this.formData.doctorName,
      status: 'SUBMITTED' as const
    };

    this.claimService.submitIncomeClaim(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = `Income Claim #${res.data?.claimNumber || 'CLM-INC-X'} filed successfully!`;
        setTimeout(() => {
          this.router.navigate(['/claims']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to submit income claim.';
      }
    });
  }
}
