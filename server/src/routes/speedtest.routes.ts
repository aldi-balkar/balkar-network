import { Router } from 'express';
import { speedTestController } from '../controllers/speedtest.controller';

const router = Router();

// GET /api/speedtest - Run complete speed test
router.get('/', (req, res) => speedTestController.runSpeedTest(req, res));

// GET /api/speedtest/ping - Measure ping only
router.get('/ping', (req, res) => speedTestController.measurePing(req, res));

// GET /api/speedtest/download - Download test endpoint
router.get('/download', (req, res) => speedTestController.downloadTest(req, res));

// POST /api/speedtest/upload - Upload test endpoint
router.post('/upload', (req, res) => speedTestController.uploadTest(req, res));

export default router;
