
import { UserAccountBar } from '@/components/UserAccountBar';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { useFavoritos } from '@/hooks/useFavoritos';
import { db } from '@/lib/firebase';
import type { Trilha } from '@/lib/trilhas';
import { trilhas } from './data/trilhas';

const IMAGENS_TRILHAS: Record<string, number> = {
  'trilha-suspensa-ponte': require('../assets/images/trilha-suspensa-ponte.jpg'),
  'trilha-cartao-postal': require('../assets/images/trilha-cartao-postal.jpg'),
};

function obterImagemTrilha(trilha: Trilha) {
  if (trilha.nome.toLowerCase().includes('pedra do sino')) {
    return require('../assets/images/pedra-do-sino.jpg');
  }

  return (
    IMAGENS_TRILHAS[trilha.id] ??
    (trilha.imagem ? { uri: trilha.imagem } : undefined)
  );
}

export default function TrilhaScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const trilhaId = id;

  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [carregando, setCarregando] = useState(true);

  const {
    favoritos,
    alternarFavorito,
    usuarioLogado,
    estaAtualizando,
  } = useFavoritos();

  useEffect(() => {
    if (!trilhaId) {
      setTrilha(null);
      setCarregando(false);
      return;
    }

    setCarregando(true);

    return onSnapshot(
      doc(db, 'trails', trilhaId),
      (snapshot) => {
        if (snapshot.exists()) {
          const dados = snapshot.data();

          setTrilha(
            dados.excluido === true
              ? null
              : {
                  id: snapshot.id,
                  nome: dados.nome ?? '',
                  descricao: dados.descricao ?? '',
                  dificuldade: dados.dificuldade ?? '',
                  duracao: dados.duracao ?? '',
                  imagem: dados.imagem ?? '',
                },
          );
        } else {
          setTrilha(
            trilhas.find((item) => item.id === trilhaId) ?? null,
          );
        }

        setCarregando(false);
      },
      (error) => {
        console.error('Erro ao carregar trilha:', error);

        setTrilha(
          trilhas.find((item) => item.id === trilhaId) ?? null,
        );

        setCarregando(false);

        Alert.alert(
          'Erro ao carregar trilha',
          'Não foi possível atualizar as informações. Verifique sua conexão e tente novamente.',
        );
      },
    );
  }, [trilhaId]);

  async function handleFavorito() {
    if (!trilha) return;

    if (!usuarioLogado) {
      Alert.alert(
        'Entre na sua conta',
        'Faça login para salvar suas trilhas favoritas.',
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

    await alternarFavorito('trilhas', trilha.id);
  }

  if (carregando) {
    return (
      <View style={[styles.container, styles.centralizado]}>
        <ActivityIndicator size="large" color="#246D2C" />
      </View>
    );
  }

  if (!trilha) {
    return (
      <View style={styles.container}>
        <UserAccountBar />

        <Text style={styles.title}>
          Trilha não encontrada
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Voltar
          </Text>
        </Pressable>
      </View>
    );
  }

  const imagemLocal = obterImagemTrilha(trilha);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <UserAccountBar />

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backText}>
          ← Voltar
        </Text>
      </Pressable>

      {imagemLocal ? (
        <Image
          source={imagemLocal}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.title}>
        {trilha.nome}
      </Text>

      <Text style={styles.description}>
        {trilha.descricao}
      </Text>

      <Pressable
        style={styles.favoriteButton}
        onPress={handleFavorito}
        disabled={estaAtualizando('trilhas', trilha.id)}
      >
        <Text style={styles.favoriteText}>
          {favoritos.trilhas.includes(trilha.id)
            ? '★ Favoritado'
            : '☆ Favoritar'}
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

  scrollContent: {
    paddingBottom: 40,
  },

  centralizado: {
    justifyContent: 'center',
    alignItems: 'center',
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
    lineHeight: 24,
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
