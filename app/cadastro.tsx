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

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function cadastrar() {
    if (!nome || !sobrenome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        'Atenção',
        'A senha deve possuir pelo menos 6 caracteres.'
      );
      return;
    }

    Alert.alert(
      'Cadastro',
      'Cadastro preenchido com sucesso!'
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>
        Circuito Terê Verde
      </Text>

      <Text style={styles.title}>
        Criar conta
      </Text>

      <Text style={styles.label}>
        Nome
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>
        Sobrenome
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu sobrenome"
        value={sobrenome}
        onChangeText={setSobrenome}
      />

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
        onPress={cadastrar}
      >
        <Text style={styles.buttonText}>
          Criar conta
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/login')}
      >
        <Text style={styles.link}>
          Já possui uma conta? Entrar
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
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 25,
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
    marginBottom: 15,
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