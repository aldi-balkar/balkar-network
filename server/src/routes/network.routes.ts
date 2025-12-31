import { Router } from 'express';
import { networkController } from '../controllers/network.controller';

const router = Router();

// GET /api/network/info - Get network information
router.get('/info', (req, res) => networkController.getNetworkInfo(req, res));

export default router;
