
import { UserAccountBar } from '@/components/UserAccountBar';
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
  border: '#E5E8DF',
};

const categories = [
  {
    title: 'Trilhas',
    subtitle: 'Aventure-se pelas montanhas e descubra novos caminhos.',
    icon: '🥾',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85',
    route: '/trilhas' as const,
  },
  {
    title: 'Natureza',
    subtitle: 'Conheça parques, cachoeiras e paisagens incríveis.',
    icon: '🌿',
    image:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
    route: '/natureza' as const,
  },
  {
    title: 'Eventos',
    subtitle: 'Descubra o que acontece em Teresópolis.',
    icon: '🎉',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85',
    route: '/eventos' as const,
  },
];

export default function ExploreScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <UserAccountBar />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>CIRCUITO TERÊ VERDE</Text>

          <Text style={styles.title}>Onde ir?</Text>

          <Text style={styles.subtitle}>
            Explore Teresópolis e descubra experiências
            inesquecíveis em meio à natureza.
          </Text>
        </View>

        <Pressable
          style={styles.heroCard}
          onPress={() => router.push('/trilhas')}
        >
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=85',
            }}
            style={styles.heroImage}
            imageStyle={styles.heroImageRadius}
          >
            <View style={styles.heroOverlay} />

            <View style={styles.heroContent}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>
                  DESCUBRA TERÊ
                </Text>
              </View>

              <Text style={styles.heroTitle}>
                A natureza está chamando
              </Text>

              <Text style={styles.heroDescription}>
                Seu próximo destino começa aqui.
              </Text>

              <View style={styles.heroButton}>
                <Text style={styles.heroButtonText}>
                  Explorar trilhas
                </Text>
                <Text style={styles.heroArrow}>→</Text>
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Explore por categoria
            </Text>
            <Text style={styles.sectionSubtitle}>
              Escolha sua próxima experiência
            </Text>
          </View>
        </View>

        <View style={styles.categoryList}>
          {categories.map((category) => (
            <Pressable
              key={category.title}
              style={({ pressed }) => [
                styles.categoryCard,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push(category.route)}
            >
              <ImageBackground
                source={{ uri: category.image }}
                style={styles.categoryImage}
                imageStyle={styles.categoryImageRadius}
              >
                <View style={styles.categoryImageOverlay} />

                <View style={styles.categoryTop}>
                  <View style={styles.categoryIcon}>
                    <Text style={styles.categoryEmoji}>
                      {category.icon}
                    </Text>
                  </View>

                  <View style={styles.arrowCircle}>
                    <Text style={styles.arrowText}>↗</Text>
                  </View>
                </View>

                <View style={styles.categoryTextContainer}>
                  <Text style={styles.categoryTitle}>
                    {category.title}
                  </Text>

                  <Text style={styles.categoryDescription}>
                    {category.subtitle}
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            TERÊ VERDE 🌿
          </Text>
          <Text style={styles.footerText}>
            Viva a natureza. Descubra novos caminhos.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem
          icon="⌂"
          label="Início"
          onPress={() => router.replace('/')}
        />

        <NavItem
          icon="🧭"
          label="Onde ir"
          active
          onPress={() => router.replace('/explore')}
        />

        <NavItem
          icon="🥾"
          label="Trilhas"
          onPress={() => router.push('/trilhas')}
        />

        <NavItem
          icon="🌿"
          label="Natureza"
          onPress={() => router.push('/natureza')}
        />

        <NavItem
          icon="🎉"
          label="Eventos"
          onPress={() => router.push('/eventos')}
        />
      </View>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >
      <Text
        style={[
          styles.navIcon,
          active && styles.navActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navLabel,
          active && styles.navLabelActive,
        ]}
      >
        {label}
      </Text>

      {active && <View style={styles.activeIndicator} />}
    </Pressable>
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
    paddingTop: 22,
    paddingBottom: 28,
  },

  heading: {
    marginBottom: 22,
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
    letterSpacing: -0.8,
    marginBottom: 8,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 330,
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
    height: 250,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.darkGreen,
  },

  heroImageRadius: {
    borderRadius: 22,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 35, 16, 0.48)',
  },

  heroContent: {
    padding: 21,
  },

  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  heroTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 32,
    maxWidth: 280,
    marginBottom: 7,
  },

  heroDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 17,
  },

  heroButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.white,
    borderRadius: 12,
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
    marginBottom: 5,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
  },

  categoryList: {
    gap: 16,
  },

  categoryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },

  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  categoryImage: {
    height: 185,
    justifyContent: 'space-between',
    padding: 17,
    backgroundColor: COLORS.darkGreen,
  },

  categoryImageRadius: {
    borderRadius: 20,
  },

  categoryImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 30, 15, 0.35)',
  },

  categoryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryEmoji: {
    fontSize: 21,
  },

  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowText: {
    color: COLORS.darkGreen,
    fontSize: 21,
    fontWeight: '700',
  },

  categoryTextContainer: {
    gap: 5,
  },

  categoryTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
  },

  categoryDescription: {
    color: 'rgba(255,255,255,0.94)',
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 290,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 28,
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

  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    paddingBottom: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 47,
    gap: 3,
  },

  navIcon: {
    color: '#7E887D',
    fontSize: 19,
  },

  navActive: {
    color: COLORS.green,
  },

  navLabel: {
    color: '#7E887D',
    fontSize: 9,
    fontWeight: '600',
  },

  navLabelActive: {
    color: COLORS.darkGreen,
    fontWeight: '800',
  },

  activeIndicator: {
    width: 17,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.green,
    marginTop: 1,
  },
});
