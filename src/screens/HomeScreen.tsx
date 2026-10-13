
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const DEFAULT_REGION: Region = {
  latitude: 20.5937,
  longitude: 78.9629,
  latitudeDelta: 20,
  longitudeDelta: 20,
};

const HomeScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const goToCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      Alert.alert(
        'Location permission required',
        'Allow location access to center the map on your current position.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(coordinates);

        const nextRegion: Region = {
          ...coordinates,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(nextRegion);
        mapRef.current?.animateToRegion(nextRegion, 700);
      },
      error => {
        Alert.alert('Unable to get location', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={DEFAULT_REGION}
        onRegionChangeComplete={setRegion}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
          />
        )}
      </MapView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go to current location"
        style={styles.locationButton}
        onPress={goToCurrentLocation}
      >
        <Text style={styles.locationButtonText}>◎</Text>
      </Pressable>

      <View style={styles.bottomPanel}>
        <Text style={styles.title}>Where are we going?</Text>
        <Text style={styles.subtitle}>
          Create a convoy and share your journey with friends.
        </Text>

        <Pressable
          style={styles.createRideButton}
          onPress={() =>
            Alert.alert(
              'Create a ride',
              'We will connect this button to your ride creation flow next.',
            )
          }
        >
          <Text style={styles.createRideButtonText}>+ Create a Ride</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    bottom: 230,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  locationButtonText: {
    color: '#202124',
    fontSize: 30,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#202124',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#5F6368',
  },
  createRideButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#1769E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createRideButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;
