import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { Koulen_400Regular } from '@expo-google-fonts/koulen';
import { Oswald_700Bold } from '@expo-google-fonts/oswald';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import AppNavigator from './src/navigation';
import { FontProvider } from './src/context/FontContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    Koulen_400Regular,
    Oswald_700Bold,
    BebasNeue_400Regular,
    Anton_400Regular,
    RussoOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#080808', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#7B2FBE" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FontProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </FontProvider>
    </GestureHandlerRootView>
  );
}
