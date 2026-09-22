import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RiskService } from '../../services/risk.service';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { IncomeQuoteRequest, IncomeQuoteResponse } from '../../models/risk.model';

@Component({
  selector: 'app-income-assurance',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="income-page container animate-fade-in">
      <!-- HEADER -->
      <div class="page-header">
        <div class="header-badge">
          <i class="fa-solid fa-calendar-check"></i> Product 2 • Annual Freelancer Shield
        </div>
        <h1 class="page-title">Annual Freelancer Income Assurance</h1>
        <p class="page-subtitle">
          An annual policy that stays with you regardless of contract changes.
          Receive guaranteed monthly replacement income if client contracts are terminated without cause,
          or if <strong>medical incapacity (illness/injury)</strong> stops you from working.
        </p>
      </div>

      <!-- MAIN 2-COLUMN SECTION -->
      <div class="grid-2 quote-bind-grid">
        <!-- LEFT: CUSTOMIZATION & CALCULATOR -->
        <div class="card quote-card">
          <div class="card-header-styled">
            <div class="icon-circle icon-circle-purple">
              <i class="fa-solid fa-sliders"></i>
            </div>
            <div>
              <h3>Configure Your Safety Net</h3>
              <p>Personalize replacement ratio, benefit duration, and medical riders</p>
            </div>
          </div>

          <form class="quote-form">
            <!-- Monthly Income Input -->
            <div class="form-group">
              <div class="form-label">
                <span>Average Monthly Freelance Income</span>
                <strong class="font-mono">{{ quoteReq.monthlyIncome | currency:'USD':'symbol':'1.0-0' }}</strong>
              </div>
              <input
                type="range"
                min="2000"
                max="25000"
                step="500"
                [(ngModel)]="quoteReq.monthlyIncome"
                (ngModelChange)="onParamsChanged()"
                name="monthlyIncome"
                class="range-slider"
              />
              <div class="range-labels">
                <span>$2,000</span>
                <span>$12,500</span>
                <span>$25,000</span>
              </div>
            </div>

            <!-- Replacement Tier Selection -->
            <div class="form-group">
              <label class="form-label">Replacement Income Tier</label>
              <div class="tier-options">
                <div
                  class="tier-card"
                  [class.selected]="selectedTier === 'GOLD'"
                  (click)="setTier('GOLD')"
                >
                  <div class="tier-top">
                    <span class="tier-name">Gold Tier</span>
                    <span class="tier-ratio">80%</span>
                  </div>
                  <span class="tier-desc">Maximum income preservation</span>
                </div>

                <div
                  class="tier-card"
                  [class.selected]="selectedTier === 'SILVER'"
                  (click)="setTier('SILVER')"
                >
                  <div class="tier-top">
                    <span class="tier-name">Silver Tier</span>
                    <span class="tier-ratio">65%</span>
                  </div>
                  <span class="tier-desc">Standard balanced protection</span>
                </div>

                <div
                  class="tier-card"
                  [class.selected]="selectedTier === 'BRONZE'"
                  (click)="setTier('BRONZE')"
                >
                  <div class="tier-top">
                    <span class="tier-name">Bronze Tier</span>
                    <span class="tier-ratio">50%</span>
                  </div>
                  <span class="tier-desc">Essential core living expense</span>
                </div>
              </div>
            </div>

            <!-- Benefit Duration Selection -->
            <div class="form-group">
              <label class="form-label">Benefit Payout Window (Consecutive Months)</label>
              <div class="duration-options">
                <label class="duration-pill" [class.selected]="quoteReq.benefitPeriodMonths === 3">
                  <input type="radio" [(ngModel)]="quoteReq.benefitPeriodMonths" (ngModelChange)="onParamsChanged()" [value]="3" name="dur">
                  <span>3 Months Payout</span>
                </label>
                <label class="duration-pill" [class.selected]="quoteReq.benefitPeriodMonths === 4">
                  <input type="radio" [(ngModel)]="quoteReq.benefitPeriodMonths" (ngModelChange)="onParamsChanged()" [value]="4" name="dur">
                  <span>4 Months Payout</span>
                </label>
                <label class="duration-pill" [class.selected]="quoteReq.benefitPeriodMonths === 6">
                  <input type="radio" [(ngModel)]="quoteReq.benefitPeriodMonths" (ngModelChange)="onParamsChanged()" [value]="6" name="dur">
                  <span>6 Months Payout</span>
                </label>
              </div>
            </div>

            <!-- MEDICAL INCAPACITY RIDER TOGGLE -->
            <div class="medical-rider-box">
              <div class="rider-header">
                <div class="rider-icon">
                  <i class="fa-solid fa-notes-medical"></i>
                </div>
                <div class="rider-info">
                  <h4>Medical Incapacity Rider</h4>
                  <p>Covers illness or physical injury preventing you from executing contracts.</p>
                </div>
                <label class="switch">
                  <input
                    type="checkbox"
                    [(ngModel)]="quoteReq.includeMedicalIncapacity"
                    (ngModelChange)="onParamsChanged()"
                    name="medRider"
                  />
                  <span class="slider-switch round"></span>
                </label>
              </div>
            </div>
          </form>
        </div>

        <!-- RIGHT: LIVE PLAN SUMMARY & BIND ACTION -->
        <div class="card summary-card">
          <div class="card-header-styled">
            <div class="icon-circle icon-circle-cyan">
              <i class="fa-solid fa-shield-heart"></i>
            </div>
            <div>
              <h3>Annual Policy Summary</h3>
              <p>Underwritten benefit guaranteed across all your clients for 12 months</p>
            </div>
          </div>

          <div *ngIf="successMessage" class="alert alert-success animate-fade-in">
            <i class="fa-solid fa-circle-check"></i>
            <div>
              <strong>Income Policy Issued!</strong>
              <p>{{ successMessage }}</p>
            </div>
          </div>

          <div *ngIf="errorMessage" class="alert alert-danger animate-fade-in">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- BENEFIT BREAKDOWN DISPLAY -->
          <div *ngIf="quoteResult" class="benefit-box">
            <div class="benefit-main">
              <span class="benefit-label">Monthly Guaranteed Payout</span>
              <span class="benefit-amount text-gradient">
                {{ quoteResult.monthlyBenefit | currency:'USD':'symbol':'1.0-0' }} <small>/ month</small>
              </span>
            </div>

            <div class="benefit-grid">
              <div class="benefit-stat">
                <span class="b-lbl">Total Financial Cap</span>
                <span class="b-val">{{ quoteResult.totalCoverage | currency:'USD':'symbol':'1.0-0' }}</span>
              </div>
              <div class="benefit-stat">
                <span class="b-lbl">Maximum Duration</span>
                <span class="b-val">{{ quoteResult.benefitPeriodMonths }} Months</span>
              </div>
              <div class="benefit-stat">
                <span class="b-lbl">Selected Tier</span>
                <span class="b-val">{{ quoteResult.tierName }}</span>
              </div>
              <div class="benefit-stat">
                <span class="b-lbl">Medical Incapacity</span>
                <span class="b-val" [class.text-success]="quoteResult.includesMedical">
                  {{ quoteResult.includesMedical ? 'INCLUDED' : 'EXCLUDED' }}
                </span>
              </div>
            </div>

            <div class="pricing-summary">
              <div class="pricing-row">
                <span>Annual Premium (Single Billed):</span>
                <strong>{{ quoteResult.annualPremium | currency }}</strong>
              </div>
              <div class="pricing-row sub-price">
                <span>Equivalent Monthly Rate:</span>
                <span>{{ quoteResult.monthlyPremium | currency }}/mo</span>
              </div>
            </div>
          </div>

          <!-- BIND BUTTON -->
          <div class="bind-action-box">
            <div *ngIf="!auth.isAuthenticated()" class="auth-gate-box">
              <p>Please log in to activate your annual income protection policy.</p>
              <a routerLink="/auth/login" class="btn btn-primary btn-sm">Sign In to Bind</a>
            </div>

            <div *ngIf="auth.isAuthenticated()">
              <button
                (click)="bindIncomePolicy()"
                [disabled]="binding || !quoteResult"
                class="btn btn-primary w-100 btn-bind-income"
              >
                <i *ngIf="binding" class="fa-solid fa-spinner fa-spin"></i>
                <span *ngIf="!binding">
                  <i class="fa-solid fa-award"></i> Bind Annual Policy for {{ (quoteResult?.annualPremium || 0) | currency }}
                </span>
                <span *ngIf="binding">Issuing Annual Policy...</span>
              </button>
              <p class="policy-disclaimer">
                30-day lookback period applies. Benefits pay out within 3 business days of verified termination or medical documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .income-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
    }

    .page-header {
      margin-bottom: 2.5rem;
      max-width: 820px;
    }

    .header-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.25);
      color: #c084fc;
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

    .icon-circle-purple {
      background: rgba(139, 92, 246, 0.15);
      color: #c084fc;
    }

    .icon-circle-cyan {
      background: rgba(6, 182, 212, 0.15);
      color: #22d3ee;
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
      background: var(--secondary);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
    }

    .range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .font-mono {
      font-family: monospace;
      color: #c084fc;
      font-size: 1.05rem;
    }

    /* Tier Options */
    .tier-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .tier-card {
      background: var(--bg-input);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      padding: 0.85rem;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .tier-card:hover {
      border-color: var(--border-bright);
    }

    .tier-card.selected {
      background: rgba(139, 92, 246, 0.15);
      border-color: var(--secondary);
    }

    .tier-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tier-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .tier-ratio {
      font-size: 0.8rem;
      font-weight: 700;
      color: #c084fc;
    }

    .tier-desc {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    /* Duration options */
    .duration-options {
      display: flex;
      gap: 0.75rem;
    }

    .duration-pill {
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
      transition: all var(--transition-fast);
    }

    .duration-pill input {
      display: none;
    }

    .duration-pill.selected {
      background: rgba(139, 92, 246, 0.15);
      border-color: var(--secondary);
      color: #d8b4fe;
    }

    /* Medical Rider Box */
    .medical-rider-box {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      margin-top: 1.5rem;
    }

    .rider-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .rider-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .rider-info {
      flex-grow: 1;
    }

    .rider-info h4 {
      font-size: 0.95rem;
      margin-bottom: 0.15rem;
      color: #6ee7b7;
    }

    .rider-info p {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Switch toggle */
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 26px;
      flex-shrink: 0;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider-switch {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #334155;
      transition: .3s;
    }

    .slider-switch:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .3s;
    }

    input:checked + .slider-switch {
      background-color: #10b981;
    }

    input:checked + .slider-switch:before {
      transform: translateX(22px);
    }

    .slider-switch.round {
      border-radius: 34px;
    }

    .slider-switch.round:before {
      border-radius: 50%;
    }

    /* Summary Card */
    .benefit-box {
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .benefit-main {
      text-align: center;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 1.25rem;
    }

    .benefit-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.35rem;
    }

    .benefit-amount {
      font-size: 2.25rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
    }

    .benefit-amount small {
      font-size: 1rem;
      color: var(--text-muted);
      font-weight: 400;
    }

    .benefit-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .benefit-stat {
      background: rgba(255, 255, 255, 0.02);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .b-lbl {
      font-size: 0.72rem;
      color: var(--text-dim);
      text-transform: uppercase;
    }

    .b-val {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .pricing-summary {
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: var(--radius-md);
      padding: 1rem;
    }

    .pricing-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-main);
    }

    .pricing-row strong {
      font-size: 1.2rem;
      color: #c084fc;
    }

    .sub-price {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .btn-bind-income {
      padding: 0.95rem;
      font-size: 1.05rem;
    }

    .policy-disclaimer {
      font-size: 0.75rem;
      color: var(--text-dim);
      text-align: center;
      margin-top: 0.75rem;
      line-height: 1.4;
    }

    .text-success {
      color: #34d399;
    }

    .w-100 {
      width: 100%;
    }
  `]
})
export class IncomeAssuranceComponent implements OnInit {
  auth = inject(AuthService);
  private riskService = inject(RiskService);
  private policyService = inject(PolicyService);
  private router = inject(Router);

  quoteReq: IncomeQuoteRequest = {
    monthlyIncome: 6000,
    benefitPeriodMonths: 3,
    coverageTier: 'GOLD',
    includeMedicalIncapacity: true
  };

  selectedTier: 'GOLD' | 'SILVER' | 'BRONZE' = 'GOLD';
  quoteResult: IncomeQuoteResponse | null = null;
  binding = false;
  successMessage = '';
  errorMessage = '';

  ngOnInit(): void {
    this.calculateQuote();
  }

  setTier(tier: 'GOLD' | 'SILVER' | 'BRONZE'): void {
    this.selectedTier = tier;
    this.quoteReq.coverageTier = tier;
    this.calculateQuote();
  }

  onParamsChanged(): void {
    this.calculateQuote();
  }

  calculateQuote(): void {
    this.riskService.getIncomeQuote(this.quoteReq).subscribe({
      next: (res) => {
        if (res.data) {
          this.quoteResult = res.data;
        }
      },
      error: () => {
        // Fallback actuarial formula
        const ratio = this.selectedTier === 'GOLD' ? 0.8 : (this.selectedTier === 'SILVER' ? 0.65 : 0.5);
        const monthlyBenefit = this.quoteReq.monthlyIncome * ratio;
        const totalCoverage = monthlyBenefit * this.quoteReq.benefitPeriodMonths;
        let rate = 0.045; // 4.5% of total benefit
        if (this.quoteReq.includeMedicalIncapacity) rate += 0.015;
        const annualPremium = Math.round(totalCoverage * rate);

        this.quoteResult = {
          monthlyIncome: this.quoteReq.monthlyIncome,
          monthlyBenefit: monthlyBenefit,
          benefitPeriodMonths: this.quoteReq.benefitPeriodMonths,
          totalCoverage: totalCoverage,
          annualPremium: annualPremium,
          monthlyPremium: Math.round((annualPremium / 12) * 100) / 100,
          includesMedical: this.quoteReq.includeMedicalIncapacity,
          tierName: `${this.selectedTier} (${Math.round(ratio * 100)}% Replacement)`
        };
      }
    });
  }

  bindIncomePolicy(): void {
    if (!this.quoteResult) return;

    this.binding = true;
    this.errorMessage = '';
    this.successMessage = '';

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 12-month annual policy

    const payload = {
      freelancerId: this.auth.currentUser()?.id || 1,
      coverageTier: this.selectedTier,
      monthlyBenefit: this.quoteResult.monthlyBenefit,
      benefitDurationMonths: this.quoteResult.benefitPeriodMonths,
      totalBenefitCap: this.quoteResult.totalCoverage,
      annualPremium: this.quoteResult.annualPremium,
      includesMedicalIncapacity: this.quoteResult.includesMedical,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'ACTIVE' as const
    };

    this.policyService.issueIncomePolicy(payload).subscribe({
      next: (res) => {
        this.binding = false;
        this.successMessage = `Annual Policy #${res.data?.policyNumber || 'INC-2026-X'} activated!`;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1800);
      },
      error: (err) => {
        this.binding = false;
        this.errorMessage = err.error?.message || 'Failed to issue policy. Please try again.';
      }
    });
  }
}
