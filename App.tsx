import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {TailwindProvider} from 'tailwind-rn';
import CustomersScreen from './screens/CustomersScreen';
import utilities from './tailwind.json';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigator/RootNavigator';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React from 'react';


const client = new ApolloClient({
  
  uri: 'https://pfarrkirchen.stepzen.net/api/understood-kangaroo/__graphql',
  headers: {'Authorization':'apikey pfarrkirchen::stepzen.io+1000::c246a16624e5a2583fcc95347e117e305a84940511b24ebb1ba07e3ee97b58bd'},
  cache: new InMemoryCache(),
  
});



export default function App() {
  return (
    //@ts-ignore -TailWindProvider is missing a type definition
    <TailwindProvider utilities={utilities}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <RootNavigator/>
        </NavigationContainer>
      </ApolloProvider>
    </TailwindProvider>
  );
}


