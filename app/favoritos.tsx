
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { UserAccountBar } from '../components/UserAccountBar';
import MenuInferior from '../components/MenuInferior';
import { useFavoritos } from '../hooks/useFavoritos';

type Categoria = 'trilhas' | 'natureza' | 'eventos';

type ItemFavorito = {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  rota: Href;
};

const VERDE = '#1A481F';
const VERDE_MEDIO = '#246D2C';
const FUNDO = '#F8F4F0';
const CINZA = '#788078';

const CATALOGO: Record<Categoria, Record<string, ItemFavorito>> = {
  trilhas: {
    escalavrado: {
      id: 'escalavrado',
      nome: 'Escalavrado',
      descricao: 'Uma das montanhas mais marcantes da Serra dos Órgãos.',
      imagem:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000',
      rota: '/escalavrado',
    },
    acu: {
      id: 'acu',
      nome: 'Pedra do Açu',
      descricao: 'Paisagens montanhosas e cenários impressionantes.',
      imagem:
        'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1000',
      rota: '/pedra-do-acu',
    },
    sino: {
      id: 'sino',
      nome: 'Pedra do Sino',
      descricao: 'Uma experiência inesquecível na Serra dos Órgãos.',
      imagem:
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1000',
      rota: '/pedra-do-sino',
    },
  },

  natureza: {
    'mata-atlantica': {
      id: 'mata-atlantica',
      nome: 'Mata Atlântica',
      descricao: 'Conheça a biodiversidade e as paisagens naturais da região.',
      imagem:
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000',
      rota: '/natureza',
    },
    montanhismo: {
      id: 'montanhismo',
      nome: 'Montanhismo',
      descricao: 'Descubra a cultura e as experiências nas montanhas.',
      imagem:
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000',
      rota: '/natureza',
    },
  },

  eventos: {
    atm: {
      id: 'atm',
      nome: 'Abertura da Temporada de Montanhismo',
      descricao: 'Um encontro para celebrar o montanhismo em Teresópolis.',
      imagem:
        'https://images.unsplash.com/photo-1511497584788-876760111969?w=1000',
      rota: '/eventos',
    },
  },
};

const CATEGORIAS: {
  id: Categoria;
  titulo: string;
  icone: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { id: 'trilhas', titulo: 'Trilhas e destinos', icone: 'trail-sign-outline' },
  { id: 'natureza', titulo: 'Natureza', icone: 'leaf-outline' },
  { id: 'eventos', titulo: 'Eventos', icone: 'calendar-outline' },
];

export default function FavoritosScreen() {
  const {
    favoritos,
    carregando,
    usuarioLogado,
    alternarFavorito,
    estaAtualizando,
  } = useFavoritos();

  function abrirLogin() {
    router.push('/login');
  }

  function obterItem(categoria: Categoria, id: string): ItemFavorito {
    const conhecido = CATALOGO[categoria][id];

    if (conhecido) return conhecido;

    return {
      id,
      nome: id
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (letra) => letra.toUpperCase()),
      descricao: 'Consulte esta categoria para conhecer o item.',
      imagem:
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000',
      rota:
        categoria === 'trilhas'
          ? '/trilhas'
          : categoria === 'natureza'
            ? '/natureza'
            : '/eventos',
    };
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <UserAccountBar />

        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={19} color={VERDE} />
          <Text style={styles.backText}>Voltar ao perfil</Text>
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>CIRCUITO TERÊ VERDE</Text>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Seus favoritos</Text>
              <Text style={styles.subtitle}>
                Seus lugares e experiências especiais em Teresópolis.
              </Text>
            </View>

            <Ionicons name="heart" size={35} color="#D94B50" />
          </View>
        </View>

        {!usuarioLogado ? (
          <View style={styles.emptyCard}>
            <Ionicons name="heart-outline" size={48} color={VERDE_MEDIO} />
            <Text style={styles.emptyTitle}>
              Entre para ver seus favoritos
            </Text>
            <Text style={styles.emptyText}>
              Faça login para salvar trilhas, lugares e eventos
              e encontrar tudo aqui.
            </Text>
            <Pressable style={styles.loginButton} onPress={abrirLogin}>
              <Text style={styles.loginButtonText}>Entrar na minha conta</Text>
            </Pressable>
          </View>
        ) : carregando ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Carregando seus favoritos...
            </Text>
          </View>
        ) : (
          <>
            {CATEGORIAS.map((categoria) => {
              const ids = favoritos[categoria.id];

              if (ids.length === 0) return null;

              return (
                <View key={categoria.id} style={styles.section}>
                  <View style={styles.sectionHeading}>
                    <View style={styles.sectionIcon}>
                      <Ionicons
                        name={categoria.icone}
                        size={21}
                        color={VERDE}
                      />
                    </View>

                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitle}>
                        {categoria.titulo}
                      </Text>
                      <Text style={styles.sectionSubtitle}>
                        {ids.length} {ids.length === 1 ? 'item salvo' : 'itens salvos'}
                      </Text>
                    </View>
                  </View>

                  {ids.map((id) => {
                    const item = obterItem(categoria.id, id);
                    const atualizando = estaAtualizando(categoria.id, id);

                    return (
                      <View key={`${categoria.id}-${id}`} style={styles.card}>
                        <Pressable
                          style={styles.cardMain}
                          onPress={() => router.push(item.rota)}
                        >
                          <ImageBackground
                            source={{ uri: item.imagem }}
                            style={styles.cardImage}
                            imageStyle={styles.cardImageRadius}
                          />

                          <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>
                              {item.nome}
                            </Text>
                            <Text style={styles.cardDescription} numberOfLines={2}>
                              {item.descricao}
                            </Text>
                            <Text style={styles.cardLink}>
                              Ver detalhes →
                            </Text>
                          </View>
                        </Pressable>

                        <Pressable
                          onPress={() =>
                            alternarFavorito(categoria.id, id)
                          }
                          disabled={atualizando}
                          style={styles.removeButton}
                          accessibilityRole="button"
                          accessibilityLabel={`Remover ${item.nome} dos favoritos`}
                        >
                          <Ionicons
                            name="heart"
                            size={23}
                            color={atualizando ? '#B8B8B8' : '#D94B50'}
                          />
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              );
            })}

            {favoritos.trilhas.length === 0 &&
              favoritos.natureza.length === 0 &&
              favoritos.eventos.length === 0 && (
                <View style={styles.emptyCard}>
                  <Ionicons
                    name="heart-outline"
                    size={48}
                    color={VERDE_MEDIO}
                  />
                  <Text style={styles.emptyTitle}>
                    Sua coleção está vazia
                  </Text>
                  <Text style={styles.emptyText}>
                    Quando encontrar uma trilha, lugar ou evento
                    interessante, toque no coração para salvá-lo aqui.
                  </Text>
                  <Pressable
                    style={styles.loginButton}
                    onPress={() => router.push('/trilhas')}
                  >
                    <Text style={styles.loginButtonText}>
                      Descobrir lugares
                    </Text>
                  </Pressable>
                </View>
              )}
          </>
        )}

        <Text style={styles.footer}>
          CIRCUITO TERÊ VERDE · TERESÓPOLIS
        </Text>
      </ScrollView>

      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: FUNDO,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 110,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 20,
    marginBottom: 22,
  },
  backText: {
    color: VERDE,
    fontSize: 13,
    fontWeight: '700',
  },
  heading: {
    marginBottom: 27,
  },
  eyebrow: {
    color: VERDE_MEDIO,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: VERDE,
    fontSize: 29,
    fontWeight: '800',
    marginBottom: 7,
  },
  subtitle: {
    color: CINZA,
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    marginBottom: 27,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#E6EEE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: VERDE,
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: CINZA,
    fontSize: 11,
    marginTop: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
    borderWidth: 1,
    borderColor: '#E9EDE5',
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 92,
    height: 100,
    backgroundColor: '#E5EDE2',
  },
  cardImageRadius: {
    borderRadius: 11,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  cardTitle: {
    color: VERDE,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },
  cardDescription: {
    color: CINZA,
    fontSize: 11,
    lineHeight: 16,
  },
  cardLink: {
    color: VERDE_MEDIO,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 8,
  },
  removeButton: {
    width: 38,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 27,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E9EDE5',
  },
  emptyTitle: {
    color: VERDE,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 15,
  },
  emptyText: {
    color: CINZA,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 19,
  },
  loginButton: {
    backgroundColor: VERDE,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  footer: {
    color: CINZA,
    fontSize: 9,
    letterSpacing: 1.3,
    textAlign: 'center',
    marginTop: 18,
  },
});
