import { Router } from 'express';
import { deviceScannerController } from '../controllers/device-scanner.controller';

const router = Router();

router.get('/scan-devices', deviceScannerController.scanDevices.bind(deviceScannerController));

export default router;
