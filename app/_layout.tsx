import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function voltarParaInicio({ tintColor }: { tintColor?: string }) {
  return (
    <Pressable
      accessibilityLabel="Voltar para o início"
      accessibilityRole="button"
      hitSlop={12}
      onPress={() => router.replace('/')}
    >
      <Ionicons name="arrow-back" size={24} color={tintColor ?? '#2E5D3B'} />
    </Pressable>
  );
}

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
          <Stack.Screen
            name="login"
            options={{
              title: 'Login',
              headerTitleAlign: 'center',
              headerLeft: voltarParaInicio,
            }}
          />
          <Stack.Screen
            name="cadastro"
            options={{
              title: 'Cadastro',
              headerTitleAlign: 'center',
              headerLeft: voltarParaInicio,
            }}
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
