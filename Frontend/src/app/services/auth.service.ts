import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UserDTO } from '../models/auth.model';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'secure360_token';
  private readonly userKey = 'secure360_user';

  currentUser = signal<AuthResponse | null>(this.getStoredUser());

  isAuthenticated = computed(() => !!this.currentUser());
  isFreelancer = computed(() => this.currentUser()?.role === 'FREELANCER');
  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');
  isUnderwriter = computed(() => this.currentUser()?.role === 'UNDERWRITER' || this.currentUser()?.role === 'ADMIN');

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<UserDTO>> {
    return this.http.post<ApiResponse<UserDTO>>(`${this.baseUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setSession(auth: AuthResponse): void {
    localStorage.setItem(this.tokenKey, auth.token);
    localStorage.setItem(this.userKey, JSON.stringify(auth));
    this.currentUser.set(auth);
  }

  private getStoredUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
