import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EquipmentClaim,
  IncomeClaim,
  ReviewClaimRequest
} from '../models/claim.model';
import { ApiResponse } from './auth.service';

export interface AllClaimsResponse {
  equipmentClaims: EquipmentClaim[];
  incomeClaims: IncomeClaim[];
}

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private readonly baseUrl = 'http://localhost:8080/api/claims';

  constructor(private http: HttpClient) {}

  submitEquipmentClaim(claimData: Partial<EquipmentClaim>): Observable<ApiResponse<EquipmentClaim>> {
    return this.http.post<ApiResponse<EquipmentClaim>>(`${this.baseUrl}/equipment`, claimData);
  }

  getEquipmentClaims(): Observable<ApiResponse<EquipmentClaim[]>> {
    return this.http.get<ApiResponse<EquipmentClaim[]>>(`${this.baseUrl}/equipment`);
  }

  getEquipmentClaimById(id: number): Observable<ApiResponse<EquipmentClaim>> {
    return this.http.get<ApiResponse<EquipmentClaim>>(`${this.baseUrl}/equipment/${id}`);
  }

  reviewEquipmentClaim(id: number, review: ReviewClaimRequest): Observable<ApiResponse<EquipmentClaim>> {
    return this.http.put<ApiResponse<EquipmentClaim>>(`${this.baseUrl}/equipment/${id}/review`, review);
  }

  submitIncomeClaim(claimData: Partial<IncomeClaim>): Observable<ApiResponse<IncomeClaim>> {
    return this.http.post<ApiResponse<IncomeClaim>>(`${this.baseUrl}/income`, claimData);
  }

  getIncomeClaims(): Observable<ApiResponse<IncomeClaim[]>> {
    return this.http.get<ApiResponse<IncomeClaim[]>>(`${this.baseUrl}/income`);
  }

  getIncomeClaimById(id: number): Observable<ApiResponse<IncomeClaim>> {
    return this.http.get<ApiResponse<IncomeClaim>>(`${this.baseUrl}/income/${id}`);
  }

  reviewIncomeClaim(id: number, review: ReviewClaimRequest): Observable<ApiResponse<IncomeClaim>> {
    return this.http.put<ApiResponse<IncomeClaim>>(`${this.baseUrl}/income/${id}/review`, review);
  }

  getAllClaims(): Observable<ApiResponse<AllClaimsResponse>> {
    return this.http.get<ApiResponse<AllClaimsResponse>>(`${this.baseUrl}/all`);
  }
}
