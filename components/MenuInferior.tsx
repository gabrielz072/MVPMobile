
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const VERDE = '#246D2C';
const VERDE_ESCURO = '#1A481F';
const CINZA = '#8A938A';

const ITENS = [
  { label: 'Início', icon: 'home-outline' as const, activeIcon: 'home' as const, path: '/' },
  { label: 'Explorar', icon: 'compass-outline' as const, activeIcon: 'compass' as const, path: '/explore' },
  { label: 'Natureza', icon: 'leaf-outline' as const, activeIcon: 'leaf' as const, path: '/natureza' },
  { label: 'Eventos', icon: 'calendar-outline' as const, activeIcon: 'calendar' as const, path: '/eventos' },
  { label: 'Perfil', icon: 'person-circle-outline' as const, activeIcon: 'person-circle' as const, path: '/(tabs)/perfil' },
];

export default function MenuInferior() {
  const pathname = usePathname();

  const ativo = (path: string) => {
    if (path === '/') return pathname === '/' || pathname === '/index';
    if (path === '/explore') {
      return (
        pathname === '/explore' ||
        pathname === '/trilhas' ||
        pathname === '/trilha' ||
        pathname === '/pedra-do-sino' ||
        pathname === '/pedra-do-acu' ||
        pathname === '/escalavrado'
      );
    }
    if (path === '/(tabs)/perfil') {
      return pathname === '/perfil' || pathname.startsWith('/perfil/');
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <View
      style={styles.container}
    >
      {ITENS.map((item) => {
        const selecionado = ativo(item.path);

        return (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: selecionado }}
            onPress={() => {
              if (!selecionado) router.navigate(item.path as never);
            }}
            style={({ pressed }) => [
              styles.item,
              pressed && styles.pressionado,
            ]}
          >
            <View style={styles.iconeArea}>
              {selecionado && <View style={styles.indicador} />}
              <Ionicons
                name={selecionado ? item.activeIcon : item.icon}
                size={23}
                color={selecionado ? VERDE : CINZA}
              />
            </View>
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                { color: selecionado ? VERDE_ESCURO : CINZA },
                selecionado && styles.labelAtivo,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: Platform.OS === 'ios' ? 10 : 12,
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    paddingHorizontal: 3,
    paddingTop: 7,
    paddingBottom: 5,
    elevation: 12,
    shadowColor: '#183B20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E8EEE7',
  },

  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  pressionado: {
    opacity: 0.7,
  },
  iconeArea: {
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicador: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: VERDE,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  labelAtivo: {
    fontWeight: '700',
  },
});
