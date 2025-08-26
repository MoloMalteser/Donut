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
import { Ionicons } from '@expo/vector-icons';
import BluetoothService from '../services/BluetoothService';
import { BluetoothDevice, SyncResult } from '../types';

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
      style={[styles.deviceItem, item.isConnected && styles.connectedDevice]}
      onPress={() => handleConnectToDevice(item)}
      disabled={isConnecting}
    >
      <View style={styles.deviceInfo}>
        <Ionicons 
          name={item.isConnected ? "bluetooth" : "bluetooth-outline"} 
          size={24} 
          color={item.isConnected ? "#4CAF50" : "#666"} 
        />
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceRssi}>Signal: {item.rssi} dBm</Text>
        </View>
      </View>
      
      <View style={styles.deviceStatus}>
        {item.isConnected ? (
          <Text style={styles.connectedText}>Connected</Text>
        ) : (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => handleConnectToDevice(item)}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.connectButtonText}>Connect</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🍩 Bluetooth Sync</Text>
        <Text style={styles.subtitle}>Discover nearby devices to share posts</Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity
        style={[styles.scanButton, isScanning && styles.scanningButton]}
        onPress={handleStartScan}
        disabled={isScanning}
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
      </TouchableOpacity>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <View style={[styles.syncResult, lastSyncResult.success ? styles.successResult : styles.errorResult]}>
          <Ionicons 
            name={lastSyncResult.success ? "checkmark-circle" : "close-circle"} 
            size={20} 
            color={lastSyncResult.success ? "#4CAF50" : "#f44336"} 
          />
          <Text style={styles.syncResultText}>
            {lastSyncResult.success 
              ? `Sync successful! Received ${lastSyncResult.postsReceived}, sent ${lastSyncResult.postsSent} posts`
              : `Sync failed: ${lastSyncResult.error}`
            }
          </Text>
        </View>
      )}

      {/* Device List */}
      <View style={styles.deviceListContainer}>
        <Text style={styles.deviceListTitle}>
          Discovered Devices ({discoveredDevices.length})
        </Text>
        
        {discoveredDevices.length === 0 && !isScanning && (
          <View style={styles.emptyState}>
            <Ionicons name="bluetooth-outline" size={48} color="#ccc" />
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
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanningButton: {
    backgroundColor: '#FF9800',
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  syncResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    gap: 12,
  },
  successResult: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  errorResult: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
    borderWidth: 1,
  },
  syncResultText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deviceListContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  deviceListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  deviceList: {
    flexGrow: 1,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  connectedDevice: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  deviceRssi: {
    fontSize: 12,
    color: '#666',
  },
  deviceStatus: {
    alignItems: 'flex-end',
  },
  connectedText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  connectButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BluetoothSync;