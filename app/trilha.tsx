import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { trilhas } from './data/trilhas';

export default function TrilhaScreen() {
  const { id } = useLocalSearchParams();
  const [favoritado, setFavoritado] = useState(false);

useEffect(() => {
  async function carregarFavorito() {
    const favoritosSalvos = await AsyncStorage.getItem('favoritos');

    if (favoritosSalvos) {
      const favoritos = JSON.parse(favoritosSalvos);

      setFavoritado(favoritos.includes(id));
    }
  }

  carregarFavorito();
}, [id]);

  const trilha = trilhas.find((item) => item.id === id);

  if (!trilha) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Trilha não encontrada
        </Text>
      </View>
    );
  }

return (
  <ScrollView style={styles.container}>

    <Pressable
      style={styles.backButton}
      onPress={() => router.back()}
    >
      <Text style={styles.backText}>
        ← Voltar
      </Text>
    </Pressable>

    <Image
      source={{ uri: trilha.imagem }}
      style={styles.image}
    />

    <Text style={styles.title}>
      {trilha.nome}
    </Text>

    <Text style={styles.description}>
      {trilha.descricao}
    </Text>
    <Pressable
  style={styles.favoriteButton}

  onPress={async () => {
  const favoritosSalvos = await AsyncStorage.getItem('favoritos');

  let favoritos = favoritosSalvos
    ? JSON.parse(favoritosSalvos)
    : [];

  if (favoritado) {
    favoritos = favoritos.filter(
      (favoritoId: string) => favoritoId !== id
    );
  } else {
    favoritos.push(id);
  }

  await AsyncStorage.setItem(
    'favoritos',
    JSON.stringify(favoritos)
  );

  setFavoritado(!favoritado);
}}
  >
  <Text style={styles.favoriteText}>
    {favoritado ? '★ Favoritado' : '☆ Favoritar'}
  </Text>
</Pressable>

    <View style={styles.infoContainer}>

      <View style={styles.info}>
        <Text style={styles.label}>
          Dificuldade
        </Text>

        <Text style={styles.value}>
          {trilha.dificuldade}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.label}>
          Duração
        </Text>

        <Text style={styles.value}>
          {trilha.duracao}
        </Text>
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

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  description: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
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

  image: {
  width: '100%',
  height: 220,
  borderRadius: 16,
  marginBottom: 20,
},

backButton: {
  marginBottom: 16,
},

backText: {
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

});