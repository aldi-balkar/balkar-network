import { execSync } from 'child_process';
import axios from 'axios';
import config from '../config/environment';

export interface DiagnosticTest {
  category: string;
  status: 'good' | 'warning' | 'error' | 'running';
  message: string;
  details?: string;
  recommendation?: string;
  duration?: number;
}

export class DiagnosticsService {
  /**
   * Run comprehensive network diagnostics
   */
  async runFullDiagnostics(): Promise<DiagnosticTest[]> {
    const results: DiagnosticTest[] = [];

    console.log('[DIAGNOSTIC] [DIAGNOSTICS] Starting comprehensive network diagnostics...');

    // Test 1: Internet Connectivity
    results.push(await this.testInternetConnectivity());

    // Test 2: DNS Resolution
    results.push(await this.testDNSResolution());

    // Test 3: Gateway Reachability
    results.push(await this.testGatewayReachability());

    // Test 4: External Ping (Google)
    results.push(await this.testExternalPing());

    // Test 5: Bandwidth Test
    results.push(await this.testBandwidth());

    // Test 6: WiFi Signal Quality
    results.push(await this.testWiFiSignal());

    console.log('[SUCCESS] [DIAGNOSTICS] All tests completed');
    return results;
  }

  /**
   * Test 1: Internet Connectivity
   */
  private async testInternetConnectivity(): Promise<DiagnosticTest> {
    const startTime = Date.now();
    
    try {
      console.log('  [NETWORK] Testing internet connectivity...');
      
      await axios.get('https://www.google.com', {
        timeout: config.diagnostic.testTimeout,
        validateStatus: () => true
      });

      const duration = Date.now() - startTime;
      console.log(`  ✓ Internet: Connected (${duration}ms)`);

      return {
        category: 'Internet Connection',
        status: 'good',
        message: 'Internet connection is active and stable',
        details: `Response time: ${duration}ms`,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log('  ✗ Internet: Failed');

      return {
        category: 'Internet Connection',
        status: 'error',
        message: 'Cannot reach internet',
        details: error instanceof Error ? error.message : 'Unknown error',
        recommendation: 'Check WiFi connection or restart router',
        duration
      };
    }
  }

  /**
   * Test 2: DNS Resolution
   */
  private async testDNSResolution(): Promise<DiagnosticTest> {
    const startTime = Date.now();
    
    try {
      console.log('  [SCAN] Testing DNS resolution...');
      
      const dns = require('dns').promises;
      const addresses = await dns.resolve4('google.com');
      
      const duration = Date.now() - startTime;
      console.log(`  ✓ DNS: Working (${duration}ms) - Resolved to ${addresses[0]}`);

      return {
        category: 'DNS Resolution',
        status: 'good',
        message: 'DNS is working correctly',
        details: `Resolved google.com to ${addresses[0]} in ${duration}ms`,
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log('  ✗ DNS: Failed');

      return {
        category: 'DNS Resolution',
        status: 'error',
        message: 'DNS resolution failed',
        details: 'Cannot resolve domain names',
        recommendation: 'Try changing DNS to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)',
        duration
      };
    }
  }

  /**
   * Test 3: Gateway Reachability (Router)
   */
  private async testGatewayReachability(): Promise<DiagnosticTest> {
    const startTime = Date.now();
    
    try {
      console.log('  [GATEWAY] Testing gateway reachability...');
      
      // Get default gateway
      const gateway = await this.getDefaultGateway();
      
      if (!gateway) {
        return {
          category: 'Gateway Connection',
          status: 'warning',
          message: 'Could not detect default gateway',
          recommendation: 'Check network configuration',
          duration: Date.now() - startTime
        };
      }

      // Ping gateway
      const output = execSync(`ping -c 3 -W 2 ${gateway} 2>&1`, {
        encoding: 'utf8',
        timeout: config.diagnostic.testTimeout
      });

      // Parse ping results
      const avgMatch = output.match(/avg[^=]*=\s*([0-9.]+)/);
      const lossMatch = output.match(/([0-9.]+)%.*loss/);
      
      const avgPing = avgMatch ? parseFloat(avgMatch[1]) : 0;
      const packetLoss = lossMatch ? parseFloat(lossMatch[1]) : 0;

      const duration = Date.now() - startTime;
      console.log(`  ✓ Gateway: Reachable (${avgPing.toFixed(1)}ms avg, ${packetLoss}% loss)`);

      if (packetLoss > 10) {
        return {
          category: 'Gateway Connection',
          status: 'warning',
          message: `High packet loss to gateway: ${packetLoss}%`,
          details: `Gateway: ${gateway}, Avg ping: ${avgPing.toFixed(1)}ms`,
          recommendation: 'WiFi signal may be weak or router overloaded',
          duration
        };
      }

      return {
        category: 'Gateway Connection',
        status: 'good',
        message: 'Router is reachable',
        details: `Gateway: ${gateway}, Ping: ${avgPing.toFixed(1)}ms, Loss: ${packetLoss}%`,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.log('  ✗ Gateway: Unreachable');

      return {
        category: 'Gateway Connection',
        status: 'error',
        message: 'Cannot reach router/gateway',
        recommendation: 'Check WiFi connection or restart router',
        duration
      };
    }
  }

  /**
   * Test 4: External Ping (Google DNS)
   */
  private async testExternalPing(): Promise<DiagnosticTest> {
    const startTime = Date.now();
    
    try {
      console.log(`  [PING] Testing external ping (${config.diagnostic.pingServer})...`);
      
      const output = execSync(`ping -c 5 -W 2 ${config.diagnostic.pingServer} 2>&1`, {
        encoding: 'utf8',
        timeout: config.diagnostic.testTimeout
      });

      const avgMatch = output.match(/avg[^=]*=\s*([0-9.]+)/);
      const lossMatch = output.match(/([0-9.]+)%.*loss/);
      
      const avgPing = avgMatch ? parseFloat(avgMatch[1]) : 0;
      const packetLoss = lossMatch ? parseFloat(lossMatch[1]) : 0;

      const duration = Date.now() - startTime;
      console.log(`  ✓ External Ping: ${avgPing.toFixed(1)}ms avg, ${packetLoss}% loss`);

      if (avgPing > 150) {
        return {
          category: 'Latency Test',
          status: 'warning',
          message: `High latency: ${avgPing.toFixed(1)}ms`,
          details: `Packet loss: ${packetLoss}%`,
          recommendation: 'High latency may cause lag in gaming/video calls',
          duration
        };
      }

      if (packetLoss > 5) {
        return {
          category: 'Latency Test',
          status: 'warning',
          message: `Packet loss detected: ${packetLoss}%`,
          details: `Average ping: ${avgPing.toFixed(1)}ms`,
          recommendation: 'Unstable connection. Check WiFi signal or ISP',
          duration
        };
      }

      return {
        category: 'Latency Test',
        status: 'good',
        message: `Low latency: ${avgPing.toFixed(1)}ms`,
        details: `Packet loss: ${packetLoss}%, Connection is stable`,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.log('  ✗ External Ping: Failed');

      return {
        category: 'Latency Test',
        status: 'error',
        message: 'Cannot ping external servers',
        recommendation: 'Check internet connection',
        duration
      };
    }
  }

  /**
   * Test 5: Bandwidth Test (Quick)
   */
  private async testBandwidth(): Promise<DiagnosticTest> {
    const startTime = Date.now();
    
    try {
      console.log('  [SPEED] Testing bandwidth...');
      
      // Download larger file for more accurate speed test (~5MB)
      const downloadStart = Date.now();
      const response = await axios.get(config.diagnostic.bandwidthTestUrl, {
        timeout: config.diagnostic.bandwidthTimeout,
        responseType: 'arraybuffer',
        maxContentLength: 10000000
      });
      const downloadTime = Date.now() - downloadStart;
      
      const sizeBytes = response.data.byteLength;
      const sizeMB = sizeBytes / (1024 * 1024);
      const speedMbps = ((sizeMB * 8) / (downloadTime / 1000)).toFixed(2);

      const duration = Date.now() - startTime;
      console.log(`  ✓ Bandwidth: ~${speedMbps} Mbps (${sizeMB.toFixed(2)} MB in ${downloadTime}ms)`);

      if (parseFloat(speedMbps) < 1) {
        return {
          category: 'Download Speed',
          status: 'warning',
          message: `Very slow: ${speedMbps} Mbps`,
          details: `Downloaded ${sizeMB.toFixed(2)} MB in ${(downloadTime / 1000).toFixed(1)}s`,
          recommendation: '[WARN] Speed too slow! Check bandwidth limit or run full speed test',
          duration
        };
      }

      if (parseFloat(speedMbps) < 5) {
        return {
          category: 'Download Speed',
          status: 'warning',
          message: `Below average: ${speedMbps} Mbps`,
          details: `Downloaded ${sizeMB.toFixed(2)} MB in ${(downloadTime / 1000).toFixed(1)}s`,
          recommendation: 'Speed is lower than expected. Run full speed test',
          duration
        };
      }

      return {
        category: 'Download Speed',
        status: 'good',
        message: `Good speed: ${speedMbps} Mbps`,
        details: `Downloaded ${sizeMB.toFixed(2)} MB in ${(downloadTime / 1000).toFixed(1)}s`,
        duration
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      console.log('  ✗ Bandwidth: Test failed');

      return {
        category: 'Download Speed',
        status: 'warning',
        message: 'Could not measure bandwidth',
        details: 'Run speed test manually for detailed results',
        duration
      };
    }
  }

  /**
   * Test 6: WiFi Signal Quality (macOS)
   */
  private async testWiFiSignal(): Promise<DiagnosticTest> {
    const startTime = Date.now();
    
    try {
      console.log('  [SIGNAL] Testing WiFi signal quality...');
      
      // macOS: Get WiFi signal info using system_profiler (more reliable)
      const output = execSync('system_profiler SPAirPortDataType 2>/dev/null | grep -A 20 "Current Network Information"', {
        encoding: 'utf8',
        timeout: config.diagnostic.testTimeout
      });

      // Parse signal/noise/RSSI from output
      const signalMatch = output.match(/Signal.*?:\s*(-?\d+)/);
      const noiseMatch = output.match(/Noise.*?:\s*(-?\d+)/);
      
      if (!signalMatch) {
        // Try alternative method with airport
        try {
          const airportOutput = execSync('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I 2>&1', {
            encoding: 'utf8',
            timeout: config.diagnostic.testTimeout / 2
          });
          
          const rssiMatch = airportOutput.match(/agrCtlRSSI:\s*(-?\d+)/);
          const noiseMatch2 = airportOutput.match(/agrCtlNoise:\s*(-?\d+)/);
          
          if (rssiMatch) {
            const rssi = parseInt(rssiMatch[1]);
            const noise = noiseMatch2 ? parseInt(noiseMatch2[1]) : -90;
            const snr = rssi - noise;
            const duration = Date.now() - startTime;
            
            return this.buildWiFiSignalResult(rssi, snr, duration);
          }
        } catch (e) {
          // Airport also failed
        }
        
        const duration = Date.now() - startTime;
        return {
          category: 'WiFi Signal',
          status: 'warning',
          message: 'Could not measure WiFi signal',
          details: 'WiFi info not available (may not be connected to WiFi)',
          recommendation: 'Connect to WiFi network to measure signal quality',
          duration
        };
      }

      const rssi = parseInt(signalMatch[1]);
      const noise = noiseMatch ? parseInt(noiseMatch[1]) : -90;
      const snr = rssi - noise; // Signal-to-Noise Ratio

      const duration = Date.now() - startTime;
      console.log(`  ✓ WiFi Signal: ${rssi} dBm (SNR: ${snr} dB)`);

      return this.buildWiFiSignalResult(rssi, snr, duration);

    } catch (error) {
      const duration = Date.now() - startTime;
      console.log('  [WARN]  WiFi Signal: Measurement unavailable');

      return {
        category: 'WiFi Signal',
        status: 'warning',
        message: 'WiFi signal measurement not available',
        details: error instanceof Error ? error.message : 'Feature may not be supported',
        recommendation: 'Ensure you are connected via WiFi (not ethernet)',
        duration
      };
    }
  }

  /**
   * Helper: Build WiFi signal result based on RSSI
   */
  private buildWiFiSignalResult(rssi: number, snr: number, duration: number): DiagnosticTest {
    let status: 'good' | 'warning' | 'error' = 'good';
    let message = '';
    let recommendation = '';

    if (rssi >= -50) {
      status = 'good';
      message = `[SIGNAL] Excellent signal: ${rssi} dBm`;
    } else if (rssi >= -60) {
      status = 'good';
      message = `[SIGNAL] Very good signal: ${rssi} dBm`;
    } else if (rssi >= -70) {
      status = 'good';
      message = `[SIGNAL] Good signal: ${rssi} dBm`;
    } else if (rssi >= -80) {
      status = 'warning';
      message = `[SIGNAL] Fair signal: ${rssi} dBm`;
      recommendation = 'Consider moving closer to router for better speed';
    } else {
      status = 'error';
      message = `[SIGNAL] Weak signal: ${rssi} dBm`;
      recommendation = '[WARN] Signal too weak! Move closer to router or use WiFi extender';
    }

    return {
      category: 'WiFi Signal',
      status,
      message,
      details: `RSSI: ${rssi} dBm, SNR: ${snr} dB`,
      recommendation,
      duration
    };
  }

  /**
   * Helper: Get default gateway IP
   */
  private async getDefaultGateway(): Promise<string | null> {
    try {
      const output = execSync('route -n get default 2>/dev/null | grep gateway | awk \'{print $2}\'', {
        encoding: 'utf8',
        timeout: config.diagnostic.testTimeout / 3
      }).trim();
      
      if (output && this.isValidIP(output)) {
        return output;
      }

      // Fallback: try netstat
      const netstatOutput = execSync('netstat -rn | grep default | awk \'{print $2}\' | head -1', {
        encoding: 'utf8',
        timeout: config.diagnostic.testTimeout / 3
      }).trim();

      if (netstatOutput && this.isValidIP(netstatOutput)) {
        return netstatOutput;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  private isValidIP(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part);
      return num >= 0 && num <= 255;
    });
  }
}

export const diagnosticsService = new DiagnosticsService();
