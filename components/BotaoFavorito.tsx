
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  StyleSheet,
} from 'react-native';

type BotaoFavoritoProps = {
  salvo: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export default function BotaoFavorito({
  salvo,
  onPress,
  disabled = false,
}: BotaoFavoritoProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={
        salvo
          ? 'Remover dos favoritos'
          : 'Adicionar aos favoritos'
      }
      hitSlop={8}
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.pressionado,
        disabled && styles.desabilitado,
      ]}
    >
      <Ionicons
        name={salvo ? 'heart' : 'heart-outline'}
        size={22}
        color={salvo ? '#D94B50' : '#1A481F'}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#183B20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  pressionado: {
    transform: [{ scale: 0.92 }],
  },
  desabilitado: {
    opacity: 0.5,
  },
});
