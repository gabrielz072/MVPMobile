import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  const { login } = useAuth();

  async function fazerLogin() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setEntrando(true);
    try {
      await login(email, senha);
      router.replace('/');
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : '';
      const mensagens: Record<string, string> = {
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/wrong-password': 'E-mail ou senha incorretos.',
        'auth/user-not-found': 'Não existe uma conta com esse e-mail.',
        'auth/invalid-email': 'Digite um endereço de e-mail válido.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde e tente novamente.',
        'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
        'auth/operation-not-allowed':
          'O login por e-mail e senha não está habilitado no Firebase.',
      };
      Alert.alert(
        'Não foi possível entrar',
        mensagens[code] ?? 'Ocorreu um erro inesperado. Tente novamente.',
      );
    } finally {
      setEntrando(false);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>
        Circuito Terê Verde
      </Text>

      <Text style={styles.title}>
        Entrar
      </Text>

      <Text style={styles.label}>
        E-mail
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>
        Senha
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, entrando && styles.buttonDisabled]}
        onPress={fazerLogin}
        disabled={entrando}
      >
        <Text style={styles.buttonText}>
          {entrando ? 'Entrando...' : 'Entrar'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/cadastro')}
      >
        <Text style={styles.link}>
          Ainda não possui uma conta? Cadastre-se
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9F5',
    padding: 24,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E5D3B',
    textAlign: 'center',
    marginBottom: 40,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5DDD3',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#2E5D3B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  link: {
    textAlign: 'center',
    color: '#2E5D3B',
    fontSize: 15,
  },
});