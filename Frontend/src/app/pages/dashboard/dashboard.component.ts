import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PolicyService } from '../../services/policy.service';
import { ProjectService } from '../../services/project.service';
import { ClaimService } from '../../services/claim.service';
import { EquipmentPolicyItem, IncomeAssurancePolicy } from '../../models/policy.model';
import { Project, Equipment } from '../../models/project.model';
import { EquipmentClaim, IncomeClaim } from '../../models/claim.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page container animate-fade-in">
      <!-- HEADER -->
      <div class="dashboard-header">
        <div class="header-left">
          <h1 class="welcome-title">
            Welcome back, <span class="text-gradient">{{ auth.currentUser()?.fullName || 'Freelancer' }}</span>
          </h1>
          <p class="welcome-subtitle">
            Manage your project hardware liability, active income assurance shields & claims
          </p>
        </div>
        <div class="header-actions">
          <a routerLink="/equipment" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-plus"></i> Insure Equipment
          </a>
          <a routerLink="/claims" class="btn btn-secondary btn-sm">
            <i class="fa-solid fa-file-shield"></i> Claims Center
          </a>
        </div>
      </div>

      <!-- METRIC STATS ROW -->
      <div class="stats-row grid-4">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <i class="fa-solid fa-laptop-medical"></i>
          </div>
          <div class="stat-meta">
            <div class="stat-value">{{ equipmentPolicies.length }}</div>
            <div class="stat-label">Active Equipment Policies</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div class="stat-meta">
            <div class="stat-value">
              {{ activeIncomePolicy ? (activeIncomePolicy.monthlyBenefit | currency:'USD':'symbol':'1.0-0') : '$0' }}
            </div>
            <div class="stat-label">Monthly Income Shield</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-cyan">
            <i class="fa-solid fa-boxes-stacked"></i>
          </div>
          <div class="stat-meta">
            <div class="stat-value">{{ totalCustodyItems }}</div>
            <div class="stat-label">Client Gear in Custody</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon stat-icon-emerald">
            <i class="fa-solid fa-clipboard-check"></i>
          </div>
          <div class="stat-meta">
            <div class="stat-value">{{ totalClaimsCount }}</div>
            <div class="stat-label">Total Claims Filed</div>
          </div>
        </div>
      </div>

      <!-- PRODUCT 1: EQUIPMENT POLICIES SECTION -->
      <div class="section-block">
        <div class="section-top">
          <div>
            <h2 class="section-heading">Client-Provided Equipment Policies</h2>
            <p class="section-sub">Project-specific coverage protecting you from liability for loss or damage</p>
          </div>
          <a routerLink="/equipment" class="btn btn-outline-primary btn-sm">
            <i class="fa-solid fa-calculator"></i> Get New Quote
          </a>
        </div>

        <div *ngIf="equipmentPolicies.length === 0" class="card empty-state">
          <i class="fa-solid fa-box-open empty-icon"></i>
          <h3>No Equipment Policies Active</h3>
          <p>Insure client hardware assigned to your ongoing projects against drops, liquid spills, and theft.</p>
          <a routerLink="/equipment" class="btn btn-primary btn-sm">
            <i class="fa-solid fa-plus"></i> View Client Projects & Insure Gear
          </a>
        </div>

        <div *ngIf="equipmentPolicies.length > 0" class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Policy #</th>
                <th>Equipment</th>
                <th>Coverage Limit</th>
                <th>Deductible</th>
                <th>Valid Period</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of equipmentPolicies">
                <td><strong class="font-mono">{{ p.policyNumber }}</strong></td>
                <td>{{ p.equipmentName || ('Equipment #' + p.equipmentId) }}</td>
                <td><span class="text-highlight">{{ p.coverageAmount | currency }}</span></td>
                <td>{{ p.deductible | currency }}</td>
                <td>{{ p.startDate | date:'mediumDate' }} - {{ p.endDate | date:'mediumDate' }}</td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + p.status.toLowerCase()">
                    {{ p.status }}
                  </span>
                </td>
                <td>
                  <a [routerLink]="['/claims/equipment/new']" [queryParams]="{policyId: p.id, equipId: p.equipmentId}" class="btn btn-secondary btn-sm">
                    <i class="fa-solid fa-triangle-exclamation"></i> File Claim
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PRODUCT 2: ANNUAL INCOME ASSURANCE SECTION -->
      <div class="section-block">
        <div class="section-top">
          <div>
            <h2 class="section-heading">Annual Freelancer Income Assurance</h2>
            <p class="section-sub">Guaranteed replacement income during unexpected contract cancellations & medical incapacity</p>
          </div>
          <a routerLink="/income" class="btn btn-outline-primary btn-sm">
            <i class="fa-solid fa-sliders"></i> Modify Plan
          </a>
        </div>

        <!-- If Active Policy Exists -->
        <div *ngIf="activeIncomePolicy" class="card income-active-card">
          <div class="income-card-header">
            <div class="tier-pill">
              <i class="fa-solid fa-crown"></i> {{ activeIncomePolicy.coverageTier }}
            </div>
            <span class="badge badge-active">{{ activeIncomePolicy.status }}</span>
          </div>

          <div class="grid-3 income-details-grid">
            <div class="detail-box">
              <span class="detail-lbl">Monthly Benefit Payout</span>
              <span class="detail-val text-gradient">{{ activeIncomePolicy.monthlyBenefit | currency }}/mo</span>
            </div>
            <div class="detail-box">
              <span class="detail-lbl">Benefit Duration</span>
              <span class="detail-val">{{ activeIncomePolicy.benefitDurationMonths }} Consecutive Months</span>
            </div>
            <div class="detail-box">
              <span class="detail-lbl">Total Protection Cap</span>
              <span class="detail-val">{{ activeIncomePolicy.totalBenefitCap | currency }}</span>
            </div>
          </div>

          <div class="income-card-footer">
            <div class="rider-status">
              <i class="fa-solid fa-circle-check text-success"></i>
              <span>Medical Incapacity Rider: <strong>{{ activeIncomePolicy.includesMedicalIncapacity ? 'ACTIVE (Illness/Injury Covered)' : 'EXCLUDED' }}</strong></span>
            </div>
            <a routerLink="/claims/income/new" [queryParams]="{policyId: activeIncomePolicy.id}" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-hand-holding-dollar"></i> File Income Claim
            </a>
          </div>
        </div>

        <!-- If No Policy Yet -->
        <div *ngIf="!activeIncomePolicy" class="card income-cta-card">
          <div class="income-cta-content">
            <div class="income-cta-icon">
              <i class="fa-solid fa-umbrella"></i>
            </div>
            <div class="income-cta-text">
              <h3>Protect Your Annual Freelance Earnings</h3>
              <p>Clients can cancel contracts without notice. Illness can derail months of billable hours. Secure up to 80% of your average freelance income.</p>
            </div>
          </div>
          <a routerLink="/income" class="btn btn-primary">
            <i class="fa-solid fa-shield-heart"></i> Calculate & Bind Plan
          </a>
        </div>
      </div>

      <!-- CLIENT EQUIPMENT IN CUSTODY -->
      <div class="section-block">
        <div class="section-top">
          <div>
            <h2 class="section-heading">Hardware in Your Custody</h2>
            <p class="section-sub">Equipment provided by clients for your active freelance projects</p>
          </div>
        </div>

        <div *ngIf="custodyEquipment.length === 0" class="card empty-state">
          <i class="fa-solid fa-laptop empty-icon"></i>
          <h3>No Client Gear Logged</h3>
          <p>When clients assign laptops, cameras, or dev boards to your project, verify custody here.</p>
        </div>

        <div *ngIf="custodyEquipment.length > 0" class="grid-3">
          <div *ngFor="let item of custodyEquipment" class="card equipment-card">
            <div class="equip-header">
              <h4>{{ item.itemName }}</h4>
              <span class="badge" [ngClass]="item.custodyStatus === 'ACCEPTED' ? 'badge-active' : 'badge-pending'">
                {{ item.custodyStatus }}
              </span>
            </div>
            <div class="equip-meta">
              <div><span class="equip-lbl">Serial:</span> <code>{{ item.serialNumber }}</code></div>
              <div><span class="equip-lbl">Model:</span> {{ item.model || 'Standard' }}</div>
              <div><span class="equip-lbl">Replacement Value:</span> <strong>{{ item.estimatedValue | currency }}</strong></div>
            </div>
            <div class="equip-actions">
              <button *ngIf="item.custodyStatus !== 'ACCEPTED'" (click)="acceptCustody(item)" class="btn btn-success btn-sm w-100">
                <i class="fa-solid fa-signature"></i> Accept Custody
              </button>
              <a *ngIf="item.custodyStatus === 'ACCEPTED'" routerLink="/equipment" class="btn btn-outline-primary btn-sm w-100">
                <i class="fa-solid fa-shield"></i> Ensure Insured
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding-top: 1.5rem;
      padding-bottom: 4rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .welcome-title {
      font-size: 2.2rem;
      margin-bottom: 0.35rem;
    }

    .welcome-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .stats-row {
      margin-bottom: 2.5rem;
    }

    .section-block {
      margin-bottom: 3rem;
    }

    .section-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .section-heading {
      font-size: 1.45rem;
      margin-bottom: 0.25rem;
    }

    .section-sub {
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
    }

    .empty-icon {
      font-size: 2.5rem;
      color: var(--text-dim);
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-muted);
      font-size: 0.9rem;
      max-width: 480px;
      margin: 0 auto 1.5rem;
    }

    .font-mono {
      font-family: monospace;
      color: #93c5fd;
    }

    .text-highlight {
      color: #60a5fa;
      font-weight: 600;
    }

    /* Income Active Card */
    .income-active-card {
      border-left: 4px solid var(--secondary);
    }

    .income-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .tier-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c084fc;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.85rem;
    }

    .income-details-grid {
      margin-bottom: 1.5rem;
    }

    .detail-box {
      background: rgba(15, 23, 42, 0.5);
      padding: 1rem;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-lbl {
      font-size: 0.78rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .detail-val {
      font-size: 1.35rem;
      font-weight: 700;
      font-family: 'Outfit', sans-serif;
    }

    .income-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--border-subtle);
      padding-top: 1rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .rider-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.88rem;
      color: var(--text-secondary);
    }

    /* Income CTA Card */
    .income-cta-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 2rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .income-cta-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      max-width: 700px;
    }

    .income-cta-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-lg);
      background: rgba(139, 92, 246, 0.15);
      color: #a78bfa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      flex-shrink: 0;
    }

    .income-cta-text h3 {
      font-size: 1.25rem;
      margin-bottom: 0.35rem;
    }

    .income-cta-text p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.45;
    }

    /* Equipment Cards */
    .equipment-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .equip-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }

    .equip-header h4 {
      font-size: 1.1rem;
    }

    .equip-meta {
      font-size: 0.88rem;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .equip-lbl {
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .w-100 {
      width: 100%;
    }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private policyService = inject(PolicyService);
  private projectService = inject(ProjectService);
  private claimService = inject(ClaimService);

  equipmentPolicies: EquipmentPolicyItem[] = [];
  activeIncomePolicy: IncomeAssurancePolicy | null = null;
  custodyEquipment: Equipment[] = [];
  totalClaimsCount = 0;
  totalCustodyItems = 0;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // 1. Load Equipment Policies
    this.policyService.getEquipmentPolicies().subscribe({
      next: (res) => {
        if (res.data) {
          this.equipmentPolicies = res.data;
        }
      }
    });

    // 2. Load Income Policies
    this.policyService.getIncomePolicies().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.activeIncomePolicy = res.data.find(p => p.status === 'ACTIVE') || res.data[0];
        }
      }
    });

    // 3. Load Projects & Equipment in Custody
    this.projectService.getProjects().subscribe({
      next: (res) => {
        if (res.data) {
          const allEquip: Equipment[] = [];
          res.data.forEach(p => {
            if (p.equipmentList) {
              allEquip.push(...p.equipmentList);
            }
          });
          this.custodyEquipment = allEquip;
          this.totalCustodyItems = allEquip.length;
        }
      }
    });

    // 4. Load Claims
    this.claimService.getEquipmentClaims().subscribe({
      next: (eqRes) => {
        const eqCount = eqRes.data?.length || 0;
        this.claimService.getIncomeClaims().subscribe({
          next: (incRes) => {
            this.totalClaimsCount = eqCount + (incRes.data?.length || 0);
          }
        });
      }
    });
  }

  acceptCustody(equipment: Equipment): void {
    this.projectService.updateCustody(equipment.projectId, equipment.id, 'ACCEPTED').subscribe({
      next: () => {
        equipment.custodyStatus = 'ACCEPTED';
      }
    });
  }
}
