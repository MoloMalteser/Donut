import { BluetoothDevice, SyncResult, Post } from '../types';
import RNBluetoothClassic from 'react-native-bluetooth-classic';

class BluetoothService {
  private isEnabled: boolean = false;
  private connectedDevices: BluetoothDevice[] = [];
  private onDeviceDiscovered?: (device: BluetoothDevice) => void;
  private onSyncComplete?: (result: SyncResult) => void;

  async initialize(): Promise<boolean> {
    try {
      const enabled = await RNBluetoothClassic.isEnabled();
      this.isEnabled = enabled;
      return enabled;
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      return false;
    }
  }

  async enableBluetooth(): Promise<boolean> {
    try {
      await RNBluetoothClassic.requestEnable();
      this.isEnabled = true;
      return true;
    } catch (error) {
      console.error('Failed to enable Bluetooth:', error);
      return false;
    }
  }

  async getAvailableDevices(): Promise<BluetoothDevice[]> {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      return devices.map(device => ({
        id: device.id,
        name: device.name,
        address: device.address,
        isConnected: false,
        rssi: (device as any).rssi,
      }));
    } catch (error) {
      console.error('Failed to get available devices:', error);
      return [];
    }
  }

  setOnDeviceDiscovered(callback: (device: BluetoothDevice) => void) {
    this.onDeviceDiscovered = callback;
  }

  setOnSyncComplete(callback: (result: SyncResult) => void) {
    this.onSyncComplete = callback;
  }

  async startScan(): Promise<void> {
    // Simulated scan using bonded devices as discoveries
    const devices = await this.getAvailableDevices();
    devices.forEach(d => this.onDeviceDiscovered?.(d));
  }

  stopScan(): void {
    // No-op for now; placeholder for real scan stop
  }

  async syncWithDevice(deviceId: string): Promise<void> {
    // Simulated sync that triggers callback
    const result: SyncResult = {
      success: true,
      message: 'Sync completed',
      postsReceived: 0,
      postsSent: 0,
    };
    this.onSyncComplete?.(result);
  }

  async cleanupExpiredPosts(): Promise<void> {
    // Placeholder; in real impl we'd invoke DatabaseService.deleteExpiredPosts()
  }

  async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      await RNBluetoothClassic.connectToDevice(device.address);
      const connectedDevice = { ...device, isConnected: true };
      this.connectedDevices.push(connectedDevice);
      return true;
    } catch (error) {
      console.error('Failed to connect to device:', error);
      return false;
    }
  }

  async disconnectFromDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      await RNBluetoothClassic.disconnectFromDevice(device.address);
      this.connectedDevices = this.connectedDevices.filter(d => d.id !== device.id);
      return true;
    } catch (error) {
      console.error('Failed to disconnect from device:', error);
      return false;
    }
  }

  async syncPosts(posts: Post[]): Promise<SyncResult> {
    try {
      const connectedDevices = this.connectedDevices.filter(d => d.isConnected);
      
      if (connectedDevices.length === 0) {
        return {
          success: false,
          message: 'No connected devices to sync with'
        };
      }

      const postsData = JSON.stringify(posts);
      let totalSynced = 0;

      for (const device of connectedDevices) {
        try {
          await RNBluetoothClassic.writeToDevice(device.address, postsData);
          totalSynced++;
        } catch (error) {
          console.error(`Failed to sync with device ${device.name}:`, error);
        }
      }

      return {
        success: totalSynced > 0,
        message: `Synced with ${totalSynced} device(s)`,
        postsSynced: totalSynced
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to sync posts',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async receivePosts(): Promise<Post[]> {
    try {
      const connectedDevices = this.connectedDevices.filter(d => d.isConnected);
      
      if (connectedDevices.length === 0) {
        return [];
      }

      const receivedPosts: Post[] = [];

      for (const device of connectedDevices) {
        try {
          const data = await RNBluetoothClassic.readFromDevice(device.address);
          if (data) {
            const posts = JSON.parse(data) as Post[];
            receivedPosts.push(...posts);
          }
        } catch (error) {
          console.error(`Failed to receive from device ${device.name}:`, error);
        }
      }

      return receivedPosts;
    } catch (error) {
      console.error('Failed to receive posts:', error);
      return [];
    }
  }

  getConnectedDevices(): BluetoothDevice[] {
    return this.connectedDevices.filter(d => d.isConnected);
  }

  isBluetoothEnabled(): boolean {
    return this.isEnabled;
  }
}

export default new BluetoothService();