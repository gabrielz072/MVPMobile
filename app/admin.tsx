
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/contexts/AuthContext';

const ADMIN_EMAIL = 'adminmvp@email.com';

const CORES = {
  fundo: '#F8F4F0',
  verdeEscuro: '#1A481F',
  verde: '#246D2C',
  verdeClaro: '#2F8F3A',
  texto: '#263B29',
  textoSecundario: '#7B8278',
  branco: '#FFFFFF',
  borda: '#E8E9E0',
};

type AreaAdministrativaProps = {
  titulo: string;
  descricao: string;
  icone: React.ComponentProps<typeof Ionicons>['name'];
  corFundo: string;
  destino: string;
};

function AreaAdministrativa({
  titulo,
  descricao,
  icone,
  corFundo,
  destino,
}: AreaAdministrativaProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.areaCard,
        pressed && styles.areaCardPressed,
      ]}
      onPress={() => router.push(destino as any)}
    >
      <View style={[styles.areaIcone, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={25} color={CORES.verde} />
      </View>

      <View style={styles.areaInfo}>
        <Text style={styles.areaTitulo}>{titulo}</Text>
        <Text style={styles.areaDescricao}>{descricao}</Text>

        <View style={styles.gerenciar}>
          <Text style={styles.gerenciarTexto}>ACESSAR GERENCIAMENTO</Text>
          <Ionicons name="arrow-forward" size={14} color={CORES.verde} />
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#A1AA9D" />
    </Pressable>
  );
}

export default function AdminScreen() {
  const { user } = useAuth();

  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      setAutorizado(false);
      setVerificando(false);
      router.replace('/login');
      return;
    }

    if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
      setAutorizado(false);
      setVerificando(false);

      Alert.alert(
        'Acesso restrito',
        'Esta área está disponível somente para a conta administradora.',
        [{ text: 'Voltar', onPress: () => router.replace('/') }],
      );

      return;
    }

    setAutorizado(true);
    setVerificando(false);
  }, [user]);

  if (verificando || !autorizado) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={styles.loading}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={CORES.verdeEscuro}
          />

          <View style={styles.loadingIcone}>
            <Ionicons name="leaf" size={30} color="#C9E5B8" />
          </View>

          <ActivityIndicator size="large" color="#C9E5B8" />

          <Text style={styles.loadingTexto}>
            Verificando acesso administrativo...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={CORES.verdeEscuro}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.marca}>
                <Ionicons name="leaf" size={25} color={CORES.verdeEscuro} />
              </View>

              <View style={styles.status}>
                <View style={styles.statusPonto} />
                <Text style={styles.statusTexto}>ÁREA RESTRITA</Text>
              </View>
            </View>

            <Text style={styles.marcaTexto}>CIRCUITO TERÊ VERDE</Text>

            <Text style={styles.tituloPrincipal}>
              Painel de{'\n'}controle
            </Text>

            <Text style={styles.descricaoPrincipal}>
              Gerencie os conteúdos e mantenha viva a experiência de explorar
              as belezas naturais de Teresópolis.
            </Text>

            <View style={styles.linhaDecorativa} />

            <View style={styles.contaCard}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color={CORES.verdeEscuro} />
              </View>

              <View style={styles.contaInfo}>
                <Text style={styles.contaLegenda}>
                  SESSÃO ADMINISTRATIVA
                </Text>
                <Text style={styles.contaEmail} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>

              <Ionicons
                name="shield-checkmark"
                size={23}
                color="#C9E5B8"
              />
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionOverline}>ADMINISTRAÇÃO</Text>
                <Text style={styles.sectionTitulo}>Central de gestão</Text>
                <Text style={styles.sectionDescricao}>
                  Selecione uma área para administrar.
                </Text>
              </View>

              <View style={styles.sectionIcone}>
                <Ionicons
                  name="grid-outline"
                  size={21}
                  color={CORES.verde}
                />
              </View>
            </View>

            <AreaAdministrativa
              titulo="Eventos"
              descricao="Edite, organize e atualize os eventos de Teresópolis."
              icone="calendar-outline"
              corFundo="#E5EFDF"
              destino="/eventos"
            />

            <AreaAdministrativa
              titulo="Trilhas e destinos"
              descricao="Gerencie informações, descrições e atrações naturais."
              icone="trail-sign-outline"
              corFundo="#EAEBD9"
              destino="/admin-trilhas"
            />

            <AreaAdministrativa
              titulo="Natureza"
              descricao="Atualize textos, imagens e conteúdos ambientais."
              icone="leaf-outline"
              corFundo="#DDECE6"
              destino="/admin-natureza"
            />

            <View style={styles.securityCard}>
              <View style={styles.securityIcone}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color={CORES.verde}
                />
              </View>

              <View style={styles.securityInfo}>
                <Text style={styles.securityTitulo}>
                  Segurança administrativa
                </Text>

                <Text style={styles.securityTexto}>
                  Sua sessão está protegida pela conta autorizada. Em
                  dispositivos compartilhados, lembre-se de encerrar sua
                  sessão ao finalizar.
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.homeButton,
                pressed && styles.homeButtonPressed,
              ]}
              onPress={() => router.replace('/')}
            >
              <Ionicons
                name="arrow-back"
                size={18}
                color={CORES.verdeEscuro}
              />
              <Text style={styles.homeButtonTexto}>
                Voltar ao aplicativo
              </Text>
            </Pressable>

            <View style={styles.footer}>
              <View style={styles.footerLinha} />
              <Text style={styles.footerTexto}>CIRCUITO TERÊ VERDE</Text>
              <Text style={styles.footerSubtexto}>
                ÁREA ADMINISTRATIVA
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },

  loading: {
    flex: 1,
    backgroundColor: CORES.verdeEscuro,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },

  loadingIcone: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: '#315B35',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  loadingTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 0.3,
  },

  scrollContent: {
    paddingTop: 24, 
    paddingBottom: 32,
  },

  header: {
    backgroundColor: CORES.verdeEscuro,
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 27,
  },

  marca: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: '#C9E5B8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#284B2E',
    borderWidth: 1,
    borderColor: '#466A49',
    borderRadius: 30,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  statusPonto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B9E69B',
  },

  statusTexto: {
    color: '#D7EACF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  marcaTexto: {
    color: '#B9E69B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2.5,
    marginBottom: 12,
  },

  tituloPrincipal: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 39,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 12,
  },

  descricaoPrincipal: {
    color: '#D0DDCD',
    fontSize: 13,
    lineHeight: 21,
    maxWidth: 310,
  },

  linhaDecorativa: {
    width: 42,
    height: 3,
    backgroundColor: '#B9E69B',
    borderRadius: 5,
    marginTop: 22,
  },

  contaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25472C',
    borderWidth: 1,
    borderColor: '#3C6041',
    borderRadius: 18,
    padding: 13,
    marginTop: 23,
    gap: 12,
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#DCEED5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  contaInfo: {
    flex: 1,
  },

  contaLegenda: {
    color: '#B9D1B7',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },

  contaEmail: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 29,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  sectionOverline: {
    color: CORES.verde,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 7,
  },

  sectionTitulo: {
    color: CORES.verdeEscuro,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 5,
  },

  sectionDescricao: {
    color: CORES.textoSecundario,
    fontSize: 12,
  },

  sectionIcone: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: '#E6EDDF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  areaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.branco,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 15,
    marginBottom: 13,
    gap: 13,
    shadowColor: '#263B29',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 2,
  },

  areaCardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  areaIcone: {
    width: 51,
    height: 51,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

  areaInfo: {
    flex: 1,
  },

  areaTitulo: {
    color: CORES.verdeEscuro,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 5,
  },

  areaDescricao: {
    color: CORES.textoSecundario,
    fontSize: 11,
    lineHeight: 17,
    marginBottom: 10,
  },

  gerenciar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  gerenciarTexto: {
    color: CORES.verde,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  securityCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 13,
    backgroundColor: '#E9EFE4',
    borderRadius: 19,
    padding: 17,
    marginTop: 9,
    marginBottom: 22,
  },

  securityIcone: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: '#D8E7D0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  securityInfo: {
    flex: 1,
  },

  securityTitulo: {
    color: CORES.verdeEscuro,
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 7,
  },

  securityTexto: {
    color: '#647362',
    fontSize: 11,
    lineHeight: 18,
  },

  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#C9D5C4',
    borderRadius: 16,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },

  homeButtonPressed: {
    backgroundColor: '#E9EFE4',
  },

  homeButtonTexto: {
    color: CORES.verdeEscuro,
    fontSize: 13,
    fontWeight: '800',
  },

  footer: {
    alignItems: 'center',
    marginTop: 27,
  },

  footerLinha: {
    width: 35,
    height: 2,
    borderRadius: 5,
    backgroundColor: '#B9C9B1',
    marginBottom: 12,
  },

  footerTexto: {
    color: CORES.verde,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },

  footerSubtexto: {
    color: '#9A9F95',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 5,
  },
});
