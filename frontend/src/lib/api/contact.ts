// src/lib/api/contact.ts
import axiosInstance from './axios';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

const contactApi = {
  /**
   * Submit contact form data to the API
   * @param data The contact form data
   * @returns A promise that resolves to the response data
   */
  submitContactForm: async (data: ContactFormData): Promise<any> => {
    const response = await axiosInstance.post('/contact/submit', data);
    return response.data;
  },
};

export default contactApi;
