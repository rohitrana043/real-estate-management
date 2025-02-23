// src/lib/validation/contact.ts
import * as yup from 'yup';

export const contactFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+?[1-9][0-9]{7,14}$/, 'Invalid phone number format')
    .optional(),
  subject: yup
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
  inquiryType: yup
    .string()
    .oneOf(
      ['general', 'buying', 'selling', 'renting', 'investment'],
      'Please select a valid inquiry type'
    )
    .optional(),
});

// Function to validate the contact form data
export const validateContactForm = async (formData: any) => {
  try {
    await contactFormSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((e) => {
        if (e.path) {
          errors[e.path] = e.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { form: 'Validation error occurred' } };
  }
};
