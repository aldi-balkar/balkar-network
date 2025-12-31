/**
 * Environment Configuration
 * Central configuration management for all environment variables
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Application Info
  app: {
    name: process.env.APP_NAME || 'Balkar Network Manager',
    version: process.env.APP_VERSION || '1.0.0',
    description: process.env.APP_DESCRIPTION || 'Professional WiFi Network Management Tool',
  },

  // URLs
  urls: {
    apiBase: process.env.API_BASE_URL || 'http://localhost:5001/api',
    client: process.env.CLIENT_URL || 'http://localhost:3000',
  },

  // Router Default Settings
  router: {
    defaultIp: process.env.DEFAULT_ROUTER_IP || '192.168.1.1',
    defaultUsername: process.env.DEFAULT_ROUTER_USERNAME || 'admin',
  },

  // Speed Test Configuration
  speedTest: {
    downloadUrl: process.env.SPEEDTEST_DOWNLOAD_URL || 'https://speed.cloudflare.com/__down?bytes=5000000',
    timeout: parseInt(process.env.SPEEDTEST_TIMEOUT || '15000', 10),
  },

  // Network Configuration
  network: {
    publicIpService: process.env.PUBLIC_IP_SERVICE || 'https://api.ipify.org?format=json',
    publicIpTimeout: parseInt(process.env.PUBLIC_IP_TIMEOUT || '3000', 10),
    wifiDetectionTimeout: parseInt(process.env.WIFI_DETECTION_TIMEOUT || '3000', 10),
  },

  // Security Scanner
  security: {
    scanTimeout: parseInt(process.env.SECURITY_SCAN_TIMEOUT || '60000', 10),
    requestTimeout: parseInt(process.env.SECURITY_REQUEST_TIMEOUT || '3000', 10),
    maxAttempts: parseInt(process.env.SECURITY_SCAN_MAX_ATTEMPTS || '20', 10),
  },

  // Diagnostic Configuration
  diagnostic: {
    pingCount: parseInt(process.env.DIAGNOSTIC_PING_COUNT || '5', 10),
    testTimeout: parseInt(process.env.DIAGNOSTIC_TEST_TIMEOUT || '5000', 10),
    bandwidthTimeout: parseInt(process.env.DIAGNOSTIC_BANDWIDTH_TIMEOUT || '15000', 10),
    bandwidthTestUrl: process.env.DIAGNOSTIC_BANDWIDTH_URL || 'https://speed.cloudflare.com/__down?bytes=5000000',
    pingServer: process.env.DIAGNOSTIC_PING_SERVER || '8.8.8.8',
    gatewayTimeout: parseInt(process.env.DIAGNOSTIC_GATEWAY_TIMEOUT || '5000', 10),
    dnsTimeout: parseInt(process.env.DIAGNOSTIC_DNS_TIMEOUT || '5000', 10),
  },

  // PDF Report Configuration
  pdf: {
    author: process.env.PDF_REPORT_AUTHOR || 'Balkar Network Manager',
    subject: process.env.PDF_REPORT_SUBJECT || 'WiFi Network Diagnostic Report',
    keywords: process.env.PDF_REPORT_KEYWORDS || 'wifi,network,diagnostic,bandwidth',
  },

  // Social Media
  social: {
    github: process.env.GITHUB_URL || 'https://github.com/balkar-network',
    instagram: process.env.INSTAGRAM_HANDLE || 'balkar_network',
  },
};

export default config;
