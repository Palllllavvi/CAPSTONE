import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EquipmentInsuranceComponent } from './pages/equipment/equipment-insurance.component';
import { IncomeAssuranceComponent } from './pages/income/income-assurance.component';
import { ClaimsCenterComponent } from './pages/claims/claims-center.component';
import { NewEquipmentClaimComponent } from './pages/claims/new-equipment-claim.component';
import { NewIncomeClaimComponent } from './pages/claims/new-income-claim.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'equipment', component: EquipmentInsuranceComponent },
  { path: 'income', component: IncomeAssuranceComponent },
  { path: 'claims', component: ClaimsCenterComponent, canActivate: [authGuard] },
  { path: 'claims/equipment/new', component: NewEquipmentClaimComponent, canActivate: [authGuard] },
  { path: 'claims/income/new', component: NewIncomeClaimComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: '**', redirectTo: '' }
];
