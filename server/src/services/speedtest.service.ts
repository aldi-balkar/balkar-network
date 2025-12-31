import { SpeedTestResult } from '../types';

/**
 * Speed Test Service
 * 
 * This provides simulated speed test functionality.
 */
export class SpeedTestService {
  /**
   * Simulate ping test
   */
  async measurePing(): Promise<number> {
    console.log('  [PING] Testing ping...');
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 5));
    const end = Date.now();
    
    const ping = Math.round(end - start + Math.random() * 15);
    console.log(`  ✓ Ping: ${ping}ms`);
    return ping;
  }

  /**
   * Simulate download speed test
   */
  async measureDownloadSpeed(): Promise<number> {
    console.log('  [DOWN]  Testing download speed...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const speed = Math.round(Math.random() * 50 + 20);
    console.log(`  ✓ Download: ${speed} Mbps`);
    return speed;
  }

  /**
   * Simulate upload speed test
   */
  async measureUploadSpeed(): Promise<number> {
    console.log('  [UP]  Testing upload speed...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const speed = Math.round(Math.random() * 30 + 10);
    console.log(`  ✓ Upload: ${speed} Mbps`);
    return speed;
  }

  /**
   * Run complete speed test
   */
  async runSpeedTest(): Promise<SpeedTestResult> {
    console.log('[START] [SPEED TEST] Starting speed test...');
    const startTime = Date.now();
    
    const ping = await this.measurePing();
    const downloadSpeed = await this.measureDownloadSpeed();
    const uploadSpeed = await this.measureUploadSpeed();
    
    const duration = Date.now() - startTime;
    console.log(`[SUCCESS] [SPEED TEST] Complete in ${duration}ms`);
    console.log(`   Results: ${ping}ms ping, ${downloadSpeed}Mbps down, ${uploadSpeed}Mbps up`);
    
    return {
      ping,
      downloadSpeed,
      uploadSpeed,
      timestamp: new Date().toISOString()
    };
  }
}

export const speedTestService = new SpeedTestService();
