export interface UserDTO {
  id: number;
  email: string;
  fullName: string;
  role: 'FREELANCER' | 'CLIENT' | 'UNDERWRITER' | 'ADMIN';
  phoneNumber?: string;
  bio?: string;
  hourlyRate?: number;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  role: 'FREELANCER' | 'CLIENT' | 'UNDERWRITER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  bio?: string;
  hourlyRate?: number;
}
