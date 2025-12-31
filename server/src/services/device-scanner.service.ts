import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

interface Device {
  ip: string;
  mac: string;
  hostname?: string;
  vendor?: string;
  isCurrentDevice?: boolean;
}

// MAC address vendor lookup (simplified - top vendors)
const macVendors: Record<string, string> = {
  '00:1B:63': 'Apple',
  '00:03:93': 'Apple', 
  '00:0A:95': 'Apple',
  '00:1C:B3': 'Apple',
  '00:1E:C2': 'Apple',
  '00:1F:5B': 'Apple',
  '00:21:E9': 'Apple',
  '00:23:12': 'Apple',
  '00:23:32': 'Apple',
  '00:23:6C': 'Apple',
  '00:23:DF': 'Apple',
  '00:24:36': 'Apple',
  '00:25:00': 'Apple',
  '00:25:4B': 'Apple',
  '00:25:BC': 'Apple',
  '00:26:08': 'Apple',
  '00:26:4A': 'Apple',
  '00:26:B0': 'Apple',
  '00:26:BB': 'Apple',
  '00:3E:E1': 'Apple',
  '00:50:E4': 'Apple',
  '00:61:71': 'Apple',
  '04:0C:CE': 'Apple',
  '04:15:52': 'Apple',
  '04:26:65': 'Apple',
  '04:4B:ED': 'Apple',
  '04:54:53': 'Apple',
  '04:69:F8': 'Apple',
  '04:D3:CF': 'Apple',
  '04:DB:56': 'Apple',
  '04:E5:36': 'Apple',
  '04:F1:3E': 'Apple',
  '04:F7:E4': 'Apple',
  '08:00:07': 'Apple',
  '08:66:98': 'Apple',
  '08:6D:41': 'Apple',
  '08:70:45': 'Apple',
  '0C:3E:9F': 'Apple',
  '0C:4D:E9': 'Apple',
  '0C:74:C2': 'Apple',
  '10:40:F3': 'Apple',
  '10:9A:DD': 'Apple',
  '10:DD:B1': 'Apple',
  '14:10:9F': 'Apple',
  '14:5A:05': 'Apple',
  '14:8F:C6': 'Apple',
  '14:BD:61': 'Apple',
  '18:34:51': 'Apple',
  '18:3D:A2': 'Apple',
  '18:AF:8F': 'Apple',
  '1C:36:BB': 'Apple',
  '1C:9E:CC': 'Apple',
  '1C:AB:A7': 'Apple',
  '20:C9:D0': 'Apple',
  '24:A0:74': 'Apple',
  '24:A2:E1': 'Apple',
  '28:37:37': 'Apple',
  '28:6A:B8': 'Apple',
  '28:E0:2C': 'Apple',
  '2C:B4:3A': 'Apple',
  '30:90:AB': 'Apple',
  '34:15:9E': 'Apple',
  '34:36:3B': 'Apple',
  '38:C9:86': 'Apple',
  '3C:AB:8E': 'Apple',
  '40:30:04': 'Apple',
  '40:6C:8F': 'Apple',
  '44:2A:60': 'Apple',
  '48:60:BC': 'Apple',
  '4C:32:75': 'Apple',
  '50:EA:D6': 'Apple',
  '54:26:96': 'Apple',
  '58:B0:35': 'Apple',
  '5C:59:48': 'Apple',
  '5C:95:AE': 'Apple',
  '60:33:4B': 'Apple',
  '60:69:44': 'Apple',
  '60:F8:1D': 'Apple',
  '64:20:0C': 'Apple',
  '68:5B:35': 'Apple',
  '68:A8:6D': 'Apple',
  '6C:40:08': 'Apple',
  '6C:70:9F': 'Apple',
  '70:A2:B3': 'Apple',
  '70:CD:60': 'Apple',
  '74:E2:F5': 'Apple',
  '78:31:C1': 'Apple',
  '78:52:1A': 'Apple',
  '7C:04:D0': 'Apple',
  '7C:11:BE': 'Apple',
  '7C:D1:C3': 'Apple',
  '80:49:71': 'Apple',
  '80:92:9F': 'Apple',
  '80:E6:50': 'Apple',
  '84:38:35': 'Apple',
  '84:78:8B': 'Apple',
  '88:53:2E': 'Apple',
  '88:63:DF': 'Apple',
  '88:66:5A': 'Apple',
  '8C:29:37': 'Apple',
  '8C:2D:AA': 'Apple',
  '8C:7C:92': 'Apple',
  '90:27:E4': 'Apple',
  '90:72:40': 'Apple',
  '90:84:0D': 'Apple',
  '94:E9:6A': 'Apple',
  '98:01:A7': 'Apple',
  '98:B8:E3': 'Apple',
  '9C:20:7B': 'Apple',
  '9C:35:EB': 'Apple',
  'A0:99:9B': 'Apple',
  'A4:5E:60': 'Apple',
  'A4:B1:97': 'Apple',
  'A4:D1:8C': 'Apple',
  'A8:20:66': 'Apple',
  'A8:5C:2C': 'Apple',
  'A8:66:7F': 'Apple',
  'A8:88:08': 'Apple',
  'AC:61:EA': 'Apple',
  'AC:87:A3': 'Apple',
  'AC:BC:32': 'Apple',
  'AC:CF:5C': 'Apple',
  'AC:FD:EC': 'Apple',
  'B0:34:95': 'Apple',
  'B4:18:D1': 'Apple',
  'B4:8B:19': 'Apple',
  'B8:09:8A': 'Apple',
  'B8:17:C2': 'Apple',
  'B8:41:A4': 'Apple',
  'B8:C7:5D': 'Apple',
  'B8:F6:B1': 'Apple',
  'BC:3B:AF': 'Apple',
  'BC:52:B7': 'Apple',
  'BC:67:1C': 'Apple',
  'BC:9F:EF': 'Apple',
  'C0:84:7D': 'Apple',
  'C4:2C:03': 'Apple',
  'C8:2A:14': 'Apple',
  'C8:69:CD': 'Apple',
  'C8:BC:C8': 'Apple',
  'CC:08:E0': 'Apple',
  'CC:25:EF': 'Apple',
  'D0:03:4B': 'Apple',
  'D0:23:DB': 'Apple',
  'D0:33:11': 'Apple',
  'D0:4F:7E': 'Apple',
  'D0:A6:37': 'Apple',
  'D4:9A:20': 'Apple',
  'D8:30:62': 'Apple',
  'D8:96:95': 'Apple',
  'D8:BB:2C': 'Apple',
  'D8:CF:9C': 'Apple',
  'DC:2B:61': 'Apple',
  'DC:37:18': 'Apple',
  'DC:56:E7': 'Apple',
  'DC:86:D8': 'Apple',
  'DC:9B:9C': 'Apple',
  'E0:33:8E': 'Apple',
  'E0:5F:45': 'Apple',
  'E0:66:78': 'Apple',
  'E0:AC:CB': 'Apple',
  'E0:B5:2D': 'Apple',
  'E0:B9:BA': 'Apple',
  'E0:C9:7A': 'Apple',
  'E4:25:E7': 'Apple',
  'E4:8B:7F': 'Apple',
  'E4:CE:8F': 'Apple',
  'E8:04:0B': 'Apple',
  'E8:80:2E': 'Apple',
  'E8:B2:AC': 'Apple',
  'EC:35:86': 'Apple',
  'EC:85:2F': 'Apple',
  'F0:18:98': 'Apple',
  'F0:24:75': 'Apple',
  'F0:CB:A1': 'Apple',
  'F0:DB:E2': 'Apple',
  'F0:DC:E2': 'Apple',
  'F4:0F:24': 'Apple',
  'F4:1B:A1': 'Apple',
  'F4:5C:89': 'Apple',
  'F4:F1:5A': 'Apple',
  'F8:1E:DF': 'Apple',
  'F8:27:93': 'Apple',
  'F8:D0:BD': 'Apple',
  'FC:25:3F': 'Apple',
  'FC:E9:98': 'Apple',
  'FC:FC:48': 'Apple',
  // Samsung
  '00:12:FB': 'Samsung',
  '00:13:77': 'Samsung',
  '00:15:99': 'Samsung',
  '00:16:32': 'Samsung',
  '00:16:6B': 'Samsung',
  '00:16:6C': 'Samsung',
  '00:17:C9': 'Samsung',
  '00:17:D5': 'Samsung',
  '00:18:AF': 'Samsung',
  '00:1A:8A': 'Samsung',
  '00:1B:98': 'Samsung',
  '00:1C:43': 'Samsung',
  '00:1D:25': 'Samsung',
  '00:1E:7D': 'Samsung',
  '00:1E:E1': 'Samsung',
  '00:1E:E2': 'Samsung',
  '00:1F:CD': 'Samsung',
  '00:21:19': 'Samsung',
  '00:21:4C': 'Samsung',
  '00:23:39': 'Samsung',
  '00:23:D6': 'Samsung',
  '00:23:D7': 'Samsung',
  '00:24:54': 'Samsung',
  '00:24:90': 'Samsung',
  '00:24:91': 'Samsung',
  '00:25:38': 'Samsung',
  '00:26:37': 'Samsung',
  '00:E0:64': 'Samsung',
  '04:18:0F': 'Samsung',
  '08:08:C2': 'Samsung',
  '08:D4:2B': 'Samsung',
  '0C:89:10': 'Samsung',
  '10:1D:C0': 'Samsung',
  '14:49:E0': 'Samsung',
  '18:3F:47': 'Samsung',
  '1C:62:B8': 'Samsung',
  '1C:66:AA': 'Samsung',
  '20:64:32': 'Samsung',
  '20:A5:BF': 'Samsung',
  '24:DA:9B': 'Samsung',
  '28:39:5E': 'Samsung',
  '28:57:BE': 'Samsung',
  '2C:44:01': 'Samsung',
  '30:07:4D': 'Samsung',
  '34:23:87': 'Samsung',
  '34:AA:8B': 'Samsung',
  '38:0A:94': 'Samsung',
  '38:AA:3C': 'Samsung',
  '3C:5A:37': 'Samsung',
  '40:0E:85': 'Samsung',
  '40:5B:D8': 'Samsung',
  '44:4E:1A': 'Samsung',
  '44:87:FC': 'Samsung',
  '48:5A:3F': 'Samsung',
  '48:DB:50': 'Samsung',
  '4C:BC:42': 'Samsung',
  '50:32:37': 'Samsung',
  '50:B7:C3': 'Samsung',
  '50:C8:E5': 'Samsung',
  '50:CC:F8': 'Samsung',
  '54:88:0E': 'Samsung',
  '54:92:BE': 'Samsung',
  '5C:0A:5B': 'Samsung',
  '5C:0E:8B': 'Samsung',
  '5C:F6:DC': 'Samsung',
  '60:21:C0': 'Samsung',
  '64:16:F0': 'Samsung',
  '64:6E:97': 'Samsung',
  '64:B8:53': 'Samsung',
  '68:EB:AE': 'Samsung',
  '70:2A:D5': 'Samsung',
  '74:45:8A': 'Samsung',
  '74:5F:00': 'Samsung',
  '74:DE:2B': 'Samsung',
  '78:1F:DB': 'Samsung',
  '78:25:AD': 'Samsung',
  '78:40:E4': 'Samsung',
  '78:47:1D': 'Samsung',
  '78:4B:87': 'Samsung',
  '78:59:5E': 'Samsung',
  '78:A8:73': 'Samsung',
  '78:BD:BC': 'Samsung',
  '78:D6:F0': 'Samsung',
  '7C:11:CB': 'Samsung',
  '7C:1C:4E': 'Samsung',
  '80:18:A7': 'Samsung',
  '84:00:D2': 'Samsung',
  '84:11:9E': 'Samsung',
  '88:30:8A': 'Samsung',
  '88:32:9B': 'Samsung',
  '88:36:6C': 'Samsung',
  '88:9B:39': 'Samsung',
  '8C:77:12': 'Samsung',
  '8C:C8:CD': 'Samsung',
  '90:18:7C': 'Samsung',
  '94:35:0A': 'Samsung',
  '98:52:B1': 'Samsung',
  '9C:02:98': 'Samsung',
  'A0:07:98': 'Samsung',
  'A0:21:95': 'Samsung',
  'A0:75:91': 'Samsung',
  'A0:82:1F': 'Samsung',
  'A4:EB:D3': 'Samsung',
  'AC:36:13': 'Samsung',
  'AC:5A:14': 'Samsung',
  'AC:5F:3E': 'Samsung',
  'B0:72:BF': 'Samsung',
  'B4:07:F9': 'Samsung',
  'B4:79:A7': 'Samsung',
  'B8:5E:7B': 'Samsung',
  'BC:14:85': 'Samsung',
  'BC:20:BA': 'Samsung',
  'BC:44:86': 'Samsung',
  'BC:72:B1': 'Samsung',
  'BC:8C:CD': 'Samsung',
  'C0:97:27': 'Samsung',
  'C4:42:02': 'Samsung',
  'C4:57:6E': 'Samsung',
  'C8:19:F7': 'Samsung',
  'C8:3D:D4': 'Samsung',
  'CC:03:FA': 'Samsung',
  'CC:05:1B': 'Samsung',
  'CC:07:AB': 'Samsung',
  'CC:B1:1A': 'Samsung',
  'CC:FE:3C': 'Samsung',
  'D0:17:6A': 'Samsung',
  'D0:22:BE': 'Samsung',
  'D0:59:E4': 'Samsung',
  'D4:87:D8': 'Samsung',
  'D4:E8:B2': 'Samsung',
  'D8:90:E8': 'Samsung',
  'DC:71:44': 'Samsung',
  'E4:12:1D': 'Samsung',
  'E4:92:FB': 'Samsung',
  'E8:03:9A': 'Samsung',
  'E8:11:32': 'Samsung',
  'E8:50:8B': 'Samsung',
  'EC:1D:8B': 'Samsung',
  'EC:9B:F3': 'Samsung',
  'F0:25:B7': 'Samsung',
  'F0:5A:09': 'Samsung',
  'F0:6B:CA': 'Samsung',
  'F0:D1:A9': 'Samsung',
  'F4:09:D8': 'Samsung',
  'F4:7B:5E': 'Samsung',
  'F8:04:2E': 'Samsung',
  'F8:D0:AC': 'Samsung',
  'FC:00:12': 'Samsung',
  'FC:03:9F': 'Samsung',
  'FC:A1:3E': 'Samsung',
  // TP-Link
  '00:27:19': 'TP-Link',
  '08:57:00': 'TP-Link',
  '0C:80:63': 'TP-Link',
  '14:CF:92': 'TP-Link',
  '18:0F:76': 'TP-Link',
  '1C:3B:F3': 'TP-Link',
  '1C:FA:68': 'TP-Link',
  '20:F4:1B': 'TP-Link',
  '28:2C:B2': 'TP-Link',
  '2C:30:33': 'TP-Link',
  '38:83:45': 'TP-Link',
  '44:4E:6D': 'TP-Link',
  '44:D9:E7': 'TP-Link',
  '48:5B:39': 'TP-Link',
  '50:C7:BF': 'TP-Link',
  '54:A5:1B': 'TP-Link',
  '64:51:06': 'TP-Link',
  '70:4F:57': 'TP-Link',
  '74:EA:3A': 'TP-Link',
  '84:16:F9': 'TP-Link',
  '84:D8:1B': 'TP-Link',
  '90:F6:52': 'TP-Link',
  '98:DA:C4': 'TP-Link',
  '9C:A2:F4': 'TP-Link',
  'A0:F3:C1': 'TP-Link',
  'A4:2B:B0': 'TP-Link',
  'AC:15:A2': 'TP-Link',
  'AC:84:C6': 'TP-Link',
  'B0:4E:26': 'TP-Link',
  'B0:95:8E': 'TP-Link',
  'B0:BE:76': 'TP-Link',
  'C0:25:E9': 'TP-Link',
  'C4:6E:1F': 'TP-Link',
  'C4:E9:84': 'TP-Link',
  'D8:07:B6': 'TP-Link',
  'D8:0D:17': 'TP-Link',
  'DC:15:C8': 'TP-Link',
  'E8:48:B8': 'TP-Link',
  'E8:94:F6': 'TP-Link',
  'EC:08:6B': 'TP-Link',
  'EC:60:73': 'TP-Link',
  'F0:A7:31': 'TP-Link',
  'F4:6D:04': 'TP-Link',
  'F4:EC:38': 'TP-Link',
  'F4:F2:6D': 'TP-Link',
  'F8:E4:3B': 'TP-Link',
  'FC:EC:DA': 'TP-Link',
};

function getVendorFromMac(mac: string): string | undefined {
  const macPrefix = mac.substring(0, 8).toUpperCase();
  return macVendors[macPrefix];
}

function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name];
    if (!nets) continue;
    
    for (const net of nets) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

export class DeviceScannerService {
  async scanNetwork(): Promise<Device[]> {
    const devices: Device[] = [];
    const localIP = getLocalIP();
    const networkPrefix = localIP.substring(0, localIP.lastIndexOf('.'));

    console.log(`[DEVICE SCANNER] Scanning network: ${networkPrefix}.0/24`);
    console.log(`[DEVICE SCANNER] Local IP: ${localIP}`);

    try {
      // Use arp-scan on macOS/Linux or arp command
      let command: string;
      
      if (process.platform === 'darwin' || process.platform === 'linux') {
        // Try arp-scan first (more reliable but needs to be installed)
        try {
          const { stdout: arpScanCheck } = await execAsync('which arp-scan');
          if (arpScanCheck) {
            command = `sudo arp-scan --localnet --interface=en0 2>/dev/null || arp -a`;
          } else {
            command = 'arp -a';
          }
        } catch {
          command = 'arp -a';
        }
      } else {
        // Windows
        command = 'arp -a';
      }

      console.log(`[DEVICE SCANNER] Using command: ${command}`);
      
      const { stdout } = await execAsync(command, { timeout: 30000 });
      const lines = stdout.split('\n');

      console.log(`[DEVICE SCANNER] Found ${lines.length} ARP entries`);

      for (const line of lines) {
        // Parse ARP output
        // Format: hostname (ip) at mac [ether] on interface
        // or: Interface: ip --- 0xNumber
        //     Internet Address      Physical Address      Type
        //     ip                   mac                   dynamic

        let ip = '';
        let mac = '';
        let hostname = '';

        console.log(`  [SCAN] Parsing line: ${line.substring(0, 100)}`);

        // macOS/Linux format: hostname (192.168.1.1) at aa:bb:cc:dd:ee:ff [ether] on en0
        const macPattern1 = /\((\d+\.\d+\.\d+\.\d+)\)\s+at\s+([\da-f]{1,2}:[\da-f]{1,2}:[\da-f]{1,2}:[\da-f]{1,2}:[\da-f]{1,2}:[\da-f]{1,2})/i;
        const match1 = line.match(macPattern1);
        
        if (match1) {
          ip = match1[1];
          mac = match1[2].toUpperCase();
          console.log(`    Matched pattern 1: IP=${ip}, MAC=${mac}`);
          
          // Extract hostname (before the IP)
          const hostnameMatch = line.match(/^([^\s]+)\s+\(/);
          if (hostnameMatch) {
            hostname = hostnameMatch[1];
            if (hostname === '?') hostname = '';
            console.log(`    Hostname from ARP: "${hostname}"`);
          }
        } else {
          // Windows format or alternative: 192.168.1.1          aa-bb-cc-dd-ee-ff     dynamic
          const macPattern2 = /(\d+\.\d+\.\d+\.\d+)\s+([\da-f]{2}[-:][\da-f]{2}[-:][\da-f]{2}[-:][\da-f]{2}[-:][\da-f]{2}[-:][\da-f]{2})/i;
          const match2 = line.match(macPattern2);
          
          if (match2) {
            ip = match2[1];
            mac = match2[2].toUpperCase().replace(/-/g, ':');
            console.log(`    Matched pattern 2: IP=${ip}, MAC=${mac}`);
          }
        }

        if (ip && mac && ip.startsWith(networkPrefix)) {
          const macPrefix = mac.substring(0, 8);
          const vendor = getVendorFromMac(mac);
          const isCurrentDevice = ip === localIP;

          console.log(`    MAC Prefix: ${macPrefix} => Vendor: ${vendor || 'Unknown'}`);

          // Try to resolve hostname if not found
          if (!hostname || hostname === '?') {
            try {
              console.log(`    Resolving hostname for ${ip}...`);
              const { stdout: hostOutput } = await execAsync(`host ${ip}`, { timeout: 2000 });
              const hostMatch = hostOutput.match(/domain name pointer\s+(.+)\./);
              if (hostMatch) {
                hostname = hostMatch[1];
                console.log(`    Hostname resolved: "${hostname}"`);
              } else {
                console.log(`    No hostname found in: ${hostOutput.substring(0, 50)}`);
              }
            } catch (error: any) {
              console.log(`    Hostname resolution failed: ${error.message}`);
            }
          }

          devices.push({
            ip,
            mac,
            hostname: hostname || undefined,
            vendor,
            isCurrentDevice
          });

          console.log(`  Device added: ${ip} | MAC: ${mac} | Vendor: ${vendor || 'Unknown'} | Hostname: ${hostname || 'N/A'} ${isCurrentDevice ? '(YOU)' : ''}`);
        } else if (ip && mac) {
          console.log(`  Skipped (different network): ${ip}`);
        }
      }

      // Sort: current device first, then by IP
      devices.sort((a, b) => {
        if (a.isCurrentDevice) return -1;
        if (b.isCurrentDevice) return 1;
        return a.ip.localeCompare(b.ip, undefined, { numeric: true });
      });

      console.log(`[DEVICE SCANNER] Scan complete: ${devices.length} devices found`);
      return devices;

    } catch (error: any) {
      console.error('[DEVICE SCANNER] Scan failed:', error.message);
      throw new Error('Failed to scan network devices');
    }
  }
}

export const deviceScannerService = new DeviceScannerService();
