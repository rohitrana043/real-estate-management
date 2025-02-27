// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/api/axios'; // Use the configured axiosInstance

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

        // Fetch analytics data from the backend using axiosInstance
        const analyticsResponse = await axiosInstance.get(
          '/analytics/dashboard'
        );
        const analyticsData = analyticsResponse.data;

        // Build dashboard stats from the analytics data
        setStats({
          totalViews: analyticsData.totalProperties || 0,
          totalProperties:
            analyticsData.availableProperties + analyticsData.soldProperties ||
            0,
          totalFavorites: analyticsData.totalProperties || 0,
          totalMessages: analyticsData.totalProperties || 0,
          recentActivity: [
            {
              id: 1,
              type: 'property_view',
              property: 'Property Summary',
              location: analyticsData.city || 'All cities',
              time: new Date(analyticsData.reportDate).toLocaleString(),
              icon: 'visibility',
            },
          ],
          propertyStats: {
            activeListings: analyticsData.availableProperties || 0,
            pendingSales: analyticsData.soldProperties || 0,
            trends: {
              views: {
                value: 0,
                isPositive: true,
              },
              properties: {
                value: 0,
                isPositive: true,
              },
              favorites: {
                value: 0,
                isPositive: true,
              },
              messages: {
                value: 0,
                isPositive: true,
              },
            },
          },
        });
      } catch (err: any) {
        console.error('Error fetching analytics data:', err);
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch analytics data'
        );
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
