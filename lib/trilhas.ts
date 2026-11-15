
import { trilhas as dadosLocais } from '../app/data/trilhas';

export type Trilha = {
  id: string;
  nome: string;
  descricao: string;
  dificuldade: string;
  duracao: string;
  imagem: string;
};

export const TRILHAS_INICIAIS: Trilha[] = dadosLocais.map((trilha) => ({
  ...trilha,
}));

// As trilhas antigas não devem mais aparecer na listagem.
const IDS_TRILHAS_ANTIGAS = new Set(['1', '2', '3']);

// As trilhas públicas agora são somente as duas cadastradas em dadosLocais.
export const TRILHAS_PUBLICAS: Trilha[] = TRILHAS_INICIAIS;

export function combinarTrilhas(
  trilhasSalvas: Trilha[],
  idsExcluidos: string[] = [],
  trilhasPadrao: Trilha[] = TRILHAS_INICIAIS,
): Trilha[] {
  const excluidos = new Set(idsExcluidos);

  const salvasPorId = new Map(
    trilhasSalvas.map((trilha) => [trilha.id, trilha]),
  );

  const idsIniciais = new Set(trilhasPadrao.map((trilha) => trilha.id));

  const iniciaisAtualizadas = trilhasPadrao
    .filter((trilha) => !excluidos.has(trilha.id))
    .map((trilha) => ({
      ...trilha,
      ...salvasPorId.get(trilha.id),
    }));

  const novas = trilhasSalvas.filter(
    (trilha) =>
      !idsIniciais.has(trilha.id) &&
      !IDS_TRILHAS_ANTIGAS.has(trilha.id) &&
      !excluidos.has(trilha.id),
  );

  return [...iniciaisAtualizadas, ...novas];
}
