// src/types/form.ts
import { ROLES } from '@/utils/roleUtils';

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface FormInputs {
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
  address: string | null;
  enabled: boolean;
  password: string | null;
  confirmPassword: string | null;
  profilePicture: string | null;
}

export interface UserSubmitData extends Omit<FormInputs, 'confirmPassword'> {}
