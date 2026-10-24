
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const itens = [
  { label: 'Início', icone: '⌂', rota: '/' },
  { label: 'Onde ir', icone: '⌖', rota: '/explore' },
  { label: 'Trilhas', icone: '♧', rota: '/trilhas' },
  { label: 'Natureza', icone: '❧', rota: '/natureza' },
  { label: 'Eventos', icone: '▦', rota: '/eventos' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  function estaAtivo(rota: string) {
    if (rota === '/') return pathname === '/';
    if (rota === '/trilhas') {
      return [
        '/trilhas',
        '/pedra-do-sino',
        '/pedra-do-acu',
        '/escalavrado',
      ].includes(pathname);
    }

    return pathname === rota;
  }

  return (
    <View style={styles.container}>
      {itens.map((item) => {
        const ativo = estaAtivo(item.rota);

        return (
          <Pressable
            key={item.rota}
            style={styles.item}
            onPress={() => {
              if (!ativo) router.replace(item.rota as any);
            }}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: ativo }}
          >
            <View style={[styles.iconeContainer, ativo && styles.iconeAtivo]}>
              <Text style={[styles.icone, ativo && styles.textoAtivo]}>
                {item.icone}
              </Text>
            </View>

            <Text
              numberOfLines={1}
              style={[styles.label, ativo && styles.textoAtivo]}
            >
              {item.label}
            </Text>

            {ativo && <View style={styles.indicador} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e6e9e0',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minWidth: 0,
  },
  iconeContainer: {
    width: 42,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeAtivo: {
    backgroundColor: '#e8f2e5',
  },
  icone: {
    fontSize: 22,
    color: '#7c887a',
  },
  label: {
    fontSize: 10,
    color: '#697367',
    fontWeight: '600',
  },
  textoAtivo: {
    color: '#246D2C',
    fontWeight: '900',
  },
  indicador: {
    height: 3,
    width: 16,
    borderRadius: 3,
    backgroundColor: '#2F8F3A',
    marginTop: 1,
  },
});
