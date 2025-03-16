// src/lib/api/contact.ts
import axiosInstance from './axios';
import { AxiosError } from 'axios';
import { withMock } from './mockUtil';

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
    return withMock(
      async () => {
        try {
          const response = await axiosInstance.post('/contacts', data);
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            // Extract API error information
            const apiError: ContactErrorResponse = {
              message:
                error.response.data?.message ||
                'Failed to submit to contact API',
              errors: error.response.data?.errors,
              status: error.response.status,
            };

            (error as any).apiError = apiError;
          }
          throw error;
        }
      },
      'contact.submitContactForm',
      'contact.submitContactForm'
    );
  },

  /**
   * Get all contacts (for admin)
   */
  getAllContacts: async (page = 0, size = 10): Promise<any> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get('/contacts', {
          params: { page, size },
        });
        return response.data;
      },
      'contact.getAllContacts',
      'contact.getAllContacts'
    );
  },

  /**
   * Get contact by ID
   */
  getContactById: async (id: number): Promise<any> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get(`/contacts/${id}`);
        return response.data;
      },
      'contact.getContactById',
      `contact.getContactById(${id})`
    );
  },

  /**
   * Mark contact as responded
   */
  markAsResponded: async (id: number): Promise<any> => {
    return withMock(
      async () => {
        const response = await axiosInstance.patch(`/contacts/${id}/respond`);
        return response.data;
      },
      'contact.markAsResponded',
      `contact.markAsResponded(${id})`
    );
  },
};

export default contactApi;
