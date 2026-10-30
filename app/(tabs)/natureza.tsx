
import { UserAccountBar } from '@/components/UserAccountBar';
import MenuInferior from '@/components/MenuInferior';
import { router } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const COLORS = {
  background: '#f8f4f0',
  darkGreen: '#1A481F',
  mediumGreen: '#246D2C',
  green: '#2F8F3A',
  white: '#FFFFFF',
  text: '#263529',
  muted: '#777D75',
  border: '#E2E7DE',
  lightGreen: '#EAF1E5',
};

const imagemNatureza =
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85';

export default function NaturezaScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <UserAccountBar />

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>CIRCUITO TERÊ VERDE</Text>
          <Text style={styles.title}>Natureza 🌿</Text>
          <Text style={styles.subtitle}>
            Biodiversidade e montanhas que fazem de Teresópolis
            um destino especial.
          </Text>
        </View>

        <View style={styles.heroCard}>
          <ImageBackground
            source={{ uri: imagemNatureza }}
            style={styles.heroImage}
            imageStyle={styles.heroImageRadius}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>
                  RIQUEZA NATURAL
                </Text>
              </View>

              <Text style={styles.heroTitle}>
                Um encontro com a natureza
              </Text>

              <Text style={styles.heroDescription}>
                Descubra a beleza da Mata Atlântica e das montanhas
                da Serra dos Órgãos.
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

        <View style={styles.infoCard}>
          <View style={styles.cardHeading}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>🌳</Text>
            </View>
            <View style={styles.cardHeadingText}>
              <Text style={styles.cardTitle}>
                Biodiversidade da Mata Atlântica
              </Text>
              <Text style={styles.cardKicker}>
                FLORESTAS E VIDA SILVESTRE
              </Text>
            </View>
          </View>

          <Text style={styles.cardText}>
            Teresópolis está inserida no bioma da Mata Atlântica,
            um dos ambientes mais ricos e ameaçados do Brasil.
            A cidade abriga áreas de floresta, rios, cachoeiras,
            encostas e campos de altitude, criando diferentes
            habitats para a vida silvestre. No Parque Nacional da
            Serra dos Órgãos e em outras áreas preservadas, é
            possível encontrar uma grande variedade de árvores,
            bromélias, orquídeas, aves, pequenos mamíferos e
            outros animais. Essa diversidade torna a região
            importante para a conservação e para a observação
            da natureza.
          </Text>
        </View>

        <View style={styles.imageCard}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
            }}
            style={styles.secondaryImage}
            imageStyle={styles.secondaryImageRadius}
          >
            <View style={styles.secondaryOverlay} />
            <View style={styles.secondaryImageContent}>
              <Text style={styles.secondaryImageTag}>
                SERRA DOS ÓRGÃOS
              </Text>
              <Text style={styles.secondaryImageTitle}>
                Montanhas que inspiram aventura
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.cardHeading}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>🥾</Text>
            </View>
            <View style={styles.cardHeadingText}>
              <Text style={styles.cardTitle}>
                A Capital Nacional do Montanhismo
              </Text>
              <Text style={styles.cardKicker}>
                AVENTURA E EXPLORAÇÃO
              </Text>
            </View>
          </View>

          <Text style={styles.cardText}>
            Teresópolis também é conhecida como a Capital Nacional
            do Montanhismo por sua história ligada às montanhas
            da Serra dos Órgãos e pela variedade de experiências
            ao ar livre que oferece. A cidade reúne trilhas,
            travessias, escaladas e vias de diferentes níveis de
            dificuldade. As formações rochosas e os cenários de
            Pedra do Sino, Pedra do Açu e Escalavrado atraem
            montanhistas e visitantes durante todo o ano. Para
            aproveitar esses lugares com segurança, é importante
            consultar as condições da trilha, respeitar os limites
            do parque, levar água e evitar deixar qualquer resíduo
            pelo caminho.
          </Text>

          <Pressable
            style={styles.detailsButton}
            onPress={() => router.push('/trilhas')}
          >
            <Text style={styles.detailsButtonText}>
              Conhecer as trilhas
            </Text>
            <Text style={styles.detailsArrow}>↗</Text>
          </Pressable>
        </View>

        <View style={styles.conservationCard}>
          <Text style={styles.conservationIcon}>🍃</Text>
          <Text style={styles.conservationTitle}>
            Preserve para continuar descobrindo
          </Text>
          <Text style={styles.conservationText}>
            Respeite as orientações locais, cuide das trilhas e
            leve seus resíduos de volta. A conservação também
            faz parte da aventura.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>TERÊ VERDE 🌿</Text>
          <Text style={styles.footerText}>
            Viva a natureza. Descubra novos caminhos.
          </Text>
        </View>
      </ScrollView>

      <MenuInferior />
    </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 20,
    paddingVertical: 7,
    paddingRight: 12,
  },
  backText: {
    color: COLORS.darkGreen,
    fontSize: 14,
    fontWeight: '700',
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
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
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
    height: 280,
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
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 33,
    marginBottom: 8,
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
    height: 220,
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
    fontSize: 24,
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
