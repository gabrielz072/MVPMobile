import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { UserAccountBar } from '@/components/UserAccountBar';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <UserAccountBar />

      <Text style={styles.title}>
        Circuito Terê Verde 🌿
      </Text>

      <Text style={styles.subtitle}>
        Biodiversidade, trilhas, eventos e condições das atrações naturais.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/explore')}
      >
        <Text style={styles.buttonText}>
          Onde ir?
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>
          Entrar / Criar conta
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F5',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E5D3B',
    textAlign: 'center',
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#2E5D3B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

});