import { UserAccountBar } from '@/components/UserAccountBar';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function NaturezaScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <UserAccountBar />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>🌳 Natureza</Text>
      <Text style={styles.subtitle}>
        Biodiversidade e montanhas que fazem de Teresópolis um destino especial.
      </Text>

      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1448375240586-882707db888b' }}
        style={styles.image}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Natureza e montanhismo</Text>
        <Text style={styles.cardText}>
          Teresópolis está inserida no bioma da Mata Atlântica, um dos ambientes
          mais ricos e ameaçados do Brasil. A cidade abriga áreas de floresta,
          rios, cachoeiras, encostas e campos de altitude, criando diferentes
          habitats para a vida silvestre. No Parque Nacional da Serra dos Órgãos
          e em outras áreas preservadas, é possível encontrar uma grande
          variedade de árvores, bromélias, orquídeas, aves, pequenos mamíferos e
          outros animais. Essa diversidade torna a região importante para a
          conservação e para a observação da natureza.
        </Text>
        <Text style={styles.cardText}>
          Teresópolis também é conhecida como a Capital Nacional do Montanhismo
          por sua história ligada às montanhas da Serra dos Órgãos e pela
          variedade de experiências ao ar livre que oferece. A cidade reúne
          trilhas, travessias, escaladas e vias de diferentes níveis de
          dificuldade. As formações rochosas e os cenários de Pedra do Sino,
          Pedra do Açu e Escalavrado atraem montanhistas e visitantes durante
          todo o ano. Para aproveitar esses lugares com segurança, é importante
          consultar as condições da trilha, respeitar os limites do parque,
          levar água e evitar deixar qualquer resíduo pelo caminho.
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
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: 210,
    borderRadius: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
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