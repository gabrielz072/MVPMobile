
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
  const { user } = useAuth();
  const { favoritos, carregando } = useFavoritos();

  const nome =
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Explorador da natureza';

  const inicial = nome.charAt(0).toUpperCase();

  const totalFavoritos =
    favoritos.trilhas.length +
    favoritos.natureza.length +
    favoritos.eventos.length;

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
              {user?.photoURL ? (
                <ImageBackground
                  source={{ uri: user.photoURL }}
                  style={styles.avatarImagem}
                  imageStyle={styles.avatarImagemBorda}
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

            <Ionicons
              name="person-circle-outline"
              size={25}
              color={VERDE_MEDIO}
            />
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

            {/* ACESSO À PÁGINA EXCLUSIVA DE FAVORITOS */}
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
  },
  avatarImagemBorda: {
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
});
