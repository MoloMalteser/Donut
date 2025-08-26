import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BluetoothService from '../services/BluetoothService';
import { BluetoothDevice, SyncResult } from '../types';

const { width } = Dimensions.get('window');

const BluetoothSync: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    // Set up Bluetooth service callbacks
    BluetoothService.setOnDeviceDiscovered((device) => {
      setDiscoveredDevices(prev => {
        const existing = prev.find(d => d.id === device.id);
        if (existing) {
          return prev.map(d => d.id === device.id ? device : d);
        } else {
          return [...prev, device];
        }
      });
    });

    BluetoothService.setOnSyncComplete((result) => {
      setLastSyncResult(result);
      if (result.success) {
        Alert.alert(
          'Sync Complete! 🍩',
          `Received ${result.postsReceived} posts\nSent ${result.postsSent} posts`
        );
      } else {
        Alert.alert('Sync Failed', result.error || 'Unknown error occurred');
      }
    });

    return () => {
      // Cleanup
      BluetoothService.stopScanning();
    };
  }, []);

  const handleStartScan = async () => {
    try {
      setIsScanning(true);
      setDiscoveredDevices([]);
      setLastSyncResult(null);
      
      await BluetoothService.startScanning();
      
      // Stop scanning after 5 seconds
      setTimeout(() => {
        setIsScanning(false);
      }, 5000);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to start Bluetooth scanning');
      setIsScanning(false);
    }
  };

  const handleConnectToDevice = async (device: BluetoothDevice) => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      const result = await BluetoothService.connectAndSync(device.id);
      
      if (result.success) {
        setLastSyncResult(result);
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Failed to connect to device');
    } finally {
      setIsConnecting(false);
    }
  };

  const renderDevice = ({ item }: { item: BluetoothDevice }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => handleConnectToDevice(item)}
      disabled={isConnecting}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={item.isConnected ? ['#4CAF50', '#66BB6A'] : ['#ffffff', '#f8f9fa']}
        style={styles.deviceGradient}
      >
        <View style={styles.deviceInfo}>
          <View style={styles.deviceIcon}>
            <LinearGradient
              colors={item.isConnected ? ['#4CAF50', '#66BB6A'] : ['#2196F3', '#42A5F5']}
              style={styles.iconGradient}
            >
              <Ionicons 
                name={item.isConnected ? "bluetooth" : "bluetooth-outline"} 
                size={24} 
                color="#ffffff" 
              />
            </LinearGradient>
          </View>
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
          </View>
        </View>
        
        <View style={styles.deviceStatus}>
          {item.isConnected ? (
            <View style={styles.connectedBadge}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.connectedBadgeGradient}
              >
                <Text style={styles.connectedText}>Connected</Text>
              </LinearGradient>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => handleConnectToDevice(item)}
              disabled={isConnecting}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2196F3', '#42A5F5']}
                style={styles.connectButtonGradient}
              >
                {isConnecting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.connectButtonText}>Connect</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4CAF50', '#66BB6A']}
        style={styles.header}
      >
        <Text style={styles.title}>🍩 Bluetooth Sync</Text>
        <Text style={styles.subtitle}>Discover nearby devices to share posts</Text>
      </LinearGradient>

      {/* Scan Button */}
      <View style={styles.scanButtonContainer}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleStartScan}
          disabled={isScanning}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isScanning ? ['#FF9800', '#FFB74D'] : ['#4CAF50', '#66BB6A']}
            style={styles.scanButtonGradient}
          >
            {isScanning ? (
              <View style={styles.scanningContent}>
                <View style={styles.donutAnimation}>
                  <Text style={styles.donutEmoji}>🍩</Text>
                </View>
                <Text style={styles.scanningText}>Scanning...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="bluetooth" size={24} color="#ffffff" />
                <Text style={styles.scanButtonText}>Start Scan</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <View style={styles.syncResultContainer}>
          <LinearGradient
            colors={lastSyncResult.success ? ['#e8f5e8', '#c8e6c9'] : ['#ffebee', '#ffcdd2']}
            style={styles.syncResultGradient}
          >
            <View style={styles.syncResultIcon}>
              <LinearGradient
                colors={lastSyncResult.success ? ['#4CAF50', '#66BB6A'] : ['#f44336', '#ef5350']}
                style={styles.syncIconGradient}
              >
                <Ionicons 
                  name={lastSyncResult.success ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color="#ffffff" 
                />
              </LinearGradient>
            </View>
            <Text style={styles.syncResultText}>
              {lastSyncResult.success 
                ? `Sync successful! Received ${lastSyncResult.postsReceived}, sent ${lastSyncResult.postsSent} posts`
                : `Sync failed: ${lastSyncResult.error}`
              }
            </Text>
          </LinearGradient>
        </View>
      )}

      {/* Device List */}
      <View style={styles.deviceListContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.deviceListGradient}
        >
          <Text style={styles.deviceListTitle}>
            Discovered Devices ({discoveredDevices.length})
          </Text>
          
          {discoveredDevices.length === 0 && !isScanning && (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <LinearGradient
                  colors={['#e0e0e0', '#f5f5f5']}
                  style={styles.emptyIconGradient}
                >
                  <Ionicons name="bluetooth-outline" size={48} color="#999" />
                </LinearGradient>
              </View>
              <Text style={styles.emptyStateText}>No devices found</Text>
              <Text style={styles.emptyStateSubtext}>Start scanning to discover nearby Donut users</Text>
            </View>
          )}

          <FlatList
            data={discoveredDevices}
            renderItem={renderDevice}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.deviceList}
          />
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
  scanButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  scanButton: {
    borderRadius: 28,
    overflow: 'hidden',
    height: 64,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  scanButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  scanningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  donutAnimation: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutEmoji: {
    fontSize: 20,
  },
  scanningText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  syncResultContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  syncResultGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  syncResultIcon: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  syncIconGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  syncResultText: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  deviceListContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  deviceListGradient: {
    flex: 1,
    padding: 24,
  },
  deviceListTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 16,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  deviceList: {
    flexGrow: 1,
  },
  deviceItem: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  deviceGradient: {
    padding: 20,
    borderRadius: 20,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginBottom: 16,
  },
  deviceIcon: {
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  iconGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deviceRssi: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  deviceStatus: {
    alignItems: 'flex-end',
  },
  connectedBadge: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  connectedBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  connectedText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '700',
  },
  connectButton: {
    borderRadius: 20,
    overflow: 'hidden',
    minWidth: 100,
  },
  connectButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default BluetoothSync;