import { useState, useEffect, useCallback, useRef } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  locationName: string;
}

export interface GeolocationState {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useGeolocation(autoRequest: boolean = false): GeolocationState {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Using Nominatim (OpenStreetMap) for reverse geocoding - free, no API key needed
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
        {
          headers: {
            'User-Agent': 'Raitakarya/1.0' // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }

      const data = await response.json();

      // Extract relevant location information
      const address = data.address || {};
      const parts = [
        address.village || address.town || address.city || address.state_district,
        address.state
      ].filter(Boolean);

      return parts.join(', ') || data.display_name;
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Only update state if component is still mounted
        if (!isMountedRef.current) return;

        const { latitude, longitude } = position.coords;

        // Get location name from coordinates
        const locationName = await reverseGeocode(latitude, longitude);

        if (!isMountedRef.current) return;

        setLocation({
          latitude,
          longitude,
          locationName
        });
        setIsLoading(false);
      },
      (err) => {
        if (!isMountedRef.current) return;

        let errorMessage = 'Unable to retrieve your location';

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }

        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []); // Empty deps - stable reference

  useEffect(() => {
    // Track mount state
    isMountedRef.current = true;

    if (autoRequest) {
      requestLocation();
    }

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [autoRequest, requestLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation
  };
}
