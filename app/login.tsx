import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function fazerLogin() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    Alert.alert('Login', 'Login preenchido com sucesso!');
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
        style={styles.button}
        onPress={fazerLogin}
      >
        <Text style={styles.buttonText}>
          Entrar
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