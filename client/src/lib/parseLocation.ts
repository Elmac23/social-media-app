export function parseLocation(country?: string, city?: string) {
  return country && city ? `${country}, ${city}` : country || city;
}
