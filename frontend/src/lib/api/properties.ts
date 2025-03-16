// src/lib/api/properties.ts
import axiosInstance from './axios';
import {
  PropertyDTO,
  PropertySearchCriteria,
  PagePropertyDTO,
  ImageDTO,
} from '@/types/property';
import { useRouter } from 'next/navigation';
import { withMock } from './mockUtil';

const PROPERTIES_ENDPOINT = '/properties';

// Public endpoints - No authentication required
export const getProperties = async (
  page = 0,
  size = 10,
  sort: string[] = ['createdAt,desc']
): Promise<PagePropertyDTO> => {
  return withMock(
    async () => {
      const response = await axiosInstance.get(PROPERTIES_ENDPOINT, {
        params: {
          page,
          size,
          sort: sort.join(','),
        },
      });
      return response.data;
    },
    'properties.getProperties',
    'getProperties'
  );
};

export const getProperty = async (id: number): Promise<PropertyDTO> => {
  try {
    return withMock(
      async () => {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(
          `${PROPERTIES_ENDPOINT}/${id}`
        );
        return response.data;
      },
      'properties.getProperty',
      `getProperty(${id})`
    );
  } catch (error: any) {
    throw error;
  }
};

export const searchProperties = async (
  criteria: PropertySearchCriteria,
  page = 0,
  size = 10,
  sort: string[] = ['createdAt,desc']
): Promise<PagePropertyDTO> => {
  return withMock(
    async () => {
      const response = await axiosInstance.get(
        `${PROPERTIES_ENDPOINT}/search`,
        {
          params: {
            ...criteria,
            page,
            size,
            sort: sort.join(','),
          },
        }
      );
      return response.data;
    },
    'properties.searchProperties',
    'searchProperties'
  );
};

// New endpoint to get similar properties
export const getSimilarProperties = async (
  propertyId: number,
  limit = 3
): Promise<PropertyDTO[]> => {
  try {
    return withMock(
      async () => {
        const response = await axiosInstance.get(
          `${PROPERTIES_ENDPOINT}/${propertyId}/similar`,
          {
            params: { limit },
          }
        );
        return response.data;
      },
      'properties.getSimilarProperties',
      `getSimilarProperties(${propertyId})`
    );
  } catch (error: any) {
    console.error('Error fetching similar properties:', error);
    // Return empty array if the endpoint fails or doesn't exist yet
    return [];
  }
};

// Protected endpoints - Require authentication
export const createProperty = async (
  property: PropertyDTO
): Promise<PropertyDTO> => {
  return withMock(
    async () => {
      const response = await axiosInstance.post(PROPERTIES_ENDPOINT, property);
      return response.data;
    },
    'properties.createProperty',
    'createProperty'
  );
};

export const updateProperty = async (
  id: number,
  property: PropertyDTO
): Promise<PropertyDTO> => {
  return withMock(
    async () => {
      const response = await axiosInstance.put(
        `${PROPERTIES_ENDPOINT}/${id}`,
        property
      );
      return response.data;
    },
    'properties.updateProperty',
    `updateProperty(${id})`
  );
};

export const deleteProperty = async (id: number): Promise<void> => {
  return withMock(
    async () => {
      await axiosInstance.delete(`${PROPERTIES_ENDPOINT}/${id}`);
    },
    'properties.deleteProperty',
    `deleteProperty(${id})`
  );
};

// Property Images API
export const getPropertyImages = async (
  propertyId: number
): Promise<ImageDTO[]> => {
  return withMock(
    async () => {
      const response = await axiosInstance.get(
        `${PROPERTIES_ENDPOINT}/${propertyId}/images`
      );
      return response.data;
    },
    'properties.getPropertyImages',
    `getPropertyImages(${propertyId})`
  );
};

export const uploadImage = async (
  propertyId: number,
  file: File
): Promise<ImageDTO> => {
  return withMock(
    async () => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(
        `${PROPERTIES_ENDPOINT}/${propertyId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    'properties.uploadImage',
    `uploadImage(${propertyId})`
  );
};

export const uploadMultipleImages = async (
  propertyId: number,
  files: File[]
): Promise<ImageDTO[]> => {
  return withMock(
    async () => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));

      const response = await axiosInstance.post(
        `${PROPERTIES_ENDPOINT}/${propertyId}/images/multiple`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    'properties.uploadMultipleImages',
    `uploadMultipleImages(${propertyId})`
  );
};

export const deleteImage = async (
  propertyId: number,
  imageId: number
): Promise<void> => {
  return withMock(
    async () => {
      await axiosInstance.delete(
        `${PROPERTIES_ENDPOINT}/${propertyId}/images/${imageId}`
      );
    },
    'properties.deleteImage',
    `deleteImage(${propertyId},${imageId})`
  );
};

export const setMainImage = async (
  propertyId: number,
  imageId: number
): Promise<ImageDTO> => {
  return withMock(
    async () => {
      const response = await axiosInstance.put(
        `${PROPERTIES_ENDPOINT}/${propertyId}/images/${imageId}/main`
      );
      return response.data;
    },
    'properties.setMainImage',
    `setMainImage(${propertyId},${imageId})`
  );
};

export const reorderImages = async (
  propertyId: number,
  imageIds: number[]
): Promise<ImageDTO[]> => {
  return withMock(
    async () => {
      const response = await axiosInstance.put(
        `${PROPERTIES_ENDPOINT}/${propertyId}/images/reorder`,
        imageIds
      );
      return response.data;
    },
    'properties.reorderImages',
    `reorderImages(${propertyId})`
  );
};
