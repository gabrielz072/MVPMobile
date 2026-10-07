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
      <View style={styles.accountInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(userName || 'U').trim().charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.caption}>LOGADO COMO</Text>
          <Text style={styles.name} numberOfLines={1}>
            {userName || 'usuário'}
          </Text>
        </View>
      </View>
      <Pressable style={styles.button} onPress={sair}>
        <Text style={styles.buttonText}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderColor: '#E1E7DD',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  accountInfo: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: 12,
    minWidth: 0,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#E8F0E8',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    marginRight: 10,
    width: 36,
  },
  avatarText: { color: '#2E5D3B', fontSize: 16, fontWeight: 'bold' },
  userDetails: { flex: 1, minWidth: 0 },
  caption: { color: '#687568', fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  name: { color: '#263B2B', fontSize: 14, fontWeight: 'bold' },
  button: {
    backgroundColor: '#F1F4EF',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  buttonText: { color: '#2E5D3B', fontSize: 14, fontWeight: 'bold' },
});