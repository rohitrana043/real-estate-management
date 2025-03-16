// src/hooks/useDashboard.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '@/lib/api/axios'; // Use the configured axiosInstance
import { withMock } from '@/lib/api/mockUtil';

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

        // Fetch analytics data from the backend using withMock
        const analyticsData = await withMock(
          () =>
            axiosInstance
              .get('/analytics/dashboard')
              .then((response) => response.data),
          'analytics.dashboard',
          'fetchDashboardStats'
        );

        // Build dashboard stats from the analytics data
        setStats({
          totalViews: analyticsData.totalViews || 0,
          totalProperties:
            analyticsData.totalProperties ||
            analyticsData.availableProperties + analyticsData.soldProperties ||
            0,
          totalFavorites: analyticsData.totalFavorites || 0,
          totalMessages: analyticsData.totalMessages || 0,
          recentActivity: analyticsData.recentActivity || [
            {
              id: 1,
              type: 'property_view',
              property: 'Property Summary',
              location: analyticsData.city || 'All cities',
              time: new Date(analyticsData.reportDate).toLocaleString(),
              icon: 'visibility',
            },
          ],
          propertyStats: analyticsData.propertyStats || {
            activeListings: analyticsData.availableProperties || 0,
            pendingSales: analyticsData.soldProperties || 0,
            trends: {
              views: {
                value: analyticsData.propertyStats?.trends?.views?.value || 5,
                isPositive:
                  analyticsData.propertyStats?.trends?.views?.isPositive ||
                  true,
              },
              properties: {
                value:
                  analyticsData.propertyStats?.trends?.properties?.value || 8,
                isPositive:
                  analyticsData.propertyStats?.trends?.properties?.isPositive ||
                  true,
              },
              favorites: {
                value:
                  analyticsData.propertyStats?.trends?.favorites?.value || 12,
                isPositive:
                  analyticsData.propertyStats?.trends?.favorites?.isPositive ||
                  true,
              },
              messages: {
                value:
                  analyticsData.propertyStats?.trends?.messages?.value || 3,
                isPositive:
                  analyticsData.propertyStats?.trends?.messages?.isPositive ||
                  false,
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
