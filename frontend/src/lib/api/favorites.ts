// src/lib/api/favorites.ts
import axiosInstance from './axios';
import { PropertyDTO } from '@/types/property';

interface FavoriteResponse {
  id: number;
  propertyId: number;
  userEmail: string; // Updated from userId
  createdAt: string;
}

const favoritesApi = {
  // Get all favorite property IDs for the logged-in user
  getFavoriteIds: async (): Promise<number[]> => {
    const response = await axiosInstance.get('/properties/favorites/ids');
    return response.data;
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
    const response = await axiosInstance.get('/properties/favorites', {
      params: { page, size, sort },
    });
    return response.data;
  },

  // Add a property to favorites
  addFavorite: async (propertyId: number): Promise<FavoriteResponse> => {
    const response = await axiosInstance.post(
      `/properties/favorites/${propertyId}`
    );
    return response.data;
  },

  // Remove a property from favorites
  removeFavorite: async (propertyId: number): Promise<void> => {
    await axiosInstance.delete(`/properties/favorites/${propertyId}`);
  },

  // Check if a property is favorited
  checkFavoriteStatus: async (propertyId: number): Promise<boolean> => {
    const response = await axiosInstance.get(
      `/properties/favorites/${propertyId}/status`
    );
    return response.data.isFavorite;
  },

  // Get total favorites count for current user
  getTotalFavoritesCount: async (): Promise<number> => {
    const response = await axiosInstance.get('/properties/favorites/count');
    return response.data.count;
  },

  // Get property favorite count (how many users favorited this property)
  getPropertyFavoriteCount: async (propertyId: number): Promise<number> => {
    const response = await axiosInstance.get(
      `/properties/favorites/${propertyId}/count`
    );
    return response.data.count;
  },
};

export default favoritesApi;
