export interface EquipmentQuoteRequest {
  equipmentValue: number;
  durationDays: number;
  category?: string;
  deductiblePercentage?: number;
}

export interface EquipmentQuoteResponse {
  equipmentValue: number;
  durationDays: number;
  coverageAmount: number;
  deductible: number;
  calculatedPremium: number;
  riskScore?: number;
  dailyRate?: number;
}

export interface IncomeQuoteRequest {
  monthlyIncome: number;
  benefitPeriodMonths: number;
  coverageTier?: string;
  includeMedicalIncapacity: boolean;
}

export interface IncomeQuoteResponse {
  monthlyIncome: number;
  monthlyBenefit: number;
  benefitPeriodMonths: number;
  totalCoverage: number;
  annualPremium: number;
  monthlyPremium: number;
  includesMedical: boolean;
  tierName: string;
}
