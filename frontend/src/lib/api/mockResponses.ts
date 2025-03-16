// src/lib/api/mockResponses.ts

// Define the structure to match your API modules
const mockResponses = {
  // PROPERTIES API
  properties: {
    // GET /properties - Page of properties
    getProperties: {
      content: [
        {
          id: 1,
          title: 'Luxury Condo in Downtown',
          description:
            'Beautiful luxury condo with amazing views of the city skyline. This fully renovated unit features hardwood floors, stainless steel appliances, and floor-to-ceiling windows.',
          type: 'APARTMENT',
          status: 'AVAILABLE',
          price: 750000,
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          address: '123 Main St',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M5V 2K7',
          images: [
            {
              id: 1,
              name: 'toronto-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/toronto-apartment.jpg',
              propertyId: 1,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
        {
          id: 2,
          title: 'Spacious Family Home',
          description:
            'Perfect family home in a quiet neighborhood with excellent schools. Features 4 bedrooms, a large backyard, and a finished basement.',
          type: 'HOUSE',
          status: 'AVAILABLE',
          price: 950000,
          bedrooms: 4,
          bathrooms: 3,
          area: 2500,
          address: '456 Oak Avenue',
          city: 'North York',
          state: 'ON',
          zipCode: 'M2N 5P7',
          images: [
            {
              id: 2,
              name: 'north-york-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/north-york-apartment.jpg',
              propertyId: 2,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
        {
          id: 3,
          title: 'Modern Downtown Apartment',
          description:
            'Sleek, modern apartment in the heart of downtown with access to amenities including gym, pool, and concierge service.',
          type: 'APARTMENT',
          status: 'AVAILABLE',
          price: 650000,
          bedrooms: 1,
          bathrooms: 1,
          area: 850,
          address: '789 Bay Street',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M5G 2C8',
          images: [
            {
              id: 3,
              name: 'downtown-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/downtown-apartment.jpg',
              propertyId: 3,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
        {
          id: 4,
          title: 'Luxury Yorkville Condo',
          description:
            'Exclusive condo in the prestigious Yorkville area with high-end finishes, doorman, and private terrace.',
          type: 'CONDO',
          status: 'AVAILABLE',
          price: 1250000,
          bedrooms: 2,
          bathrooms: 2,
          area: 1400,
          address: '100 Yorkville Avenue',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M5R 1C2',
          images: [
            {
              id: 4,
              name: 'yorkville-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/yorkville-apartment.jpg',
              propertyId: 4,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
        {
          id: 5,
          title: 'Commercial Space in Business District',
          description:
            'Prime commercial space in the financial district, perfect for office or retail. Recently renovated with modern facilities.',
          type: 'COMMERCIAL',
          status: 'AVAILABLE',
          price: 2000000,
          bedrooms: 0,
          bathrooms: 2,
          area: 3000,
          address: '200 King Street West',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M5H 3T4',
          images: [
            {
              id: 5,
              name: 'york-mills-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/york-mills-apartment.jpg',
              propertyId: 5,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        offset: 0,
        unpaged: false,
        paged: true,
      },
      last: false,
      totalPages: 3,
      totalElements: 20,
      size: 10,
      number: 0,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      first: true,
      numberOfElements: 5,
      empty: false,
    },

    // GET /properties/{id} - Single property
    getProperty: {
      id: 1,
      title: 'Luxury Condo in Downtown',
      description:
        'Beautiful luxury condo with amazing views of the city skyline. This fully renovated unit features hardwood floors, stainless steel appliances, and floor-to-ceiling windows. Located in a secure building with 24-hour concierge, indoor pool, fitness center, and rooftop terrace. Walking distance to restaurants, shopping, and public transportation.',
      type: 'APARTMENT',
      status: 'AVAILABLE',
      price: 750000,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      address: '123 Main St',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M5V 2K7',
      images: [
        {
          id: 1,
          name: 'toronto-apartment.jpg',
          type: 'image/jpeg',
          url: '/images/properties/toronto-apartment.jpg',
          propertyId: 1,
          isMain: true,
          displayOrder: 0,
          fileSize: null,
          createdAt: '2025-02-23T20:43:13.005686',
          updatedAt: '2025-02-23T20:43:13.005686',
        },
        {
          id: 6,
          name: 'north-york-apartment.jpg',
          type: 'image/jpeg',
          url: '/images/properties/north-york-apartment.jpg',
          propertyId: 1,
          isMain: false,
          displayOrder: 1,
          fileSize: null,
          createdAt: '2025-02-23T20:43:13.005686',
          updatedAt: '2025-02-23T20:43:13.005686',
        },
      ],
    },

    // GET /properties/search - Search results
    searchProperties: {
      content: [
        {
          id: 1,
          title: 'Luxury Condo in Downtown',
          description: 'Beautiful luxury condo with amazing views',
          type: 'APARTMENT',
          status: 'AVAILABLE',
          price: 750000,
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          address: '123 Main St',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M5V 2K7',
          images: [
            {
              id: 1,
              name: 'toronto-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/toronto-apartment.jpg',
              propertyId: 1,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
          empty: false,
          sorted: true,
          unsorted: false,
        },
        offset: 0,
        unpaged: false,
        paged: true,
      },
      last: true,
      totalPages: 1,
      totalElements: 1,
      size: 10,
      number: 0,
      sort: {
        empty: false,
        sorted: true,
        unsorted: false,
      },
      first: true,
      numberOfElements: 1,
      empty: false,
    },

    // GET /properties/{id}/similar - Similar properties
    getSimilarProperties: [
      {
        id: 2,
        title: 'Spacious Family Home',
        description: 'Perfect family home in a quiet neighborhood',
        type: 'HOUSE',
        status: 'AVAILABLE',
        price: 950000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        address: '456 Oak Avenue',
        city: 'North York',
        state: 'ON',
        zipCode: 'M2N 5P7',
        images: [
          {
            id: 2,
            name: 'north-york-apartment.jpg',
            type: 'image/jpeg',
            url: '/images/properties/north-york-apartment.jpg',
            propertyId: 2,
            isMain: true,
            displayOrder: 0,
            fileSize: null,
            createdAt: '2025-02-23T20:43:13.005686',
            updatedAt: '2025-02-23T20:43:13.005686',
          },
        ],
      },
    ],

    // POST, PUT and DELETE operations
    createProperty: { id: 6, title: 'New Property' /* other fields */ },
    updateProperty: { id: 1, title: 'Updated Luxury Condo' /* other fields */ },
    deleteProperty: {},
  },

  // FAVORITES API
  favorites: {
    getFavoriteIds: [1, 3, 5],

    getFavoriteProperties: {
      content: [
        {
          id: 1,
          title: 'Luxury Condo in Downtown',
          description: 'Beautiful luxury condo with amazing views',
          type: 'APARTMENT',
          status: 'AVAILABLE',
          price: 750000,
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          address: '123 Main St',
          city: 'Toronto',
          state: 'ON',
          zipCode: 'M5V 2K7',
          images: [
            {
              id: 1,
              name: 'toronto-apartment.jpg',
              type: 'image/jpeg',
              url: '/images/properties/toronto-apartment.jpg',
              propertyId: 1,
              isMain: true,
              displayOrder: 0,
              fileSize: null,
              createdAt: '2025-02-23T20:43:13.005686',
              updatedAt: '2025-02-23T20:43:13.005686',
            },
          ],
        },
      ],
      totalElements: 3,
      totalPages: 1,
      size: 10,
      number: 0,
    },

    addFavorite: {
      id: 5,
      propertyId: 2,
      userEmail: 'user@example.com',
      createdAt: '2025-02-28T10:30:00Z',
    },

    removeFavorite: {},

    checkFavoriteStatus: true,

    getTotalFavoritesCount: {
      count: 3,
    },

    getPropertyFavoriteCount: {
      count: 5,
    },
  },

  // AUTH API
  auth: {
    // This is not directly used - we use dynamic login function below
    login: null,

    // Demo user credentials
    demoUsers: {
      'admin@realestate.com': {
        password: 'Admin123!',
        userData: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZXMiOlsiQURNSU4iXSwiaWF0IjoxNTE2MjM5MDIyfQ==',
          refreshToken: 'mock-admin-refresh-token-xyz789',
          tokenType: 'Bearer',
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@realestate.com',
            phone: '+1234567890',
            address: '123 Admin Street',
            profilePicture: '/images/male-profile-pic.svg',
            enabled: true,
            roles: ['ROLE_ADMIN'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
      'agent@realestate.com': {
        password: 'Agent123!',
        userData: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZ2VudCIsIm5hbWUiOiJBZ2VudCBVc2VyIiwicm9sZXMiOlsiQUdFTlQiXSwiaWF0IjoxNTE2MjM5MDIyfQ==',
          refreshToken: 'mock-agent-refresh-token-xyz456',
          tokenType: 'Bearer',
          user: {
            id: 2,
            name: 'Agent User',
            email: 'agent@realestate.com',
            phone: '+1987654321',
            address: '456 Agent Avenue',
            profilePicture: '/images/female-profile-pic.svg',
            enabled: true,
            roles: ['ROLE_AGENT'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
      'client@realestate.com': {
        password: 'Client123!',
        userData: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbGllbnQiLCJuYW1lIjoiQ2xpZW50IFVzZXIiLCJyb2xlcyI6WyJDTElFTlQiXSwiaWF0IjoxNTE2MjM5MDIyfQ==',
          refreshToken: 'mock-client-refresh-token-xyz123',
          tokenType: 'Bearer',
          user: {
            id: 3,
            name: 'Client User',
            email: 'client@realestate.com',
            phone: '+1555123456',
            address: '789 Client Court',
            profilePicture: '/images/male-profile-pic.svg',
            enabled: true,
            roles: ['ROLE_CLIENT'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        },
      },
    },

    register:
      'Registration successful. Please check your email for verification.',

    verifyEmail: {},

    resendVerification: {},

    forgotPassword: {},

    resetPassword: {},

    getCurrentUser: {
      id: 1,
      name: 'Mock User',
      email: 'user@example.com',
      phone: '+1234567890',
      address: '123 Mock Street',
      profilePicture: '/images/male-profile-pic.svg',
      enabled: true,
      roles: ['CLIENT'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },

    updateProfile: {
      id: 1,
      name: 'Updated Mock User',
      email: 'user@example.com',
      phone: '+1234567890',
      address: '123 Mock Street',
      profilePicture: '/images/male-profile-pic.svg',
      enabled: true,
      roles: ['CLIENT'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },

    changePassword: {},

    refreshToken: {
      accessToken: 'new-mock-access-token',
      refreshToken: 'new-mock-refresh-token',
      tokenType: 'Bearer',
    },

    revokeToken: {},

    getAllUsers: [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@realestate.com',
        phone: '+1234567890',
        address: '123 Admin Street',
        profilePicture: '/images/male-profile-pic.svg',
        enabled: true,
        roles: ['ADMIN'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Agent User',
        email: 'agent@realestate.com',
        phone: '+1987654321',
        address: '456 Agent Avenue',
        profilePicture: '/images/female-profile-pic.svg',
        enabled: true,
        roles: ['AGENT'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 3,
        name: 'Client User',
        email: 'client@realestate.com',
        phone: '+1555123456',
        address: '789 Client Court',
        profilePicture: '/images/male-profile-pic.svg',
        enabled: true,
        roles: ['CLIENT'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ],
  },

  // NEWSLETTER API
  newsletter: {
    subscribe: {
      success: true,
      message: 'Successfully subscribed to newsletter!',
    },

    unsubscribe: {
      success: true,
      message: 'Successfully unsubscribed from newsletter.',
    },

    verifyUnsubscribeToken: {
      success: true,
      email: 'user@example.com',
    },
  },

  // CONTACT API
  contact: {
    submitContactForm: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      subject: 'Property Inquiry',
      message: "I'm interested in one of your properties...",
      inquiryType: 'BUYING',
      responded: false,
      createdAt: '2024-02-28T12:00:00Z',
      updatedAt: '2024-02-28T12:00:00Z',
    },
  },

  // ANALYTICS API (for dashboard)
  analytics: {
    dashboard: {
      totalViews: 1250,
      totalProperties: 50,
      totalFavorites: 85,
      totalMessages: 120,
      availableProperties: 32,
      soldProperties: 18,
      recentActivity: [
        {
          id: 1,
          type: 'property_view',
          property: 'Property Summary',
          location: 'All cities',
          time: new Date().toLocaleString(),
          icon: 'visibility',
        },
      ],
      propertyStats: {
        activeListings: 32,
        pendingSales: 8,
        trends: {
          views: { value: 15, isPositive: true },
          properties: { value: 8, isPositive: true },
          favorites: { value: 12, isPositive: true },
          messages: { value: 5, isPositive: false },
        },
      },
      city: 'All cities',
      reportDate: new Date().toISOString(),
    },
  },
};

export default mockResponses;
