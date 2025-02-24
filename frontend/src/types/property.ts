// src/types/property.ts

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
  content: PropertyDTO[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface SortOption {
  label: string;
  value: string;
  field: string;
  direction: 'asc' | 'desc';
}

export interface PropertySearchCriteria {
  keyword?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  city?: string;
  state?: string;
}

export interface FilterState {
  type: string;
  status: string;
  bedrooms: string;
  bathrooms: string;
  priceRange: [number, number];
}

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 2000000];

export const DEFAULT_FILTERS: FilterState = {
  type: 'all',
  status: 'all',
  bedrooms: 'all',
  bathrooms: 'all',
  priceRange: DEFAULT_PRICE_RANGE,
};

export enum PropertyType {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  COMMERCIAL = 'COMMERCIAL',
  CONDO = 'CONDO',
  SPECIAL = 'SPECIAL',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
}
