import { router } from 'expo-router';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { UserAccountBar } from '@/components/UserAccountBar';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

const imagensATM = [
  'https://images.unsplash.com/photo-1511497584788-876760111969',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
];

type Evento = {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  program: string;
  closing: string;
};

const eventoPadrao: Evento = {
  title: 'Abertura da Temporada de Montanhismo',
  subtitle: 'Encontros que celebram as montanhas e a natureza de Teresópolis.',
  heroImage: imagensATM[0],
  description:
    'A Abertura da Temporada de Montanhismo, conhecida como ATM, é um dos eventos mais importantes do calendário outdoor de Teresópolis. O encontro acontece no Parque Nacional da Serra dos Órgãos (PARNASO) e reúne montanhistas, grupos de caminhada, escaladores, moradores e visitantes para celebrar o início da temporada nas montanhas.',
  program:
    'A programação costuma valorizar a cultura do montanhismo por meio de atividades ao ar livre, caminhadas, escaladas, rodas de conversa, oficinas e momentos de integração. Mais do que marcar o começo de um período de maior movimento nas trilhas, a ATM aproxima o público da história, da paisagem e das práticas responsáveis que fazem parte da vida na Serra dos Órgãos.',
  closing:
    'Realizada em um dos cenários mais emblemáticos do montanhismo brasileiro, a ATM destaca Teresópolis como a Capital Nacional do Montanhismo. É uma oportunidade para conhecer novas pessoas, descobrir atividades na serra e lembrar que a aventura fica ainda melhor quando caminhamos com cuidado e respeito pelo ambiente.',
};

export default function EventosScreen() {
  const { role } = useAuth();
  const [evento, setEvento] = useState(eventoPadrao);
  const [rascunho, setRascunho] = useState(eventoPadrao);
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'events', 'atm'), (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.data();
      const atualizado: Evento = {
        title: data.title || eventoPadrao.title,
        subtitle: data.subtitle || eventoPadrao.subtitle,
        heroImage: data.heroImage || eventoPadrao.heroImage,
        description: data.description || eventoPadrao.description,
        program: data.program || eventoPadrao.program,
        closing: data.closing || eventoPadrao.closing,
      };
      setEvento(atualizado);
      setRascunho(atualizado);
    });
  }, []);

  async function salvarEvento() {
    try {
      await setDoc(doc(db, 'events', 'atm'), rascunho, { merge: true });
      setEvento(rascunho);
      setEditando(false);
      Alert.alert('Evento atualizado', 'As alterações já estão disponíveis para os usuários.');
    } catch {
      Alert.alert('Acesso negado', 'Somente administradores podem alterar eventos.');
    }
  }

  function atualizarCampo(campo: keyof Evento, valor: string) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <UserAccountBar />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>🎉 Eventos</Text>
      {role === 'admin' && (
        <Pressable style={styles.editButton} onPress={() => setEditando((atual) => !atual)}>
          <Text style={styles.editButtonText}>{editando ? 'Cancelar edição' : 'Editar evento'}</Text>
        </Pressable>
      )}

      {editando ? (
        <View style={styles.editor}>
          <TextInput style={styles.editorInput} value={rascunho.title} onChangeText={(valor) => atualizarCampo('title', valor)} placeholder="Título" />
          <TextInput style={styles.editorInput} value={rascunho.subtitle} onChangeText={(valor) => atualizarCampo('subtitle', valor)} placeholder="Subtítulo" />
          <TextInput style={styles.editorInput} value={rascunho.heroImage} onChangeText={(valor) => atualizarCampo('heroImage', valor)} placeholder="URL da imagem principal" autoCapitalize="none" />
          <TextInput style={[styles.editorInput, styles.editorTextArea]} value={rascunho.description} onChangeText={(valor) => atualizarCampo('description', valor)} placeholder="Descrição" multiline />
          <TextInput style={[styles.editorInput, styles.editorTextArea]} value={rascunho.program} onChangeText={(valor) => atualizarCampo('program', valor)} placeholder="Programação" multiline />
          <TextInput style={[styles.editorInput, styles.editorTextArea]} value={rascunho.closing} onChangeText={(valor) => atualizarCampo('closing', valor)} placeholder="Texto final" multiline />
          <Pressable style={styles.saveButton} onPress={salvarEvento}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.subtitle}>{evento.subtitle}</Text>
      )}

      <Image source={{ uri: evento.heroImage }} style={styles.heroImage} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {evento.title}
        </Text>
        <Text style={styles.cardText}>
          {evento.description}
        </Text>
      </View>

      <Image source={{ uri: imagensATM[1] }} style={styles.galleryImage} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Montanhas, esporte e encontro</Text>
        <Text style={styles.cardText}>
          {evento.program}
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
          {evento.closing}
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
  editButton: {
    backgroundColor: '#2E5D3B',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  editor: {
    marginBottom: 20,
  },
  editorInput: {
    borderWidth: 1,
    borderColor: '#C8D4C8',
    borderRadius: 8,
    backgroundColor: '#F8FBF7',
    padding: 12,
    marginBottom: 10,
  },
  editorTextArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#173D25',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});