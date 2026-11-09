export type BlocoNatureza = {
  id: string;
  tipo: 'texto' | 'imagem';
  titulo: string;
  conteudo: string;
  imagem: string;
};

export type ConteudoNatureza = {
  subtitle: string;
  heroImage: string;
  heroTitle: string;
  heroDescription: string;
  contentBlocks: BlocoNatureza[];
};

export const CONTEUDO_NATUREZA_PADRAO: ConteudoNatureza = {
  subtitle:
    'Biodiversidade e montanhas que fazem de Teresópolis um destino especial.',
  heroImage:
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=85',
  heroTitle: 'Um encontro com a natureza',
  heroDescription:
    'Descubra a beleza da Mata Atlântica e das montanhas da Serra dos Órgãos.',
  contentBlocks: [
    {
      id: 'mata-atlantica',
      tipo: 'texto',
      titulo: 'Biodiversidade da Mata Atlântica',
      conteudo:
        'Teresópolis está inserida no bioma da Mata Atlântica, um dos ambientes mais ricos e ameaçados do Brasil. A cidade abriga áreas de floresta, rios, cachoeiras, encostas e campos de altitude, criando diferentes habitats para a vida silvestre. No Parque Nacional da Serra dos Órgãos e em outras áreas preservadas, é possível encontrar uma grande variedade de árvores, bromélias, orquídeas, aves, pequenos mamíferos e outros animais. Essa diversidade torna a região importante para a conservação e para a observação da natureza.',
      imagem: '',
    },
    {
      id: 'imagem-montanhas',
      tipo: 'imagem',
      titulo: 'As montanhas da Serra dos Órgãos',
      conteudo: '',
      imagem:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    },
    {
      id: 'montanhismo',
      tipo: 'texto',
      titulo: 'A Capital Nacional do Montanhismo',
      conteudo:
        'Teresópolis também é conhecida como a Capital Nacional do Montanhismo por sua história ligada às montanhas da Serra dos Órgãos e pela variedade de experiências ao ar livre que oferece. A cidade reúne trilhas, travessias, escaladas e vias de diferentes níveis de dificuldade. As formações rochosas e os cenários de Pedra do Sino, Pedra do Açu e Escalavrado atraem montanhistas e visitantes durante todo o ano. Para aproveitar esses lugares com segurança, é importante consultar as condições da trilha, respeitar os limites do parque, levar água e evitar deixar qualquer resíduo pelo caminho.',
      imagem: '',
    },
    {
      id: 'conservacao',
      tipo: 'texto',
      titulo: 'Preserve para continuar descobrindo',
      conteudo:
        'Respeite as orientações locais, cuide das trilhas e leve seus resíduos de volta. A conservação também faz parte da aventura.',
      imagem: '',
    },
  ],
};
