// src/lib/api/newsletter.ts
import axiosInstance from './axios';
import { AxiosError } from 'axios';

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export interface NewsletterErrorResponse {
  message: string;
  errors?: Record<string, string>;
  status?: number;
}

const newsletterApi = {
  /**
   * Subscribe to newsletter
   * @param email Email address to subscribe
   * @returns A promise that resolves to the response data
   */
  subscribe: async (email: string): Promise<NewsletterResponse> => {
    try {
      const response = await axiosInstance.post('/contact/newsletter', {
        email,
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Extract API error information
        const apiError: NewsletterErrorResponse = {
          message:
            error.response.data?.message || 'Failed to subscribe to newsletter',
          errors: error.response.data?.errors,
          status: error.response.status,
        };

        (error as any).apiError = apiError;
      }
      throw error;
    }
  },

  /**
   * Unsubscribe from newsletter
   * @param email Email address to unsubscribe
   * @param token Unsubscribe token for verification
   * @returns A promise that resolves to the response data
   */
  unsubscribe: async (
    email: string,
    token: string
  ): Promise<NewsletterResponse> => {
    try {
      const response = await axiosInstance.post(
        '/contact/newsletter/unsubscribe',
        {
          email,
          token,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Extract API error information
        const apiError: NewsletterErrorResponse = {
          message:
            error.response.data?.message ||
            'Failed to unsubscribe from newsletter',
          errors: error.response.data?.errors,
          status: error.response.status,
        };

        (error as any).apiError = apiError;
      }
      throw error;
    }
  },

  /**
   * Verify unsubscribe token (before showing unsubscribe form)
   * @param token Unsubscribe token to verify
   * @returns A promise that resolves to the response with email
   */
  verifyUnsubscribeToken: async (
    token: string
  ): Promise<{ success: boolean; email: string }> => {
    try {
      const response = await axiosInstance.get(
        `/contact/newsletter/verify?token=${token}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        // Extract API error information
        const apiError: NewsletterErrorResponse = {
          message: error.response.data?.message || 'Invalid unsubscribe link',
          status: error.response.status,
        };

        (error as any).apiError = apiError;
      }
      throw error;
    }
  },
};

export default newsletterApi;
