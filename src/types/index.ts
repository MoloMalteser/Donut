export interface Post {
  id: string;
  content: string;
  type: 'text' | 'photo';
  imageUri?: string;
  timestamp: number;
  authorId: string;
  hopCount: number;
  isLocal: boolean;
}

export interface User {
  id: string;
  deviceName: string;
  lastSeen: number;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi: number;
  isConnected: boolean;
}

export interface SyncResult {
  success: boolean;
  postsReceived: number;
  postsSent: number;
  error?: string;
}