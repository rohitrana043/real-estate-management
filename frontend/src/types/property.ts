// src/types/property.ts

export type PropertyType = 'APARTMENT' | 'HOUSE' | 'COMMERCIAL';
export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'RENTED';

export interface ImageDTO {
  id: number;
  name: string;
  type: string;
  url: string;
  propertyId: number;
  isMain: boolean;
  displayOrder: number;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyDTO {
  id?: number;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  images?: ImageDTO[];
}

export interface PropertySearchCriteria {
  status?: PropertyStatus;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  keyword?: string;
  createdAfter?: string;
  createdBefore?: string;
  minPricePerSqFt?: number;
  maxPricePerSqFt?: number;
}

export interface PagePropertyDTO {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PropertyDTO[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
