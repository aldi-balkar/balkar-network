import { Request, Response } from 'express';
import { diagnosticsService } from '../services/diagnostics.service';

export class DiagnosticsController {
  /**
   * GET /api/diagnostics/run
   * Run comprehensive network diagnostics
   */
  async runDiagnostics(req: Request, res: Response): Promise<void> {
    try {
      console.log('[DIAGNOSTIC] [DIAGNOSTICS] Running network diagnostics...');
      
      const results = await diagnosticsService.runFullDiagnostics();
      
      console.log('[SUCCESS] [DIAGNOSTICS] Diagnostics complete');
      
      res.json({
        success: true,
        timestamp: new Date().toISOString(),
        results
      });

    } catch (error) {
      console.error('[ERROR] [DIAGNOSTICS] Error running diagnostics:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to run diagnostics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export const diagnosticsController = new DiagnosticsController();
