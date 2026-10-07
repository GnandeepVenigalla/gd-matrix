export const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('gdmatrix.com')) {
    return 'https://gd-matric-backend.gdmatrix.com';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
};
