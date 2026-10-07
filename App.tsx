/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {AuthProvider} from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator/>
          </NavigationContainer>
        </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
