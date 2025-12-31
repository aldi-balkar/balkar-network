import { Request, Response, NextFunction } from 'express';
import { bandwidthStore } from '../services/bandwidth.service';

/**
 * Bandwidth Throttling Middleware
 * 
 * This middleware simulates bandwidth limiting by introducing delays
 * based on the configured bandwidth settings.
 * 
 * HOW IT WORKS:
 * 1. Checks if bandwidth limiting is enabled (global or device-specific)
 * 2. Calculates artificial delay based on response size and bandwidth limit
 * 3. Delays response to simulate slower connection
 * 
 * IMPORTANT NOTES:
 * - This is SIMULATION for demonstration purposes
 * - Real bandwidth control requires:
 *   - Network interface manipulation (requires root/admin)
 *   - Router QoS settings via API
 *   - Traffic shaping tools (tc, iptables, etc.)
 * - This approach is SAFE and LEGAL as it only affects the current request
 * - No actual network manipulation occurs
 */
export const bandwidthThrottleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Store original send function
  const originalSend = res.send;

  // Override send function to add throttling
  res.send = function(data: any): Response {
    const deviceId = req.headers['x-device-id'] as string || 'unknown';
    
    // Check device-specific settings first
    let bandwidthLimit = bandwidthStore.getDeviceSettings(deviceId);
    
    // Fall back to global settings if no device-specific settings
    if (!bandwidthLimit || !bandwidthLimit.limit.enabled) {
      const globalSettings = bandwidthStore.getGlobalSettings();
      if (globalSettings.limit.enabled) {
        bandwidthLimit = globalSettings as any;
      }
    }

    // If bandwidth limiting is enabled, apply throttling
    if (bandwidthLimit && bandwidthLimit.limit.enabled) {
      const maxSpeed = bandwidthLimit.limit.maxSpeed; // in Mbps
      const dataSize = JSON.stringify(data).length; // in bytes
      
      // Calculate delay based on bandwidth limit
      // Formula: delay (ms) = (dataSize * 8) / (maxSpeed * 1000)
      // Convert bytes to bits, Mbps to bps, result in seconds -> convert to ms
      const delay = Math.min((dataSize * 8) / (maxSpeed * 1000000) * 1000, 2000);
      
      console.log(`[THROTTLE] Throttling response: ${dataSize} bytes at ${maxSpeed} Mbps = ${Math.round(delay)}ms delay`);
      
      setTimeout(() => {
        originalSend.call(res, data);
      }, delay);
      
      return res;
    }

    // No throttling, send immediately
    return originalSend.call(res, data);
  };

  next();
};

/**
 * Generate a device ID from request
 * Uses combination of IP and User-Agent
 * In production, you might use a more sophisticated approach
 */
export const deviceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers['x-device-id']) {
    const ip = req.socket.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';
    const deviceId = Buffer.from(`${ip}-${ua}`).toString('base64').substring(0, 16);
    req.headers['x-device-id'] = deviceId;
  }
  next();
};
