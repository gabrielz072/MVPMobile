import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const imagensATM = [
  'https://images.unsplash.com/photo-1511497584788-876760111969',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
];

export default function EventosScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>🎉 Eventos</Text>
      <Text style={styles.subtitle}>
        Encontros que celebram as montanhas e a natureza de Teresópolis.
      </Text>

      <Image source={{ uri: imagensATM[0] }} style={styles.heroImage} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Abertura da Temporada de Montanhismo
        </Text>
        <Text style={styles.cardText}>
          A Abertura da Temporada de Montanhismo, conhecida como ATM, é um dos
          eventos mais importantes do calendário outdoor de Teresópolis. O
          encontro acontece no Parque Nacional da Serra dos Órgãos (PARNASO) e
          reúne montanhistas, grupos de caminhada, escaladores, moradores e
          visitantes para celebrar o início da temporada nas montanhas.
        </Text>
      </View>

      <Image source={{ uri: imagensATM[1] }} style={styles.galleryImage} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Montanhas, esporte e encontro</Text>
        <Text style={styles.cardText}>
          A programação costuma valorizar a cultura do montanhismo por meio de
          atividades ao ar livre, caminhadas, escaladas, rodas de conversa,
          oficinas e momentos de integração. Mais do que marcar o começo de um
          período de maior movimento nas trilhas, a ATM aproxima o público da
          história, da paisagem e das práticas responsáveis que fazem parte da
          vida na Serra dos Órgãos.
        </Text>
        <Text style={styles.cardText}>
          O evento também reforça a importância da segurança e da conservação.
          Antes de visitar o parque, é importante conferir a programação e as
          regras da edição, respeitar as orientações da equipe, planejar o
          percurso e não deixar resíduos na natureza.
        </Text>
      </View>

      <Image source={{ uri: imagensATM[2] }} style={styles.galleryImage} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Uma celebração de Teresópolis</Text>
        <Text style={styles.cardText}>
          Realizada em um dos cenários mais emblemáticos do montanhismo
          brasileiro, a ATM destaca Teresópolis como a Capital Nacional do
          Montanhismo. É uma oportunidade para conhecer novas pessoas,
          descobrir atividades na serra e lembrar que a aventura fica ainda
          melhor quando caminhamos com cuidado e respeito pelo ambiente.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 20,
  },
  galleryImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: 'gray',
    lineHeight: 23,
    marginBottom: 12,
  },
});