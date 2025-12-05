// Global API configuration
export const API_BASE_URL = "https://bhs-appraisal-backend-production.up.railway.app";


/**
 * Construct a full API URL from a path
 * @param {string} path - API endpoint path (e.g., "/auth/login")
 * @returns {string} Full URL
 */
export function apiUrl(path) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE}${normalizedPath}`
}


