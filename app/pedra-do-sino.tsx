import { TrilhaDetalhe } from '@/components/TrilhaDetalhe';

export default function PedraDoSinoScreen() {
  return (
    <TrilhaDetalhe
      id="1"
      nome="Pedra do Sino"
      imagem="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
      texto="A trilha da Pedra do Sino leva ao ponto mais alto da Serra dos Órgãos. O caminho atravessa a Mata Atlântica e oferece paisagens amplas das montanhas de Teresópolis. Ao longo da subida, o cenário muda entre trechos de floresta, campos de altitude e grandes paredões de pedra. No topo, as formações rochosas e o horizonte da serra proporcionam um dos visuais mais marcantes do parque. É uma caminhada longa e exigente, indicada para quem tem bom preparo físico, planejamento e atenção às mudanças de clima."
      dificuldade="Difícil"
      duracao="Aproximadamente 6 horas"
    />
  );
}