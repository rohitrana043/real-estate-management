import { ROLES } from '@/utils/roleUtils';

export interface SecureRegisterCredentials extends RegisterDTO {
  role: 'ADMIN' | 'AGENT';
  adminCode?: string; // Optional security code for admin registration
  agencyName?: string; // For agents
  licenseNumber?: string; // For agents
}

export interface AdminRegisterResponse {
  message: string;
  user: UserDTO;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  roles?: string[];
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profilePicture?: string | null;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  profilePicture?: string | File | null;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface PasswordResetRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LoginResponseDTO extends TokenResponse {
  token: string;
  user: UserDTO;
}

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface CreateUserDTO
  extends Omit<UserDTO, 'id' | 'createdAt' | 'updatedAt'> {
  password?: string;
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {}
