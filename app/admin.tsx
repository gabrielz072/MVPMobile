import { router } from 'expo-router';
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

  function abrirTela(rota: string) {
    router.push(rota as any);
  }

  if (verificando || !autorizado) {
    return (
      <View style={styles.loading}>
        <StatusBar barStyle="light-content" backgroundColor="#12351C" />
        <ActivityIndicator size="large" color="#B9E69B" />
        <Text style={styles.loadingText}>
          Verificando acesso administrativo...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#12351C" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>TV</Text>
            </View>

            <View style={styles.adminBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.adminBadgeText}>ADMINISTRADOR</Text>
            </View>
          </View>

          <Text style={styles.overline}>CIRCUITO TERÊ VERDE</Text>
          <Text style={styles.welcome}>Painel de controle</Text>
          <Text style={styles.headerDescription}>
            Gerencie a experiência de quem explora as belezas de Teresópolis.
          </Text>

          <View style={styles.accountCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>

            <View style={styles.accountInfo}>
              <Text style={styles.accountLabel}>
                Sessão administrativa
              </Text>
              <Text style={styles.accountEmail}>{user?.email}</Text>
            </View>

            <Text style={styles.lock}>✓</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Central de gestão</Text>
            <Text style={styles.sectionSubtitle}>
              Escolha uma área para administrar
            </Text>
          </View>

          <Pressable
            style={styles.featureCard}
            onPress={() => abrirTela('/eventos')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#DCEED5' }]}>
              <Text style={styles.featureEmoji}>▦</Text>
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Eventos</Text>
              <Text style={styles.featureDescription}>
                Edite e organize o conteúdo dos eventos.
              </Text>
              <Text style={styles.featureLink}>GERENCIAR →</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable
            style={styles.featureCard}
            onPress={() => abrirTela('/admin-trilhas')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#E7E6CF' }]}>
              <Text style={styles.featureEmoji}>♧</Text>
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Trilhas e destinos</Text>
              <Text style={styles.featureDescription}>
                Gerencie os textos e as informações das atrações naturais.
              </Text>
              <Text style={styles.featureLink}>GERENCIAR →</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <Pressable
            style={styles.featureCard}
            onPress={() => abrirTela('/admin-natureza')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#D9E9E7' }]}>
              <Text style={styles.featureEmoji}>❧</Text>
            </View>

            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Natureza</Text>
              <Text style={styles.featureDescription}>
                Edite os textos, as imagens e o conteúdo ambiental.
              </Text>
              <Text style={styles.featureLink}>GERENCIAR →</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </Pressable>

          <View style={styles.securityCard}>
            <Text style={styles.securityTitle}>◈ Segurança do painel</Text>
            <Text style={styles.securityText}>
              Você está acessando a área administrativa com a conta
              autorizada. Encerre sua sessão ao terminar em um dispositivo
              compartilhado.
            </Text>
          </View>

          <Pressable
            style={styles.homeButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.homeButtonText}>
              ← Voltar ao aplicativo
            </Text>
          </Pressable>

          <Text style={styles.footer}>
            CIRCUITO TERÊ VERDE · ÁREA ADMINISTRATIVA
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F5EF',
  },
  loading: {
    flex: 1,
    backgroundColor: '#12351C',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  content: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#12351C',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#B9E69B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#12351C',
    fontSize: 20,
    fontWeight: '900',
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#426849',
    backgroundColor: '#1C4828',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#B9E69B',
  },
  adminBadgeText: {
    color: '#D8F0CB',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  overline: {
    color: '#B9E69B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 10,
  },
  welcome: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '900',
    marginBottom: 10,
  },
  headerDescription: {
    color: '#D1DDCE',
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 320,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20452A',
    borderWidth: 1,
    borderColor: '#355C3D',
    borderRadius: 18,
    padding: 14,
    marginTop: 26,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#DCEED5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#1A481F',
    fontSize: 18,
    fontWeight: '900',
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    color: '#B9D1B7',
    fontSize: 11,
    marginBottom: 5,
  },
  accountEmail: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  lock: {
    color: '#B9E69B',
    fontSize: 21,
    fontWeight: '900',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  sectionHeading: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#193B21',
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: '#778073',
    fontSize: 13,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E9E0',
    padding: 16,
    marginBottom: 13,
    gap: 13,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: {
    fontSize: 26,
    color: '#1A481F',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    color: '#193B21',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 5,
  },
  featureDescription: {
    color: '#778073',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  featureLink: {
    color: '#246D2C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chevron: {
    color: '#779078',
    fontSize: 27,
    paddingLeft: 2,
  },
  securityCard: {
    backgroundColor: '#E7EFE2',
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  securityTitle: {
    color: '#1A481F',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 9,
  },
  securityText: {
    color: '#50644F',
    fontSize: 13,
    lineHeight: 21,
  },
  homeButton: {
    borderWidth: 1,
    borderColor: '#C9D5C4',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginBottom: 22,
  },
  homeButtonText: {
    color: '#1A481F',
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    color: '#92988D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
