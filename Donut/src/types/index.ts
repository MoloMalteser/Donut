export interface Post {
  id: string;
  content: string;
  imageUri?: string;
  timestamp: number;
  hopCount: number;
  isExpired: boolean;
  authorId?: string;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  isConnected: boolean;
}

export interface SyncResult {
  success: boolean;
  message: string;
  postsSynced?: number;
  error?: string;
}

export interface PostCreationData {
  content: string;
  imageUri?: string;
}