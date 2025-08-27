export interface Post {
  id: string;
  content: string;
  imageUri?: string | null;
  timestamp: number;
  hopCount: number;
  authorId: string;
  // legacy fields used by storage/rendering
  type?: 'text' | 'photo';
  isLocal?: boolean;
  // optional app-side status field
  isExpired?: boolean;
}

export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  isConnected: boolean;
  rssi?: number;
}

export interface SyncResult {
  success: boolean;
  message: string;
  postsSynced?: number;
  postsReceived?: number;
  postsSent?: number;
  error?: string;
}

export interface PostCreationData {
  content: string;
  imageUri?: string;
}