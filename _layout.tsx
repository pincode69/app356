import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainMenuScreen from './src/screens/MainMenu';
import RunScreen from './src/screens/Run';
import DiscoveryScreen from './src/screens/Discovery';
import SettingsScreen from './src/screens/Settings';
import AboutScreen from './src/screens/About';

export type RootStackParamList = {
  mainMenu: undefined;
  run: { isBonusRun?: boolean } | undefined;
  discovery: undefined;
  settings: undefined;
  about: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  
  return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="mainMenu"
        >
          <Stack.Screen name="mainMenu" component={MainMenuScreen} />
          <Stack.Screen name="run" component={RunScreen} />
          <Stack.Screen name="discovery" component={DiscoveryScreen} />
          <Stack.Screen name="settings" component={SettingsScreen} />
          <Stack.Screen name="about" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default RootNavigator;
