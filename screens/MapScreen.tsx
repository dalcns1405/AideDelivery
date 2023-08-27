import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { TabStackParamList } from '../navigator/TabNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../navigator/RootNavigator';
import { useTailwind } from 'tailwind-rn/dist';

export type MapScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamList, 'Delivery'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface Coordinate {
  latitude: number;
  longitude: number;
}

const MapScreen: React.FC = () => {
  const tw = useTailwind();
  const navigation = useNavigation<MapScreenNavigationProp>();

  const [waypoints, setWaypoints] = useState<Coordinate[]>([
    { latitude: 37.771843566445824, longitude: 29.082412868367218 }, // New York
    { latitude: 37.771843566445824, longitude: 29.082412868367218 }, // London
    { latitude: 37.77728731918146, longitude: 29.08811229763957 }, // Sydney
    { latitude: 37.78991059289068, longitude: 29.099673141582272 }, // Tokyo
    { latitude: 37.73151191335449, longitude: 29.14309114410388 },
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    optimizeWaypoints();
  }, []);

  const optimizeWaypoints = async () => {
    try {
      const apiKey = 'APIKEY';
      const origin = `${waypoints[0].latitude},${waypoints[0].longitude}`;
      const destination = `${waypoints[waypoints.length - 1].latitude},${waypoints[waypoints.length - 1].longitude}`;
      const intermediateWaypoints = waypoints
        .slice(1, -1)
        .map((waypoint) => `${waypoint.latitude},${waypoint.longitude}`);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=${intermediateWaypoints.join(
          '|'
        )}&optimizeWaypoints=true&key=${apiKey}`
      );

      const result = await response.json();

      if (result.status === 'OK') {
        const optimizedWaypoints = result.routes[0].legs.map((leg: any) => ({
          latitude: leg.end_location.lat,
          longitude: leg.end_location.lng,
        }));
        setWaypoints([waypoints[0], ...optimizedWaypoints, waypoints[waypoints.length - 1]]);
      } else {
        console.error('Route optimization failed:', result);
      }
    } catch (error) {
      console.error('Route optimization error:', error);
    }
  };

  const calculateTotalDistance = () => {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const lat1 = waypoints[i].latitude;
      const lon1 = waypoints[i].longitude;
      const lat2 = waypoints[i + 1].latitude;
      const lon2 = waypoints[i + 1].longitude;

      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371000 * c; 
      totalDistance += distance;
    }
    return totalDistance;
  };

  const totalDistance = calculateTotalDistance();

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {waypoints.map((waypoint, index) => (
          <Marker key={index} coordinate={waypoint} />
        ))}
        <MapViewDirections
          origin={waypoints[0]}
          destination={waypoints[waypoints.length - 1]}
          waypoints={waypoints.slice(1, -1)}
          apikey="APIKEY"
          strokeWidth={3}
          strokeColor="blue"
        />
      </MapView>
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>{`Total Distance: ${(totalDistance / 1000).toFixed(2)} km`}</Text>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 4,
  },
  distanceText: {
    fontWeight: 'bold',
  },
});

export default MapScreen;
