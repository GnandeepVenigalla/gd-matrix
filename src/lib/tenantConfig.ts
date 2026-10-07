export const getTenantFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // Ignore base domains
  if (hostname === 'localhost' || hostname === 'www.gdmatrix.com' || hostname === 'gdmatrix.com') {
    return null;
  }
  
  // Extract subdomain (e.g. gdenterprises.gdmatrix.com -> gdenterprises)
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
};
