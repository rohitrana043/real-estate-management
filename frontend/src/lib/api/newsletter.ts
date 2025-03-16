// src/lib/api/newsletter.ts
import axiosInstance from './axios';
import { AxiosError } from 'axios';
import { withMock } from './mockUtil';

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
    return withMock(
      async () => {
        try {
          const response = await axiosInstance.post('/newsletter/subscribe', {
            email,
          });
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            // Extract API error information
            const apiError: NewsletterErrorResponse = {
              message:
                error.response.data?.message ||
                'Failed to subscribe to newsletter',
              errors: error.response.data?.errors,
              status: error.response.status,
            };

            (error as any).apiError = apiError;
          }
          throw error;
        }
      },
      'newsletter.subscribe',
      'subscribe'
    );
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
    return withMock(
      async () => {
        try {
          const response = await axiosInstance.post(
            `/newsletter/unsubscribe?token=${token}`
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
      'newsletter.unsubscribe',
      'unsubscribe'
    );
  },

  /**
   * Verify unsubscribe token (before showing unsubscribe form)
   * @param token Unsubscribe token to verify
   * @returns A promise that resolves to the response with email
   */
  verifyUnsubscribeToken: async (
    token: string
  ): Promise<{ success: boolean; email: string }> => {
    return withMock(
      async () => {
        try {
          const response = await axiosInstance.get(
            `/newsletter/verify?token=${token}`
          );
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError && error.response) {
            // Extract API error information
            const apiError: NewsletterErrorResponse = {
              message:
                error.response.data?.message || 'Invalid unsubscribe link',
              status: error.response.status,
            };

            (error as any).apiError = apiError;
          }
          throw error;
        }
      },
      'newsletter.verifyUnsubscribeToken',
      'verifyUnsubscribeToken'
    );
  },
};

export default newsletterApi;
