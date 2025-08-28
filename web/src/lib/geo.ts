export type Coords = { latitude: number; longitude: number };

export async function getBrowserLocation(timeout = 20000): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator))
      return reject(new Error("Geolocation not supported by this browser"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({
        latitude: +p.coords.latitude.toFixed(6),
        longitude: +p.coords.longitude.toFixed(6),
      }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout, maximumAge: 0 }
    );
  });
}
