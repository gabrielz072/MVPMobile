import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export function UserAccountBar() {
  const { user, userName, logout } = useAuth();

  if (!user) return null;

  async function sair() {
    await logout();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>Olá, {userName || 'usuário'}!</Text>
      <Pressable style={styles.button} onPress={sair}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'flex-end', alignSelf: 'flex-end', marginBottom: 24 },
  name: { color: '#2E5D3B', fontSize: 17, fontWeight: 'bold', marginBottom: 10, textAlign: 'right' },
  button: { borderColor: '#2E5D3B', borderWidth: 1, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 9 },
  buttonText: { color: '#2E5D3B', fontSize: 15, fontWeight: 'bold' },
});