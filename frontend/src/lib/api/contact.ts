// src/lib/api/contact.ts
import axiosInstance from './axios';
import { AxiosError } from 'axios';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export interface ContactErrorResponse {
  message: string;
  errors?: Record<string, string>;
  status?: number;
}

const contactApi = {
  /**
   * Submit contact form data to the API
   * @param data The contact form data
   * @returns A promise that resolves to the response data
   */
  submitContactForm: async (data: ContactFormData): Promise<any> => {
    try {
      const response = await axiosInstance.post('/contacts', data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Extract API error information
        const apiError: ContactErrorResponse = {
          message:
            error.response.data?.message || 'Failed to submit to contact API',
          errors: error.response.data?.errors,
          status: error.response.status,
        };

        (error as any).apiError = apiError;
      }
      throw error;
    }
  },
};

export default contactApi;
