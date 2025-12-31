import { Router } from 'express';
import { diagnosticsController } from '../controllers/diagnostics.controller';

const router = Router();

// GET /api/diagnostics/run - Run full network diagnostics
router.get('/run', (req, res) => diagnosticsController.runDiagnostics(req, res));

export default router;
