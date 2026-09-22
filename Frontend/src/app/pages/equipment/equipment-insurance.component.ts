import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RiskService } from '../../services/risk.service';
import { PolicyService } from '../../services/policy.service';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { EquipmentQuoteRequest, EquipmentQuoteResponse } from '../../models/risk.model';
import { Project, Equipment } from '../../models/project.model';

@Component({
  selector: 'app-equipment-insurance',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="equipment-page container animate-fade-in">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-badge">
          <i class="fa-solid fa-laptop-code"></i> Product 1 • Project-Specific
        </div>
        <h1 class="page-title">Client-Provided Equipment Liability Insurance</h1>
        <p class="page-subtitle">
          Under your freelance contract, you are legally responsible for client-owned gear while in your custody.
          Protect yourself against catastrophic repair costs, accidental physical damage, and theft.
        </p>
      </div>

      <!-- MAIN 2-COLUMN SECTION: QUOTE CALCULATOR & BINDING -->
      <div class="grid-2 quote-bind-grid">
        <!-- LEFT: INTERACTIVE ACTUARIAL QUOTE CALCULATOR -->
        <div class="card quote-card">
          <div class="card-header-styled">
            <div class="icon-circle icon-circle-blue">
              <i class="fa-solid fa-calculator"></i>
            </div>
            <div>
              <h3>Actuarial Rate Calculator</h3>
              <p>Instant precision quote powered by risk underwriter algorithms</p>
            </div>
          </div>

          <form (ngSubmit)="calculateQuote()" class="quote-form">
            <div class="form-group">
              <div class="form-label">
                <span>Hardware Replacement Value</span>
                <strong>{{ quoteReq.equipmentValue | currency }}</strong>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="250"
                [(ngModel)]="quoteReq.equipmentValue"
                (ngModelChange)="onQuoteParamsChanged()"
                name="equipVal"
                class="range-slider"
              />
              <div class="range-labels">
                <span>$500</span>
                <span>$7,500</span>
                <span>$15,000</span>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="category">Hardware Type</label>
                <select id="category" [(ngModel)]="quoteReq.category" (ngModelChange)="onQuoteParamsChanged()" name="category" class="form-select">
                  <option value="Laptop">Laptop / Workstation</option>
                  <option value="Camera">Cinema / Camera Rig</option>
                  <option value="MobileDevice">Test Phones / Tablets</option>
                  <option value="ServerHardware">Edge / Server Hardware</option>
                  <option value="AudioGear">Studio Audio Gear</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="durationDays">Coverage Duration (Days)</label>
                <input
                  type="number"
                  id="durationDays"
                  [(ngModel)]="quoteReq.durationDays"
                  (ngModelChange)="onQuoteParamsChanged()"
                  name="durationDays"
                  min="7"
                  max="365"
                  class="form-control"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Select Your Deductible</label>
              <div class="deductible-options">
                <label class="deductible-pill" [class.selected]="selectedDeductible === 100">
                  <input type="radio" [(ngModel)]="selectedDeductible" (ngModelChange)="onQuoteParamsChanged()" [value]="100" name="deductible">
                  <span>$100 Deductible</span>
                </label>
                <label class="deductible-pill" [class.selected]="selectedDeductible === 250">
                  <input type="radio" [(ngModel)]="selectedDeductible" (ngModelChange)="onQuoteParamsChanged()" [value]="250" name="deductible">
                  <span>$250 Deductible</span>
                </label>
                <label class="deductible-pill" [class.selected]="selectedDeductible === 500">
                  <input type="radio" [(ngModel)]="selectedDeductible" (ngModelChange)="onQuoteParamsChanged()" [value]="500" name="deductible">
                  <span>$500 Deductible</span>
                </label>
              </div>
            </div>
          </form>

          <!-- LIVE QUOTE BREAKDOWN RESULT -->
          <div *ngIf="quoteResult" class="quote-result-box animate-fade-in">
            <div class="quote-result-header">
              <span class="quote-tag">Underwriter Calculation</span>
              <span class="daily-rate">{{ (quoteResult.calculatedPremium / quoteResult.durationDays) | currency }}/day</span>
            </div>
            <div class="premium-total">
              <span class="total-label">Total Bound Premium</span>
              <span class="total-value text-gradient">{{ quoteResult.calculatedPremium | currency }}</span>
            </div>
            <div class="quote-specs">
              <div><span>Coverage Limit:</span> <strong>{{ quoteResult.coverageAmount | currency }}</strong></div>
              <div><span>Your Deductible:</span> <strong>{{ selectedDeductible | currency }}</strong></div>
              <div><span>Duration:</span> <strong>{{ quoteResult.durationDays }} Days</strong></div>
            </div>
          </div>
        </div>

        <!-- RIGHT: SELECT HARDWARE & BIND POLICY -->
        <div class="card bind-card">
          <div class="card-header-styled">
            <div class="icon-circle icon-circle-purple">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3>Bind Policy to Client Gear</h3>
              <p>Attach coverage to verified equipment assigned to your projects</p>
            </div>
          </div>

          <div *ngIf="successMessage" class="alert alert-success animate-fade-in">
            <i class="fa-solid fa-circle-check"></i>
            <div>
              <strong>Policy Issued Successfully!</strong>
              <p>{{ successMessage }}</p>
            </div>
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger animate-fade-in">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <div *ngIf="!auth.isAuthenticated()" class="auth-gate-box">
            <i class="fa-solid fa-lock gate-icon"></i>
            <h4>Sign In to Select Project Gear</h4>
            <p>Log in or create a free freelancer account to link client projects and bind policies.</p>
            <a routerLink="/auth/login" class="btn btn-primary btn-sm">Sign In Now</a>
          </div>

          <form *ngIf="auth.isAuthenticated()" (ngSubmit)="bindPolicy()" class="bind-form">
            <div class="form-group">
              <label class="form-label" for="selectedProject">Select Client Project</label>
              <select
                id="selectedProject"
                [(ngModel)]="selectedProjectId"
                (ngModelChange)="onProjectSelected()"
                name="selectedProj"
                class="form-select"
                required
              >
                <option [ngValue]="null">-- Choose Client Project --</option>
                <option *ngFor="let proj of projects" [ngValue]="proj.id">
                  {{ proj.title }} (Client: {{ proj.clientName }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="selectedEquipment">Select Assigned Equipment</label>
              <select
                id="selectedEquipment"
                [(ngModel)]="selectedEquipmentId"
                (ngModelChange)="onEquipmentSelected()"
                name="selectedEquip"
                class="form-select"
                [disabled]="!availableEquipment.length"
                required
              >
                <option [ngValue]="null">-- Choose Equipment in Custody --</option>
                <option *ngFor="let eq of availableEquipment" [ngValue]="eq.id">
                  {{ eq.itemName }} (SN: {{ eq.serialNumber }}) - Value: {{ eq.estimatedValue | currency }}
                </option>
              </select>
            </div>

            <!-- Liability Agreement Confirmation -->
            <div class="liability-terms-box">
              <div class="terms-title">
                <i class="fa-solid fa-scale-balanced"></i> Custody Liability Terms
              </div>
              <p class="terms-text">
                By binding this policy, you confirm that you have physical custody of the selected hardware provided by the client, and that this coverage will be active exclusively for the agreed project duration.
              </p>
              <label class="terms-checkbox">
                <input type="checkbox" [(ngModel)]="agreedToTerms" name="terms" required />
                <span>I acknowledge custody responsibility under the client contract.</span>
              </label>
            </div>

            <button
              type="submit"
              [disabled]="binding || !agreedToTerms || !selectedEquipmentId || !quoteResult"
              class="btn btn-primary w-100 btn-bind"
            >
              <i *ngIf="binding" class="fa-solid fa-spinner fa-spin"></i>
              <span *ngIf="!binding">
                <i class="fa-solid fa-file-signature"></i> Bind Policy for {{ (quoteResult?.calculatedPremium || 0) | currency }}
              </span>
              <span *ngIf="binding">Processing Underwriting & Issuing...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .equipment-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
    }

    .page-header {
      margin-bottom: 2.5rem;
      max-width: 800px;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.25);
      color: #60a5fa;
      padding: 0.3rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }

    .page-title {
      font-size: 2.4rem;
      margin-bottom: 0.75rem;
    }

    .page-subtitle {
      font-size: 1.05rem;
      color: var(--text-secondary);
      line-height: 1.55;
    }

    .card-header-styled {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }

    .icon-circle {
      width: 46px;
      height: 46px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }

    .icon-circle-blue {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
    }

    .icon-circle-purple {
      background: rgba(139, 92, 246, 0.15);
      color: #c084fc;
    }

    .card-header-styled h3 {
      font-size: 1.25rem;
      margin-bottom: 0.2rem;
    }

    .card-header-styled p {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    /* Slider styling */
    .range-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #1e293b;
      outline: none;
      -webkit-appearance: none;
      margin: 0.75rem 0 0.35rem;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--primary);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    /* Deductibles */
    .deductible-options {
      display: flex;
      gap: 0.75rem;
    }

    .deductible-pill {
      flex: 1;
      padding: 0.6rem;
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      text-align: center;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      transition: all var(--transition-fast);
    }

    .deductible-pill input {
      display: none;
    }

    .deductible-pill.selected {
      background: rgba(59, 130, 246, 0.15);
      border-color: var(--primary);
      color: #93c5fd;
    }

    /* Quote result box */
    .quote-result-box {
      margin-top: 1.5rem;
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: var(--radius-md);
      padding: 1.25rem;
    }

    .quote-result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .quote-tag {
      font-size: 0.72rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #60a5fa;
      background: rgba(59, 130, 246, 0.15);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
    }

    .daily-rate {
      font-size: 0.88rem;
      color: var(--text-muted);
    }

    .premium-total {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 0.75rem;
    }

    .total-label {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .total-value {
      font-size: 1.85rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
    }

    .quote-specs {
      display: flex;
      justify-content: space-between;
      font-size: 0.82rem;
      color: var(--text-secondary);
    }

    .quote-specs strong {
      color: var(--text-main);
    }

    /* Auth Gate Box */
    .auth-gate-box {
      text-align: center;
      padding: 3rem 1.5rem;
    }

    .gate-icon {
      font-size: 2.2rem;
      color: var(--text-dim);
      margin-bottom: 1rem;
    }

    .auth-gate-box h4 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .auth-gate-box p {
      color: var(--text-muted);
      font-size: 0.88rem;
      margin-bottom: 1.5rem;
    }

    /* Liability terms box */
    .liability-terms-box {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin: 1.5rem 0;
    }

    .terms-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: #93c5fd;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 0.4rem;
    }

    .terms-text {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.45;
      margin-bottom: 0.85rem;
    }

    .terms-checkbox {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.82rem;
      color: var(--text-secondary);
      cursor: pointer;
    }

    .btn-bind {
      padding: 0.9rem;
      font-size: 1rem;
    }

    .w-100 {
      width: 100%;
    }
  `]
})
export class EquipmentInsuranceComponent implements OnInit {
  auth = inject(AuthService);
  private riskService = inject(RiskService);
  private policyService = inject(PolicyService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  // Quote State
  quoteReq: EquipmentQuoteRequest = {
    equipmentValue: 3500,
    durationDays: 90,
    category: 'Laptop',
    deductiblePercentage: 5
  };
  selectedDeductible = 250;
  quoteResult: EquipmentQuoteResponse | null = null;

  // Bind State
  projects: Project[] = [];
  availableEquipment: Equipment[] = [];
  selectedProjectId: number | null = null;
  selectedEquipmentId: number | null = null;
  agreedToTerms = false;
  binding = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.calculateQuote();
    if (this.auth.isAuthenticated()) {
      this.loadProjects();
    }
  }

  onQuoteParamsChanged(): void {
    this.calculateQuote();
  }

  calculateQuote(): void {
    this.riskService.getEquipmentQuote(this.quoteReq).subscribe({
      next: (res) => {
        if (res.data) {
          this.quoteResult = res.data;
          this.quoteResult.deductible = this.selectedDeductible;
        }
      },
      error: () => {
        // Fallback local actuarial estimate if backend not running during dev preview
        const days = this.quoteReq.durationDays || 30;
        const val = this.quoteReq.equipmentValue || 2000;
        const rate = 0.00045 * days;
        const premium = Math.round(val * rate * 100) / 100;
        this.quoteResult = {
          equipmentValue: val,
          durationDays: days,
          coverageAmount: val,
          deductible: this.selectedDeductible,
          calculatedPremium: Math.max(25, premium)
        };
      }
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        if (res.data) {
          this.projects = res.data;
        }
      }
    });
  }

  onProjectSelected(): void {
    this.selectedEquipmentId = null;
    this.availableEquipment = [];
    if (!this.selectedProjectId) return;

    const proj = this.projects.find(p => p.id === this.selectedProjectId);
    if (proj && proj.equipmentList) {
      this.availableEquipment = proj.equipmentList;
    } else {
      this.projectService.getEquipmentByProject(this.selectedProjectId).subscribe({
        next: (res) => {
          if (res.data) {
            this.availableEquipment = res.data;
          }
        }
      });
    }
  }

  onEquipmentSelected(): void {
    if (!this.selectedEquipmentId) return;
    const eq = this.availableEquipment.find(e => e.id === this.selectedEquipmentId);
    if (eq) {
      this.quoteReq.equipmentValue = eq.estimatedValue || 3500;
      this.calculateQuote();
    }
  }

  bindPolicy(): void {
    if (!this.selectedProjectId || !this.selectedEquipmentId || !this.quoteResult) {
      this.errorMessage = 'Please select project, equipment and generate a quote.';
      return;
    }

    this.binding = true;
    this.errorMessage = '';
    this.successMessage = '';

    const eq = this.availableEquipment.find(e => e.id === this.selectedEquipmentId);
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + this.quoteResult.durationDays);

    const payload = {
      freelancerId: this.auth.currentUser()?.id || 1,
      projectId: this.selectedProjectId,
      equipmentId: this.selectedEquipmentId,
      equipmentName: eq?.itemName || 'Client Equipment',
      coverageAmount: this.quoteResult.coverageAmount,
      deductible: this.selectedDeductible,
      premium: this.quoteResult.calculatedPremium,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'ACTIVE' as const
    };

    this.policyService.issueEquipmentPolicy(payload).subscribe({
      next: (res) => {
        this.binding = false;
        this.successMessage = `Policy #${res.data?.policyNumber || 'EQ-2026-X'} bound and active!`;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1800);
      },
      error: (err) => {
        this.binding = false;
        this.errorMessage = err.error?.message || 'Failed to bind policy. Please try again.';
      }
    });
  }
}
