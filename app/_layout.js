import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { ReportProvider } from '../context/reportContext';

let typographyConfigured = false;

function applyGlobalTypography() {
  if (typographyConfigured) {
    return;
  }

  const textBaseStyle = { fontFamily: 'Montserrat_400Regular' };

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [textBaseStyle, Text.defaultProps.style];

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = [textBaseStyle, TextInput.defaultProps.style];

  typographyConfigured = true;
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      applyGlobalTypography();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ReportProvider>
      <Tabs
        initialRouteName="auth/login"
        screenOptions={{
          tabBarActiveTintColor: '#E83D84',
          headerShown: false,
          tabBarLabelStyle: { fontFamily: 'Montserrat_600SemiBold' },
        }}
      >

      <Tabs.Screen
        name="tabs/item/[type]"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="tabs/success/[type]"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Relatar item',
          tabBarIcon: ({ color }) => (
            <Ionicons name="clipboard-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tabs/history"
        options={{
          title: 'Itens registrados',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={24} color={color} />
          ),
        }}
      />

      </Tabs>
    </ReportProvider>
  );
}