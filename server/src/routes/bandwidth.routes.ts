import { Router } from 'express';
import { bandwidthController } from '../controllers/bandwidth.controller';
import { bandwidthThrottleMiddleware, deviceIdMiddleware } from '../middlewares/bandwidth.middleware';

const router = Router();

// POST /api/bandwidth/scan-router-security - Security scan for default credentials
router.post('/scan-router-security', (req, res) => bandwidthController.scanRouterSecurity(req, res));

// POST /api/bandwidth/connect-router - Connect to router (no middleware needed)
router.post('/connect-router', (req, res) => bandwidthController.connectRouter(req, res));

// Apply device ID middleware to all routes
router.use(deviceIdMiddleware);

// GET /api/bandwidth/status - Get current bandwidth status
router.get('/status', (req, res) => bandwidthController.getStatus(req, res));

// Apply bandwidth throttling middleware to routes that need throttling
router.use(bandwidthThrottleMiddleware);

// GET /api/bandwidth/global - Get global bandwidth settings
router.get('/global', (req, res) => bandwidthController.getGlobalSettings(req, res));

// POST /api/bandwidth/global - Set global bandwidth settings
router.post('/global', (req, res) => bandwidthController.setGlobalSettings(req, res));

// GET /api/bandwidth/device/:deviceId - Get device-specific settings
router.get('/device/:deviceId', (req, res) => bandwidthController.getDeviceSettings(req, res));

// POST /api/bandwidth/device - Set device-specific settings
router.post('/device', (req, res) => bandwidthController.setDeviceSettings(req, res));

// DELETE /api/bandwidth/device/:deviceId - Clear device-specific settings
router.delete('/device/:deviceId', (req, res) => bandwidthController.clearDeviceSettings(req, res));

// GET /api/bandwidth/devices - Get all device settings
router.get('/devices', (req, res) => bandwidthController.getAllDeviceSettings(req, res));

export default router;
