export type IncidentType =
  | 'PHYSICAL_DAMAGE'
  | 'THEFT'
  | 'FIRE'
  | 'WATER_DAMAGE'
  | 'NATURAL_EVENT'
  | 'OTHER';

export type TerminationType =
  | 'UNEXPECTED_TERMINATION'
  | 'CLIENT_INSOLVENCY'
  | 'MEDICAL_INCAPACITY'
  | 'OTHER_COVERED';

export type ClaimStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SETTLED';

export interface EquipmentClaim {
  id: number;
  claimNumber: string;
  policyId: number;
  freelancerId: number;
  equipmentId: number;
  equipmentName?: string;
  incidentDate: string;
  incidentType: IncidentType;
  description: string;
  policeReportNumber?: string;
  claimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  rejectionReason?: string;
  settlementDate?: string;
  createdAt?: string;
}

export interface IncomeClaim {
  id: number;
  claimNumber: string;
  policyId: number;
  freelancerId: number;
  terminationDate: string;
  terminationType: TerminationType;
  reason: string;
  clientName?: string;
  monthlyBenefit: number;
  monthsClaimed: number;
  totalClaimAmount: number;
  approvedAmount?: number;
  status: ClaimStatus;
  rejectionReason?: string;
  settlementDate?: string;
  medicalCertProvided: boolean;
  doctorName?: string;
  createdAt?: string;
}

export interface ReviewClaimRequest {
  status: 'APPROVED' | 'REJECTED' | 'SETTLED' | 'UNDER_REVIEW';
  approvedAmount?: number;
  rejectionReason?: string;
  notes?: string;
}
