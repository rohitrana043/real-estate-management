// src/lib/validation/auth.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  phone: yup
    .string()
    .matches(/^\+?[1-9][0-9]{7,14}$/, 'Invalid phone number format')
    .optional(),
  address: yup.string().optional(),
});

export const passwordResetSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const secureRegisterSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
      .required('Password is required'),
    firstName: yup
      .string()
      .min(2, 'First name must be at least 2 characters')
      .required('First name is required'),
    lastName: yup
      .string()
      .min(2, 'Last name must be at least 2 characters')
      .required('Last name is required'),
    phoneNumber: yup
      .string()
      .matches(/^\+?[1-9][0-9]{7,14}$/, 'Invalid phone number format')
      .optional(),
    role: yup
      .string()
      .oneOf(['ADMIN', 'AGENT'] as const)
      .required('Role is required'),
    adminCode: yup.string().when('role', ([role], schema) => {
      return role === 'ADMIN'
        ? schema.required('Admin code is required for admin registration')
        : schema.optional();
    }),
    agencyName: yup.string().when('role', ([role], schema) => {
      return role === 'AGENT'
        ? schema.required('Agency name is required for agents')
        : schema.optional();
    }),
    licenseNumber: yup.string().when('role', ([role], schema) => {
      return role === 'AGENT'
        ? schema.required('License number is required for agents')
        : schema.optional();
    }),
  })
  .required();

// Validation schema for profile update
export const profileUpdateSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+?[1-9][0-9]{7,14}$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  address: yup.string().optional().nullable(),
});
