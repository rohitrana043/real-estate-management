// src/lib/validation/userForm.ts
import * as yup from 'yup';
import { ROLES } from '@/utils/roleUtils';
import { FormInputs, UserRole } from '@/types/userForm';

export const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const createValidationSchema = (
  isNewUser: boolean
): yup.ObjectSchema<FormInputs> => {
  return yup.object().shape({
    name: yup
      .string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),

    email: yup
      .string()
      .required('Email is required')
      .email('Invalid email format'),

    phone: yup
      .string()
      .nullable()
      .transform((value) => (value?.trim() === '' ? null : value))
      .matches(phoneRegExp, {
        message: 'Invalid phone number format',
        excludeEmptyString: true,
      }),

    roles: yup
      .array()
      .of(yup.string())
      .min(1, 'At least one role is required')
      .required('Roles are required')
      .default([ROLES.CLIENT]),

    address: yup
      .string()
      .nullable()
      .transform((value) => (value?.trim() === '' ? null : value))
      .max(200, 'Address must not exceed 200 characters'),

    enabled: yup.boolean().required('Status is required').default(true),

    password: yup
      .string()
      .nullable()
      .transform((value) => (value?.trim() === '' ? null : value))
      .when('$isNewUser', {
        is: true,
        then: (schema) =>
          schema
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password must not exceed 50 characters'),
        otherwise: (schema) =>
          schema.test(
            'password',
            'Password must be at least 8 characters',
            (value) => (value ? value.length >= 8 : true)
          ),
      }),

    confirmPassword: yup
      .string()
      .nullable()
      .transform((value) => (value?.trim() === '' ? null : value))
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value;
      }),

    profilePicture: yup.string().nullable().default(null),
  }) as yup.ObjectSchema<FormInputs>;
};
