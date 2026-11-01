
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useFavoritos } from '@/hooks/useFavoritos';

const VERDE = '#1A481F';
const VERDE_MEDIO = '#246D2C';
const FUNDO = '#F8F4F0';
const TEXTO = '#26372A';
const CINZA = '#788078';

const CAPA =
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200';

export default function PerfilScreen() {
  const { user, userName, photoURL, updateUserProfile } = useAuth();
  const { favoritos, carregando } = useFavoritos();

  const [modalEdicao, setModalEdicao] = useState(false);
  const [nomeEditado, setNomeEditado] = useState('');
  const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  const nome =
    userName ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Explorador da natureza';

  const inicial = nome.charAt(0).toUpperCase();

  const totalFavoritos =
    favoritos.trilhas.length +
    favoritos.natureza.length +
    favoritos.eventos.length;

  function abrirEdicao() {
    setNomeEditado(nome);
    setFotoSelecionada(null);
    setModalEdicao(true);
  }

  async function escolherFoto() {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Precisamos de acesso à galeria para você escolher uma foto.'
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets.length > 0) {
        setFotoSelecionada(resultado.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  }

  async function salvarPerfil() {
    if (!nomeEditado.trim()) {
      Alert.alert('Atenção', 'Digite seu nome antes de salvar.');
      return;
    }

    try {
      setSalvando(true);

      await updateUserProfile(
        nomeEditado.trim(),
        fotoSelecionada || undefined
      );

      setModalEdicao(false);
      setFotoSelecionada(null);

      Alert.alert(
        'Perfil atualizado!',
        'Suas informações foram salvas com sucesso.'
      );
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);

      Alert.alert(
        'Não foi possível salvar',
        'Ocorreu um erro ao atualizar seu perfil. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* CAPA */}
        <ImageBackground
          source={{ uri: CAPA }}
          style={styles.capa}
          imageStyle={styles.imagemCapa}
        >
          <View style={styles.overlay} />

          <View style={styles.topoCapa}>
            <Text style={styles.marca}>CIRCUITO</Text>
            <Text style={styles.marcaDestaque}>TERÊ VERDE</Text>
            <View style={styles.linhaMarca} />
            <Text style={styles.subtituloCapa}>
              SUA CONEXÃO COM A NATUREZA
            </Text>
          </View>

          <View style={styles.textoCapa}>
            <Text style={styles.fraseCapa}>
              A natureza espera{' '}
              {'\n'}
              por você.
            </Text>
            <Text style={styles.descricaoCapa}>
              Descubra, explore e viva Teresópolis.
            </Text>
          </View>

          <View style={styles.indicadorCapa}>
            <Ionicons name="leaf-outline" size={17} color="#FFFFFF" />
            <Text style={styles.textoIndicador}>
              SERRA DOS ÓRGÃOS
            </Text>
          </View>
        </ImageBackground>

        {/* CONTEÚDO */}
        <View style={styles.conteudo}>
          {/* PERFIL */}
          <View style={styles.cartaoPerfil}>
            <View style={styles.avatar}>
              {photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  style={styles.avatarImagem}
                />
              ) : (
                <Text style={styles.avatarTexto}>
                  {user ? inicial : '?'}
                </Text>
              )}
            </View>

            <View style={styles.infoPerfil}>
              <Text style={styles.rotulo}>
                {user ? 'BEM-VINDO DE VOLTA' : 'ÁREA DO VISITANTE'}
              </Text>

              <Text style={styles.nomePerfil} numberOfLines={1}>
                {user ? nome : 'Sua jornada começa aqui'}
              </Text>

              <Text style={styles.emailPerfil} numberOfLines={1}>
                {user?.email || 'Entre ou crie sua conta gratuitamente'}
              </Text>
            </View>

            {user && (
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={abrirEdicao}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="create-outline"
                  size={21}
                  color={VERDE_MEDIO}
                />
                <Text style={styles.textoBotaoEditar}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ACESSO À CONTA */}
          {!user && (
            <View style={styles.acessoConta}>
              <View style={styles.acessoTexto}>
                <Text style={styles.acessoTitulo}>
                  Faça parte dessa experiência
                </Text>
                <Text style={styles.acessoDescricao}>
                  Acesse sua conta para salvar seus lugares favoritos
                  e aproveitar o Circuito Terê Verde.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.botaoEntrar}
                onPress={() => router.push('/login')}
                activeOpacity={0.85}
              >
                <Text style={styles.botaoEntrarTexto}>
                  Entrar na minha conta
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/cadastro')}
                style={styles.botaoCadastro}
              >
                <Text style={styles.botaoCadastroTexto}>
                  Ainda não tem conta? Cadastre-se
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* SEUS FAVORITOS */}
          <View style={styles.secao}>
            <View style={styles.tituloSecao}>
              <View>
                <Text style={styles.miniTitulo}>
                  SUA COLEÇÃO PESSOAL
                </Text>
                <Text style={styles.titulo}>
                  Seus favoritos
                </Text>
              </View>

              <Ionicons name="heart" size={27} color="#D94B50" />
            </View>

            <Text style={styles.introducaoFavoritos}>
              Guarde os lugares e experiências que deseja conhecer
              em Teresópolis.
            </Text>

            <TouchableOpacity
              style={styles.opcao}
              onPress={() => router.push('/favoritos')}
              activeOpacity={0.8}
            >
              <View style={styles.iconeFavoritos}>
                <Ionicons
                  name="heart"
                  size={24}
                  color="#D94B50"
                />
              </View>

              <View style={styles.textoOpcao}>
                <Text style={styles.nomeOpcao}>
                  Ver meus favoritos
                </Text>

                <Text style={styles.descOpcao}>
                  {!user
                    ? 'Entre para salvar e acessar seus favoritos'
                    : carregando
                      ? 'Carregando seus favoritos...'
                      : totalFavoritos === 0
                        ? 'Você ainda não salvou nenhum item'
                        : `${totalFavoritos} ${totalFavoritos === 1 ? 'item salvo' : 'itens salvos'} na sua coleção`}
                </Text>
              </View>

              {user && !carregando && (
                <View style={styles.contador}>
                  <Text style={styles.contadorTexto}>
                    {totalFavoritos}
                  </Text>
                </View>
              )}

              <Ionicons
                name="chevron-forward"
                size={21}
                color={CINZA}
              />
            </TouchableOpacity>

            {!user && (
              <Text style={styles.avisoFavoritos}>
                Entre na sua conta para manter seus favoritos salvos
                e acessá-los quando quiser.
              </Text>
            )}
          </View>

          {/* FRASE INSTITUCIONAL */}
          <View style={styles.fraseFinal}>
            <Ionicons name="leaf" size={20} color="#D6E3D0" />
            <Text style={styles.fraseFinalTexto}>
              Mais que conhecer lugares, é viver experiências.
            </Text>
            <Text style={styles.assinatura}>
              CIRCUITO TERÊ VERDE
            </Text>
          </View>

          <Text style={styles.rodape}>
            TERESÓPOLIS · RIO DE JANEIRO
          </Text>
        </View>
      </ScrollView>

      {/* MODAL DE EDIÇÃO DO PERFIL */}
      <Modal
        visible={modalEdicao}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!salvando) setModalEdicao(false);
        }}
      >
        <View style={styles.fundoModal}>
          <View style={styles.modal}>
            <View style={styles.topoModal}>
              <View>
                <Text style={styles.tituloModal}>Editar perfil</Text>
                <Text style={styles.subtituloModal}>
                  Atualize suas informações pessoais
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setModalEdicao(false)}
                disabled={salvando}
                style={styles.fecharModal}
              >
                <Ionicons name="close" size={23} color={VERDE} />
              </TouchableOpacity>
            </View>

            {/* FOTO */}
            <TouchableOpacity
              style={styles.areaFoto}
              onPress={escolherFoto}
              disabled={salvando}
              activeOpacity={0.8}
            >
              <View style={styles.avatarEdicao}>
                {fotoSelecionada || photoURL ? (
                  <Image
                    source={{
                      uri: fotoSelecionada || photoURL || '',
                    }}
                    style={styles.imagemEdicao}
                  />
                ) : (
                  <Text style={styles.avatarTextoEdicao}>
                    {nomeEditado.charAt(0).toUpperCase() || '?'}
                  </Text>
                )}

                <View style={styles.iconeCamera}>
                  <Ionicons
                    name="camera"
                    size={17}
                    color="#FFFFFF"
                  />
                </View>
              </View>

              <Text style={styles.textoAlterarFoto}>
                Alterar foto de perfil
              </Text>
              <Text style={styles.dicaFoto}>
                Escolha uma imagem da sua galeria
              </Text>
            </TouchableOpacity>

            {/* NOME */}
            <Text style={styles.labelCampo}>Nome de exibição</Text>

            <View style={styles.campoNome}>
              <Ionicons
                name="person-outline"
                size={19}
                color={VERDE_MEDIO}
              />

              <TextInput
                style={styles.inputNome}
                value={nomeEditado}
                onChangeText={setNomeEditado}
                placeholder="Digite seu nome"
                placeholderTextColor="#999999"
                maxLength={60}
                editable={!salvando}
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>

            {/* E-MAIL */}
            <Text style={styles.labelCampo}>E-mail da conta</Text>

            <View style={[styles.campoNome, styles.campoDesabilitado]}>
              <Ionicons
                name="mail-outline"
                size={19}
                color={CINZA}
              />
              <Text style={styles.emailModal}>
                {user?.email || ''}
              </Text>
            </View>

            <Text style={styles.avisoEmail}>
              O e-mail não pode ser alterado nesta tela.
            </Text>

            {/* BOTÕES */}
            <TouchableOpacity
              style={[
                styles.botaoSalvar,
                salvando && styles.botaoDesabilitado,
              ]}
              onPress={salvarPerfil}
              disabled={salvando}
              activeOpacity={0.85}
            >
              {salvando ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.textoSalvar}>
                    Salvar alterações
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => setModalEdicao(false)}
              disabled={salvando}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FUNDO,
  },
  scroll: {
    paddingBottom: 115,
  },
  capa: {
    height: 390,
    justifyContent: 'space-between',
    paddingTop: 65,
    paddingHorizontal: 25,
    paddingBottom: 25,
    overflow: 'hidden',
  },
  imagemCapa: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 28, 15, 0.48)',
  },
  topoCapa: {
    alignItems: 'center',
  },
  marca: {
    color: '#FFFFFF',
    fontSize: 14,
    letterSpacing: 6,
    fontWeight: '300',
  },
  marcaDestaque: {
    color: '#FFFFFF',
    fontSize: 28,
    letterSpacing: 4,
    fontWeight: 'bold',
    marginTop: 3,
  },
  linhaMarca: {
    width: 42,
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 12,
  },
  subtituloCapa: {
    color: '#E1EBDD',
    fontSize: 9,
    letterSpacing: 3,
  },
  textoCapa: {
    marginBottom: 15,
  },
  fraseCapa: {
    color: '#FFFFFF',
    fontSize: 37,
    lineHeight: 43,
    fontWeight: '600',
    letterSpacing: -1,
  },
  descricaoCapa: {
    color: '#E4E9E1',
    fontSize: 14,
    marginTop: 12,
  },
  indicadorCapa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textoIndicador: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  conteudo: {
    paddingHorizontal: 20,
    marginTop: -22,
  },
  cartaoPerfil: {
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#183B20',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.09,
    shadowRadius: 9,
  },
  avatar: {
    width: 57,
    height: 57,
    borderRadius: 30,
    backgroundColor: '#E5EDE2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImagem: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  avatarTexto: {
    fontSize: 25,
    fontWeight: 'bold',
    color: VERDE,
  },
  infoPerfil: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },
  rotulo: {
    color: VERDE_MEDIO,
    fontSize: 9,
    letterSpacing: 1.4,
    fontWeight: 'bold',
  },
  nomePerfil: {
    color: TEXTO,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emailPerfil: {
    color: CINZA,
    fontSize: 11,
    marginTop: 4,
  },
  botaoEditar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  textoBotaoEditar: {
    color: VERDE_MEDIO,
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  acessoConta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 19,
    marginTop: 18,
  },
  acessoTexto: {
    marginBottom: 16,
  },
  acessoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: VERDE,
  },
  acessoDescricao: {
    color: CINZA,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  botaoEntrar: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  botaoEntrarTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  botaoCadastro: {
    alignItems: 'center',
    paddingTop: 15,
  },
  botaoCadastroTexto: {
    color: VERDE_MEDIO,
    fontSize: 12,
    fontWeight: '600',
  },
  secao: {
    marginTop: 30,
  },
  tituloSecao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    marginTop: 3,
  },
  introducaoFavoritos: {
    color: CINZA,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 15,
  },
  opcao: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconeFavoritos: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F9E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoOpcao: {
    flex: 1,
    marginLeft: 13,
    marginRight: 8,
  },
  nomeOpcao: {
    color: TEXTO,
    fontSize: 14,
    fontWeight: 'bold',
  },
  descOpcao: {
    color: CINZA,
    fontSize: 11,
    marginTop: 5,
  },
  contador: {
    minWidth: 27,
    height: 27,
    paddingHorizontal: 7,
    borderRadius: 14,
    backgroundColor: '#F0F3ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  contadorTexto: {
    color: VERDE,
    fontSize: 11,
    fontWeight: 'bold',
  },
  avisoFavoritos: {
    color: CINZA,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 15,
  },
  fraseFinal: {
    backgroundColor: VERDE,
    borderRadius: 19,
    padding: 22,
    alignItems: 'center',
    marginTop: 25,
  },
  fraseFinalTexto: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    marginTop: 12,
  },
  assinatura: {
    color: '#C9D8C4',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 15,
  },
  rodape: {
    color: CINZA,
    fontSize: 9,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 22,
  },

  // MODAL DE EDIÇÃO
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 430,
    backgroundColor: FUNDO,
    borderRadius: 22,
    padding: 22,
  },
  topoModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tituloModal: {
    color: VERDE,
    fontSize: 23,
    fontWeight: 'bold',
  },
  subtituloModal: {
    color: CINZA,
    fontSize: 12,
    marginTop: 5,
  },
  fecharModal: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#E8EDE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  areaFoto: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 25,
  },
  avatarEdicao: {
    width: 105,
    height: 105,
    borderRadius: 55,
    backgroundColor: '#E5EDE2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imagemEdicao: {
    width: '100%',
    height: '100%',
  },
  avatarTextoEdicao: {
    fontSize: 42,
    fontWeight: 'bold',
    color: VERDE,
  },
  iconeCamera: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 31,
    height: 31,
    borderRadius: 17,
    backgroundColor: VERDE_MEDIO,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: FUNDO,
  },
  textoAlterarFoto: {
    color: VERDE_MEDIO,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 11,
  },
  dicaFoto: {
    color: CINZA,
    fontSize: 11,
    marginTop: 4,
  },
  labelCampo: {
    color: TEXTO,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 13,
  },
  campoNome: {
    height: 49,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E7DE',
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputNome: {
    flex: 1,
    color: TEXTO,
    fontSize: 14,
    height: '100%',
  },
  campoDesabilitado: {
    backgroundColor: '#EEF0EC',
  },
  emailModal: {
    flex: 1,
    color: CINZA,
    fontSize: 13,
  },
  avisoEmail: {
    color: CINZA,
    fontSize: 10,
    marginTop: 6,
  },
  botaoSalvar: {
    backgroundColor: VERDE,
    borderRadius: 12,
    minHeight: 49,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  textoSalvar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  textoCancelar: {
    color: CINZA,
    fontSize: 13,
    fontWeight: '600',
  },
});
