// src/components/maps/GoogleMap.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

interface GoogleMapProps {
  address: string;
  zoom?: number;
  height?: number | string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  address,
  zoom = 15,
  height = 300,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    // Function to load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        initMap();
      };

      document.head.appendChild(script);
    };

    // Function to initialize the map
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { address },
        (
          results: google.maps.GeocoderResult[],
          status: google.maps.GeocoderStatus
        ) => {
          if (status === 'OK' && results && results[0]) {
            const map = new window.google.maps.Map(mapRef.current!, {
              center: results[0].geometry.location,
              zoom: zoom,
            });

            new window.google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              animation: window.google.maps.Animation.DROP,
            });
          } else {
            console.error(
              'Geocode was not successful for the following reason:',
              status
            );
          }
        }
      );
    };

    loadGoogleMapsScript();

    // Cleanup
    return () => {
      const scriptElements = document.querySelectorAll(
        'script[src*="maps.googleapis.com"]'
      );
      scriptElements.forEach((element) => element.remove());
    };
  }, [address, zoom, apiKey]);

  return (
    <Box
      ref={mapRef}
      sx={{
        height: height,
        width: '100%',
        bgcolor: 'neutral.light',
      }}
    />
  );
};

export default GoogleMap;
