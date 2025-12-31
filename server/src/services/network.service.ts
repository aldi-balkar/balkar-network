import { Request } from 'express';
import { NetworkInfo } from '../types';
import { execSync } from 'child_process';
import { networkInterfaces } from 'os';
import config from '../config/environment';

/**
 * Service for retrieving network information
 * 
 * IMPORTANT NOTES:
 * - Public IP is retrieved from request headers or external service
 * - SSID (WiFi network name) can be accessed via system commands on the server
 * - This implementation is SAFE and LEGAL, working within server capabilities
 */
export class NetworkService {
  /**
   * Get WiFi SSID from system (macOS/Linux)
   * This works on the server machine, not the client browser
   */
  private getWifiSSID(): string | null {
    try {
      // Method 1: Try macOS system_profiler (most reliable)
      try {
        const output = execSync("system_profiler SPAirPortDataType 2>/dev/null | awk '/Current Network Information:/,/PHY Mode:/' | grep -E '^\\s+[A-Z_0-9-]+:' | head -1 | awk '{print $1}' | tr -d ':'", {
          encoding: 'utf8',
          timeout: config.network.wifiDetectionTimeout
        }).trim();
        
        if (output && output.length > 0) {
          console.log(`  ✓ WiFi SSID: ${output}`);
          return output;
        }
      } catch (profilerError) {
        // Continue to next method
      }

      // Method 2: Try macOS networksetup command
      for (let i = 0; i <= 5; i++) {
        try {
          const output = execSync(`networksetup -getairportnetwork en${i}`, { 
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore']
          }).trim();
          
          // Output format: "Current Wi-Fi Network: SSID_NAME"
          if (output && !output.includes('not a Wi-Fi interface') && !output.includes('not associated')) {
            const match = output.match(/Current Wi-Fi Network: (.+)/);
            if (match && match[1]) {
              const ssid = match[1].trim();
              console.log(`  ✓ WiFi SSID: ${ssid}`);
              return ssid;
            }
          }
        } catch (err) {
          continue;
        }
      }

      // Method 3: Try Linux command
      try {
        const ssid = execSync('iwgetid -r', { encoding: 'utf8' }).trim();
        if (ssid) {
          console.log(`  ✓ WiFi SSID: ${ssid}`);
          return ssid;
        }
      } catch (linuxError) {
        // Silently fail
      }
    } catch (error) {
      // All methods failed
    }
    console.log('  [WARN]  WiFi SSID: Not connected to WiFi');
    return null;
  }

  /**
   * Get local IP address from network interfaces
   */
  private getLocalIP(): string {
    try {
      const nets = networkInterfaces();
      for (const name of Object.keys(nets)) {
        const netInterface = nets[name];
        if (!netInterface) continue;
        
        for (const net of netInterface) {
          // Skip internal (loopback) and non-IPv4 addresses
          const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
          if (net.family === familyV4Value && !net.internal) {
            console.log(`  ✓ Local IP: ${net.address}`);
            return net.address;
          }
        }
      }
      return 'localhost';
    } catch (error) {
      return 'localhost';
    }
  }
  /**
   * Get public IP address from external API
   * Falls back to request IP if external API fails
   */
  async getPublicIp(req: Request): Promise<string> {
    console.log('  [SCAN] Getting public IP...');
    
    // Try external API first to get real public IP
    try {
      const https = require('https');
      const publicIp = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Public IP request timeout'));
        }, config.network.publicIpTimeout);
        
        https.get(config.network.publicIpService, { timeout: config.network.publicIpTimeout }, (res: any) => {
          clearTimeout(timeout);
          let data = '';
          res.on('data', (chunk: any) => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve(json.ip || data.trim());
            } catch {
              resolve(data.trim());
            }
          });
        }).on('error', (err: Error) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
      
      if (publicIp) {
        console.log(`  ✓ Public IP: ${publicIp}`);
        return publicIp;
      }
    } catch (error) {
      console.log('  [WARN]  External API failed, using fallback...');
    }
    
    // Fallback: Check if IP is forwarded (proxy, load balancer)
    const forwardedIp = req.headers['x-forwarded-for'];
    if (forwardedIp) {
      const ip = Array.isArray(forwardedIp) ? forwardedIp[0] : forwardedIp.split(',')[0];
      console.log(`  ✓ Public IP (forwarded): ${ip.trim()}`);
      return ip.trim();
    }

    // Get IP from socket
    const socketIp = req.socket.remoteAddress;
    if (socketIp) {
      // Clean up IPv6 localhost format
      if (socketIp === '::1' || socketIp === '::ffff:127.0.0.1') {
        console.log('  ✓ Public IP: 127.0.0.1 (localhost - no external access)');
        return '127.0.0.1 (localhost)';
      }
      console.log(`  ✓ Public IP: ${socketIp}`);
      return socketIp;
    }

    console.log('  [WARN]  Public IP: localhost (fallback)');
    return 'localhost';
  }

  /**
   * Get network information
   * 
   * Now includes actual WiFi SSID from server's system
   */
  async getNetworkInfo(req: Request): Promise<NetworkInfo> {
    console.log('[SCAN] [NETWORK SERVICE] Getting network info...');
    const startTime = Date.now();
    
    const publicIp = await this.getPublicIp(req);
    const localIp = this.getLocalIP();
    const ssid = this.getWifiSSID();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    console.log(`  ✓ User Agent: ${userAgent.substring(0, 50)}...`);

    const result = {
      publicIp,
      localIp,
      userAgent,
      timestamp: new Date().toISOString(),
      ssid,
      explanation: ssid 
        ? `Connected to WiFi: ${ssid}` 
        : 'Not connected to WiFi or WiFi info not available from server',
    };
    
    const elapsed = Date.now() - startTime;
    console.log(`[SUCCESS] [NETWORK SERVICE] Complete in ${elapsed}ms\n`);
    
    return result;
  }
}

export const networkService = new NetworkService();
