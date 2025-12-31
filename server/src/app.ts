import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/environment';
import networkRoutes from './routes/network.routes';
import speedTestRoutes from './routes/speedtest.routes';
import bandwidthRoutes from './routes/bandwidth.routes';
import diagnosticsRoutes from './routes/diagnostics.routes';
import deviceScannerRoutes from './routes/device-scanner.routes';

const app: Application = express();
const PORT = config.server.port;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware dengan detail
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleString('id-ID');
  console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    console.log('   Body:', JSON.stringify(req.body));
  }
  next();
});

// Routes
app.use('/api/network', networkRoutes);
app.use('/api/speedtest', speedTestRoutes);
app.use('/api/bandwidth', bandwidthRoutes);
app.use('/api/diagnostics', diagnosticsRoutes);
app.use('/api/network', deviceScannerRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log(`BALKAR NETWORK MANAGER - ${config.server.nodeEnv.toUpperCase()}`);
  console.log('='.repeat(70));
  console.log(`Server URL       : http://localhost:${PORT}`);
  console.log(`Health Check     : http://localhost:${PORT}/api/health`);
  console.log(`Network Info     : http://localhost:${PORT}/api/network/info`);
  console.log(`Speed Test       : http://localhost:${PORT}/api/speedtest`);
  console.log(`Bandwidth API    : http://localhost:${PORT}/api/bandwidth`);
  console.log('='.repeat(70));
  console.log(`Version: ${config.app.version}`);
  console.log('Request logs:\n');
});

export default app;
