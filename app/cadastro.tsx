import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

const VERDE = '#1A481F';
const VERDE_MEDIO = '#246D2C';
const FUNDO = '#F8F4F0';
const TEXTO = '#26372A';
const CINZA = '#788078';

const CAPA =
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [cadastrando, setCadastrando] = useState(false);

  const { register } = useAuth();

  async function cadastrar() {
    if (
      !nome.trim() ||
      !sobrenome.trim() ||
      !email.trim() ||
      !senha
    ) {
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

    setCadastrando(true);

    try {
      await register(
        `${nome.trim()} ${sobrenome.trim()}`,
        email.trim(),
        senha
      );

      Alert.alert('Cadastro', 'Conta criada com sucesso.', [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ]);
    } catch {
      Alert.alert(
        'Não foi possível cadastrar',
        'Esse e-mail pode já estar em uso. Verifique os dados e tente novamente.'
      );
    } finally {
      setCadastrando(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* REMOVE O CABEÇALHO PADRÃO DO EXPO ROUTER */}
      <Stack.Screen options={{ headerShown: false }} />

      <StatusBar
        barStyle="light-content"
        backgroundColor={VERDE}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          {/* CAPA */}
          <ImageBackground
            source={{ uri: CAPA }}
            style={styles.capa}
            imageStyle={styles.imagemCapa}
          >
            <View style={styles.overlay} />

            {/* BOTÃO DE VOLTAR TRANSPARENTE */}
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.marca}>
              <Ionicons
                name="leaf-outline"
                size={27}
                color="#FFFFFF"
              />

              <Text style={styles.marcaTexto}>CIRCUITO</Text>

              <Text style={styles.marcaDestaque}>
                TERÊ VERDE
              </Text>

              <View style={styles.linhaMarca} />

              <Text style={styles.subtituloMarca}>
                SUA CONEXÃO COM A NATUREZA
              </Text>
            </View>

            <View style={styles.textoCapa}>
              <Text style={styles.fraseCapa}>
                Faça parte dessa jornada.
              </Text>

              <Text style={styles.descricaoCapa}>
                Descubra novas experiências em Teresópolis.
              </Text>
            </View>
          </ImageBackground>

          {/* FORMULÁRIO */}
          <View style={styles.conteudo}>
            <View style={styles.cartao}>
              <View style={styles.iconeTopo}>
                <Ionicons
                  name="person-add-outline"
                  size={25}
                  color={VERDE_MEDIO}
                />
              </View>

              <Text style={styles.miniTitulo}>
                JUNTE-SE A NÓS
              </Text>

              <Text style={styles.titulo}>
                Criar conta
              </Text>

              <Text style={styles.descricao}>
                Cadastre-se para explorar, descobrir e viver o melhor do Circuito Terê Verde.
              </Text>

              {/* NOME */}
              <Text style={styles.label}>Nome</Text>

              <View style={styles.campo}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={VERDE_MEDIO}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Digite seu nome"
                  placeholderTextColor="#A0A69F"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!cadastrando}
                  returnKeyType="next"
                />
              </View>

              {/* SOBRENOME */}
              <Text style={styles.label}>Sobrenome</Text>

              <View style={styles.campo}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={VERDE_MEDIO}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Digite seu sobrenome"
                  placeholderTextColor="#A0A69F"
                  value={sobrenome}
                  onChangeText={setSobrenome}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!cadastrando}
                  returnKeyType="next"
                />
              </View>

              {/* E-MAIL */}
              <Text style={styles.label}>E-mail</Text>

              <View style={styles.campo}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={VERDE_MEDIO}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#A0A69F"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!cadastrando}
                  returnKeyType="next"
                />
              </View>

              {/* SENHA */}
              <Text style={styles.label}>Senha</Text>

              <View style={styles.campo}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={VERDE_MEDIO}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Crie uma senha"
                  placeholderTextColor="#A0A69F"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry={!mostrarSenha}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!cadastrando}
                  returnKeyType="done"
                  onSubmitEditing={cadastrar}
                />

                <TouchableOpacity
                  onPress={() => setMostrarSenha(!mostrarSenha)}
                  disabled={cadastrando}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={21}
                    color={CINZA}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.avisoSenha}>
                A senha deve possuir pelo menos 6 caracteres.
              </Text>

              {/* BOTÃO CADASTRAR */}
              <Pressable
                style={[
                  styles.botaoCadastrar,
                  cadastrando && styles.botaoDesabilitado,
                ]}
                onPress={cadastrar}
                disabled={cadastrando}
              >
                {cadastrando ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.textoBotaoCadastrar}>
                      Criar minha conta
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={19}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </Pressable>

              {/* LINK PARA LOGIN */}
              <View style={styles.divisor}>
                <View style={styles.linhaDivisor} />

                <Text style={styles.textoDivisor}>OU</Text>

                <View style={styles.linhaDivisor} />
              </View>

              <Text style={styles.textoLogin}>
                Já possui uma conta?
              </Text>

              <TouchableOpacity
                style={styles.botaoLogin}
                onPress={() => router.push('/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBotaoLogin}>
                  Entrar na minha conta
                </Text>

                <Ionicons
                  name="log-in-outline"
                  size={19}
                  color={VERDE_MEDIO}
                />
              </TouchableOpacity>
            </View>

            {/* RODAPÉ */}
            <View style={styles.rodape}>
              <Ionicons
                name="leaf"
                size={17}
                color={VERDE_MEDIO}
              />

              <Text style={styles.textoRodape}>
                Mais que conhecer lugares, é viver experiências.
              </Text>

              <Text style={styles.assinatura}>
                TERESÓPOLIS · RIO DE JANEIRO
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 35,
  },

  // CAPA
  capa: {
    height: 330,
    justifyContent: 'space-between',
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  imagemCapa: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 28, 15, 0.55)',
  },
  botaoVoltar: {
    position: 'absolute',
    top: 48,
    left: 22,
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  marca: {
    alignItems: 'center',
  },
  marcaTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 5,
    fontWeight: '300',
    marginTop: 8,
  },
  marcaDestaque: {
    color: '#FFFFFF',
    fontSize: 27,
    letterSpacing: 3,
    fontWeight: 'bold',
    marginTop: 3,
  },
  linhaMarca: {
    width: 42,
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 11,
  },
  subtituloMarca: {
    color: '#E1EBDD',
    fontSize: 9,
    letterSpacing: 2.5,
  },
  textoCapa: {
    alignItems: 'center',
  },
  fraseCapa: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  descricaoCapa: {
    color: '#E4E9E1',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },

  // CONTEÚDO
  conteudo: {
    paddingHorizontal: 20,
    marginTop: -25,
  },
  cartao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 23,
    elevation: 6,
    shadowColor: '#183B20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconeTopo: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#EDF3E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  miniTitulo: {
    color: VERDE_MEDIO,
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  titulo: {
    color: VERDE,
    fontSize: 27,
    fontWeight: 'bold',
    marginTop: 6,
  },
  descricao: {
    color: CINZA,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    marginBottom: 15,
  },

  // CAMPOS
  label: {
    color: TEXTO,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  campo: {
    minHeight: 53,
    backgroundColor: '#FAFBF9',
    borderWidth: 1,
    borderColor: '#E1E7DE',
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  input: {
    flex: 1,
    color: TEXTO,
    fontSize: 14,
    minHeight: 50,
    paddingVertical: 0,
  },
  avisoSenha: {
    color: CINZA,
    fontSize: 11,
    marginTop: 9,
  },

  // BOTÃO CADASTRAR
  botaoCadastrar: {
    minHeight: 53,
    backgroundColor: VERDE,
    borderRadius: 13,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 25,
    elevation: 2,
  },
  botaoDesabilitado: {
    opacity: 0.65,
  },
  textoBotaoCadastrar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // LOGIN
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginTop: 25,
    marginBottom: 20,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8ECE5',
  },
  textoDivisor: {
    color: '#9AA198',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textoLogin: {
    color: CINZA,
    fontSize: 12,
    textAlign: 'center',
  },
  botaoLogin: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#DCE6D8',
    borderRadius: 12,
    backgroundColor: '#F8FAF6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  textoBotaoLogin: {
    color: VERDE_MEDIO,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // RODAPÉ
  rodape: {
    alignItems: 'center',
    marginTop: 27,
    paddingHorizontal: 10,
  },
  textoRodape: {
    color: VERDE,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
  assinatura: {
    color: CINZA,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 10,
  },
});