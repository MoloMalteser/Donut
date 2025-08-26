import { Post, BluetoothDevice, SyncResult } from '../types';
import DatabaseService from './DatabaseService';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

class BluetoothService {
  private isScanning: boolean = false;
  private discoveredDevices: Map<string, BluetoothDevice> = new Map();
  private onDeviceDiscovered?: (device: BluetoothDevice) => void;
  private onSyncComplete?: (result: SyncResult) => void;

  constructor() {
    this.startPeriodicCleanup();
  }

  // Set callback for when new devices are discovered
  setOnDeviceDiscovered(callback: (device: BluetoothDevice) => void): void {
    this.onDeviceDiscovered = callback;
  }

  // Set callback for when sync completes
  setOnSyncComplete(callback: (result: SyncResult) => void): void {
    this.onSyncComplete = callback;
  }

  // Start scanning for nearby devices
  async startScanning(): Promise<void> {
    if (this.isScanning) return;

    try {
      this.isScanning = true;
      console.log('🔍 Starting Bluetooth scan...');

      // Simulate device discovery (in real app, use actual Bluetooth APIs)
      this.simulateDeviceDiscovery();

    } catch (error) {
      console.error('Failed to start scanning:', error);
      this.isScanning = false;
    }
  }

  // Stop scanning
  stopScanning(): void {
    this.isScanning = false;
    console.log('🛑 Stopped Bluetooth scan');
  }

  // Simulate device discovery (replace with actual Bluetooth implementation)
  private simulateDeviceDiscovery(): void {
    const deviceNames = ['iPhone 12', 'Samsung Galaxy', 'Pixel 6', 'OnePlus 9'];
    
    deviceNames.forEach((name, index) => {
      setTimeout(() => {
        const device: BluetoothDevice = {
          id: `device_${index}`,
          name,
          rssi: -50 + Math.random() * 30,
          isConnected: false
        };

        this.discoveredDevices.set(device.id, device);
        
        if (this.onDeviceDiscovered) {
          this.onDeviceDiscovered(device);
        }
      }, index * 1000);
    });

    // Stop scanning after 5 seconds
    setTimeout(() => {
      this.stopScanning();
    }, 5000);
  }

  // Connect to a device and sync posts
  async connectAndSync(deviceId: string): Promise<SyncResult> {
    const device = this.discoveredDevices.get(deviceId);
    if (!device) {
      return {
        success: false,
        postsReceived: 0,
        postsSent: 0,
        error: 'Device not found'
      };
    }

    try {
      console.log(`🔗 Connecting to ${device.name}...`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark device as connected
      device.isConnected = true;
      this.discoveredDevices.set(deviceId, device);

      // Perform post synchronization
      const result = await this.syncPosts(deviceId);
      
      if (this.onSyncComplete) {
        this.onSyncComplete(result);
      }

      return result;

    } catch (error) {
      console.error('Sync failed:', error);
      return {
        success: false,
        postsReceived: 0,
        postsSent: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      // Disconnect after sync
      device.isConnected = false;
      this.discoveredDevices.set(deviceId, device);
    }
  }

  // Synchronize posts with a connected device
  private async syncPosts(deviceId: string): Promise<SyncResult> {
    try {
      // Get our posts for sharing
      const ourPosts = await DatabaseService.getAllPosts();
      const ourPostIds = ourPosts.map(post => post.id);

      // Simulate receiving posts from the other device
      const receivedPosts = await this.simulateReceivePosts(deviceId);
      const receivedPostIds = receivedPosts.map(post => post.id);

      // Get posts that the other device doesn't have
      const postsToSend = await DatabaseService.getPostsForSync(receivedPostIds);

      // Save received posts locally
      for (const post of receivedPosts) {
        if (!(await DatabaseService.postExists(post.id))) {
          // Increment hop count for received posts
          post.hopCount += 1;
          post.isLocal = false;
          await DatabaseService.savePost(post);
        }
      }

      // Simulate sending our posts
      await this.simulateSendPosts(deviceId, postsToSend);

      // Update hop counts for posts we sent
      for (const post of postsToSend) {
        await DatabaseService.updateHopCount(post.id, post.hopCount + 1);
      }

      return {
        success: true,
        postsReceived: receivedPosts.length,
        postsSent: postsToSend.length
      };

    } catch (error) {
      throw error;
    }
  }

  // Simulate receiving posts from another device
  private async simulateReceivePosts(deviceId: string): Promise<Post[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate some sample posts (in real app, these would come from Bluetooth)
    const samplePosts: Post[] = [
      {
        id: `remote_${deviceId}_${Date.now()}_1`,
        content: 'Just discovered this amazing app! 🍩',
        type: 'text',
        timestamp: Date.now() - 300000, // 5 minutes ago
        authorId: deviceId,
        hopCount: 1,
        isLocal: false
      },
      {
        id: `remote_${deviceId}_${Date.now()}_2`,
        content: 'The offline sharing is incredible!',
        type: 'text',
        timestamp: Date.now() - 600000, // 10 minutes ago
        authorId: deviceId,
        hopCount: 2,
        isLocal: false
      }
    ];

    return samplePosts;
  }

  // Simulate sending posts to another device
  private async simulateSendPosts(deviceId: string, posts: Post[]): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`📤 Sent ${posts.length} posts to ${deviceId}`);
  }

  // Get all discovered devices
  getDiscoveredDevices(): BluetoothDevice[] {
    return Array.from(this.discoveredDevices.values());
  }

  // Get device by ID
  getDevice(deviceId: string): BluetoothDevice | undefined {
    return this.discoveredDevices.get(deviceId);
  }

  // Clean up expired posts periodically
  private startPeriodicCleanup(): void {
    setInterval(async () => {
      try {
        await DatabaseService.deleteExpiredPosts();
      } catch (error) {
        console.error('Failed to cleanup expired posts:', error);
      }
    }, 60 * 60 * 1000); // Run every hour
  }

  // Check if Bluetooth is available
  async isBluetoothAvailable(): Promise<boolean> {
    // In a real app, check actual Bluetooth permissions and availability
    return Platform.OS !== 'web';
  }

  // Request Bluetooth permissions
  async requestPermissions(): Promise<boolean> {
    // In a real app, request actual Bluetooth permissions
    return true;
  }
}

export default new BluetoothService();