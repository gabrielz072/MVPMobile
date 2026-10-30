
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';

const VERDE = '#246D2C';
const CINZA = '#879087';
const FUNDO = '#FFFFFF';

function IconeAba({
  name,
  color,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <View style={styles.iconeContainer}>
      {focused && <View style={styles.indicador} />}
      <Ionicons name={name} size={23} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: VERDE,
        tabBarInactiveTintColor: CINZA,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.menu,
        tabBarItemStyle: styles.item,
        tabBarBackground: () => <View style={styles.fundo} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => (
            <IconeAba
              name={focused ? 'home' : 'home-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ color, focused }) => (
            <IconeAba
              name={focused ? 'compass' : 'compass-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
  name="natureza"
  options={{
    title: 'Natureza',
    tabBarIcon: ({ color, focused }) => (
      <IconeAba
        name={focused ? 'leaf' : 'leaf-outline'}
        color={color}
        focused={focused}
      />
    ),
  }}
/>

      <Tabs.Screen
  name="eventos"
  options={{
    title: 'Eventos',
    tabBarIcon: ({ color, focused }) => (
      <IconeAba
        name={focused ? 'calendar' : 'calendar-outline'}
        color={color}
        focused={focused}
      />
    ),
  }}
/>

      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <IconeAba
              name={focused ? 'person-circle' : 'person-circle-outline'}
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: Platform.OS === 'ios' ? 10 : 12,
    height: 68,
    paddingTop: 7,
    paddingBottom: 5,
    paddingHorizontal: 3,
    borderTopWidth: 0,
    borderRadius: 23,
    backgroundColor: FUNDO,
    elevation: 12,
    shadowColor: '#183B20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  fundo: {
    flex: 1,
    backgroundColor: FUNDO,
    borderRadius: 23,
  },
  item: {
    paddingVertical: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  iconeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 38,
  },
  indicador: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: VERDE,
  },
});
