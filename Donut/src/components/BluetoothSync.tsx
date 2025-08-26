import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BluetoothService from '../services/BluetoothService';
import { BluetoothDevice, SyncResult } from '../types';

const BluetoothSync: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    // Set up Bluetooth service callbacks
    BluetoothService.setOnDeviceDiscovered((device) => {
      setDevices(prev => {
        const existing = prev.find(d => d.id === device.id);
        if (existing) {
          return prev.map(d => d.id === device.id ? device : d);
        }
        return [...prev, device];
      });
    });

    BluetoothService.setOnSyncComplete((result) => {
      setSyncResult(result);
      if (result.success) {
        Alert.alert('Sync Complete', `Received ${result.postsReceived} posts, sent ${result.postsSent} posts`);
      } else {
        Alert.alert('Sync Failed', result.error || 'Unknown error occurred');
      }
    });

    // Clean up expired posts periodically
    const cleanupInterval = setInterval(() => {
      BluetoothService.cleanupExpiredPosts();
    }, 60000); // Every minute

    return () => {
      clearInterval(cleanupInterval);
    };
  }, []);

  const handleStartScan = async () => {
    setIsScanning(true);
    setDevices([]);
    setSyncResult(null);

    try {
      await BluetoothService.startScan();
      // Simulate finding devices after a delay
      setTimeout(() => {
        setIsScanning(false);
      }, 5000);
    } catch (error) {
      Alert.alert('Error', 'Failed to start scanning');
      setIsScanning(false);
    }
  };

  const handleStopScan = () => {
    BluetoothService.stopScan();
    setIsScanning(false);
  };

  const handleSyncWithDevice = async (device: BluetoothDevice) => {
    try {
      await BluetoothService.syncWithDevice(device.id);
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to sync with device');
    }
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <LinearGradient
      colors={['#4ecdc4', '#44a08d']}
      style={styles.deviceItem}
    >
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{item.name}</Text>
        <Text style={styles.deviceId}>ID: {item.id}</Text>
        <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
      </View>
      <TouchableOpacity
        style={styles.syncButton}
        onPress={() => handleSyncWithDevice(item)}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.syncButtonGradient}
        >
          <Text style={styles.syncButtonText}>Sync</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.title}>Bluetooth Sync</Text>
        <Text style={styles.subtitle}>Share posts with nearby devices</Text>
      </LinearGradient>

      <View style={styles.scanSection}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={isScanning ? handleStopScan : handleStartScan}
        >
          <LinearGradient
            colors={isScanning ? ['#ff6b6b', '#ee5a24'] : ['#4ecdc4', '#44a08d']}
            style={styles.scanButtonGradient}
          >
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <Text style={styles.scanningText}>🍩 Scanning...</Text>
                <ActivityIndicator color="#fff" style={styles.spinner} />
              </View>
            ) : (
              <Text style={styles.scanButtonText}>Start Scan</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {syncResult && (
        <LinearGradient
          colors={syncResult.success ? ['#4ecdc4', '#44a08d'] : ['#ff6b6b', '#ee5a24']}
          style={styles.syncResult}
        >
          <Text style={styles.syncResultText}>
            {syncResult.success 
              ? `✅ Sync successful! Received ${syncResult.postsReceived} posts, sent ${syncResult.postsSent} posts`
              : `❌ Sync failed: ${syncResult.error}`
            }
          </Text>
        </LinearGradient>
      )}

      <View style={styles.devicesSection}>
        <Text style={styles.sectionTitle}>Discovered Devices</Text>
        {devices.length > 0 ? (
          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id}
            style={styles.devicesList}
          />
        ) : (
          <LinearGradient
            colors={['#95a5a6', '#7f8c8d']}
            style={styles.emptyState}
          >
            <Text style={styles.emptyStateIcon}>🍩</Text>
            <Text style={styles.emptyStateText}>
              {isScanning ? 'Scanning for devices...' : 'No devices found. Start scanning to discover nearby Donut users!'}
            </Text>
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  scanSection: {
    padding: 20,
    alignItems: 'center',
  },
  scanButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scanningText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  spinner: {
    marginLeft: 8,
  },
  syncResult: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
  },
  syncResultText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  devicesSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  devicesList: {
    flex: 1,
  },
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  deviceRssi: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  syncButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  syncButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BluetoothSync;