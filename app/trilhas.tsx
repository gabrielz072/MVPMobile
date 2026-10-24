
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

import { UserAccountBar } from '@/components/UserAccountBar';

const COLORS = {
  background: '#f8f4f0',
  darkGreen: '#1A481F',
  green: '#246D2C',
  brightGreen: '#2F8F3A',
  white: '#FFFFFF',
  text: '#243126',
  muted: '#6B746B',
  border: '#E6E5DC',
};

type Trail = {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  description: string;
  image: string;
  route: '/escalavrado' | '/pedra-do-acu' | '/pedra-do-sino';
};

const TRAILS: Trail[] = [
  {
    id: 'escalavrado',
    name: 'Escalavrado',
    location: 'Parque Nacional da Serra dos Órgãos',
    difficulty: 'Desafiadora',
    description:
      'Conheça uma das montanhas mais marcantes da Serra dos Órgãos.',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85',
    route: '/escalavrado',
  },
  {
    id: 'acu',
    name: 'Pedra do Açu',
    location: 'Serra dos Órgãos',
    difficulty: 'Desafiadora',
    description:
      'Explore paisagens montanhosas e cenários naturais impressionantes.',
    image:
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1200&q=85',
    route: '/pedra-do-acu',
  },
  {
    id: 'sino',
    name: 'Pedra do Sino',
    location: 'Parque Nacional da Serra dos Órgãos',
    difficulty: 'Desafiadora',
    description:
      'Descubra uma das experiências de montanha mais conhecidas da região.',
    image:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=85',
    route: '/pedra-do-sino',
  },
];

function TrailCard({ trail }: { trail: Trail }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Conhecer a trilha ${trail.name}`}
      onPress={() => router.push(trail.route)}
      style={({ pressed }) => [
        styles.trailCard,
        pressed && styles.cardPressed,
      ]}
    >
      <ImageBackground
        source={{ uri: trail.image }}
        style={styles.trailImage}
        imageStyle={styles.trailImageRadius}
        resizeMode="cover"
      >
        <View style={styles.imageShade} />

        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>
            {trail.difficulty}
          </Text>
        </View>

        <View style={styles.imageContent}>
          <Text style={styles.trailName}>{trail.name}</Text>
          <Text style={styles.trailLocation}>
            {trail.location}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.cardContent}>
        <Text style={styles.trailDescription}>
          {trail.description}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.cardLink}>
            Conhecer trilha
          </Text>

          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function BottomNavigation() {
  return (
    <View style={styles.bottomNavigation}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/explore')}
        style={styles.navItem}
      >
        <Text style={styles.navIcon}>⌂</Text>
        <Text style={styles.navLabel}>Início</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/trilhas')}
        style={styles.navItem}
      >
        <Text style={[styles.navIcon, styles.activeNavText]}>
          ▲
        </Text>
        <Text style={[styles.navLabel, styles.activeNavText]}>
          Trilhas
        </Text>
        <View style={styles.activeIndicator} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/natureza')}
        style={styles.navItem}
      >
        <Text style={styles.navIcon}>♧</Text>
        <Text style={styles.navLabel}>Atrações</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/eventos')}
        style={styles.navItem}
      >
        <Text style={styles.navIcon}>▦</Text>
        <Text style={styles.navLabel}>Eventos</Text>
      </Pressable>
    </View>
  );
}

export default function TrilhasScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.topBar}>
        <UserAccountBar />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrowText}>
              CIRCUITO TERÊ VERDE
            </Text>
          </View>

          <Text style={styles.title}>
            Explore as{' '}
            <Text style={styles.titleHighlight}>
              trilhas
            </Text>
          </Text>

          <Text style={styles.subtitle}>
            Respire a natureza, descubra novas paisagens e
            conheça as montanhas de Teresópolis.
          </Text>
        </View>

        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=85',
          }}
          style={styles.featured}
          imageStyle={styles.featuredImage}
          resizeMode="cover"
        >
          <View style={styles.featuredShade} />

          <View style={styles.featuredContent}>
            <View style={styles.featuredTag}>
              <Text style={styles.featuredTagText}>
                AVENTURA E NATUREZA
              </Text>
            </View>

            <Text style={styles.featuredTitle}>
              Sua próxima aventura começa aqui.
            </Text>

            <Text style={styles.featuredDescription}>
              Encontre sua próxima experiência ao ar livre.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/natureza')}
              style={({ pressed }) => [
                styles.featuredButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.featuredButtonText}>
                Descobrir a região
              </Text>
              <Text style={styles.featuredButtonArrow}>
                →
              </Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>
              Trilhas em destaque
            </Text>
            <Text style={styles.sectionSubtitle}>
              Descubra os caminhos da Serra
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {TRAILS.length} trilhas
            </Text>
          </View>
        </View>

        <View style={styles.trailsList}>
          {TRAILS.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </View>

        <View style={styles.tipCard}>
          <View style={styles.tipIconContainer}>
            <Text style={styles.tipIcon}>♧</Text>
          </View>

          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>
              Explore com responsabilidade
            </Text>
            <Text style={styles.tipDescription}>
              Planeje sua visita, confira as condições de
              acesso e preserve a natureza durante o percurso.
            </Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          CIRCUITO TERÊ VERDE · CONECTE-SE À NATUREZA
        </Text>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  topBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: COLORS.background,
    zIndex: 2,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },

  heading: {
    marginBottom: 22,
  },

  eyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  eyebrowLine: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.brightGreen,
    marginRight: 8,
  },

  eyebrowText: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },

  title: {
    color: COLORS.darkGreen,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    lineHeight: 39,
  },

  titleHighlight: {
    color: COLORS.brightGreen,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    maxWidth: 340,
  },

  featured: {
    height: 255,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 30,
    backgroundColor: COLORS.darkGreen,
  },

  featuredImage: {
    borderRadius: 24,
  },

  featuredShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 30, 15, 0.48)',
  },

  featuredContent: {
    padding: 20,
    alignItems: 'flex-start',
  },

  featuredTag: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.32)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },

  featuredTagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  featuredTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
    maxWidth: 280,
  },

  featuredDescription: {
    color: '#F0F3EC',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    marginBottom: 15,
  },

  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
  },

  featuredButtonText: {
    color: COLORS.darkGreen,
    fontSize: 12,
    fontWeight: '800',
  },

  featuredButtonArrow: {
    color: COLORS.green,
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  sectionTitleContainer: {
    flex: 1,
  },

  sectionTitle: {
    color: COLORS.darkGreen,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },

  countBadge: {
    backgroundColor: '#E7EFE2',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },

  countText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '800',
  },

  trailsList: {
    gap: 16,
  },

  trailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },

  trailImage: {
    height: 190,
    justifyContent: 'space-between',
    backgroundColor: '#DCE5D8',
  },

  trailImageRadius: {
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },

  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 30, 16, 0.30)',
  },

  difficultyBadge: {
    alignSelf: 'flex-start',
    margin: 13,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  difficultyText: {
    color: COLORS.darkGreen,
    fontSize: 10,
    fontWeight: '800',
  },

  imageContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  trailName: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  trailLocation: {
    color: '#F2F4EF',
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },

  cardContent: {
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 15,
  },

  trailDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
  },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  cardLink: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '800',
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9F1E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    color: COLORS.green,
    fontSize: 25,
    lineHeight: 28,
    marginTop: -2,
  },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF0E5',
    borderRadius: 18,
    padding: 16,
    marginTop: 24,
  },

  tipIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  tipIcon: {
    fontSize: 23,
    color: COLORS.green,
  },

  tipTextContainer: {
    flex: 1,
  },

  tipTitle: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },

  tipDescription: {
    color: '#586658',
    fontSize: 11,
    lineHeight: 18,
  },

  footerText: {
    color: '#899184',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 25,
    marginBottom: 4,
  },

  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 9,
    paddingBottom: 10,
    minHeight: 66,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45,
  },

  navIcon: {
    color: '#7C877B',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 3,
  },

  navLabel: {
    color: '#7C877B',
    fontSize: 10,
    fontWeight: '600',
  },

  activeNavText: {
    color: COLORS.green,
    fontWeight: '800',
  },

  activeIndicator: {
    position: 'absolute',
    top: -9,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.brightGreen,
  },

  buttonPressed: {
    opacity: 0.8,
  },
});
