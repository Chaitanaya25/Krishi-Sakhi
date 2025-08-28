import { useCallback, useEffect, useState } from 'react';

export type GeoState = {
  lat?: number;
  lon?: number;
  status: 'idle' | 'fetching' | 'ok' | 'error';
  message?: string;
};

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({ status: 'idle', message: 'Not fetched' });

  // load last successful coords from localStorage (optional UX nicety)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ks:lastLocation');
      if (saved) {
        const { lat, lon } = JSON.parse(saved);
        if (typeof lat === 'number' && typeof lon === 'number') {
          setGeo({ status: 'ok', lat, lon, message: 'Loaded last location' });
        }
      }
    } catch { /* noop */ }
  }, []);

  const fetchLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeo({ status: 'error', message: 'Geolocation not supported by this browser' });
      return;
    }
    setGeo((g) => ({ ...g, status: 'fetching', message: 'Fetching…' }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lon = Number(pos.coords.longitude.toFixed(6));
        setGeo({ status: 'ok', lat, lon, message: 'Location fetched' });
        try { localStorage.setItem('ks:lastLocation', JSON.stringify({ lat, lon })); } catch {}
      },
      (err) => {
        console.error('Geolocation error:', err);
        setGeo({ status: 'error', message: `Location error: ${err.message}` });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { geo, fetchLocation };
}
