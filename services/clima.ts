
const LATITUDE = -22.4167;
const LONGITUDE = -42.9756;

export interface DadosClima {
  cidade: string;
  temperatura: number;
  sensacaoTermica: number;
  umidade: number;
  vento: number;
  descricao: string;
  temperaturaMaxima: number;
  temperaturaMinima: number;
  probabilidadeChuva: number;
}

function descreverClima(codigo: number): string {
  const descricoes: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Predominantemente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Neblina',
    48: 'Neblina',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    61: 'Chuva leve',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    80: 'Pancadas de chuva',
    81: 'Pancadas de chuva',
    82: 'Pancadas de chuva fortes',
    95: 'Trovoadas',
    96: 'Trovoadas com granizo',
    99: 'Trovoadas fortes',
  };

  return descricoes[codigo] || 'Condição não identificada';
}

export async function buscarClima(): Promise<DadosClima> {
  const parametros = new URLSearchParams({
    latitude: String(LATITUDE),
    longitude: String(LONGITUDE),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
    ].join(','),
    timezone: 'America/Sao_Paulo',
    forecast_days: '1',
  });

  const resposta = await fetch(
    `https://api.open-meteo.com/v1/forecast?${parametros}`
  );

  if (!resposta.ok) {
    throw new Error('Não foi possível consultar o clima.');
  }

  const dados = await resposta.json();

  return {
    cidade: 'Teresópolis',
    temperatura: dados.current.temperature_2m,
    sensacaoTermica: dados.current.apparent_temperature,
    umidade: dados.current.relative_humidity_2m,
    vento: dados.current.wind_speed_10m,
    descricao: descreverClima(dados.current.weather_code),
    temperaturaMaxima: dados.daily.temperature_2m_max[0],
    temperaturaMinima: dados.daily.temperature_2m_min[0],
    probabilidadeChuva:
      dados.daily.precipitation_probability_max[0],
  };
}
