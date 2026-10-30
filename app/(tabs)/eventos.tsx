import { UserAccountBar } from '@/components/UserAccountBar';
import MenuInferior from '@/components/MenuInferior';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { router } from 'expo-router';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const COLORS = {
  background: '#f8f4f0',
  darkGreen: '#1A481F',
  mediumGreen: '#246D2C',
  green: '#2F8F3A',
  white: '#FFFFFF',
  text: '#263529',
  muted: '#777D75',
  border: '#E2E7DE',
  lightGreen: '#EDF3E9',
  red: '#A43232',
};

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
  subtitle:
    'Encontros que celebram as montanhas e a natureza de Teresópolis.',
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
    ...(imagens[0]
      ? [{ id: 'gallery-0', type: 'image' as const, url: imagens[0] }]
      : []),
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
      body: data.conservation || eventoPadrao.contentBlocks[3].body,
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

  const [evento, setEvento] = useState<Evento>(eventoPadrao);
  const [rascunho, setRascunho] = useState<Evento>(eventoPadrao);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

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
    if (salvando) return;

    try {
      setSalvando(true);

      const atualizado: Evento = {
        ...rascunho,
        contentBlocks: rascunho.contentBlocks.filter((bloco) =>
          bloco.type === 'image'
            ? Boolean(bloco.url?.trim())
            : Boolean(bloco.title?.trim() || bloco.body?.trim()),
        ),
      };

      await setDoc(doc(db, 'events', 'atm'), atualizado, {
        merge: true,
      });

      setEvento(atualizado);
      setRascunho(atualizado);
      setEditando(false);

      Alert.alert(
        'Evento atualizado',
        'As alterações já estão disponíveis para os usuários.',
      );
    } catch {
      Alert.alert(
        'Não foi possível salvar',
        'Verifique sua conexão e se sua conta tem permissão para alterar eventos.',
      );
    } finally {
      setSalvando(false);
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

      if (
        novoIndice < 0 ||
        novoIndice >= atual.contentBlocks.length
      ) {
        return atual;
      }

      const contentBlocks = [...atual.contentBlocks];

      [contentBlocks[indice], contentBlocks[novoIndice]] = [
        contentBlocks[novoIndice],
        contentBlocks[indice],
      ];

      return { ...atual, contentBlocks };
    });
  }

  function adicionarBloco(type: BlocoEvento['type']) {
    const id = `bloco-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const bloco: BlocoEvento =
      type === 'image'
        ? { id, type, url: '' }
        : { id, type, title: '', body: '' };

    setRascunho((atual) => ({
      ...atual,
      contentBlocks: [...atual.contentBlocks, bloco],
    }));
  }

  function removerBloco(id: string) {
    setRascunho((atual) => ({
      ...atual,
      contentBlocks: atual.contentBlocks.filter(
        (bloco) => bloco.id !== id,
      ),
    }));
  }

  function alternarEdicao() {
    if (editando) {
      setRascunho(evento);
      setEditando(false);
    } else {
      setRascunho(evento);
      setEditando(true);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <UserAccountBar />

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>

        <View style={styles.heading}>
          <Text style={styles.eyebrow}>CIRCUITO TERÊ VERDE</Text>
          <Text style={styles.title}>Eventos 🎉</Text>
          <Text style={styles.subtitle}>
            {editando
              ? 'Personalize as informações e a apresentação do evento.'
              : evento.subtitle}
          </Text>
        </View>

        {role === 'admin' && (
          <View style={styles.adminPanel}>
            <View style={styles.adminInfo}>
              <View style={styles.adminIcon}>
                <Text style={styles.adminIconText}>✎</Text>
              </View>
              <View style={styles.adminTextContainer}>
                <Text style={styles.adminTitle}>
                  Área do administrador
                </Text>
                <Text style={styles.adminSubtitle}>
                  Gerencie o conteúdo desta página.
                </Text>
              </View>
            </View>

            <Pressable
              style={[
                styles.editButton,
                editando && styles.cancelButton,
              ]}
              onPress={alternarEdicao}
            >
              <Text style={styles.editButtonText}>
                {editando ? 'Cancelar edição' : 'Editar evento'}
              </Text>
            </Pressable>
          </View>
        )}

        {editando ? (
          <View style={styles.editor}>
            <View style={styles.editorHeading}>
              <Text style={styles.editorTitle}>Editar evento</Text>
              <Text style={styles.editorDescription}>
                Atualize a capa, os textos e as imagens exibidas na página.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Subtítulo</Text>
            <TextInput
              style={styles.editorInput}
              value={rascunho.subtitle}
              onChangeText={(valor) =>
                atualizarCampo('subtitle', valor)
              }
              placeholder="Subtítulo do evento"
              placeholderTextColor="#90998F"
            />

            <Text style={styles.fieldLabel}>URL da foto de capa</Text>
            <TextInput
              style={styles.editorInput}
              value={rascunho.heroImage}
              onChangeText={(valor) =>
                atualizarCampo('heroImage', valor)
              }
              placeholder="https://..."
              placeholderTextColor="#90998F"
              autoCapitalize="none"
              keyboardType="url"
            />

            <Text style={styles.fieldLabel}>Conteúdo do evento</Text>

            {rascunho.contentBlocks.map((bloco, indice) => (
              <View key={bloco.id} style={styles.blockEditor}>
                <View style={styles.blockEditorHeader}>
                  <View style={styles.blockTypeBadge}>
                    <Text style={styles.blockType}>
                      {bloco.type === 'image' ? '▧  FOTO' : '≡  TEXTO'}
                    </Text>
                  </View>

                  <View style={styles.blockActions}>
                    <Pressable
                      style={[
                        styles.orderButton,
                        indice === 0 && styles.disabledButton,
                      ]}
                      onPress={() => moverBloco(indice, -1)}
                      disabled={indice === 0}
                    >
                      <Text style={styles.orderButtonText}>↑</Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.orderButton,
                        indice === rascunho.contentBlocks.length - 1 &&
                          styles.disabledButton,
                      ]}
                      onPress={() => moverBloco(indice, 1)}
                      disabled={
                        indice === rascunho.contentBlocks.length - 1
                      }
                    >
                      <Text style={styles.orderButtonText}>↓</Text>
                    </Pressable>

                    <Pressable
                      style={styles.removeButton}
                      onPress={() => removerBloco(bloco.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover bloco ${indice + 1}`}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </Pressable>
                  </View>
                </View>

                {bloco.type === 'image' ? (
                  <>
                    <Text style={styles.smallLabel}>URL da imagem</Text>
                    <TextInput
                      style={styles.editorInput}
                      value={bloco.url}
                      onChangeText={(valor) =>
                        atualizarBloco(bloco.id, { url: valor })
                      }
                      placeholder="https://..."
                      placeholderTextColor="#90998F"
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                    {bloco.url?.trim() ? (
                      <Image
                        source={{ uri: bloco.url }}
                        style={styles.editorImagePreview}
                        resizeMode="cover"
                      />
                    ) : null}
                  </>
                ) : (
                  <>
                    <Text style={styles.smallLabel}>
                      Título (opcional)
                    </Text>
                    <TextInput
                      style={styles.editorInput}
                      value={bloco.title}
                      onChangeText={(valor) =>
                        atualizarBloco(bloco.id, { title: valor })
                      }
                      placeholder="Título da seção"
                      placeholderTextColor="#90998F"
                    />

                    <Text style={styles.smallLabel}>Texto</Text>
                    <TextInput
                      style={[
                        styles.editorInput,
                        styles.editorTextArea,
                      ]}
                      value={bloco.body}
                      onChangeText={(valor) =>
                        atualizarBloco(bloco.id, { body: valor })
                      }
                      placeholder="Escreva o conteúdo..."
                      placeholderTextColor="#90998F"
                      multiline
                    />
                  </>
                )}
              </View>
            ))}

            <View style={styles.addBlockActions}>
              <Pressable
                style={styles.addButton}
                onPress={() => adicionarBloco('text')}
              >
                <Text style={styles.addButtonText}>
                  + Adicionar texto
                </Text>
              </Pressable>

              <Pressable
                style={styles.addButton}
                onPress={() => adicionarBloco('image')}
              >
                <Text style={styles.addButtonText}>
                  + Adicionar foto
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.saveButton,
                salvando && styles.disabledButton,
              ]}
              onPress={salvarEvento}
              disabled={salvando}
            >
              <Text style={styles.saveButtonText}>
                {salvando ? 'Salvando...' : '✓  Salvar alterações'}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.heroCard}>
              <ImageBackground
                source={{ uri: evento.heroImage }}
                style={styles.heroImage}
                imageStyle={styles.heroImageRadius}
              >
                <View style={styles.heroOverlay} />

                <View style={styles.heroContent}>
                  <View style={styles.heroTag}>
                    <Text style={styles.heroTagText}>
                      EVENTOS EM TERESÓPOLIS
                    </Text>
                  </View>

                  <Text style={styles.heroTitle}>
                    Aventura, cultura e natureza
                  </Text>

                  <Text style={styles.heroDescription}>
                    Viva experiências que aproximam você da serra.
                  </Text>
                </View>
              </ImageBackground>
            </View>

            <View style={styles.eventLabelRow}>
              <View style={styles.eventLabelLine} />
              <Text style={styles.eventLabel}>EM DESTAQUE</Text>
              <View style={styles.eventLabelLine} />
            </View>

            {evento.contentBlocks.map((bloco) =>
              bloco.type === 'image' ? (
                bloco.url?.trim() ? (
                  <View key={bloco.id} style={styles.galleryCard}>
                    <Image
                      source={{ uri: bloco.url }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  </View>
                ) : null
              ) : bloco.title?.trim() || bloco.body?.trim() ? (
                <View key={bloco.id} style={styles.contentCard}>
                  {bloco.title?.trim() ? (
                    <Text style={styles.cardTitle}>{bloco.title}</Text>
                  ) : null}

                  {bloco.body?.trim() ? (
                    <Text style={styles.cardText}>{bloco.body}</Text>
                  ) : null}
                </View>
              ) : null,
            )}

            <View style={styles.closingCard}>
              <Text style={styles.closingIcon}>🌿</Text>
              <Text style={styles.closingTitle}>
                Descubra Teresópolis
              </Text>
              <Text style={styles.closingText}>
                Explore, participe e preserve. As melhores experiências
                são aquelas que respeitam a natureza.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      <MenuInferior />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 18,
    marginBottom: 20,
    paddingVertical: 7,
    paddingRight: 12,
  },
  backText: {
    color: COLORS.darkGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  heading: {
    marginBottom: 22,
  },
  eyebrow: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: COLORS.darkGreen,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  adminPanel: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 22,
    gap: 14,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminIconText: {
    color: COLORS.darkGreen,
    fontSize: 22,
    fontWeight: '800',
  },
  adminTextContainer: {
    flex: 1,
  },
  adminTitle: {
    color: COLORS.darkGreen,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  adminSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
  },
  editButton: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 11,
    alignItems: 'center',
    paddingVertical: 13,
  },
  cancelButton: {
    backgroundColor: '#6D756C',
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
  heroCard: {
    overflow: 'hidden',
    borderRadius: 22,
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  heroImage: {
    height: 275,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.darkGreen,
  },
  heroImageRadius: {
    borderRadius: 22,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 35, 16, 0.48)',
  },
  heroContent: {
    padding: 21,
  },
  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.19)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 13,
  },
  heroTagText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '800',
    lineHeight: 33,
    marginBottom: 8,
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.93)',
    fontSize: 13,
    lineHeight: 20,
  },
  eventLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  eventLabelLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#D7DFD3',
  },
  eventLabel: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#EAECE5',
    borderRadius: 18,
    padding: 20,
    marginBottom: 17,
    elevation: 2,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardTitle: {
    color: COLORS.darkGreen,
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 27,
    marginBottom: 11,
  },
  cardText: {
    color: '#5E675E',
    fontSize: 14,
    lineHeight: 24,
  },
  galleryCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 19,
    backgroundColor: COLORS.lightGreen,
  },
  galleryImage: {
    width: '100%',
    height: 210,
  },
  closingCard: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 20,
    padding: 23,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },
  closingIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  closingTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 9,
  },
  closingText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
  },
  editor: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 17,
    marginBottom: 22,
  },
  editorHeading: {
    marginBottom: 22,
  },
  editorTitle: {
    color: COLORS.darkGreen,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 7,
  },
  editorDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
  },
  fieldLabel: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 5,
  },
  smallLabel: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },
  editorInput: {
    borderWidth: 1,
    borderColor: '#DCE4D9',
    borderRadius: 11,
    backgroundColor: '#FAFBF8',
    color: COLORS.text,
    fontSize: 14,
    paddingHorizontal: 13,
    paddingVertical: 12,
    marginBottom: 15,
  },
  editorTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  blockEditor: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FCFCFA',
    borderRadius: 14,
    padding: 13,
    marginBottom: 13,
  },
  blockEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  blockTypeBadge: {
    backgroundColor: COLORS.lightGreen,
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  blockType: {
    color: COLORS.darkGreen,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  blockActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderButton: {
    backgroundColor: '#EAF1E7',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: {
    color: COLORS.darkGreen,
    fontSize: 17,
    fontWeight: '800',
  },
  removeButton: {
    backgroundColor: '#FBEDEC',
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.35,
  },
  editorImagePreview: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: COLORS.lightGreen,
  },
  addBlockActions: {
    gap: 9,
    marginTop: 3,
    marginBottom: 15,
  },
  addButton: {
    borderWidth: 1,
    borderColor: COLORS.mediumGreen,
    borderRadius: 11,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#F7FAF5',
  },
  addButtonText: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '800',
  },
  saveButton: {
    backgroundColor: COLORS.darkGreen,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});