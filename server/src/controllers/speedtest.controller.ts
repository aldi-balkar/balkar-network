import { Request, Response } from 'express';
import { speedTestService } from '../services/speedtest.service';

export class SpeedTestController {
  /**
   * GET /api/speedtest
   * Runs a complete speed test (ping, download, upload)
   */
  async runSpeedTest(req: Request, res: Response): Promise<void> {
    try {
      const result = await speedTestService.runSpeedTest();
      res.json(result);
    } catch (error) {
      console.error('Error running speed test:', error);
      res.status(500).json({ 
        error: 'Failed to run speed test',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/speedtest/ping
   * Measures ping only
   */
  async measurePing(req: Request, res: Response): Promise<void> {
    try {
      const ping = await speedTestService.measurePing();
      res.json({ ping, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error measuring ping:', error);
      res.status(500).json({ 
        error: 'Failed to measure ping',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/speedtest/download
   * Returns test data for download speed testing
   */
  downloadTest(req: Request, res: Response): void {
    try {
      console.log('[DOWNLOAD] Download test request received');
      
      // Generate random data (1MB)
      const dataSize = 1024 * 1024; // 1MB
      const testData = Buffer.alloc(dataSize, 'x');
      
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Length': testData.length,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.send(testData);
    } catch (error) {
      console.error('Error in download test:', error);
      res.status(500).json({ 
        error: 'Failed to perform download test',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/speedtest/upload
   * Receives test data for upload speed testing
   */
  uploadTest(req: Request, res: Response): void {
    try {
      console.log('[UPLOAD] Upload test request received');
      
      let receivedBytes = 0;
      
      req.on('data', (chunk) => {
        receivedBytes += chunk.length;
      });
      
      req.on('end', () => {
        console.log(`[SUCCESS] Received ${receivedBytes} bytes`);
        res.json({ 
          success: true, 
          bytesReceived: receivedBytes,
          timestamp: new Date().toISOString()
        });
      });
      
      req.on('error', (error) => {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Upload failed' });
      });
    } catch (error) {
      console.error('Error in upload test:', error);
      res.status(500).json({ 
        error: 'Failed to perform upload test',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const speedTestController = new SpeedTestController();
