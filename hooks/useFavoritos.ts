
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

export type CategoriaFavorito =
  | 'trilhas'
  | 'natureza'
  | 'eventos';

export type ListaFavoritos = {
  trilhas: string[];
  natureza: string[];
  eventos: string[];
};

const FAVORITOS_VAZIOS: ListaFavoritos = {
  trilhas: [],
  natureza: [],
  eventos: [],
};

export function useFavoritos() {
  const { user } = useAuth();

  const [favoritos, setFavoritos] =
    useState<ListaFavoritos>(FAVORITOS_VAZIOS);

  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] =
    useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) {
      setFavoritos(FAVORITOS_VAZIOS);
      setCarregando(false);
      return;
    }

    setCarregando(true);

    const referencia = doc(db, 'users', user.uid);

    return onSnapshot(
      referencia,
      (snapshot) => {
        const dados = snapshot.data()?.favoritos ?? {};

        setFavoritos({
          trilhas: Array.isArray(dados.trilhas)
            ? dados.trilhas
            : [],
          natureza: Array.isArray(dados.natureza)
            ? dados.natureza
            : [],
          eventos: Array.isArray(dados.eventos)
            ? dados.eventos
            : [],
        });

        setCarregando(false);
      },
      (erro) => {
        console.error('Erro ao carregar favoritos:', erro);
        setCarregando(false);
      },
    );
  }, [user?.uid]);

  const alternarFavorito = useCallback(
    async (
      categoria: CategoriaFavorito,
      id: string,
    ): Promise<boolean> => {
      if (!user) return false;

      const chave = `${categoria}-${id}`;

      if (atualizando[chave]) return false;

      setAtualizando((anterior) => ({
        ...anterior,
        [chave]: true,
      }));

      try {
        const jaFavoritado =
          favoritos[categoria].includes(id);

        const referencia = doc(db, 'users', user.uid);

        await updateDoc(referencia, {
          [`favoritos.${categoria}`]: jaFavoritado
            ? arrayRemove(id)
            : arrayUnion(id),
        });

        return true;
      } catch (erro) {
        console.error('Erro ao atualizar favorito:', erro);

        Alert.alert(
          'Não foi possível atualizar',
          'Verifique sua conexão e tente novamente.',
        );

        return false;
      } finally {
        setAtualizando((anterior) => ({
          ...anterior,
          [chave]: false,
        }));
      }
    },
    [user, favoritos, atualizando],
  );

  return {
    favoritos,
    carregando,
    alternarFavorito,
    usuarioLogado: Boolean(user),
    estaAtualizando: (
      categoria: CategoriaFavorito,
      id: string,
    ) => Boolean(atualizando[`${categoria}-${id}`]),
  };
}
