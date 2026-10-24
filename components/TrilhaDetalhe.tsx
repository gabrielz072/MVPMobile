import { BottomNavigation } from '@/components/BottomNavigation';
import { router } from 'expo-router';
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { UserAccountBar } from '@/components/UserAccountBar';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

type TrilhaDetalheProps = {
  id: string;
  nome: string;
  imagem: string;
  texto: string;
  dificuldade: string;
  duracao: string;
};

export function TrilhaDetalhe({
  id,
  nome,
  imagem,
  texto,
  dificuldade,
  duracao,
}: TrilhaDetalheProps) {
  const { user } = useAuth();
  const [favoritado, setFavoritado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarFavorito() {
      if (!user) {
        setFavoritado(false);
        return;
      }

      try {
        const perfil = await getDoc(doc(db, 'users', user.uid));
        const favoritos = perfil.data()?.favoritos;

        if (ativo) {
          setFavoritado(
            Array.isArray(favoritos) && favoritos.includes(id)
          );
        }
      } catch {
        if (ativo) {
          Alert.alert(
            'Não foi possível carregar',
            'Verifique sua conexão e tente novamente.'
          );
        }
      }
    }

    carregarFavorito();

    return () => {
      ativo = false;
    };
  }, [id, user]);

  async function alternarFavorito() {
    if (!user) {
      Alert.alert(
        'Faça login',
        'Entre na sua conta para salvar trilhas favoritas.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar', onPress: () => router.push('/login') },
        ]
      );
      return;
    }

    if (salvando) return;

    setSalvando(true);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        favoritos: favoritado ? arrayRemove(id) : arrayUnion(id),
      });

      setFavoritado((atual) => !atual);
    } catch {
      Alert.alert(
        'Não foi possível salvar',
        'Tente novamente em instantes.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4f0" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <UserAccountBar />

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹  Voltar</Text>
        </Pressable>

        <View style={styles.hero}>
          <Image
            source={{ uri: imagem }}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.imageOverlay}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>CIRCUITO TERÊ VERDE</Text>
            </View>
          </View>
        </View>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>EXPLORE A NATUREZA</Text>
          <Text style={styles.title}>{nome}</Text>
          <Text style={styles.intro}>
            Descubra uma das paisagens marcantes da Serra dos Órgãos.
          </Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>▲</Text>
            </View>
            <Text style={styles.label}>Dificuldade</Text>
            <Text style={styles.value}>{dificuldade}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>◷</Text>
            </View>
            <Text style={styles.label}>Duração</Text>
            <Text style={styles.value}>{duracao}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre o destino</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{texto}</Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Antes de partir</Text>
          <Text style={styles.tipText}>
            Planeje sua visita, confira as condições climáticas e as regras
            de acesso. Use calçados adequados, leve água e respeite a
            natureza durante todo o percurso.
          </Text>
        </View>

        <Pressable
          style={[
            styles.favoriteButton,
            favoritado && styles.favoriteButtonActive,
            salvando && styles.favoriteButtonDisabled,
          ]}
          onPress={alternarFavorito}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.favoriteText}>
              {favoritado ? '★  Salvo nos favoritos' : '☆  Salvar nos favoritos'}
            </Text>
          )}
        </Pressable>

        <Text style={styles.footer}>
          CIRCUITO TERÊ VERDE · CONECTE-SE À NATUREZA
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f4f0',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingRight: 20,
    marginBottom: 4,
  },
  backText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A481F',
  },
  hero: {
    height: 245,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#dce8d9',
    marginBottom: 25,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#1A481F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heading: {
    marginBottom: 22,
  },
  eyebrow: {
    color: '#2F8F3A',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: '#1A481F',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
  },
  intro: {
    color: '#647064',
    fontSize: 15,
    lineHeight: 23,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e9df',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#e8f2e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#246D2C',
  },
  label: {
    fontSize: 12,
    color: '#777f75',
    marginBottom: 6,
  },
  value: {
    color: '#1A481F',
    fontSize: 16,
    fontWeight: '800',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#1A481F',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 13,
  },
  descriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 19,
    borderWidth: 1,
    borderColor: '#e8e9df',
  },
  description: {
    color: '#4f594f',
    fontSize: 15,
    lineHeight: 25,
  },
  tipCard: {
    backgroundColor: '#e8f2e5',
    borderRadius: 18,
    padding: 19,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2F8F3A',
  },
  tipTitle: {
    color: '#1A481F',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },
  tipText: {
    color: '#435b43',
    fontSize: 14,
    lineHeight: 22,
  },
  favoriteButton: {
    backgroundColor: '#246D2C',
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 24,
  },
  favoriteButtonActive: {
    backgroundColor: '#1A481F',
  },
  favoriteButtonDisabled: {
    opacity: 0.7,
  },
  favoriteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    color: '#849080',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e8df',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    fontSize: 21,
    color: '#7c887a',
  },
  navText: {
    fontSize: 10,
    color: '#697367',
    fontWeight: '600',
  },
  navSelected: {
    color: '#246D2C',
    fontWeight: '900',
  },
});
