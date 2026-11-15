
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  buscarClima,
  DadosClima,
} from '../services/clima';

type DicaClima = {
  emoji: string;
  titulo: string;
  mensagem: string;
};

function obterDicaClima(clima: DadosClima): DicaClima {
  const temperatura = clima.temperatura;
  const chuva = clima.probabilidadeChuva;
  const descricao = clima.descricao.toLowerCase();

  const temTrovoada =
    descricao.includes('trovoada') ||
    descricao.includes('tempestade') ||
    descricao.includes('temporal');

  const estaChovendo =
    descricao.includes('chuva') ||
    descricao.includes('garoa') ||
    descricao.includes('chuvisco');

  // Segurança: chuva forte ou trovoadas têm prioridade.
  if (temTrovoada || (estaChovendo && chuva >= 70)) {
    return {
      emoji: '⛈️',
      titulo: 'Melhor aproveitar em segurança!',
      mensagem:
        'O tempo pede um passeio mais tranquilo. Que tal conhecer um restaurante ou aproveitar um espaço fechado? Deixe as trilhas para um dia mais seguro.',
    };
  }

  // Chuva com probabilidade elevada.
  if (chuva >= 60 || estaChovendo) {
    return {
      emoji: '☔',
      titulo: 'Um dia para curtir sem pressa',
      mensagem:
        'A previsão indica possibilidade de chuva. Que tal aproveitar a gastronomia de Teresópolis ou conhecer algum espaço cultural da cidade?',
    };
  }

  // Frio intenso.
  if (temperatura < 12) {
    return {
      emoji: '🍷',
      titulo: 'Dia de aconchego na serra!',
      mensagem:
        'O friozinho chegou! Que tal um jantar especial no Viva Italia e aproveitar o clima charmoso de Teresópolis?',
    };
  }

  // Frio agradável.
  if (temperatura < 18) {
    return {
      emoji: '☕',
      titulo: 'Aproveite o clima da serra!',
      mensagem:
        'Um clima perfeito para passear sem pressa, tomar um chocolate quente e curtir o aconchego que só Teresópolis tem.',
    };
  }

  // Temperatura ideal para atividades ao ar livre.
  if (temperatura < 24) {
    return {
      emoji: '🥾',
      titulo: 'Hoje combina com aventura!',
      mensagem:
        'O clima está convidativo! Que tal colocar um tênis confortável e explorar uma trilha ou apreciar as paisagens da Serra dos Órgãos?',
    };
  }

  // Dias mais quentes.
  if (temperatura <= 28) {
    return {
      emoji: '🌿',
      titulo: 'Dia perfeito para explorar!',
      mensagem:
        'Aproveite para conhecer o Lago Comary, visitar a Feirinha do Alto ou descobrir um cantinho especial de Teresópolis.',
    };
  }

  // Calor intenso.
  return {
    emoji: '💦',
    titulo: 'Vamos aproveitar e se refrescar!',
    mensagem:
      'O calor apareceu! Que tal conhecer uma cachoeira ou aproveitar um lugar fresquinho em meio à natureza? Não esqueça de beber bastante água!',
  };
}

export default function ClimaCard() {
  const [clima, setClima] = useState<DadosClima | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const atualizarClima = useCallback(async () => {
    try {
      setErro(false);
      setCarregando(true);

      const dados = await buscarClima();
      setClima(dados);
    } catch (error) {
      console.error('Erro ao carregar clima:', error);
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    atualizarClima();
  }, [atualizarClima]);

  if (carregando && !clima) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#246D2C" size="large" />
        <Text style={styles.loadingText}>
          Consultando o clima...
        </Text>
      </View>
    );
  }

  if (erro && !clima) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Clima em Teresópolis</Text>

        <Text style={styles.errorText}>
          Não foi possível carregar as informações do clima.
        </Text>

        <Pressable
          style={styles.refreshButton}
          onPress={atualizarClima}
        >
          <Text style={styles.refreshText}>
            Tentar novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!clima) return null;

  const dica = obterDicaClima(clima);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clima agora</Text>
          <Text style={styles.city}>Teresópolis, RJ</Text>
        </View>

        <Pressable
          onPress={atualizarClima}
          disabled={carregando}
          style={styles.refreshIcon}
        >
          {carregando ? (
            <ActivityIndicator color="#246D2C" />
          ) : (
            <Text style={styles.refreshSymbol}>↻</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.temperatureArea}>
        <Text style={styles.weatherEmoji}>🌤️</Text>

        <View>
          <Text style={styles.temperature}>
            {Math.round(clima.temperatura)}°
          </Text>

          <Text style={styles.description}>
            {clima.descricao}
          </Text>
        </View>
      </View>

      <Text style={styles.feelsLike}>
        Sensação térmica de {Math.round(clima.sensacaoTermica)}°
      </Text>

      <View style={styles.rangeArea}>
        <Text style={styles.rangeText}>
          ↑ {Math.round(clima.temperaturaMaxima)}° máxima
        </Text>

        <Text style={styles.rangeText}>
          ↓ {Math.round(clima.temperaturaMinima)}° mínima
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>💧</Text>
          <Text style={styles.detailValue}>
            {clima.umidade}%
          </Text>
          <Text style={styles.detailLabel}>Umidade</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>💨</Text>
          <Text style={styles.detailValue}>
            {Math.round(clima.vento)} km/h
          </Text>
          <Text style={styles.detailLabel}>Vento</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailEmoji}>🌧️</Text>
          <Text style={styles.detailValue}>
            {clima.probabilidadeChuva}%
          </Text>
          <Text style={styles.detailLabel}>Chance de chuva</Text>
        </View>
      </View>

      {/* Dica personalizada de acordo com o clima */}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipIcon}>{dica.emoji}</Text>

          <View style={styles.tipTitleArea}>
            <Text style={styles.tipEyebrow}>
              UMA DICA ESPECIAL PARA VOCÊ
            </Text>

            <Text style={styles.tipTitle}>
              {dica.titulo}
            </Text>
          </View>
        </View>

        <Text style={styles.tipMessage}>
          {dica.mensagem}
        </Text>
      </View>

      {erro && (
        <Text style={styles.warningText}>
          Não foi possível atualizar. Exibindo os últimos dados.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F4F0',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E4E8DF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1A481F',
  },

  city: {
    fontSize: 13,
    color: '#687568',
    marginTop: 3,
  },

  refreshIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8EFE5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  refreshSymbol: {
    fontSize: 25,
    color: '#246D2C',
  },

  temperatureArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 15,
  },

  weatherEmoji: {
    fontSize: 48,
  },

  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1A481F',
  },

  description: {
    fontSize: 15,
    color: '#536453',
  },

  feelsLike: {
    fontSize: 13,
    color: '#687568',
    marginTop: 8,
  },

  rangeArea: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
  },

  rangeText: {
    fontSize: 13,
    color: '#405540',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#DDE4D9',
    marginVertical: 17,
  },

  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailItem: {
    alignItems: 'center',
    flex: 1,
  },

  detailEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A481F',
  },

  detailLabel: {
    fontSize: 11,
    color: '#687568',
    marginTop: 4,
    textAlign: 'center',
  },

  tipCard: {
    backgroundColor: '#EAF1E5',
    borderRadius: 16,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#DCE8D5',
  },

  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tipIcon: {
    fontSize: 30,
    marginRight: 11,
  },

  tipTitleArea: {
    flex: 1,
  },

  tipEyebrow: {
    color: '#64814F',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  tipTitle: {
    color: '#1A481F',
    fontSize: 14,
    fontWeight: '900',
  },

  tipMessage: {
    color: '#536453',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 12,
  },

  loadingText: {
    color: '#536453',
    marginTop: 12,
    textAlign: 'center',
  },

  errorText: {
    color: '#8B3434',
    marginTop: 12,
    fontSize: 13,
  },

  refreshButton: {
    backgroundColor: '#246D2C',
    padding: 11,
    borderRadius: 10,
    marginTop: 14,
    alignItems: 'center',
  },

  refreshText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  warningText: {
    color: '#8B6630',
    fontSize: 11,
    marginTop: 12,
    textAlign: 'center',
  },
});
