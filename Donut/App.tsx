import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FeedScreen from './src/screens/FeedScreen';
import BluetoothSync from './src/components/BluetoothSync';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#667eea',
            tabBarInactiveTintColor: '#95a5a6',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              paddingBottom: 5,
              paddingTop: 5,
              height: 60,
            },
            headerShown: false,
          }}
        >
          <Tab.Screen
            name="Feed"
            component={FeedScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ color, fontSize: size }}>🍩</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Sync"
            component={BluetoothSync}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ color, fontSize: size }}>📡</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
