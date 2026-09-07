import { TrilhaDetalhe } from '@/components/TrilhaDetalhe';

export default function PedraDoAcuScreen() {
  return (
    <TrilhaDetalhe
      id="3"
      nome="Pedra do Açu"
      imagem="https://images.unsplash.com/photo-1464278533981-50106e6176b1"
      texto="A Pedra do Açu é uma das atrações mais famosas do Parque Nacional da Serra dos Órgãos. A trilha combina subidas desafiadoras, campos de altitude e um visual privilegiado das montanhas. No caminho, é possível observar a transição da floresta para a vegetação mais baixa das áreas elevadas, além de diferentes formações rochosas. No topo, as pedras criam um cenário especial para contemplar a natureza, descansar e apreciar a paisagem de Teresópolis. Como o clima pode mudar rapidamente, é importante levar água, proteção contra o sol e roupas adequadas."
      dificuldade="Moderada"
      duracao="Aproximadamente 4 horas"
    />
  );
}