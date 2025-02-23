export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  token: string;
  newPassword: string;
}

export interface SecureRegisterCredentials extends RegisterCredentials {
  role: 'ADMIN' | 'AGENT';
  adminCode?: string; // Optional security code for admin registration
  agencyName?: string; // For agents
  licenseNumber?: string; // For agents
}

export interface AdminRegisterResponse {
  message: string;
  user: User;
}
