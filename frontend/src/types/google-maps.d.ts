// src/types/google-maps.d.ts
declare interface Window {
  google: {
    maps: {
      Map: new (element: HTMLElement, options: any) => any;
      Marker: new (options: any) => any;
      Geocoder: new () => {
        geocode: (
          request: { address?: string; location?: any },
          callback: (
            results: google.maps.GeocoderResult[],
            status: google.maps.GeocoderStatus
          ) => void
        ) => void;
      };
      GeocoderStatus: {
        OK: string;
        ZERO_RESULTS: string;
        OVER_QUERY_LIMIT: string;
        REQUEST_DENIED: string;
        INVALID_REQUEST: string;
        UNKNOWN_ERROR: string;
      };
      GeocoderResult: any;
      LatLng: any;
      Animation: {
        DROP: number;
      };
    };
  };
}
