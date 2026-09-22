import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipmentPolicyItem, IncomeAssurancePolicy } from '../models/policy.model';
import { ApiResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly baseUrl = 'http://localhost:8080/api/policies';

  constructor(private http: HttpClient) {}

  getEquipmentPolicies(): Observable<ApiResponse<EquipmentPolicyItem[]>> {
    return this.http.get<ApiResponse<EquipmentPolicyItem[]>>(`${this.baseUrl}/equipment`);
  }

  getEquipmentPolicyById(id: number): Observable<ApiResponse<EquipmentPolicyItem>> {
    return this.http.get<ApiResponse<EquipmentPolicyItem>>(`${this.baseUrl}/equipment/${id}`);
  }

  issueEquipmentPolicy(policyData: Partial<EquipmentPolicyItem>): Observable<ApiResponse<EquipmentPolicyItem>> {
    return this.http.post<ApiResponse<EquipmentPolicyItem>>(`${this.baseUrl}/equipment`, policyData);
  }

  getIncomePolicies(): Observable<ApiResponse<IncomeAssurancePolicy[]>> {
    return this.http.get<ApiResponse<IncomeAssurancePolicy[]>>(`${this.baseUrl}/income`);
  }

  getIncomePolicyById(id: number): Observable<ApiResponse<IncomeAssurancePolicy>> {
    return this.http.get<ApiResponse<IncomeAssurancePolicy>>(`${this.baseUrl}/income/${id}`);
  }

  issueIncomePolicy(policyData: Partial<IncomeAssurancePolicy>): Observable<ApiResponse<IncomeAssurancePolicy>> {
    return this.http.post<ApiResponse<IncomeAssurancePolicy>>(`${this.baseUrl}/income`, policyData);
  }
}
