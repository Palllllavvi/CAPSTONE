import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Equipment } from '../models/project.model';
import { ApiResponse } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly baseUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ApiResponse<Project[]>> {
    return this.http.get<ApiResponse<Project[]>>(this.baseUrl);
  }

  getProjectById(id: number): Observable<ApiResponse<Project>> {
    return this.http.get<ApiResponse<Project>>(`${this.baseUrl}/${id}`);
  }

  createProject(project: Partial<Project>): Observable<ApiResponse<Project>> {
    return this.http.post<ApiResponse<Project>>(this.baseUrl, project);
  }

  getEquipmentByProject(projectId: number): Observable<ApiResponse<Equipment[]>> {
    return this.http.get<ApiResponse<Equipment[]>>(`${this.baseUrl}/${projectId}/equipment`);
  }

  addEquipment(projectId: number, equipment: Partial<Equipment>): Observable<ApiResponse<Equipment>> {
    return this.http.post<ApiResponse<Equipment>>(`${this.baseUrl}/${projectId}/equipment`, equipment);
  }

  updateCustody(projectId: number, equipmentId: number, status: string): Observable<ApiResponse<Equipment>> {
    return this.http.put<ApiResponse<Equipment>>(
      `${this.baseUrl}/${projectId}/equipment/${equipmentId}/custody`,
      { status }
    );
  }
}
