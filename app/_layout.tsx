import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="eventos" options={{ headerShown: false }} />
          <Stack.Screen name="natureza" options={{ headerShown: false }} />
          <Stack.Screen name="trilha" options={{ headerShown: false }} />
          <Stack.Screen name="trilhas" options={{ headerShown: false }} />
          <Stack.Screen name="pedra-do-sino" options={{ headerShown: false }} />
          <Stack.Screen name="escalavrado" options={{ headerShown: false }} />
          <Stack.Screen name="pedra-do-acu" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
