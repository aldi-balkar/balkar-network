/**
 * Format speed value to Mbps with unit
 */
export const formatSpeed = (mbps: number): string => {
  return `${mbps.toFixed(1)} Mbps`;
};

/**
 * Format ping value to ms with unit
 */
export const formatPing = (ms: number): string => {
  return `${ms} ms`;
};

/**
 * Get device ID from browser
 * This is a simple implementation using User Agent hash
 * In production, you might use localStorage or a more sophisticated approach
 */
export const getDeviceId = (): string => {
  const stored = localStorage.getItem('deviceId');
  if (stored) return stored;

  const ua = navigator.userAgent;
  const deviceId = btoa(ua).substring(0, 16);
  localStorage.setItem('deviceId', deviceId);
  return deviceId;
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Truncate long strings
 */
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};
