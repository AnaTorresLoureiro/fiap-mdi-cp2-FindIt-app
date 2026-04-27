import { Stack } from 'expo-router';
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { ReportProvider } from '../context/reportContext';
import { AuthProvider, useAuth } from '../context/authContext';

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

function RootLayoutContent() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      applyGlobalTypography();
    }
  }, [fontsLoaded]);

  const { isHydrated, isAuthenticated } = useAuth();

  if (!fontsLoaded) {
    return null;
  }

  if (!isHydrated) {
    return null;
  }

  const initialRoute = isAuthenticated ? 'tabs' : 'auth/login';

  return (
    <ReportProvider>
      <Stack
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="tabs" />

      </Stack>
    </ReportProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}