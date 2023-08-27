import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomersScreen from '../screens/CustomersScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import MapScreen from '../screens/MapScreen';

export type TabStackParamList ={
  Customers: undefined;
  Orders: undefined;
  Delivery: undefined;
};

const Tab =createBottomTabNavigator<TabStackParamList>();

const TabNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown : false,
    });
    
  },[] )


  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarActiveTintColor: "blue",
      tabBarInactiveTintColor:"gray",
      tabBarIcon:({ focused, color, size }) =>{
        if(route.name === 'Customers'){
          return(
            <Icon
            name="users"
            type="entypo"
            color={focused ? "blue" : "gray"}
            />
          )
        }else if (route.name === "Orders"){
          return(
            <Icon
            name="box"
            type="entypo"
            color={focused ? "red" : "gray"}
            />
          )
        }else if(route.name === "Delivery"){
          return(
            <Icon
            name="map"
            type="entypo"
            color={focused ? "green" : "gray" }
            />
          )
        }

      }

    })}>
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Delivery" component={MapScreen} />
      
    </Tab.Navigator>
  )
}

export default TabNavigator

