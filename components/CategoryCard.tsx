import { View, Text, StyleSheet, Pressable } from 'react-native';

type CategoryCardProps = {
  title: string;
  description: string
  onPress?: () => void;
};

export function CategoryCard({
  title,
  description,
  onPress,
}: CategoryCardProps) {

  return (
    <Pressable style={styles.card}
    onPress={onPress}
    >
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },

  description: {
    fontSize: 15,
    color: 'gray',
  },
});