import axios from 'axios';
import config from '../config/environment';

/**
 * Router Security Scanner
 * Tests common default credentials to check router security
 * 
 * [WARN] SECURITY NOTICE:
 * This tool is for EDUCATIONAL and SECURITY TESTING purposes only.
 * Only use on YOUR OWN network/router to test security.
 * Unauthorized access to networks is illegal.
 */

interface DefaultCredential {
  username: string;
  password: string;
  brand?: string;
}

// Common default router credentials (publicly known)
const DEFAULT_CREDENTIALS: DefaultCredential[] = [
  // Generic/Common
  { username: 'admin', password: 'admin' },
  { username: 'admin', password: 'password' },
  { username: 'admin', password: '1234' },
  { username: 'admin', password: '12345' },
  { username: 'admin', password: '' },
  { username: 'root', password: 'admin' },
  { username: 'root', password: 'root' },
  { username: 'root', password: '' },
  { username: 'user', password: 'user' },
  
  // TP-Link specific
  { username: 'admin', password: 'admin', brand: 'tplink' },
  { username: 'admin', password: '1234', brand: 'tplink' },
  
  // D-Link specific
  { username: 'admin', password: '', brand: 'dlink' },
  { username: 'admin', password: 'admin', brand: 'dlink' },
  
  // Asus specific
  { username: 'admin', password: 'admin', brand: 'asus' },
  { username: 'admin', password: 'password', brand: 'asus' },
  
  // Huawei specific
  { username: 'admin', password: 'admin', brand: 'huawei' },
  { username: 'root', password: 'admin', brand: 'huawei' },
  { username: 'telecomadmin', password: 'admintelecom', brand: 'huawei' },
  
  // Netgear
  { username: 'admin', password: 'password', brand: 'netgear' },
  { username: 'admin', password: '1234', brand: 'netgear' },
  
  // Linksys
  { username: 'admin', password: 'admin', brand: 'linksys' },
  { username: '', password: 'admin', brand: 'linksys' },
  
  // ZTE
  { username: 'admin', password: 'admin', brand: 'zte' },
  { username: 'user', password: 'user', brand: 'zte' },
];

export class RouterScannerService {
  /**
   * Scan router for default credentials
   * Tests common username/password combinations
   */
  async scanDefaultCredentials(
    routerIp: string,
    detectedBrand?: string
  ): Promise<{
    found: boolean;
    credentials?: { username: string; password: string };
    attemptCount: number;
    vulnerabilityLevel: 'CRITICAL' | 'NONE';
    message: string;
  }> {
    console.log(`[SCAN] [SECURITY SCAN] Testing router at ${routerIp}`);
    console.log(`   Detected brand: ${detectedBrand || 'unknown'}`);
    
    let attemptCount = 0;
    
    // Filter credentials based on detected brand (try brand-specific first)
    const credentialsToTest = detectedBrand
      ? [
          ...DEFAULT_CREDENTIALS.filter(c => c.brand === detectedBrand),
          ...DEFAULT_CREDENTIALS.filter(c => !c.brand)
        ]
      : DEFAULT_CREDENTIALS;

    // Test each credential combination
    for (const cred of credentialsToTest) {
      attemptCount++;
      
      try {
        const isValid = await this.testCredential(routerIp, cred.username, cred.password);
        
        if (isValid) {
          console.log(`[WARN]  [VULNERABILITY FOUND!] Router menggunakan default credentials!`);
          console.log(`   Username: ${cred.username}`);
          console.log(`   Password: ${cred.password || '(empty)'}`);
          
          return {
            found: true,
            credentials: cred,
            attemptCount,
            vulnerabilityLevel: 'CRITICAL',
            message: `[WARN] CRITICAL VULNERABILITY: Router masih menggunakan default credentials! Username: "${cred.username}", Password: "${cred.password || '(kosong)'}". Segera ganti password!`
          };
        }
        
        // Small delay to avoid overwhelming the router
        await this.delay(200);
        
      } catch (error) {
        // Continue testing even if one fails
        continue;
      }
    }

    console.log(`[SUCCESS] [SECURITY CHECK PASSED] No default credentials found after ${attemptCount} attempts`);
    return {
      found: false,
      attemptCount,
      vulnerabilityLevel: 'NONE',
      message: `[SUCCESS] Router aman! Tidak menggunakan default credentials. Tested ${attemptCount} common combinations.`
    };
  }

  /**
   * Test a specific credential combination
   */
  private async testCredential(
    ip: string,
    username: string,
    password: string
  ): Promise<boolean> {
    try {
      // Try HTTP Basic Auth
      const authString = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await axios.get(`http://${ip}`, {
        headers: { 
          'Authorization': `Basic ${authString}`,
          'User-Agent': 'Mozilla/5.0 (Security Scanner)'
        },
        timeout: config.security.requestTimeout,
        validateStatus: (status) => status < 500, // Accept any status < 500
        maxRedirects: 0 // Don't follow redirects
      });

      // Check if authentication was successful
      // Status 200 or 302 (redirect) usually means success
      // Status 401 means unauthorized (wrong credentials)
      if (response.status === 200 || response.status === 302 || response.status === 301) {
        // Verify it's not a login page by checking response
        const html = response.data.toLowerCase();
        
        // If response contains typical admin panel elements, it's probably authenticated
        const adminIndicators = [
          'logout',
          'system settings',
          'wireless',
          'status',
          'administration',
          'dashboard'
        ];
        
        const hasAdminIndicator = adminIndicators.some(indicator => html.includes(indicator));
        
        // If it doesn't ask for login again, authentication likely succeeded
        const isLoginPage = html.includes('login') && (html.includes('password') || html.includes('username'));
        
        return hasAdminIndicator || !isLoginPage;
      }

      return false;
    } catch (error: any) {
      // If we get 401, credentials are wrong (expected)
      if (error.response?.status === 401) {
        return false;
      }
      
      // Connection errors mean we can't test this combo
      return false;
    }
  }

  /**
   * Detect router brand from HTTP response
   */
  async detectRouterBrand(ip: string): Promise<string | null> {
    try {
      const response = await axios.get(`http://${ip}`, {
        timeout: config.security.requestTimeout,
        validateStatus: () => true // Accept any status
      });

      const html = response.data.toLowerCase();
      const headers = JSON.stringify(response.headers).toLowerCase();
      
      // Check for brand indicators
      if (html.includes('tp-link') || html.includes('tplink') || headers.includes('tplink')) {
        return 'tplink';
      }
      if (html.includes('d-link') || html.includes('dlink') || headers.includes('dlink')) {
        return 'dlink';
      }
      if (html.includes('asus') || headers.includes('asus')) {
        return 'asus';
      }
      if (html.includes('huawei') || headers.includes('huawei')) {
        return 'huawei';
      }
      if (html.includes('netgear') || headers.includes('netgear')) {
        return 'netgear';
      }
      if (html.includes('linksys') || headers.includes('linksys')) {
        return 'linksys';
      }
      if (html.includes('zte') || headers.includes('zte')) {
        return 'zte';
      }
      if (html.includes('mikrotik') || headers.includes('mikrotik')) {
        return 'mikrotik';
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get default gateway (router IP) from system
   */
  async getDefaultGateway(): Promise<string | null> {
    try {
      const { execSync } = require('child_process');
      
      // macOS/Linux command
      try {
        const output = execSync('route -n get default 2>/dev/null | grep gateway | awk \'{print $2}\'', {
          encoding: 'utf8',
          timeout: config.security.requestTimeout
        }).trim();
        
        if (output && this.isValidIP(output)) {
          return output;
        }
      } catch (macError) {
        // Try alternative method
        try {
          const output = execSync('netstat -rn | grep default | awk \'{print $2}\' | head -1', {
            encoding: 'utf8',
            timeout: config.security.requestTimeout
          }).trim();
          
          if (output && this.isValidIP(output)) {
            return output;
          }
        } catch (altError) {
          // Continue to next method
        }
      }

      // Common default IPs as fallback
      const commonIPs = ['192.168.1.1', '192.168.0.1', '192.168.100.1', '10.0.0.1'];
      
      for (const ip of commonIPs) {
        try {
          await axios.get(`http://${ip}`, { timeout: config.security.requestTimeout / 3, validateStatus: () => true });
          return ip; // If reachable, assume it's the gateway
        } catch (error) {
          continue;
        }
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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const routerScanner = new RouterScannerService();
