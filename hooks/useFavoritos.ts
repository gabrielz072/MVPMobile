
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  doc,
  onSnapshot,
  runTransaction,
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

function listaDeIds(valor: unknown): string[] {
  return Array.isArray(valor)
    ? valor.filter((id): id is string => typeof id === 'string')
    : [];
}

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
        const favoritosSalvos: unknown = snapshot.data()?.favoritos;
        const dados =
          typeof favoritosSalvos === 'object' && favoritosSalvos !== null
            ? favoritosSalvos as Record<string, unknown>
            : {};

        setFavoritos({
          trilhas: Array.isArray(favoritosSalvos)
            ? listaDeIds(favoritosSalvos)
            : listaDeIds(dados.trilhas),
          natureza: listaDeIds(dados.natureza),
          eventos: listaDeIds(dados.eventos),
        });

        setCarregando(false);
      },
      (erro) => {
        console.error('Erro ao carregar favoritos:', erro);
        setCarregando(false);
      },
    );
  }, [user]);

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
        const referencia = doc(db, 'users', user.uid);

        await runTransaction(db, async (transaction) => {
          const perfil = await transaction.get(referencia);

          if (!perfil.exists()) {
            throw new Error('O perfil do usuário não foi encontrado.');
          }

          const favoritosSalvos: unknown = perfil.data().favoritos;
          const dados =
            typeof favoritosSalvos === 'object' && favoritosSalvos !== null
              ? favoritosSalvos as Record<string, unknown>
              : {};
          const trilhasAtuais = Array.isArray(favoritosSalvos)
            ? listaDeIds(favoritosSalvos)
            : listaDeIds(dados.trilhas);
          const listaAtual = categoria === 'trilhas'
            ? trilhasAtuais
            : listaDeIds(dados[categoria]);
          const listaAtualizada = listaAtual.includes(id)
            ? listaAtual.filter((favoritoId) => favoritoId !== id)
            : [...listaAtual, id];

          transaction.set(
            referencia,
            {
              favoritos: {
                trilhas: categoria === 'trilhas'
                  ? listaAtualizada
                  : trilhasAtuais,
                natureza: categoria === 'natureza'
                  ? listaAtualizada
                  : listaDeIds(dados.natureza),
                eventos: categoria === 'eventos'
                  ? listaAtualizada
                  : listaDeIds(dados.eventos),
              },
            },
            { merge: true },
          );
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
    [user, atualizando],
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
