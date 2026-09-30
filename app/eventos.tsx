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

type BlocoEvento = {
  id: string;
  type: 'text' | 'image';
  title?: string;
  body?: string;
  url?: string;
};

type Evento = {
  subtitle: string;
  heroImage: string;
  contentBlocks: BlocoEvento[];
};

const eventoPadrao: Evento = {
  subtitle: 'Encontros que celebram as montanhas e a natureza de Teresópolis.',
  heroImage: imagensATM[0],
  contentBlocks: [
    {
      id: 'description',
      type: 'text',
      title: 'Abertura da Temporada de Montanhismo',
      body:
        'A Abertura da Temporada de Montanhismo, conhecida como ATM, é um dos eventos mais importantes do calendário outdoor de Teresópolis. O encontro acontece no Parque Nacional da Serra dos Órgãos (PARNASO) e reúne montanhistas, grupos de caminhada, escaladores, moradores e visitantes para celebrar o início da temporada nas montanhas.',
    },
    { id: 'gallery-0', type: 'image', url: imagensATM[1] },
    {
      id: 'program',
      type: 'text',
      title: 'Montanhas, esporte e encontro',
      body:
        'A programação costuma valorizar a cultura do montanhismo por meio de atividades ao ar livre, caminhadas, escaladas, rodas de conversa, oficinas e momentos de integração. Mais do que marcar o começo de um período de maior movimento nas trilhas, a ATM aproxima o público da história, da paisagem e das práticas responsáveis que fazem parte da vida na Serra dos Órgãos.',
    },
    {
      id: 'conservation',
      type: 'text',
      body:
        'O evento também reforça a importância da segurança e da conservação. Antes de visitar o parque, é importante conferir a programação e as regras da edição, respeitar as orientações da equipe, planejar o percurso e não deixar resíduos na natureza.',
    },
    { id: 'gallery-1', type: 'image', url: imagensATM[2] },
    {
      id: 'closing',
      type: 'text',
      title: 'Uma celebração de Teresópolis',
      body:
        'Realizada em um dos cenários mais emblemáticos do montanhismo brasileiro, a ATM destaca Teresópolis como a Capital Nacional do Montanhismo. É uma oportunidade para conhecer novas pessoas, descobrir atividades na serra e lembrar que a aventura fica ainda melhor quando caminhamos com cuidado e respeito pelo ambiente.',
    },
  ],
};

function blocosLegados(data: Record<string, any>): BlocoEvento[] {
  if (Array.isArray(data.contentBlocks)) {
    return data.contentBlocks.map((bloco, indice) => ({
      id: typeof bloco.id === 'string' ? bloco.id : `bloco-${indice}`,
      type: bloco.type === 'image' ? 'image' : 'text',
      title: typeof bloco.title === 'string' ? bloco.title : '',
      body: typeof bloco.body === 'string' ? bloco.body : '',
      url: typeof bloco.url === 'string' ? bloco.url : '',
    }));
  }

  const imagens = Array.isArray(data.galleryImages)
    ? data.galleryImages
    : imagensATM.slice(1);
  const textosAdicionais = Array.isArray(data.additionalTexts)
    ? data.additionalTexts
    : [];

  return [
    {
      id: 'description',
      type: 'text',
      title: data.title || 'Abertura da Temporada de Montanhismo',
      body: data.description || eventoPadrao.contentBlocks[0].body,
    },
    ...textosAdicionais.map((body: string, indice: number) => ({
      id: `texto-adicional-${indice}`,
      type: 'text' as const,
      title: '',
      body,
    })),
    ...(imagens[0] ? [{ id: 'gallery-0', type: 'image' as const, url: imagens[0] }] : []),
    {
      id: 'program',
      type: 'text',
      title: data.programTitle || 'Montanhas, esporte e encontro',
      body: data.program || eventoPadrao.contentBlocks[2].body,
    },
    {
      id: 'conservation',
      type: 'text',
      title: '',
      body:
        data.conservation ||
        eventoPadrao.contentBlocks[3].body,
    },
    ...imagens.slice(1).map((url: string, indice: number) => ({
      id: `gallery-${indice + 1}`,
      type: 'image' as const,
      url,
    })),
    {
      id: 'closing',
      type: 'text',
      title: data.closingTitle || 'Uma celebração de Teresópolis',
      body: data.closing || eventoPadrao.contentBlocks[5].body,
    },
  ];
}

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
        subtitle: data.subtitle || eventoPadrao.subtitle,
        heroImage: data.heroImage || eventoPadrao.heroImage,
        contentBlocks: blocosLegados(data),
      };
      setEvento(atualizado);
      setRascunho(atualizado);
    });
  }, []);

  async function salvarEvento() {
    try {
      const atualizado = {
        ...rascunho,
        contentBlocks: rascunho.contentBlocks.filter((bloco) =>
          bloco.type === 'image' ? bloco.url?.trim() : bloco.title?.trim() || bloco.body?.trim(),
        ),
      };
      await setDoc(doc(db, 'events', 'atm'), atualizado, { merge: true });
      setEvento(atualizado);
      setRascunho(atualizado);
      setEditando(false);
      Alert.alert('Evento atualizado', 'As alterações já estão disponíveis para os usuários.');
    } catch {
      Alert.alert('Acesso negado', 'Somente administradores podem alterar eventos.');
    }
  }

  function atualizarCampo(campo: 'subtitle' | 'heroImage', valor: string) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  function atualizarBloco(id: string, alteracoes: Partial<BlocoEvento>) {
    setRascunho((atual) => ({
      ...atual,
      contentBlocks: atual.contentBlocks.map((bloco) =>
        bloco.id === id ? { ...bloco, ...alteracoes } : bloco,
      ),
    }));
  }

  function moverBloco(indice: number, direcao: -1 | 1) {
    setRascunho((atual) => {
      const novoIndice = indice + direcao;
      if (novoIndice < 0 || novoIndice >= atual.contentBlocks.length) return atual;

      const contentBlocks = [...atual.contentBlocks];
      [contentBlocks[indice], contentBlocks[novoIndice]] = [
        contentBlocks[novoIndice],
        contentBlocks[indice],
      ];
      return { ...atual, contentBlocks };
    });
  }

  function adicionarBloco(type: BlocoEvento['type']) {
    const id = `bloco-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const bloco: BlocoEvento = type === 'image'
      ? { id, type, url: '' }
      : { id, type, title: '', body: '' };
    setRascunho((atual) => ({
      ...atual,
      contentBlocks: [...atual.contentBlocks, bloco],
    }));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <UserAccountBar />
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>🎉 Eventos</Text>
      {role === 'admin' && (
        <Pressable
          style={styles.editButton}
          onPress={() => {
            if (editando) setRascunho(evento);
            setEditando((atual) => !atual);
          }}
        >
          <Text style={styles.editButtonText}>{editando ? 'Cancelar edição' : 'Editar evento'}</Text>
        </Pressable>
      )}

      {editando ? (
        <View style={styles.editor}>
          <Text style={styles.fieldLabel}>Subtítulo</Text>
          <TextInput style={styles.editorInput} value={rascunho.subtitle} onChangeText={(valor) => atualizarCampo('subtitle', valor)} placeholder="Subtítulo" />
          <Text style={styles.fieldLabel}>URL da foto de capa</Text>
          <TextInput style={styles.editorInput} value={rascunho.heroImage} onChangeText={(valor) => atualizarCampo('heroImage', valor)} placeholder="URL da imagem principal" autoCapitalize="none" />
          <Text style={styles.fieldLabel}>Conteúdo do evento</Text>
          {rascunho.contentBlocks.map((bloco, indice) => (
            <View key={bloco.id} style={styles.blockEditor}>
              <View style={styles.blockEditorHeader}>
                <Text style={styles.blockType}>{bloco.type === 'image' ? 'Foto' : 'Texto'}</Text>
                <View style={styles.blockActions}>
                  <Pressable
                    style={[styles.orderButton, indice === 0 && styles.disabledButton]}
                    onPress={() => moverBloco(indice, -1)}
                    disabled={indice === 0}
                    accessibilityRole="button"
                    accessibilityLabel={`Mover bloco ${indice + 1} para cima`}
                  >
                    <Text style={styles.orderButtonText}>Subir</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.orderButton, indice === rascunho.contentBlocks.length - 1 && styles.disabledButton]}
                    onPress={() => moverBloco(indice, 1)}
                    disabled={indice === rascunho.contentBlocks.length - 1}
                    accessibilityRole="button"
                    accessibilityLabel={`Mover bloco ${indice + 1} para baixo`}
                  >
                    <Text style={styles.orderButtonText}>Descer</Text>
                  </Pressable>
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => setRascunho((atual) => ({
                      ...atual,
                      contentBlocks: atual.contentBlocks.filter((item) => item.id !== bloco.id),
                    }))}
                    accessibilityRole="button"
                    accessibilityLabel={`Remover bloco ${indice + 1}`}
                  >
                    <Text style={styles.removeImageText}>Remover</Text>
                  </Pressable>
                </View>
              </View>
              {bloco.type === 'image' ? (
                <TextInput
                  style={styles.editorInput}
                  value={bloco.url}
                  onChangeText={(valor) => atualizarBloco(bloco.id, { url: valor })}
                  placeholder="URL da foto"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              ) : (
                <>
                  <TextInput
                    style={styles.editorInput}
                    value={bloco.title}
                    onChangeText={(valor) => atualizarBloco(bloco.id, { title: valor })}
                    placeholder="Título (opcional)"
                  />
                  <TextInput
                    style={[styles.editorInput, styles.editorTextArea]}
                    value={bloco.body}
                    onChangeText={(valor) => atualizarBloco(bloco.id, { body: valor })}
                    placeholder="Texto"
                    multiline
                  />
                </>
              )}
            </View>
          ))}
          <View style={styles.addBlockActions}>
            <Pressable style={styles.addImageButton} onPress={() => adicionarBloco('text')}>
              <Text style={styles.addImageText}>+ Adicionar texto</Text>
            </Pressable>
            <Pressable style={styles.addImageButton} onPress={() => adicionarBloco('image')}>
              <Text style={styles.addImageText}>+ Adicionar foto</Text>
            </Pressable>
          </View>
          <Pressable style={styles.saveButton} onPress={salvarEvento}>
            <Text style={styles.saveButtonText}>Salvar alterações</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.subtitle}>{evento.subtitle}</Text>
      )}

      <Image source={{ uri: evento.heroImage }} style={styles.heroImage} />

      {evento.contentBlocks.map((bloco) =>
        bloco.type === 'image' ? (
          bloco.url?.trim()
            ? <Image key={bloco.id} source={{ uri: bloco.url }} style={styles.galleryImage} />
            : null
        ) : (
          <View key={bloco.id} style={styles.card}>
            {bloco.title?.trim() ? <Text style={styles.cardTitle}>{bloco.title}</Text> : null}
            {bloco.body?.trim() ? <Text style={styles.cardText}>{bloco.body}</Text> : null}
          </View>
        ),
      )}
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#26372B',
    marginBottom: 6,
  },
  imageEditorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageInput: {
    flex: 1,
  },
  removeImageButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  removeImageText: {
    color: '#A43232',
    fontWeight: '600',
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: '#2E5D3B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addImageText: {
    color: '#2E5D3B',
    fontWeight: '600',
  },
  editorTextArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  blockEditor: {
    borderWidth: 1,
    borderColor: '#D5DED5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  blockEditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  blockType: {
    fontWeight: '700',
    color: '#26372B',
  },
  blockActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  orderButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#E8F5E9',
  },
  orderButtonText: {
    color: '#2E5D3B',
    fontSize: 12,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.4,
  },
  addBlockActions: {
    gap: 8,
    marginBottom: 12,
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