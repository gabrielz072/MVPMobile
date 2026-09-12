import { router } from 'expo-router';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

  useEffect(() => {
    async function carregarFavorito() {
      if (!user) {
        setFavoritado(false);
        return;
      }

      const perfil = await getDoc(doc(db, 'users', user.uid));
      const favoritos = perfil.data()?.favoritos;
      setFavoritado(Array.isArray(favoritos) && favoritos.includes(id));
    }

    carregarFavorito();
  }, [id, user]);

  async function alternarFavorito() {
    if (!user) {
      Alert.alert('Faça login', 'Entre na sua conta para salvar trilhas favoritas.');
      router.push('/login');
      return;
    }

    const perfilRef = doc(db, 'users', user.uid);

    await updateDoc(perfilRef, {
      favoritos: favoritado ? arrayRemove(id) : arrayUnion(id),
    });
    setFavoritado((atual) => !atual);
  }

  return (
    <ScrollView style={styles.container}>
      <UserAccountBar />
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