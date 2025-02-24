// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from '@/lib/api/axios';

interface DashboardStats {
  totalViews: number;
  totalProperties: number;
  totalFavorites: number;
  totalMessages: number;
  recentActivity: {
    id: number;
    type: 'property_view' | 'favorite_added' | 'message';
    property: string;
    location: string;
    time: string;
    icon: string;
  }[];
  propertyStats: {
    activeListings: number;
    pendingSales: number;
    trends: {
      views: { value: number; isPositive: boolean };
      properties: { value: number; isPositive: boolean };
      favorites: { value: number; isPositive: boolean };
      messages: { value: number; isPositive: boolean };
    };
  };
}

export const useDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // In a real application, these would be separate API endpoints
        // const viewsResponse = await axios.get('/api/analytics/views');
        // const propertiesResponse = await axios.get('/api/properties/stats');
        // const favoritesResponse = await axios.get('/api/favorites/stats');
        // const messagesResponse = await axios.get('/api/messages/stats');
        // const activityResponse = await axios.get('/api/activity/recent');

        // For now, we'll use mock data
        setStats({
          totalViews: 2845,
          totalProperties: 18,
          totalFavorites: 245,
          totalMessages: 12,
          recentActivity: [
            {
              id: 1,
              type: 'property_view',
              property: 'Modern Apartment',
              location: 'Downtown',
              time: '2 hours ago',
              icon: 'visibility',
            },
            // Add more activity items...
          ],
          propertyStats: {
            activeListings: 15,
            pendingSales: 3,
            trends: {
              views: { value: 12, isPositive: true },
              properties: { value: 5, isPositive: true },
              favorites: { value: 8, isPositive: true },
              messages: { value: 3, isPositive: false },
            },
          },
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  return { stats, loading, error };
};
