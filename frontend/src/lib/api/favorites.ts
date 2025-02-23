// src/lib/api/favorites.ts
import axiosInstance from './axios';
import { PropertyDTO } from '@/types/property';

interface FavoriteResponse {
  id: number;
  propertyId: number;
  userId: number;
  createdAt: string;
}

const favoritesApi = {
  // Get all favorite property IDs for the logged-in user
  getFavoriteIds: async (): Promise<number[]> => {
    const response = await axiosInstance.get('/favorites/ids');
    return response.data;
  },

  // Get all favorite properties with details
  getFavoriteProperties: async (): Promise<PropertyDTO[]> => {
    const response = await axiosInstance.get('/favorites');
    return response.data;
  },

  // Add a property to favorites
  addFavorite: async (propertyId: number): Promise<FavoriteResponse> => {
    const response = await axiosInstance.post('/favorites', { propertyId });
    return response.data;
  },

  // Remove a property from favorites
  removeFavorite: async (propertyId: number): Promise<void> => {
    await axiosInstance.delete(`/favorites/${propertyId}`);
  },
};

export default favoritesApi;
