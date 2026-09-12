import { CategoryCard } from '@/components/CategoryCard';
import { UserAccountBar } from '@/components/UserAccountBar';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>

  <UserAccountBar />

  <Text style={styles.title}>
    Onde ir? 🧭
  </Text>

  <Text style={styles.subtitle}>
    Descubra lugares para conhecer em Teresópolis.
  </Text>

  <CategoryCard
    title="🥾 Trilhas"
    description="Explore as trilhas de Teresópolis"
    onPress={() => router.push("/trilhas")}
  />

  <CategoryCard
    title="🌳 Natureza"
    description="Conheça parques e atrações naturais"
    onPress={() => router.push("/natureza")}
  />

  <CategoryCard
    title="🎉 Eventos"
    description="Fique por dentro dos eventos da cidade"
    onPress={() => router.push("/eventos")}
  />

</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
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
    marginBottom: 30,
  },

  card: {
    backgroundColor: 'rgba(40, 95, 48, 0.32)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 15,
    color: 'gray',
  },
});