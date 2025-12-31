/**
 * Client Environment Configuration
 * Central configuration management for frontend
 */

export const config = {
  // Application Info
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Balkar Network Manager',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Professional WiFi Network Management Tool',
  },

  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  },

  // Router Default Settings
  router: {
    defaultIp: import.meta.env.VITE_DEFAULT_ROUTER_IP || '192.168.1.1',
    defaultUsername: import.meta.env.VITE_DEFAULT_ROUTER_USERNAME || 'admin',
  },

  // Security Scanner
  security: {
    scanTimeout: parseInt(import.meta.env.VITE_SECURITY_SCAN_TIMEOUT || '60000', 10),
  },

  // PDF Report Configuration
  pdf: {
    author: import.meta.env.VITE_PDF_REPORT_AUTHOR || 'Balkar Network Manager',
    subject: import.meta.env.VITE_PDF_REPORT_SUBJECT || 'WiFi Network Diagnostic Report',
    keywords: import.meta.env.VITE_PDF_REPORT_KEYWORDS || 'wifi,network,diagnostic,bandwidth',
  },

  // Social Media
  social: {
    github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/balkar-network',
    instagram: import.meta.env.VITE_INSTAGRAM_HANDLE || 'balkar_network',
  },
};

export default config;
