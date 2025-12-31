import { Request, Response } from 'express';
import { deviceScannerService } from '../services/device-scanner.service';

export class DeviceScannerController {
  async scanDevices(req: Request, res: Response) {
    try {
      console.log('[DEVICE SCANNER] Scan request received');
      
      const startTime = Date.now();
      const devices = await deviceScannerService.scanNetwork();
      const scanTime = Date.now() - startTime;

      console.log(`[DEVICE SCANNER] Returning ${devices.length} devices (${scanTime}ms)`);

      res.json({
        success: true,
        devices,
        scanTime,
        totalDevices: devices.length
      });
    } catch (error: any) {
      console.error('[DEVICE SCANNER] Error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to scan network devices',
        devices: []
      });
    }
  }
}

export const deviceScannerController = new DeviceScannerController();
