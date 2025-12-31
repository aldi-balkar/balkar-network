import { Request, Response } from 'express';
import { bandwidthStore, RouterConnectionService } from '../services/bandwidth.service';
import { SetBandwidthRequest, SetDeviceBandwidthRequest } from '../types';
import { routerScanner } from '../services/router-scanner.service';

export class BandwidthController {
  private routerService = new RouterConnectionService();

  /**
   * POST /api/bandwidth/scan-router-security
   * Scan router for default credentials (security testing)
   */
  async scanRouterSecurity(req: Request, res: Response): Promise<void> {
    try {
      let { routerIp } = req.body;

      console.log('[SECURITY] [SECURITY SCANNER] Starting router security scan...');

      // If no IP provided, try to detect default gateway
      if (!routerIp) {
        console.log('   Auto-detecting router IP...');
        routerIp = await routerScanner.getDefaultGateway();
        
        if (!routerIp) {
          res.status(400).json({
            success: false,
            error: 'Could not detect router IP. Please provide router IP manually.'
          });
          return;
        }
        console.log(`   ✓ Detected router IP: ${routerIp}`);
      }

      // Detect router brand
      const detectedBrand = await routerScanner.detectRouterBrand(routerIp);
      console.log(`   Router brand: ${detectedBrand || 'unknown'}`);

      // Scan for default credentials
      const scanResult = await routerScanner.scanDefaultCredentials(routerIp, detectedBrand || undefined);

      res.json({
        success: true,
        routerIp,
        detectedBrand,
        ...scanResult,
        warning: '[WARN] This scan is for security testing purposes only. Only use on your own network.'
      });

    } catch (error) {
      console.error('[ERROR] Security scan error:', error);
      res.status(500).json({
        success: false,
        error: 'Security scan failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/bandwidth/connect-router
   * Connect to router with admin credentials
   */
  async connectRouter(req: Request, res: Response): Promise<void> {
    try {
      const { routerIp, username, password, routerType } = req.body;

      if (!routerIp || !username || !password) {
        res.status(400).json({ 
          success: false,
          error: 'Router IP, username, and password are required' 
        });
        return;
      }

      console.log(`[CONNECT] Attempting to connect to router: ${routerIp} (Type: ${routerType || 'auto'})`);

      const result = await this.routerService.connectToRouter({
        routerIp,
        username,
        password,
        routerType: routerType || 'auto'
      });

      if (result.success) {
        console.log(`[SUCCESS] Successfully connected to ${result.routerType} router at ${routerIp}`);
        res.json(result);
      } else {
        console.log(`[ERROR] Failed to connect to router: ${result.error}`);
        res.status(401).json(result);
      }
    } catch (error) {
      console.error('[ERROR] Router connection error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to connect to router',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/bandwidth/global
   * Get global bandwidth settings
   */
  getGlobalSettings(req: Request, res: Response): void {
    try {
      const settings = bandwidthStore.getGlobalSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error getting global settings:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve global bandwidth settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/bandwidth/global
   * Set global bandwidth limit for all devices
   * 
   * Body: { enabled: boolean, maxSpeed: number }
   */
  setGlobalSettings(req: Request, res: Response): void {
    try {
      const { enabled, maxSpeed } = req.body as SetBandwidthRequest;

      // Validation
      if (typeof enabled !== 'boolean') {
        res.status(400).json({ error: 'enabled must be a boolean' });
        return;
      }

      if (typeof maxSpeed !== 'number' || maxSpeed <= 0) {
        res.status(400).json({ error: 'maxSpeed must be a positive number' });
        return;
      }

      const settings = bandwidthStore.setGlobalSettings(enabled, maxSpeed);
      
      console.log(`[GLOBAL] Global bandwidth ${enabled ? 'enabled' : 'disabled'}: ${maxSpeed} Mbps`);
      
      res.json({
        success: true,
        settings,
        message: `Global bandwidth limit ${enabled ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error('Error setting global bandwidth:', error);
      res.status(500).json({ 
        error: 'Failed to set global bandwidth settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/bandwidth/device/:deviceId
   * Get device-specific bandwidth settings
   */
  getDeviceSettings(req: Request, res: Response): void {
    try {
      const { deviceId } = req.params;
      const settings = bandwidthStore.getDeviceSettings(deviceId);

      if (!settings) {
        res.status(404).json({ 
          error: 'Device settings not found',
          deviceId 
        });
        return;
      }

      res.json(settings);
    } catch (error) {
      console.error('Error getting device settings:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve device bandwidth settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/bandwidth/device
   * Set device-specific bandwidth limit
   * 
   * Body: { deviceId: string, enabled: boolean, maxSpeed: number }
   */
  setDeviceSettings(req: Request, res: Response): void {
    try {
      const { deviceId, enabled, maxSpeed } = req.body as SetDeviceBandwidthRequest;

      // Validation
      if (!deviceId || typeof deviceId !== 'string') {
        res.status(400).json({ error: 'deviceId is required and must be a string' });
        return;
      }

      if (typeof enabled !== 'boolean') {
        res.status(400).json({ error: 'enabled must be a boolean' });
        return;
      }

      if (typeof maxSpeed !== 'number' || maxSpeed <= 0) {
        res.status(400).json({ error: 'maxSpeed must be a positive number' });
        return;
      }

      const settings = bandwidthStore.setDeviceSettings(deviceId, enabled, maxSpeed);
      
      console.log(`[DEVICE] Device ${deviceId} bandwidth ${enabled ? 'enabled' : 'disabled'}: ${maxSpeed} Mbps`);
      
      res.json({
        success: true,
        settings,
        message: `Device bandwidth limit ${enabled ? 'enabled' : 'disabled'}`
      });
    } catch (error) {
      console.error('Error setting device bandwidth:', error);
      res.status(500).json({ 
        error: 'Failed to set device bandwidth settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * DELETE /api/bandwidth/device/:deviceId
   * Remove device-specific bandwidth settings
   */
  clearDeviceSettings(req: Request, res: Response): void {
    try {
      const { deviceId } = req.params;
      const deleted = bandwidthStore.clearDeviceSettings(deviceId);

      if (!deleted) {
        res.status(404).json({ 
          error: 'Device settings not found',
          deviceId 
        });
        return;
      }

      console.log(`[DELETE]  Cleared bandwidth settings for device ${deviceId}`);
      
      res.json({
        success: true,
        message: 'Device bandwidth settings cleared',
        deviceId
      });
    } catch (error) {
      console.error('Error clearing device settings:', error);
      res.status(500).json({ 
        error: 'Failed to clear device bandwidth settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/bandwidth/devices
   * Get all device-specific settings
   */
  getAllDeviceSettings(req: Request, res: Response): void {
    try {
      const devices = bandwidthStore.getAllDeviceSettings();
      res.json({ devices });
    } catch (error) {
      console.error('Error getting all device settings:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve device settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/bandwidth/status
   * Get current bandwidth status for diagnostics
   */
  getStatus(req: Request, res: Response): void {
    try {
      const globalSettings = bandwidthStore.getGlobalSettings();
      const devices = bandwidthStore.getAllDeviceSettings();
      
      res.json({
        globalLimit: globalSettings.limit.enabled ? globalSettings.limit.maxSpeed : null,
        globalEnabled: globalSettings.limit.enabled,
        deviceCount: devices.length,
        devices: devices.map(d => ({
          deviceId: d.deviceId,
          enabled: d.limit.enabled,
          maxSpeed: d.limit.maxSpeed
        }))
      });
    } catch (error) {
      console.error('Error getting bandwidth status:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve bandwidth status',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const bandwidthController = new BandwidthController();
