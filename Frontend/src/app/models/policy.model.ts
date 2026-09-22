export interface EquipmentPolicyItem {
  id: number;
  policyNumber: string;
  freelancerId: number;
  projectId: number;
  equipmentId: number;
  equipmentName?: string;
  coverageAmount: number;
  deductible: number;
  premium: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'CLAIMED';
  createdAt?: string;
}

export interface IncomeAssurancePolicy {
  id: number;
  policyNumber: string;
  freelancerId: number;
  coverageTier: string;
  monthlyBenefit: number;
  benefitDurationMonths: number;
  totalBenefitCap: number;
  annualPremium: number;
  includesMedicalIncapacity: boolean;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  createdAt?: string;
}
