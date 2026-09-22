export interface Equipment {
  id: number;
  projectId: number;
  itemName: string;
  serialNumber: string;
  model?: string;
  category?: string;
  estimatedValue: number;
  custodyStartDate?: string;
  custodyEndDate?: string;
  custodyStatus: 'ASSIGNED' | 'ACCEPTED' | 'RETURNED' | 'DISPUTED';
  conditionNotes?: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  clientName: string;
  clientEmail?: string;
  freelancerId: number;
  startDate?: string;
  endDate?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  equipmentList?: Equipment[];
}
