import config from '../config/environment';

// API Base URL
const API_BASE_URL = config.api.baseUrl;

// Network Info
export interface NetworkInfo {
  publicIp: string;
  userAgent: string;
  timestamp: string;
  ssid: string | null;
  explanation: string;
}

// Speed Test
export interface SpeedTestResult {
  ping: number;
  downloadSpeed: number;
  uploadSpeed: number;
  timestamp: string;
}

// Bandwidth Settings
export interface BandwidthLimit {
  enabled: boolean;
  maxSpeed: number;
  appliedAt: string;
}

export interface GlobalBandwidthSettings {
  limit: BandwidthLimit;
  type: 'global';
}

export interface DeviceBandwidthSettings {
  deviceId: string;
  limit: BandwidthLimit;
  type: 'device';
}

// API Client
export const api = {
  // Network
  getNetworkInfo: async (): Promise<NetworkInfo> => {
    const response = await fetch(`${API_BASE_URL}/network/info`);
    if (!response.ok) throw new Error('Failed to fetch network info');
    return response.json();
  },

  // Speed Test
  runSpeedTest: async (): Promise<SpeedTestResult> => {
    const response = await fetch(`${API_BASE_URL}/speedtest`);
    if (!response.ok) throw new Error('Failed to run speed test');
    return response.json();
  },

  // Bandwidth
  getGlobalBandwidth: async (): Promise<GlobalBandwidthSettings> => {
    const response = await fetch(`${API_BASE_URL}/bandwidth/global`);
    if (!response.ok) throw new Error('Failed to fetch global bandwidth settings');
    return response.json();
  },

  setGlobalBandwidth: async (enabled: boolean, maxSpeed: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bandwidth/global`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled, maxSpeed }),
    });
    if (!response.ok) throw new Error('Failed to set global bandwidth');
  },

  setDeviceBandwidth: async (deviceId: string, enabled: boolean, maxSpeed: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bandwidth/device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, enabled, maxSpeed }),
    });
    if (!response.ok) throw new Error('Failed to set device bandwidth');
  },
};
