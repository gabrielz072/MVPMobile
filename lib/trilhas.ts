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

export const TRILHAS_PUBLICAS: Trilha[] = [
  {
    id: '2',
    nome: 'Escalavrado',
    descricao: 'Conheça uma das montanhas mais marcantes da Serra dos Órgãos.',
    dificuldade: 'Desafiadora',
    duracao: 'Aproximadamente 5 horas',
    imagem:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85',
  },
  {
    id: '3',
    nome: 'Pedra do Açu',
    descricao: 'Explore paisagens montanhosas e cenários naturais impressionantes.',
    dificuldade: 'Desafiadora',
    duracao: 'Aproximadamente 4 horas',
    imagem:
      'https://images.unsplash.com/photo-1464278533981-50106e6176b1?w=1200&q=85',
  },
  {
    id: '1',
    nome: 'Pedra do Sino',
    descricao: 'Descubra uma das experiências de montanha mais conhecidas da região.',
    dificuldade: 'Desafiadora',
    duracao: 'Aproximadamente 6 horas',
    imagem:
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=85',
  },
];

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
    (trilha) => !idsIniciais.has(trilha.id) && !excluidos.has(trilha.id),
  );

  return [...iniciaisAtualizadas, ...novas];
}
