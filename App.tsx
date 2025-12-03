import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { Identity } from '@semaphore-protocol/identity';
import HomeScreen from './src/screens/HomeScreen';
import IdentityScreen from './src/screens/IdentityScreen';
import LocationProofScreen from './src/screens/LocationProofScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { SemaphoreIdentity } from '../../shared/types';

const Stack = createStackNavigator();

export default function App() {
  const [identity, setIdentity] = useState<SemaphoreIdentity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdentity();
    requestLocationPermission();
  }, []);

  const loadIdentity = async () => {
    try {
      const stored = await SecureStore.getItemAsync('semaphore_identity');
      if (stored) {
        setIdentity(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading identity:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Location permission is required for this app to work.');
    }
  };

  const createIdentity = async () => {
    try {
      const semaphoreIdentity = new Identity();
      const identityData: SemaphoreIdentity = {
        identityCommitment: semaphoreIdentity.commitment.toString(),
        trapdoor: semaphoreIdentity.trapdoor.toString(),
        nullifier: semaphoreIdentity.nullifier.toString(),
      };
      
      await SecureStore.setItemAsync('semaphore_identity', JSON.stringify(identityData));
      setIdentity(identityData);
      Alert.alert('Success', 'Semaphore identity created successfully!');
    } catch (error) {
      console.error('Error creating identity:', error);
      Alert.alert('Error', 'Failed to create identity');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Identity" component={IdentityScreen} />
        <Stack.Screen name="LocationProof" component={LocationProofScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

