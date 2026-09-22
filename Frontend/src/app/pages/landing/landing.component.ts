import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="landing-page">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container hero-content">
          <div class="hero-badge">
            <i class="fa-solid fa-bolt-lightning"></i>
            <span>Institutional-Grade Freelance Safety Net</span>
          </div>
          <h1 class="hero-title">
            Fearless Freelancing.<br>
            <span class="text-gradient">Comprehensive 360° Shield.</span>
          </h1>
          <p class="hero-subtitle">
            Tailored actuarial coverage for the modern independent professional. Protect expensive client hardware in your custody and secure your annual income against sudden termination & medical incapacity.
          </p>

          <div class="hero-cta-group">
            <a routerLink="/equipment" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-laptop-file"></i> Protect Client Equipment
            </a>
            <a routerLink="/income" class="btn btn-secondary btn-lg">
              <i class="fa-solid fa-shield-heart"></i> Calculate Income Shield
            </a>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="metrics-bar grid-4">
            <div class="metric-item">
              <span class="metric-num">$1.8M+</span>
              <span class="metric-label">Equipment Insured</span>
            </div>
            <div class="metric-item">
              <span class="metric-num">< 24 hrs</span>
              <span class="metric-label">Avg Claim Settlement</span>
            </div>
            <div class="metric-item">
              <span class="metric-num">100%</span>
              <span class="metric-label">Digital Underwriting</span>
            </div>
            <div class="metric-item">
              <span class="metric-num">4.9 / 5</span>
              <span class="metric-label">Freelancer Rating</span>
            </div>
          </div>
        </div>
      </section>

      <!-- TWO FLAGSHIP PRODUCTS -->
      <section class="products-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Two Dedicated Shields. <span class="text-gradient-cyan">Zero Blind Spots.</span></h2>
            <p class="section-desc">Independent coverage products engineered specifically to address contractual liabilities and income volatility.</p>
          </div>

          <div class="grid-2 product-cards">
            <!-- PRODUCT 1: EQUIPMENT LIABILITY -->
            <div class="card product-card">
              <div class="card-glow blue-glow"></div>
              <div class="product-badge blue-badge">
                <i class="fa-solid fa-microchip"></i> Project-Specific
              </div>
              <h3 class="product-title">Client-Provided Equipment Liability</h3>
              <p class="product-summary">
                When enterprise clients entrust you with $4,000+ MacBook Pros, test hardware, camera rigs, or dev servers, their contracts hold you personally liable for damage or theft.
              </p>
              
              <ul class="feature-checklist">
                <li><i class="fa-solid fa-check text-success"></i> Accidental physical drops, spills & liquid damage</li>
                <li><i class="fa-solid fa-check text-success"></i> Theft & burglary with police report reimbursement</li>
                <li><i class="fa-solid fa-check text-success"></i> Project custody verification with client sign-off</li>
                <li><i class="fa-solid fa-check text-success"></i> Tailored low-deductible options starting at $100</li>
              </ul>

              <div class="product-pricing">
                <span class="price-rate">From <strong>$0.45</strong> / day</span>
                <span class="price-note">Billed precisely for project duration</span>
              </div>

              <div class="product-actions">
                <a routerLink="/equipment" class="btn btn-primary w-100">
                  <i class="fa-solid fa-calculator"></i> Quote & Bind Coverage
                </a>
              </div>
            </div>

            <!-- PRODUCT 2: INCOME ASSURANCE -->
            <div class="card product-card">
              <div class="card-glow purple-glow"></div>
              <div class="product-badge purple-badge">
                <i class="fa-solid fa-calendar-check"></i> Annual Freelancer Policy
              </div>
              <h3 class="product-title">Annual Freelancer Income Assurance</h3>
              <p class="product-summary">
                A personal 12-month policy that travels with you across all contracts. Provides guaranteed monthly payouts if contracts are canceled unexpectedly or illness halts work.
              </p>

              <ul class="feature-checklist">
                <li><i class="fa-solid fa-check text-success"></i> Sudden termination without cause & client insolvency</li>
                <li><i class="fa-solid fa-check text-success"></i> <strong>Medical Incapacity Rider</strong> covering illness/injury</li>
                <li><i class="fa-solid fa-check text-success"></i> Up to 80% monthly income replacement for 3-6 months</li>
                <li><i class="fa-solid fa-check text-success"></i> Direct wire transfer settlement with expedited triage</li>
              </ul>

              <div class="product-pricing">
                <span class="price-rate">From <strong>$28</strong> / month</span>
                <span class="price-note">Based on 12-month average freelance revenue</span>
              </div>

              <div class="product-actions">
                <a routerLink="/income" class="btn btn-primary w-100">
                  <i class="fa-solid fa-sliders"></i> Customize Income Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- WHY SECURE360 SECTION -->
      <section class="features-section">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Built for the Contract Economy</h2>
            <p class="section-desc">Traditional corporate commercial policies were never made for freelancers. Secure360 is built from first principles.</p>
          </div>

          <div class="grid-3 feature-grid">
            <div class="card feature-box">
              <div class="feature-icon"><i class="fa-solid fa-file-contract"></i></div>
              <h4>Contract-Aligned Custody</h4>
              <p>Directly link client project contracts to equipment custody logs. Client signs off digitally on release and condition.</p>
            </div>
            <div class="card feature-box">
              <div class="feature-icon"><i class="fa-solid fa-brain"></i></div>
              <h4>Actuarial Risk Pricing</h4>
              <p>Dynamic automated quotes based on hardware category, replacement value, project duration, and verified track record.</p>
            </div>
            <div class="card feature-box">
              <div class="feature-icon"><i class="fa-solid fa-money-bill-transfer"></i></div>
              <h4>Transparent Claims Triage</h4>
              <p>Track your claim real-time from submission to review and settlement. Transparent status without bureaucratic runaround.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      padding-bottom: 3rem;
    }

    .hero-section {
      padding: 4.5rem 0 3.5rem;
      text-align: center;
      position: relative;
    }

    .hero-content {
      max-width: 860px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(59, 130, 246, 0.12);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
      padding: 0.35rem 0.95rem;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      font-size: 3.5rem;
      line-height: 1.12;
      margin-bottom: 1.5rem;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2.25rem;
      max-width: 720px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-cta-group {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 3.5rem;
      flex-wrap: wrap;
    }

    .metrics-bar {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      text-align: center;
    }

    .metric-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .metric-num {
      font-size: 1.75rem;
      font-weight: 800;
      font-family: 'Outfit', sans-serif;
      color: var(--text-main);
    }

    .metric-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 3rem;
    }

    .section-title {
      font-size: 2.2rem;
      margin-bottom: 0.75rem;
    }

    .section-desc {
      color: var(--text-secondary);
      font-size: 1.05rem;
    }

    .products-section {
      padding: 4rem 0;
    }

    .product-card {
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .product-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      width: fit-content;
      margin-bottom: 1rem;
    }

    .blue-badge {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .purple-badge {
      background: rgba(139, 92, 246, 0.15);
      color: #c084fc;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .product-title {
      font-size: 1.6rem;
      margin-bottom: 0.75rem;
    }

    .product-summary {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .feature-checklist {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
      flex-grow: 1;
    }

    .feature-checklist li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.925rem;
      color: var(--text-secondary);
    }

    .text-success {
      color: var(--accent-emerald);
    }

    .product-pricing {
      background: rgba(15, 23, 42, 0.6);
      border-radius: var(--radius-md);
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-bottom: 1.5rem;
    }

    .price-rate {
      font-size: 1.15rem;
      color: var(--text-main);
    }

    .price-rate strong {
      font-size: 1.5rem;
      color: #60a5fa;
    }

    .price-note {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    .w-100 {
      width: 100%;
    }

    .features-section {
      padding: 3.5rem 0;
    }

    .feature-box {
      padding: 2rem;
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin-bottom: 1.25rem;
    }

    .feature-box h4 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .feature-box p {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.4rem;
      }
    }
  `]
})
export class LandingComponent {}
