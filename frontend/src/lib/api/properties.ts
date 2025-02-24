// src/lib/api/properties.ts
import axiosInstance from './axios';
import {
  PropertyDTO,
  PropertySearchCriteria,
  PagePropertyDTO,
  ImageDTO,
} from '@/types/property';
import { useRouter } from 'next/navigation';

const PROPERTIES_ENDPOINT = '/properties';

// Public endpoints - No authentication required
export const getProperties = async (
  page = 0,
  size = 10,
  sort: string[] = ['createdAt,desc']
): Promise<PagePropertyDTO> => {
  const response = await axiosInstance.get(PROPERTIES_ENDPOINT, {
    params: {
      page,
      size,
      sort: sort.join(','),
    },
  });
  return response.data;
};

export const getProperty = async (id: number): Promise<PropertyDTO> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get(`${PROPERTIES_ENDPOINT}/${id}`);
    return response.data;
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
  const response = await axiosInstance.get(`${PROPERTIES_ENDPOINT}/search`, {
    params: {
      ...criteria,
      page,
      size,
      sort: sort.join(','),
    },
  });
  return response.data;
};

// Protected endpoints - Require authentication
export const createProperty = async (
  property: PropertyDTO
): Promise<PropertyDTO> => {
  const response = await axiosInstance.post(PROPERTIES_ENDPOINT, property);
  return response.data;
};

export const updateProperty = async (
  id: number,
  property: PropertyDTO
): Promise<PropertyDTO> => {
  const response = await axiosInstance.put(
    `${PROPERTIES_ENDPOINT}/${id}`,
    property
  );
  return response.data;
};

export const deleteProperty = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${PROPERTIES_ENDPOINT}/${id}`);
};

// Property Images API
export const getPropertyImages = async (
  propertyId: number
): Promise<ImageDTO[]> => {
  const response = await axiosInstance.get(
    `${PROPERTIES_ENDPOINT}/${propertyId}/images`
  );
  return response.data;
};

export const uploadImage = async (
  propertyId: number,
  file: File
): Promise<ImageDTO> => {
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
};

export const uploadMultipleImages = async (
  propertyId: number,
  files: File[]
): Promise<ImageDTO[]> => {
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
};

export const deleteImage = async (
  propertyId: number,
  imageId: number
): Promise<void> => {
  await axiosInstance.delete(
    `${PROPERTIES_ENDPOINT}/${propertyId}/images/${imageId}`
  );
};

export const setMainImage = async (
  propertyId: number,
  imageId: number
): Promise<ImageDTO> => {
  const response = await axiosInstance.put(
    `${PROPERTIES_ENDPOINT}/${propertyId}/images/${imageId}/main`
  );
  return response.data;
};

export const reorderImages = async (
  propertyId: number,
  imageIds: number[]
): Promise<ImageDTO[]> => {
  const response = await axiosInstance.put(
    `${PROPERTIES_ENDPOINT}/${propertyId}/images/reorder`,
    imageIds
  );
  return response.data;
};
