import { UserAccountBar } from '@/components/UserAccountBar';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { trilhas } from './data/trilhas';

export default function TrilhasScreen() {
  return (
    <View style={styles.container}> 

      <UserAccountBar />

      <Text style={styles.title}>
        🥾 Trilhas
      </Text>

      <Text style={styles.subtitle}>
        Explore as trilhas de Teresópolis.
      </Text>

      {trilhas.map((trilha) => (
        <Pressable
        key={trilha.id}
        style={styles.card}
        onPress={() => {
          if (trilha.id === '1') router.push('/pedra-do-sino');
          if (trilha.id === '2') router.push('/escalavrado');
          if (trilha.id === '3') router.push('/pedra-do-acu');
        }}
>
          
          <Text style={styles.cardTitle}>
            {trilha.nome}
          </Text>

          <Text style={styles.cardDescription}>
            {trilha.descricao}
          </Text>

        </Pressable>
      ))}

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
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  cardDescription: {
    fontSize: 15,
    color: 'gray',
  },
});