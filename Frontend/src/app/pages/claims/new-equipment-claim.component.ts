import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService } from '../../services/claim.service';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { EquipmentPolicyItem } from '../../models/policy.model';
import { IncidentType } from '../../models/claim.model';

@Component({
  selector: 'app-new-equipment-claim',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="new-claim-page container animate-fade-in">
      <div class="card form-card">
        <div class="form-header">
          <a routerLink="/claims" class="back-link">
            <i class="fa-solid fa-arrow-left"></i> Back to Claims
          </a>
          <h2>File Equipment Liability Claim</h2>
          <p>Submit incident details for damaged, stolen, or lost client-provided hardware</p>
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
            <label class="form-label" for="policy">Active Equipment Policy</label>
            <select
              id="policy"
              [(ngModel)]="selectedPolicyId"
              (ngModelChange)="onPolicyChange()"
              name="policy"
              class="form-select"
              required
            >
              <option [ngValue]="null">-- Select Equipment Policy --</option>
              <option *ngFor="let p of policies" [ngValue]="p.id">
                Policy #{{ p.policyNumber }} - {{ p.equipmentName || ('Equipment #' + p.equipmentId) }} (Covered: {{ p.coverageAmount | currency }})
              </option>
            </select>
          </div>

          <div class="grid-2">
            <!-- Incident Date -->
            <div class="form-group">
              <label class="form-label" for="incidentDate">Date of Incident</label>
              <input
                type="date"
                id="incidentDate"
                [(ngModel)]="formData.incidentDate"
                name="incidentDate"
                required
                class="form-control"
              />
            </div>

            <!-- Incident Type -->
            <div class="form-group">
              <label class="form-label" for="incidentType">Incident Type</label>
              <select
                id="incidentType"
                [(ngModel)]="formData.incidentType"
                name="incidentType"
                class="form-select"
                required
              >
                <option value="PHYSICAL_DAMAGE">Physical Damage / Drops</option>
                <option value="THEFT">Theft / Burglary</option>
                <option value="WATER_DAMAGE">Liquid Spill / Water Damage</option>
                <option value="FIRE">Fire / Thermal Damage</option>
                <option value="NATURAL_EVENT">Natural Event / Surge</option>
                <option value="OTHER">Other Covered Event</option>
              </select>
            </div>
          </div>

          <!-- Police Report Number if Theft -->
          <div *ngIf="formData.incidentType === 'THEFT'" class="form-group animate-fade-in">
            <label class="form-label" for="policeReport">Police Report Number (Required for Theft)</label>
            <input
              type="text"
              id="policeReport"
              [(ngModel)]="formData.policeReportNumber"
              name="policeReportNumber"
              class="form-control"
              placeholder="e.g. PRN-2026-99410"
              required
            />
          </div>

          <!-- Claim Amount -->
          <div class="form-group">
            <div class="form-label">
              <label for="claimAmount">Estimated Claim / Repair Loss Amount</label>
              <span *ngIf="selectedPolicy" class="text-dim">Max Limit: {{ selectedPolicy.coverageAmount | currency }}</span>
            </div>
            <input
              type="number"
              id="claimAmount"
              [(ngModel)]="formData.claimAmount"
              name="claimAmount"
              class="form-control"
              placeholder="e.g. 1500"
              required
            />
          </div>

          <!-- Incident Description -->
          <div class="form-group">
            <label class="form-label" for="description">Detailed Incident Narrative</label>
            <textarea
              id="description"
              [(ngModel)]="formData.description"
              name="description"
              class="form-control"
              rows="4"
              placeholder="Describe where and how the incident occurred, the extent of hardware damage, and immediate actions taken..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            [disabled]="loading || !selectedPolicyId || !formData.claimAmount || !formData.description"
            class="btn btn-primary w-100 btn-submit"
          >
            <i *ngIf="loading" class="fa-solid fa-spinner fa-spin"></i>
            <span *ngIf="!loading">
              <i class="fa-solid fa-paper-plane"></i> Submit Claim for Underwriter Review
            </span>
            <span *ngIf="loading">Submitting Claim...</span>
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
export class NewEquipmentClaimComponent implements OnInit {
  private claimService = inject(ClaimService);
  private policyService = inject(PolicyService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  policies: EquipmentPolicyItem[] = [];
  selectedPolicyId: number | null = null;
  selectedPolicy: EquipmentPolicyItem | null = null;

  formData = {
    incidentDate: new Date().toISOString().split('T')[0],
    incidentType: 'PHYSICAL_DAMAGE' as IncidentType,
    policeReportNumber: '',
    claimAmount: 1200,
    description: ''
  };

  loading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.policyService.getEquipmentPolicies().subscribe({
      next: (res) => {
        if (res.data) {
          this.policies = res.data;
          // Check query params if preselected
          this.route.queryParams.subscribe(params => {
            if (params['policyId']) {
              this.selectedPolicyId = Number(params['policyId']);
              this.onPolicyChange();
            }
          });
        }
      }
    });
  }

  onPolicyChange(): void {
    this.selectedPolicy = this.policies.find(p => p.id === this.selectedPolicyId) || null;
    if (this.selectedPolicy) {
      this.formData.claimAmount = Math.min(1500, this.selectedPolicy.coverageAmount);
    }
  }

  onSubmit(): void {
    if (!this.selectedPolicyId || !this.selectedPolicy) {
      this.errorMessage = 'Please select a valid equipment policy.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      policyId: this.selectedPolicyId,
      freelancerId: this.auth.currentUser()?.id || 1,
      equipmentId: this.selectedPolicy.equipmentId,
      equipmentName: this.selectedPolicy.equipmentName,
      incidentDate: this.formData.incidentDate,
      incidentType: this.formData.incidentType,
      description: this.formData.description,
      policeReportNumber: this.formData.incidentType === 'THEFT' ? this.formData.policeReportNumber : undefined,
      claimAmount: this.formData.claimAmount,
      status: 'SUBMITTED' as const
    };

    this.claimService.submitEquipmentClaim(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = `Claim #${res.data?.claimNumber || 'CLM-EQ-X'} registered successfully!`;
        setTimeout(() => {
          this.router.navigate(['/claims']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to submit equipment claim.';
      }
    });
  }
}
