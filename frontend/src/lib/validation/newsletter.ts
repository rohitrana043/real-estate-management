// src/lib/validation/newsletter.ts
import * as yup from 'yup';

// Newsletter subscription validation schema
export const newsletterSubscribeSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
});

// Newsletter unsubscribe validation schema
export const newsletterUnsubscribeSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  token: yup.string().optional(),
});

// Function to validate email
export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  try {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);

    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }

    if (!isValid) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid email format' };
  }
};
