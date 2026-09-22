import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EquipmentQuoteRequest,
  EquipmentQuoteResponse,
  IncomeQuoteRequest,
  IncomeQuoteResponse
} from '../models/risk.model';
import { ApiResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RiskService {
  private readonly baseUrl = 'http://localhost:8080/api/risk';

  constructor(private http: HttpClient) {}

  getEquipmentQuote(request: EquipmentQuoteRequest): Observable<ApiResponse<EquipmentQuoteResponse>> {
    return this.http.post<ApiResponse<EquipmentQuoteResponse>>(`${this.baseUrl}/quote/equipment`, request);
  }

  getIncomeQuote(request: IncomeQuoteRequest): Observable<ApiResponse<IncomeQuoteResponse>> {
    return this.http.post<ApiResponse<IncomeQuoteResponse>>(`${this.baseUrl}/quote/income`, request);
  }
}
