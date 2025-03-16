// src/lib/api/favorites.ts
import axiosInstance from './axios';
import { PropertyDTO } from '@/types/property';
import { withMock } from './mockUtil';

interface FavoriteResponse {
  id: number;
  propertyId: number;
  userEmail: string; // Updated from userId
  createdAt: string;
}

const favoritesApi = {
  // Get all favorite property IDs for the logged-in user
  getFavoriteIds: async (): Promise<number[]> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get('/properties/favorites/ids');
        return response.data;
      },
      'favorites.getFavoriteIds',
      'getFavoriteIds'
    );
  },

  // Get all favorite properties with details and pagination
  getFavoriteProperties: async (
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Promise<{
    content: PropertyDTO[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get('/properties/favorites', {
          params: { page, size, sort },
        });
        return response.data;
      },
      'favorites.getFavoriteProperties',
      'getFavoriteProperties'
    );
  },

  // Add a property to favorites
  addFavorite: async (propertyId: number): Promise<FavoriteResponse> => {
    return withMock(
      async () => {
        const response = await axiosInstance.post(
          `/properties/favorites/${propertyId}`
        );
        return response.data;
      },
      'favorites.addFavorite',
      `addFavorite(${propertyId})`
    );
  },

  // Remove a property from favorites
  removeFavorite: async (propertyId: number): Promise<void> => {
    return withMock(
      async () => {
        await axiosInstance.delete(`/properties/favorites/${propertyId}`);
      },
      'favorites.removeFavorite',
      `removeFavorite(${propertyId})`
    );
  },

  // Check if a property is favorited
  checkFavoriteStatus: async (propertyId: number): Promise<boolean> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get(
          `/properties/favorites/${propertyId}/status`
        );
        return response.data.isFavorite;
      },
      'favorites.checkFavoriteStatus',
      `checkFavoriteStatus(${propertyId})`
    );
  },

  // Get total favorites count for current user
  getTotalFavoritesCount: async (): Promise<number> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get('/properties/favorites/count');
        return response.data.count;
      },
      'favorites.getTotalFavoritesCount',
      'getTotalFavoritesCount'
    );
  },

  // Get property favorite count (how many users favorited this property)
  getPropertyFavoriteCount: async (propertyId: number): Promise<number> => {
    return withMock(
      async () => {
        const response = await axiosInstance.get(
          `/properties/favorites/${propertyId}/count`
        );
        return response.data.count;
      },
      'favorites.getPropertyFavoriteCount',
      `getPropertyFavoriteCount(${propertyId})`
    );
  },
};

export default favoritesApi;
