import { Request, Response } from 'express';
import { networkService } from '../services/network.service';

export class NetworkController {
  /**
   * GET /api/network/info
   * Returns network information including public IP and user agent
   */
  async getNetworkInfo(req: Request, res: Response): Promise<void> {
    try {
      const networkInfo = await networkService.getNetworkInfo(req);
      res.json(networkInfo);
    } catch (error) {
      console.error('Error getting network info:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve network information',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const networkController = new NetworkController();
