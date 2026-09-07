import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    async function carregarFavorito() {
      const favoritosSalvos = await AsyncStorage.getItem('favoritos');

      if (favoritosSalvos) {
        const favoritos: string[] = JSON.parse(favoritosSalvos);
        setFavoritado(favoritos.includes(id));
      }
    }

    carregarFavorito();
  }, [id]);

  async function alternarFavorito() {
    const favoritosSalvos = await AsyncStorage.getItem('favoritos');
    let favoritos: string[] = favoritosSalvos ? JSON.parse(favoritosSalvos) : [];

    favoritos = favoritado
      ? favoritos.filter((favoritoId) => favoritoId !== id)
      : [...favoritos, id];

    await AsyncStorage.setItem('favoritos', JSON.stringify(favoritos));
    setFavoritado(!favoritado);
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Image source={{ uri: imagem }} style={styles.image} />

      <Text style={styles.title}>{nome}</Text>
      <Text style={styles.description}>{texto}</Text>

      <Pressable style={styles.favoriteButton} onPress={alternarFavorito}>
        <Text style={styles.favoriteText}>
          {favoritado ? '★ Favoritado' : '☆ Favoritar'}
        </Text>
      </Pressable>

      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <Text style={styles.label}>Dificuldade</Text>
          <Text style={styles.value}>{dificuldade}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Duração</Text>
          <Text style={styles.value}>{duracao}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: 'gray',
    lineHeight: 24,
    marginBottom: 30,
  },
  favoriteButton: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  favoriteText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 10,
  },
  info: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});