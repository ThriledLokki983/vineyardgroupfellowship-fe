
// *********************************************************
// API and App Configuration
// Updated: 2025-10-11 - Force fresh rebuild
// *********************************************************

// Environment variables for API configuration
export const VITE_DEV_ENVIRONMENT = import.meta.env.VITE_DEV_ENVIRONMENT || 'true';
export const USE_LOCAL_ENDPOINT = import.meta.env.VITE_USE_LOCAL_ENDPOINT === 'true';
export const LOCAL_API_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:8001/api/v1';
export const PRODUCTION_API_URL = import.meta.env.VITE_PRODUCTION_API_URL || 'https://api.vineyardgroupfellowship.org/api/v1';
export const DEBUG_API = import.meta.env.VITE_DEBUG_API === 'true';

// Base URLs for media files (without /api/v1 suffix)
export const LOCAL_BASE_URL = 'http://localhost:8001';
export const PRODUCTION_BASE_URL = 'https://api.vineyardgroupfellowship.org';

// Determine which API base URL to use based on environment configuration
export const API_BASE_URL = USE_LOCAL_ENDPOINT ? LOCAL_API_URL : PRODUCTION_API_URL;
export const BASE_URL = USE_LOCAL_ENDPOINT ? LOCAL_BASE_URL : PRODUCTION_BASE_URL;

// Export environment configuration for easy access
export const API_CONFIG = {
  useLocal: USE_LOCAL_ENDPOINT,
  localUrl: LOCAL_API_URL,
  productionUrl: PRODUCTION_API_URL,
  currentUrl: API_BASE_URL,
  baseUrl: BASE_URL,
  debugMode: DEBUG_API,
  environment: USE_LOCAL_ENDPOINT ? 'development' : 'production'
} as const;

// Custom Log
// Custom Logger for API Configuration
const log = {
  header: (msg: string) => console.log("\x1b[1m\x1b[34m%s\x1b[0m", msg),
  environment: (msg: string) => console.log("\x1b[36m%s\x1b[0m", `    -- 🌍 ${msg}`),
  endpoint: (msg: string) => console.log("\x1b[35m%s\x1b[0m", `    -- 🔗 ${msg}`),
  url: (msg: string) => console.log("\x1b[33m%s\x1b[0m", `    --📍 ${msg}`),
  debug: (msg: string) => console.log("\x1b[32m%s\x1b[0m", `    -- 🐛 ${msg}`),
  footer: (msg: string) => console.log(`${msg}`),
};

// Log current API configuration in development only
if (import.meta.env.DEV) {
  log.header('🌐 API Configuration');
  log.environment(`Environment: ${API_CONFIG.environment.toUpperCase()}`);
  log.endpoint(`Using ${USE_LOCAL_ENDPOINT ? 'LOCAL' : 'PRODUCTION'} endpoint`);
  log.url(`API Base URL: ${API_BASE_URL}`);
  log.url(`Media Base URL: ${BASE_URL}`);
  log.debug(`Debug Mode: ${DEBUG_API ? 'ON' : 'OFF'}`);
}

export const API_TIMEOUT = 30000;
export const CSRF_TOKEN_STORAGE_KEY = 'csrfToken';
export const CSRF_TOKEN_MATCH = document.cookie.match(/csrftoken=([^;]+)/);

export const APP_NAME = 'Vineyard Group Fellowship';
