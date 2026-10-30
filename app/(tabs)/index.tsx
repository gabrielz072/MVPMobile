import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

const COLORS = {
  background: '#F7F8F3',
  green: '#173D25',
  lime: '#A9E849',
  white: '#FFFFFF',
  text: '#202820',
  muted: '#788078',
  border: '#E1E6DD',
};

const ADMIN_EMAIL = 'adminmvp@email.com';

const FOREST_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=90',
};

const MAX_DRAG = SCREEN_HEIGHT;

export default function HomeScreen() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [erroLogin, setErroLogin] = useState<string | null>(null);
  const [loginVisivel, setLoginVisivel] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;
  const dragStart = useRef(0);
  const senhaRef = useRef<TextInput>(null);

  const abrirLogin = useCallback(() => {
    Keyboard.dismiss();
    setLoginVisivel(true);

    Animated.spring(progress, {
      toValue: 1,
      useNativeDriver: true,
      damping: 25,
      stiffness: 140,
      mass: 0.8,
    }).start();
  }, [progress]);

  const fecharLogin = useCallback(() => {
    Keyboard.dismiss();

    Animated.spring(progress, {
      toValue: 0,
      useNativeDriver: true,
      damping: 25,
      stiffness: 140,
      mass: 0.8,
    }).start(({ finished }) => {
      if (finished) {
        setLoginVisivel(false);
      }
    });
  }, [progress]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dy) > 7,
      onPanResponderGrant: () => {
        progress.stopAnimation((value: number) => {
          dragStart.current = value;
        });
      },
      onPanResponderMove: (_, gesture) => {
        const next = Math.max(
          0,
          Math.min(1, dragStart.current - gesture.dy / MAX_DRAG),
        );

        progress.setValue(next);

        if (next > 0.04) {
          setLoginVisivel(true);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const current = Math.max(
          0,
          Math.min(1, dragStart.current - gesture.dy / MAX_DRAG),
        );

        const abrir =
          gesture.dy < -60 ||
          gesture.vy < -0.5 ||
          current >= 0.35;

        if (abrir) {
          abrirLogin();
        } else {
          fecharLogin();
        }
      },
      onPanResponderTerminate: () => {
        fecharLogin();
      },
    }),
  ).current;

  async function fazerLogin() {
    if (!email.trim() || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    setEntrando(true);
    setErroLogin(null);

    try {
      await login(email.trim(), senha);
      Keyboard.dismiss();
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
        'auth/too-many-requests':
          'Muitas tentativas. Aguarde e tente novamente.',
        'auth/network-request-failed':
          'Falha de conexão. Verifique sua internet.',
        'auth/operation-not-allowed':
          'O login por e-mail e senha não está habilitado no Firebase.',
      };

      setErroLogin(
        mensagens[code] ?? 'Ocorreu um erro inesperado. Tente novamente.',
      );
    } finally {
      setEntrando(false);
    }
  }

  async function acessarAdmin() {
    const emailDigitado = email.trim().toLowerCase();

    if (emailDigitado !== ADMIN_EMAIL) {
      Alert.alert(
        'Acesso restrito',
        'Esta área é exclusiva do administrador. Confira o e-mail informado.',
      );
      return;
    }

    if (!senha) {
      Alert.alert(
        'Autenticação necessária',
        'Digite a senha administrativa no campo de senha.',
      );
      senhaRef.current?.focus();
      return;
    }

    if (entrando) return;

    setEntrando(true);
    setErroLogin(null);

    try {
      await login(email.trim(), senha);
      Keyboard.dismiss();
      router.replace('/admin' as never);
    } catch {
      Alert.alert(
        'Acesso negado',
        'Não foi possível autenticar. Confira o e-mail e a senha administrativos.',
      );
    } finally {
      setEntrando(false);
    }
  }

  const introTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_HEIGHT * 0.25],
  });

  const introOpacity = progress.interpolate({
    inputRange: [0, 0.35, 0.7],
    outputRange: [1, 0.7, 0],
    extrapolate: 'clamp',
  });

  const loginTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.45, 0],
  });

  const loginOpacity = progress.interpolate({
    inputRange: [0, 0.3, 0.65],
    outputRange: [0, 0.45, 1],
    extrapolate: 'clamp',
  });

  if (user) {
    const slides = [
      {
        title: 'Explore novas trilhas',
        subtitle: 'Descubra caminhos incríveis na Serra dos Órgãos.',
        image:
          'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
        route: '/trilhas',
      },
      {
        title: 'Descubra a natureza',
        subtitle: 'Montanhas, paisagens e lugares inesquecíveis.',
        image:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
        route: '/natureza',
      },
      {
        title: 'Viva Teresópolis',
        subtitle: 'Conheça eventos e experiências da região.',
        image:
          'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=85',
        route: '/eventos',
      },
    ];

    const cardWidth = SCREEN_WIDTH - 50;
    const slideInterval = cardWidth + 14;

    return (
      <SafeAreaView
        style={styles.authenticatedContainer}
        edges={['top', 'left', 'right']}
      >
        <View style={styles.authenticatedHeader}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>✳</Text>
          </View>

          <View>
            <Text style={styles.brandName}>TERÊ VERDE</Text>
            <Text style={styles.brandSubtitle}>NATUREZA & AVENTURA</Text>
          </View>
        </View>

        <ScrollView
          style={styles.homeScroll}
          contentContainerStyle={styles.homeScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.homeEyebrow}>SEU PRÓXIMO DESTINO</Text>

          <Text style={styles.homeTitle}>
            A natureza está{'\n'}chamando.
          </Text>

          <Text style={styles.homeDescription}>
            Explore as belezas de Teresópolis e encontre sua próxima aventura.
          </Text>

          <View style={styles.galleryHeader}>
            <Text style={styles.galleryTitle}>Descubra o circuito</Text>

            <Text style={styles.galleryCounter}>
              {String(activeSlide + 1).padStart(2, '0')} / 03
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={slideInterval}
            snapToAlignment="start"
            disableIntervalMomentum
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / slideInterval,
              );

              setActiveSlide(
                Math.max(0, Math.min(slides.length - 1, index)),
              );
            }}
          >
            {slides.map((slide, index) => (
              <Pressable
                key={slide.title}
                onPress={() => router.push(slide.route as never)}
                accessibilityRole="button"
                accessibilityLabel={slide.title}
                style={[styles.carouselCard, { width: cardWidth }]}
              >
                <ImageBackground
                  source={{ uri: slide.image }}
                  style={styles.carouselImage}
                  imageStyle={styles.carouselImageRadius}
                  resizeMode="cover"
                >
                  <View style={styles.carouselOverlay} />

                  <View style={styles.carouselBadge}>
                    <Text style={styles.carouselBadgeText}>
                      {index === 0
                        ? 'AVENTURA'
                        : index === 1
                          ? 'NATUREZA'
                          : 'EXPERIÊNCIAS'}
                    </Text>
                  </View>

                  <View style={styles.carouselTextContent}>
                    <Text style={styles.carouselTitle}>
                      {slide.title}
                    </Text>

                    <Text style={styles.carouselSubtitle}>
                      {slide.subtitle}
                    </Text>

                    <View style={styles.carouselAction}>
                      <Text style={styles.carouselActionText}>
                        Explorar
                      </Text>

                      <Text style={styles.carouselArrow}>↗</Text>
                    </View>
                  </View>
                </ImageBackground>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.pagination}>
            {slides.map((slide, index) => (
              <View
                key={slide.title}
                style={[
                  styles.paginationDot,
                  activeSlide === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.homeTip}>
            <Text style={styles.homeTipIcon}>✦</Text>

            <View style={styles.homeTipContent}>
              <Text style={styles.homeTipTitle}>
                Sua próxima aventura começa aqui
              </Text>

              <Text style={styles.homeTipDescription}>
                Toque em uma foto ou escolha uma opção no menu abaixo.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fullScreen,
          {
            opacity: introOpacity,
            transform: [{ translateY: introTranslateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <ImageBackground
          source={FOREST_IMAGE}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay} />

          <SafeAreaView style={styles.introSafeArea}>
            <View style={styles.statusSpacer} />

            <View style={styles.introText}>
              <Text style={styles.introTitle}>
                Circuito
                {'\n'}
                Terê
                {'\n'}
                Verde
              </Text>

              <Text style={styles.introSubtitle}>
                Explore conosco
              </Text>
            </View>

            <View style={styles.goArea}>
              <View style={styles.chevrons}>
                <Text style={styles.chevron}>⌃</Text>

                <Text style={[styles.chevron, styles.chevronSecond]}>
                  ⌃
                </Text>
              </View>

              <Pressable
                style={styles.goButton}
                onPress={abrirLogin}
                accessibilityRole="button"
                accessibilityLabel="Abrir tela de login"
              >
                <Text style={styles.goButtonText}>GO</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </Animated.View>

      <Animated.View
        style={[
          styles.loginScreen,
          {
            opacity: loginOpacity,
            transform: [{ translateY: loginTranslateY }],
          },
        ]}
        pointerEvents={loginVisivel ? 'auto' : 'none'}
      >
        <SafeAreaView style={styles.loginSafeArea}>
          <View style={styles.loginHeader}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>✳</Text>
            </View>

            <View>
              <Text style={styles.brandName}>TERÊ VERDE</Text>
              <Text style={styles.brandSubtitle}>
                NATUREZA & AVENTURA
              </Text>
            </View>
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardArea}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.loginScroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.loginEyebrow}>
                SUA JORNADA COMEÇA AGORA
              </Text>

              <Text style={styles.loginTitle}>
                Bem-vinda de volta.
              </Text>

              <Text style={styles.loginDescription}>
                Entre na sua conta e continue explorando as belezas
                naturais de Teresópolis.
              </Text>

              <View style={styles.form}>
                <Text style={styles.label}>E-mail</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor="#90988E"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setErroLogin(null);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => senhaRef.current?.focus()}
                />

                <Text style={styles.label}>Senha</Text>

                <TextInput
                  ref={senhaRef}
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#90988E"
                  value={senha}
                  onChangeText={(value) => {
                    setSenha(value);
                    setErroLogin(null);
                  }}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={fazerLogin}
                />

                {erroLogin && (
                  <Text
                    style={styles.errorMessage}
                    accessibilityRole="alert"
                  >
                    {erroLogin}
                  </Text>
                )}

                <Pressable
                  style={[
                    styles.primaryButton,
                    entrando && styles.buttonDisabled,
                  ]}
                  onPress={fazerLogin}
                  disabled={entrando}
                  accessibilityRole="button"
                >
                  <Text style={styles.primaryButtonText}>
                    {entrando ? 'Entrando...' : 'Entrar na conta'}
                  </Text>

                  {!entrando && (
                    <Text style={styles.buttonArrow}>↗</Text>
                  )}
                </Pressable>

                <Pressable
                  style={[
                    styles.adminLoginButton,
                    entrando && styles.buttonDisabled,
                  ]}
                  onPress={acessarAdmin}
                  disabled={entrando}
                  accessibilityRole="button"
                >
                  <Text style={styles.adminLoginIcon}>♙</Text>

                  <View style={styles.adminLoginContent}>
                    <Text style={styles.adminLoginTitle}>
                      Área administrativa
                    </Text>

                    <Text style={styles.adminLoginSubtitle}>
                      Acesso exclusivo ao administrador
                    </Text>
                  </View>

                  <Text style={styles.adminLoginArrow}>↗</Text>
                </Pressable>

                <Pressable
                  style={styles.registerButton}
                  onPress={() => router.push('/cadastro')}
                  accessibilityRole="button"
                >
                  <Text style={styles.registerText}>
                    Ainda não possui uma conta?{' '}
                    <Text style={styles.registerHighlight}>
                      Cadastre-se
                    </Text>
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.backArea}>
            <Pressable
              style={styles.backButton}
              onPress={fecharLogin}
              accessibilityRole="button"
            >
              <Text style={styles.backButtonText}>
                ↑  Voltar à natureza
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 20, 10, 0.16)',
  },
  introSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 28,
  },
  statusSpacer: {
    height: 10,
  },
  introText: {
    marginTop: -30,
  },
  introTitle: {
    color: COLORS.white,
    fontSize: 38,
    lineHeight: 43,
    fontWeight: '800',
    letterSpacing: -0.8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  introSubtitle: {
    color: COLORS.white,
    fontSize: 12,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 3,
    marginRight: 30,
  },
  goArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  chevrons: {
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  chevron: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 19,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 5,
  },
  chevronSecond: {
    marginTop: -8,
  },
  goButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  goButtonText: {
    color: COLORS.green,
    fontSize: 16,
    fontWeight: '700',
  },
  loginScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    backgroundColor: COLORS.background,
  },
  loginSafeArea: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 12,
    paddingBottom: 12,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  brandIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  brandIconText: {
    color: COLORS.lime,
    fontSize: 27,
  },
  brandName: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 1.7,
  },
  brandSubtitle: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  keyboardArea: {
    flex: 1,
  },
  loginScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  loginEyebrow: {
    color: '#64814F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 12,
  },
  loginTitle: {
    color: COLORS.text,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -0.9,
  },
  loginDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 29,
  },
  form: {
    width: '100%',
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 16,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 20,
  },
  errorMessage: {
    color: '#B42318',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  primaryButton: {
    minHeight: 55,
    backgroundColor: COLORS.lime,
    borderRadius: 15,
    paddingHorizontal: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  primaryButtonText: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: '900',
  },
  buttonArrow: {
    color: COLORS.green,
    fontSize: 22,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  adminLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#31563A',
  },
  adminLoginIcon: {
    color: COLORS.lime,
    fontSize: 25,
    marginRight: 13,
  },
  adminLoginContent: {
    flex: 1,
  },
  adminLoginTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
  },
  adminLoginSubtitle: {
    color: '#D6E2D5',
    fontSize: 11,
    marginTop: 4,
  },
  adminLoginArrow: {
    color: COLORS.lime,
    fontSize: 22,
    fontWeight: '800',
    marginLeft: 8,
  },
  registerButton: {
    paddingVertical: 23,
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  registerHighlight: {
    color: COLORS.green,
    fontWeight: '900',
  },
  backArea: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 6,
  },
  backButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#E9EFE4',
  },
  backButtonText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '800',
  },
  gestureArea: {
    position: 'absolute',
    zIndex: 10,
    bottom: 20,
    alignSelf: 'center',
  },
  gestureButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  gestureButtonText: {
    color: COLORS.green,
    fontSize: 24,
    fontWeight: '800',
  },
  authenticatedContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 12,
    paddingHorizontal: 25,
  },
  authenticatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  homeScroll: {
    flex: 1,
    marginHorizontal: -25,
  },
  homeScrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  homeEyebrow: {
    color: '#64814F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  homeTitle: {
    color: COLORS.green,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  homeDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    marginBottom: 26,
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  galleryTitle: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: '900',
  },
  galleryCounter: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  carouselContent: {
    paddingRight: 25,
  },
  carouselCard: {
    height: 365,
    marginRight: 14,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#DDE6D7',
    elevation: 5,
    shadowColor: '#173D25',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
  },
  carouselImage: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  carouselImageRadius: {
    borderRadius: 24,
  },
  carouselOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 20, 10, 0.32)',
  },
  carouselBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lime,
  },
  carouselBadgeText: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  carouselTextContent: {
    marginTop: 'auto',
  },
  carouselTitle: {
    color: COLORS.white,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  carouselSubtitle: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 18,
  },
  carouselAction: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  carouselActionText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '900',
  },
  carouselArrow: {
    color: COLORS.green,
    fontSize: 17,
    fontWeight: '900',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 17,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#CCD5C6',
  },
  paginationDotActive: {
    width: 22,
    backgroundColor: COLORS.green,
  },
  homeTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF2E8',
    borderRadius: 17,
    padding: 15,
    marginTop: 24,
  },
  homeTipIcon: {
    color: '#64814F',
    fontSize: 24,
    marginRight: 12,
  },
  homeTipContent: {
    flex: 1,
  },
  homeTipTitle: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '900',
  },
  homeTipDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },
  authenticatedEyebrow: {
    color: '#64814F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  authenticatedTitle: {
    color: COLORS.green,
    fontSize: 33,
    lineHeight: 40,
    fontWeight: '900',
  },
  authenticatedDescription: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    marginBottom: 25,
  },
  secondaryButton: {
    minHeight: 52,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: COLORS.green,
    fontSize: 14,
    fontWeight: '800',
  },
});