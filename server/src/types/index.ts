// Types for network information
export interface NetworkInfo {
  publicIp: string;
  localIp: string;
  userAgent: string;
  timestamp: string;
  // SSID can now be accessed via system commands on the server
  ssid: string | null;
  explanation: string;
}

// Types for speed test
export interface SpeedTestResult {
  ping: number; // in ms
  downloadSpeed: number; // in Mbps
  uploadSpeed: number; // in Mbps
  timestamp: string;
}

// Types for bandwidth control
export interface BandwidthLimit {
  enabled: boolean;
  maxSpeed: number; // in Mbps
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

export interface BandwidthState {
  global: GlobalBandwidthSettings;
  devices: Map<string, DeviceBandwidthSettings>;
}

// Request types
export interface SetBandwidthRequest {
  enabled: boolean;
  maxSpeed: number;
}

export interface SetDeviceBandwidthRequest extends SetBandwidthRequest {
  deviceId: string;
}
