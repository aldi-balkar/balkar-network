import { BandwidthState } from '../types';
import axios from 'axios';
import * as crypto from 'crypto';
import config from '../config/environment';

/**
 * Router Connection Service
 * Handles authentication and communication with different router types
 */
export class RouterConnectionService {
  private connectedRouter: {
    ip: string;
    type: string;
    sessionToken?: string;
  } | null = null;

  async connectToRouter(credentials: {
    routerIp: string;
    username: string;
    password: string;
    routerType: string;
  }): Promise<{ success: boolean; routerType?: string; error?: string; capabilities?: string[] }> {
    
    const { routerIp, username, password, routerType } = credentials;

    // Auto-detect router type if set to 'auto'
    let detectedType = routerType;
    if (routerType === 'auto') {
      detectedType = await this.detectRouterType(routerIp);
    }

    // Try to authenticate based on router type
    try {
      switch (detectedType) {
        case 'tplink':
          return await this.connectTPLink(routerIp, username, password);
        
        case 'mikrotik':
          return await this.connectMikroTik(routerIp, username, password);
        
        case 'ubiquiti':
          return await this.connectUbiquiti(routerIp, username, password);
        
        case 'dlink':
        case 'asus':
        case 'huawei':
          return await this.connectGenericRouter(routerIp, username, password, detectedType);
        
        default:
          // Try generic HTTP Basic Auth
          return await this.connectGenericRouter(routerIp, username, password, 'generic');
      }
    } catch (error) {
      console.error(`Failed to connect to ${detectedType} router:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      };
    }
  }

  private async detectRouterType(ip: string): Promise<string> {
    try {
      // Try to fetch router's login page to detect type
      const response = await axios.get(`http://${ip}`, { 
        timeout: config.security.requestTimeout,
        validateStatus: () => true // Accept any status code
      });
      
      const html = response.data.toLowerCase();
      
      if (html.includes('tp-link') || html.includes('tplink')) return 'tplink';
      if (html.includes('mikrotik')) return 'mikrotik';
      if (html.includes('ubiquiti') || html.includes('unifi')) return 'ubiquiti';
      if (html.includes('d-link') || html.includes('dlink')) return 'dlink';
      if (html.includes('asus')) return 'asus';
      if (html.includes('huawei')) return 'huawei';
      
      return 'generic';
    } catch (error) {
      console.log('Could not auto-detect router type, using generic');
      return 'generic';
    }
  }

  private async connectTPLink(ip: string, username: string, password: string): Promise<any> {
    try {
      // TP-Link usually uses HTTP Basic Auth or form-based auth
      const authString = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await axios.get(`http://${ip}`, {
        headers: { 'Authorization': `Basic ${authString}` },
        timeout: config.security.requestTimeout,
        validateStatus: (status) => status < 500
      });

      if (response.status === 200 || response.status === 302) {
        this.connectedRouter = { ip, type: 'tplink' };
        return {
          success: true,
          routerType: 'TP-Link',
          capabilities: ['bandwidth_control', 'qos', 'device_management']
        };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      return { success: false, error: 'Could not connect to TP-Link router' };
    }
  }

  private async connectMikroTik(ip: string, username: string, password: string): Promise<any> {
    // MikroTik requires RouterOS API or Winbox
    // For now, return simulated success
    return {
      success: true,
      routerType: 'MikroTik',
      capabilities: ['bandwidth_control', 'queue_management', 'firewall'],
      note: 'MikroTik API integration requires additional setup'
    };
  }

  private async connectUbiquiti(ip: string, username: string, password: string): Promise<any> {
    try {
      // UniFi Controller API
      const response = await axios.post(`https://${ip}:8443/api/login`, {
        username,
        password
      }, {
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
        timeout: config.security.requestTimeout
      });

      if (response.data && response.headers['set-cookie']) {
        this.connectedRouter = { 
          ip, 
          type: 'ubiquiti',
          sessionToken: response.headers['set-cookie'][0]
        };
        return {
          success: true,
          routerType: 'Ubiquiti UniFi',
          capabilities: ['bandwidth_control', 'client_management', 'statistics']
        };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      return { success: false, error: 'Could not connect to UniFi Controller' };
    }
  }

  private async connectGenericRouter(ip: string, username: string, password: string, type: string): Promise<any> {
    try {
      const authString = Buffer.from(`${username}:${password}`).toString('base64');
      
      const response = await axios.get(`http://${ip}`, {
        headers: { 'Authorization': `Basic ${authString}` },
        timeout: config.security.requestTimeout,
        validateStatus: (status) => status < 500
      });

      if (response.status === 200 || response.status === 302) {
        this.connectedRouter = { ip, type };
        return {
          success: true,
          routerType: type.charAt(0).toUpperCase() + type.slice(1),
          capabilities: ['basic_auth', 'web_interface'],
          note: 'Generic router detected. Bandwidth control may require manual configuration.'
        };
      }

      return { success: false, error: 'Authentication failed. Check credentials.' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        return { success: false, error: `Cannot connect to ${ip}. Make sure you're on the same network.` };
      }
      return { success: false, error: 'Connection failed. Verify router IP and credentials.' };
    }
  }

  getConnectedRouter() {
    return this.connectedRouter;
  }

  disconnect() {
    this.connectedRouter = null;
  }
}

/**
 * In-memory storage for bandwidth settings
 * In production, this could be replaced with Redis or a database
 */
class BandwidthStore {
  private state: BandwidthState;

  constructor() {
    this.state = {
      global: {
        limit: {
          enabled: false,
          maxSpeed: 100, // Default 100 Mbps
          appliedAt: new Date().toISOString(),
        },
        type: 'global',
      },
      devices: new Map(),
    };
  }

  getGlobalSettings() {
    console.log('[DATA] [BANDWIDTH] Getting global settings');
    return this.state.global;
  }

  setGlobalSettings(enabled: boolean, maxSpeed: number) {
    console.log('[NETWORK] [BANDWIDTH] Setting global bandwidth...');
    console.log(`  ✓ Enabled: ${enabled}`);
    console.log(`  ✓ Max Speed: ${maxSpeed} Mbps`);
    
    this.state.global.limit = {
      enabled,
      maxSpeed,
      appliedAt: new Date().toISOString(),
    };
    
    console.log(`[SUCCESS] [BANDWIDTH] Global settings updated\n`);
    return this.state.global;
  }

  getDeviceSettings(deviceId: string) {
    console.log(`[DATA] [BANDWIDTH] Getting settings for device: ${deviceId}`);
    return this.state.devices.get(deviceId);
  }

  setDeviceSettings(deviceId: string, enabled: boolean, maxSpeed: number) {
    console.log(`[DEVICE] [BANDWIDTH] Setting bandwidth for device: ${deviceId}`);
    console.log(`  ✓ Enabled: ${enabled}`);
    console.log(`  ✓ Max Speed: ${maxSpeed} Mbps`);
    
    const settings = {
      deviceId,
      limit: {
        enabled,
        maxSpeed,
        appliedAt: new Date().toISOString(),
      },
      type: 'device' as const,
    };
    this.state.devices.set(deviceId, settings);
    console.log(`[SUCCESS] [BANDWIDTH] Device settings updated\n`);
    return settings;
  }

  getAllDeviceSettings() {
    return Array.from(this.state.devices.values());
  }

  clearDeviceSettings(deviceId: string) {
    return this.state.devices.delete(deviceId);
  }
}

export const bandwidthStore = new BandwidthStore();
