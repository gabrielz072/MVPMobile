import BotaoFavorito from '@/components/BotaoFavorito';
import {
  CONTEUDO_NATUREZA_PADRAO,
  type ConteudoNatureza,
} from '@/lib/conteudoNatureza';
import { db } from '@/lib/firebase';
import { useFavoritos } from '@/hooks/useFavoritos';
import { doc, onSnapshot } from 'firebase/firestore';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const COLORS = {
  background: '#f8f4f0',
  darkGreen: '#1A481F',
  green: '#2F8F3A',
  white: '#FFFFFF',
  muted: '#777D75',
  border: '#E2E7DE',
  lightGreen: '#EAF1E5',
};

export default function NaturezaScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 380;
  const isTablet = width >= 700;

  const horizontalPadding = isSmallScreen ? 16 : isTablet ? 32 : 24;
  const heroHeight = Math.min(320, Math.max(210, height * 0.34));
  const secondaryHeight = isTablet ? 260 : 220;

  const [conteudo, setConteudo] =
    useState<ConteudoNatureza>(CONTEUDO_NATUREZA_PADRAO);

  useEffect(() => {
    return onSnapshot(
      doc(db, 'natureza', 'pagina'),
      (snapshot) => {
        if (!snapshot.exists()) {
          setConteudo(CONTEUDO_NATUREZA_PADRAO);
          return;
        }

        const dados = snapshot.data() as Partial<ConteudoNatureza>;
        setConteudo({
          ...CONTEUDO_NATUREZA_PADRAO,
          ...dados,
          contentBlocks: Array.isArray(dados.contentBlocks)
            ? dados.contentBlocks
            : CONTEUDO_NATUREZA_PADRAO.contentBlocks,
        });
      },
      (error) => {
        console.error('Erro ao carregar a página Natureza:', error);
        Alert.alert(
          'Erro ao carregar Natureza',
          'Não foi possível atualizar o conteúdo. Verifique sua conexão e tente novamente.',
        );
      },
    );
  }, []);

  const {
    favoritos,
    alternarFavorito,
    usuarioLogado,
    estaAtualizando,
  } = useFavoritos();

  async function handleFavorito(id: string) {
    if (!usuarioLogado) {
      Alert.alert(
        'Entre na sua conta',
        'Faça login para salvar seus conteúdos favoritos.',
        [
          { text: 'Agora não', style: 'cancel' },
          {
            text: 'Entrar',
            onPress: () => router.push('/login'),
          },
        ],
      );

      return;
    }

    await alternarFavorito('natureza', id);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>
              CIRCUITO TERÊ VERDE
            </Text>

            <Text
              style={[
                styles.title,
                { fontSize: isSmallScreen ? 28 : 32 },
              ]}
            >
              Natureza 🌿
            </Text>

            <Text style={styles.subtitle}>
              {conteudo.subtitle}
            </Text>
          </View>

          <View style={styles.heroCard}>
            <ImageBackground
              source={
                conteudo.heroImage
                  ? { uri: conteudo.heroImage }
                  : undefined
              }
              style={[
                styles.heroImage,
                { height: heroHeight },
              ]}
              imageStyle={styles.heroImageRadius}
            >
              <View style={styles.heroOverlay} />

              <View style={styles.heroContent}>
                <View style={styles.heroTag}>
                  <Text style={styles.heroTagText}>
                    RIQUEZA NATURAL
                  </Text>
                </View>

                <Text
                  style={[
                    styles.heroTitle,
                    { fontSize: isSmallScreen ? 23 : 27 },
                  ]}
                >
                  {conteudo.heroTitle}
                </Text>

                <Text style={styles.heroDescription}>
                  {conteudo.heroDescription}
                </Text>

                <Pressable
                  style={styles.heroButton}
                  onPress={() => router.push('/trilhas')}
                >
                  <Text style={styles.heroButtonText}>
                    Explorar trilhas
                  </Text>
                  <Text style={styles.heroArrow}>→</Text>
                </Pressable>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Natureza e montanhismo
            </Text>

            <Text style={styles.sectionSubtitle}>
              Conheça o que torna a região tão especial
            </Text>
          </View>

          {conteudo.contentBlocks.map((bloco) =>
            bloco.tipo === 'imagem' ? (
              <View key={bloco.id} style={styles.imageCard}>
                <ImageBackground
                  source={
                    bloco.imagem
                      ? { uri: bloco.imagem }
                      : undefined
                  }
                  style={[
                    styles.secondaryImage,
                    { height: secondaryHeight },
                  ]}
                  imageStyle={styles.secondaryImageRadius}
                >
                  <View style={styles.secondaryOverlay} />
                  <View style={styles.secondaryImageContent}>
                    <Text style={styles.secondaryImageTag}>
                      SERRA DOS ÓRGÃOS
                    </Text>
                    <Text
                      style={[
                        styles.secondaryImageTitle,
                        { fontSize: isSmallScreen ? 21 : 24 },
                      ]}
                    >
                      {bloco.titulo}
                    </Text>
                  </View>
                </ImageBackground>
              </View>
            ) : bloco.id === 'conservacao' ? (
              <View key={bloco.id} style={styles.conservationCard}>
                <Text style={styles.conservationIcon}>🍃</Text>
                <Text style={styles.conservationTitle}>
                  {bloco.titulo}
                </Text>
                <Text style={styles.conservationText}>
                  {bloco.conteudo}
                </Text>
              </View>
            ) : (
              <View key={bloco.id} style={styles.infoCard}>
                <View style={styles.cardHeading}>
                  <View style={styles.cardIcon}>
                    <Text style={styles.cardEmoji}>🌿</Text>
                  </View>
                  <View style={styles.cardHeadingText}>
                    <Text style={styles.cardTitle}>{bloco.titulo}</Text>
                    {bloco.id === 'mata-atlantica' && (
                      <Text style={styles.cardKicker}>
                        FLORESTAS E VIDA SILVESTRE
                      </Text>
                    )}
                    {bloco.id === 'montanhismo' && (
                      <Text style={styles.cardKicker}>
                        AVENTURA E EXPLORAÇÃO
                      </Text>
                    )}
                  </View>
                  {bloco.id !== 'conservacao' && (
                    <BotaoFavorito
                      salvo={favoritos.natureza.includes(bloco.id)}
                      onPress={() => handleFavorito(bloco.id)}
                      disabled={estaAtualizando('natureza', bloco.id)}
                    />
                  )}
                </View>
                <Text style={styles.cardText}>{bloco.conteudo}</Text>
                {bloco.id === 'montanhismo' && (
                  <Pressable
                    style={styles.detailsButton}
                    onPress={() => router.push('/trilhas')}
                  >
                    <Text style={styles.detailsButtonText}>
                      Conhecer as trilhas
                    </Text>
                    <Text style={styles.detailsArrow}>↗</Text>
                  </Pressable>
                )}
              </View>
            ),
          )}

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>
              TERÊ VERDE 🌿
            </Text>

            <Text style={styles.footerText}>
              Viva a natureza. Descubra novos caminhos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 30,
  },

  container: {
    width: '100%',
    maxWidth: 850,
  },

  heading: {
    marginBottom: 23,
  },

  eyebrow: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },

  title: {
    color: COLORS.darkGreen,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 8,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 420,
  },

  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  heroImage: {
    justifyContent: 'flex-end',
    backgroundColor: COLORS.darkGreen,
  },

  heroImageRadius: {
    borderRadius: 22,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 35, 16, 0.5)',
  },

  heroContent: {
    padding: 21,
  },

  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 13,
  },

  heroTagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  heroTitle: {
    color: COLORS.white,
    fontWeight: '800',
    lineHeight: 33,
    marginBottom: 8,
    maxWidth: 340,
  },

  heroDescription: {
    color: 'rgba(255,255,255,0.93)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 17,
  },

  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 11,
    paddingHorizontal: 15,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  heroButtonText: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '800',
  },

  heroArrow: {
    color: COLORS.darkGreen,
    fontSize: 17,
    fontWeight: '700',
  },

  sectionHeader: {
    marginBottom: 17,
  },

  sectionTitle: {
    color: COLORS.darkGreen,
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 6,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
  },

  infoCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#EAECE5',
    borderRadius: 19,
    padding: 20,
    marginBottom: 19,
    elevation: 2,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  cardHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },

  cardIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardEmoji: {
    fontSize: 22,
  },

  cardHeadingText: {
    flex: 1,
  },

  cardTitle: {
    color: COLORS.darkGreen,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 5,
  },

  cardKicker: {
    color: COLORS.green,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
  },

  cardText: {
    color: '#5E675E',
    fontSize: 14,
    lineHeight: 24,
  },

  imageCard: {
    borderRadius: 19,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },

  secondaryImage: {
    justifyContent: 'flex-end',
    backgroundColor: COLORS.darkGreen,
  },

  secondaryImageRadius: {
    borderRadius: 19,
  },

  secondaryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 30, 15, 0.38)',
  },

  secondaryImageContent: {
    padding: 20,
  },

  secondaryImageTag: {
    color: '#D9EACF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  secondaryImageTitle: {
    color: COLORS.white,
    fontWeight: '800',
    lineHeight: 30,
  },

  detailsButton: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  detailsButtonText: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '800',
  },

  detailsArrow: {
    color: COLORS.green,
    fontSize: 20,
    fontWeight: '800',
  },

  conservationCard: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    marginTop: 5,
  },

  conservationIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  conservationTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 9,
  },

  conservationText: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },

  footer: {
    alignItems: 'center',
    paddingTop: 27,
    paddingBottom: 8,
  },

  footerTitle: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 7,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
  },
});