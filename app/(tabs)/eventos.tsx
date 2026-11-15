
import BotaoFavorito from '../../components/BotaoFavorito';
import { useFavoritos } from '../../hooks/useFavoritos';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
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

type Evento = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
};

const eventosPadrao: Evento[] = [
  {
    id: 'vinte-sesc',
    title: 'Vinte!',
    category: 'Teatro',
    date: '21 de novembro de 2026',
    time: '19h30',
    location: 'Sesc Teresópolis',
    description:
      'Espetáculo teatral apresentado no Sesc Teresópolis. Uma opção cultural para quem deseja aproveitar a programação artística da cidade.',
    image:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'adil-leoes',
    title: 'Ádil e os Leões',
    category: 'Teatro infantil',
    date: '22 de novembro de 2026',
    time: '16h',
    location: 'Sesc Teresópolis',
    description:
      'Espetáculo infantil da programação cultural do Sesc. Uma atividade voltada ao público infantil e às famílias.',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'amazing-tenors',
    title: 'Amazing Tenors — Sings Bocelli',
    category: 'Música',
    date: '22 de novembro de 2026',
    time: '20h',
    location: 'Espaço Cultural Higino',
    description:
      'Apresentação musical em homenagem ao repertório de Andrea Bocelli, reunindo vozes e interpretações inspiradas na música clássica e popular.',
    image:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'drenna-sesc',
    title: 'Cisne Negro — Drenna',
    category: 'Música',
    date: '27 de novembro de 2026',
    time: '19h30',
    location: 'Sesc Teresópolis',
    description:
      'Show musical de Drenna, integrante da programação cultural de novembro do Sesc Teresópolis.',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'lotus-sesc',
    title: 'Lótus',
    category: 'Circo',
    date: '28 de novembro de 2026',
    time: '19h30',
    location: 'Sesc Teresópolis',
    description:
      'Espetáculo circense que integra a programação cultural do Sesc na cidade.',
    image:
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'show-italo',
    title: 'O Show de Ítalo',
    category: 'Comédia',
    date: '28 de novembro de 2026',
    time: 'Horário a confirmar',
    location: 'Espaço Cultural Higino',
    description:
      'Apresentação de comédia anunciada para o Espaço Cultural Higino. Consulte a organização para confirmar horário e ingressos.',
    image:
      'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'proncovo',
    title: 'Proncovô',
    category: 'Teatro musical',
    date: '29 de novembro de 2026',
    time: '16h',
    location: 'Sesc Teresópolis',
    description:
      'Espetáculo de teatro musical com Laura de Castro e Zé Motta, incluído na programação cultural de novembro.',
    image:
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=85',
  },
  {
    id: 'caravana-natal',
    title: 'Caravana de Natal Coca-Cola',
    category: 'Natal',
    date: '30 de novembro de 2026',
    time: 'A partir das 19h',
    location: 'Ruas da Várzea e do Alto',
    description:
      'A tradicional caravana natalina está prevista para percorrer ruas de Teresópolis, levando decoração iluminada e clima de Natal aos bairros da cidade.',
    image:
      'https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=85',
  },
];

const COLECAO_EVENTOS = 'events';
const DOCUMENTO_EVENTOS = 'agenda-teresopolis-2026';

export default function EventosScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallScreen = width < 380;
  const isTablet = width >= 700;

  const horizontalPadding = isSmallScreen ? 16 : isTablet ? 32 : 24;
  const heroHeight = Math.min(300, Math.max(210, height * 0.32));

  const { role } = useAuth();

  const {
    favoritos,
    alternarFavorito,
    usuarioLogado,
    estaAtualizando,
  } = useFavoritos();

  const [eventos, setEventos] = useState<Evento[]>(eventosPadrao);
  const [rascunho, setRascunho] = useState<Evento[]>(eventosPadrao);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const referencia = doc(
      db,
      COLECAO_EVENTOS,
      DOCUMENTO_EVENTOS,
    );

    const cancelar = onSnapshot(
      referencia,
      (snapshot) => {
        if (!snapshot.exists()) return;

        const dados = snapshot.data();

        if (!Array.isArray(dados.items)) return;

        const eventosValidos = dados.items.filter(
          (item: any) =>
            item &&
            typeof item.id === 'string' &&
            typeof item.title === 'string',
        );

        if (eventosValidos.length > 0) {
          setEventos(eventosValidos);
          setRascunho(eventosValidos);
        }
      },
      (error) => {
        console.error('Erro ao carregar eventos:', error);
      },
    );

    return cancelar;
  }, []);

  async function handleFavorito(id: string) {
    if (!usuarioLogado) {
      Alert.alert(
        'Entre na sua conta',
        'Faça login para salvar eventos nos seus favoritos.',
      );
      return;
    }

    await alternarFavorito('eventos', id);
  }

  function atualizarEvento(
    id: string,
    campo: keyof Evento,
    valor: string,
  ) {
    setRascunho((atual) =>
      atual.map((evento) =>
        evento.id === id
          ? { ...evento, [campo]: valor }
          : evento,
      ),
    );
  }

  async function salvarEventos() {
    if (salvando) return;

    try {
      setSalvando(true);

      const eventosValidos = rascunho.filter(
        (evento) =>
          evento.title.trim() &&
          evento.description.trim() &&
          evento.location.trim(),
      );

      await setDoc(
        doc(db, COLECAO_EVENTOS, DOCUMENTO_EVENTOS),
        {
          items: eventosValidos,
          updatedAt: new Date().toISOString(),
        },
      );

      setEventos(eventosValidos);
      setRascunho(eventosValidos);
      setEditando(false);

      Alert.alert(
        'Agenda atualizada',
        'As informações dos eventos foram salvas.',
      );
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);

      Alert.alert(
        'Não foi possível salvar',
        'Verifique sua conexão e as permissões da sua conta no Firebase.',
      );
    } finally {
      setSalvando(false);
    }
  }

  function alternarEdicao() {
    if (editando) {
      setRascunho(eventos);
      setEditando(false);
    } else {
      setRascunho(eventos);
      setEditando(true);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* CABEÇALHO */}
          <View style={styles.heading}>
            <Text style={styles.eyebrow}>
              CIRCUITO TERÊ VERDE
            </Text>

            <Text
              style={[
                styles.title,
                { fontSize: isSmallScreen ? 28 : 32 },
              ]}
            >
              Eventos 🎉
            </Text>

            <Text style={styles.subtitle}>
              Confira a programação cultural e as experiências
              que movimentam Teresópolis.
            </Text>
          </View>

          {/* ÁREA DO ADMINISTRADOR */}
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
                    Gerencie as informações da agenda.
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
                  {editando ? 'Cancelar edição' : 'Editar eventos'}
                </Text>
              </Pressable>
            </View>
          )}

          {editando && role === 'admin' ? (
            /* EDITOR */
            <View style={styles.editor}>
              <Text style={styles.editorTitle}>
                Editar agenda
              </Text>

              <Text style={styles.editorDescription}>
                Altere as informações dos eventos. As mudanças serão
                exibidas para todos os usuários após salvar.
              </Text>

              {rascunho.map((evento, indice) => (
                <View key={evento.id} style={styles.eventEditor}>
                  <Text style={styles.eventEditorTitle}>
                    Evento {indice + 1}
                  </Text>

                  <Text style={styles.fieldLabel}>Nome</Text>

                  <TextInput
                    style={styles.editorInput}
                    value={evento.title}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'title', valor)
                    }
                  />

                  <Text style={styles.fieldLabel}>Categoria</Text>

                  <TextInput
                    style={styles.editorInput}
                    value={evento.category}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'category', valor)
                    }
                  />

                  <Text style={styles.fieldLabel}>Data</Text>

                  <TextInput
                    style={styles.editorInput}
                    value={evento.date}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'date', valor)
                    }
                  />

                  <Text style={styles.fieldLabel}>Horário</Text>

                  <TextInput
                    style={styles.editorInput}
                    value={evento.time}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'time', valor)
                    }
                  />

                  <Text style={styles.fieldLabel}>Local</Text>

                  <TextInput
                    style={styles.editorInput}
                    value={evento.location}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'location', valor)
                    }
                  />

                  <Text style={styles.fieldLabel}>Descrição</Text>

                  <TextInput
                    style={[
                      styles.editorInput,
                      styles.editorTextArea,
                    ]}
                    value={evento.description}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'description', valor)
                    }
                    multiline
                  />

                  <Text style={styles.fieldLabel}>
                    URL da imagem
                  </Text>

                  <TextInput
                    style={styles.editorInput}
                    value={evento.image}
                    onChangeText={(valor) =>
                      atualizarEvento(evento.id, 'image', valor)
                    }
                    autoCapitalize="none"
                    keyboardType="url"
                    placeholder="https://..."
                  />
                </View>
              ))}

              <Pressable
                style={[
                  styles.saveButton,
                  salvando && styles.disabledButton,
                ]}
                onPress={salvarEventos}
                disabled={salvando}
              >
                <Text style={styles.saveButtonText}>
                  {salvando ? 'Salvando...' : '✓ Salvar agenda'}
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* DESTAQUE */}
              <View style={styles.heroCard}>
                <ImageBackground
                  source={{
                    uri: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1400&q=85',
                  }}
                  style={[
                    styles.heroImage,
                    { height: heroHeight },
                  ]}
                  imageStyle={styles.heroImageRadius}
                >
                  <View style={styles.heroOverlay} />

                  <View style={styles.heroContent}>
                    <View style={styles.heroTag}>
                      <Text style={styles.heroTagText}>
                        AGENDA DE TERESÓPOLIS
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.heroTitle,
                        { fontSize: isSmallScreen ? 23 : 27 },
                      ]}
                    >
                      Cultura, música e diversão
                    </Text>

                    <Text style={styles.heroDescription}>
                      Descubra o que acontece na cidade e aproveite
                      novas experiências.
                    </Text>
                  </View>
                </ImageBackground>
              </View>

              {/* LISTA DE EVENTOS */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Programação de novembro
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Eventos divulgados para o restante do mês.
                </Text>
              </View>

              <View
                style={[
                  styles.eventsList,
                  isTablet && styles.eventsListTablet,
                ]}
              >
                {eventos.map((evento) => {
                  const salvo = favoritos.eventos.includes(evento.id);

                  return (
                    <View
                      key={evento.id}
                      style={[
                        styles.eventCard,
                        isTablet && styles.eventCardTablet,
                      ]}
                    >
                      <ImageBackground
                        source={{ uri: evento.image }}
                        style={styles.eventImage}
                        imageStyle={styles.eventImageRadius}
                      >
                        <View style={styles.eventImageOverlay} />

                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>
                            {evento.category}
                          </Text>
                        </View>
                      </ImageBackground>

                      <View style={styles.eventInfo}>
                        <View style={styles.eventTitleRow}>
                          <Text style={styles.eventTitle}>
                            {evento.title}
                          </Text>

                          <BotaoFavorito
                            salvo={salvo}
                            onPress={() => handleFavorito(evento.id)}
                            disabled={estaAtualizando('eventos', evento.id)}
                          />
                        </View>

                        <View style={styles.eventDetail}>
                          <Text style={styles.detailIcon}>📅</Text>
                          <Text style={styles.detailText}>
                            {evento.date}
                          </Text>
                        </View>

                        <View style={styles.eventDetail}>
                          <Text style={styles.detailIcon}>🕒</Text>
                          <Text style={styles.detailText}>
                            {evento.time}
                          </Text>
                        </View>

                        <View style={styles.eventDetail}>
                          <Text style={styles.detailIcon}>📍</Text>
                          <Text style={styles.detailText}>
                            {evento.location}
                          </Text>
                        </View>

                        <Text style={styles.eventDescription}>
                          {evento.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.noticeCard}>
                <Text style={styles.noticeIcon}>ℹ️</Text>

                <View style={styles.noticeContent}>
                  <Text style={styles.noticeTitle}>
                    Antes de sair
                  </Text>

                  <Text style={styles.noticeText}>
                    A programação, os horários e os locais podem sofrer
                    alterações. Consulte os organizadores antes de
                    se deslocar ou adquirir ingressos.
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* RODAPÉ */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>
              TERÊ VERDE 🌿
            </Text>

            <Text style={styles.footerText}>
              Viva a natureza. Descubra novos caminhos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    width: '100%',
    alignItems: 'center',
    paddingTop: 55,
    paddingBottom: 30,
  },

  container: {
    width: '100%',
    maxWidth: 850,
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
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 8,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 450,
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
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  heroImage: {
    justifyContent: 'flex-end',
    backgroundColor: COLORS.darkGreen,
  },

  heroImageRadius: {
    borderRadius: 22,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 35, 16, 0.52)',
  },

  heroContent: {
    padding: 21,
  },

  heroTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  heroTagText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  heroTitle: {
    color: COLORS.white,
    fontWeight: '800',
    lineHeight: 33,
    maxWidth: 340,
    marginBottom: 8,
  },

  heroDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 21,
  },

  sectionHeader: {
    marginBottom: 18,
  },

  sectionTitle: {
    color: COLORS.darkGreen,
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 5,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
  },

  eventsList: {
    gap: 18,
  },

  eventsListTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  eventCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EAECE5',
    elevation: 3,
    shadowColor: '#19391D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  eventCardTablet: {
    width: '48.5%',
  },

  eventImage: {
    height: 185,
    justifyContent: 'flex-start',
    backgroundColor: COLORS.darkGreen,
  },

  eventImageRadius: {
    borderTopLeftRadius: 19,
    borderTopRightRadius: 19,
  },

  eventImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(12, 30, 15, 0.18)',
  },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    margin: 13,
  },

  categoryBadgeText: {
    color: COLORS.darkGreen,
    fontSize: 11,
    fontWeight: '800',
  },

  eventInfo: {
    padding: 16,
  },

  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },

  eventTitle: {
    flex: 1,
    color: COLORS.darkGreen,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },

  eventDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 8,
  },

  detailIcon: {
    fontSize: 14,
    width: 19,
  },

  detailText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 19,
  },

  eventDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 7,
  },

  noticeCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.lightGreen,
    borderRadius: 16,
    padding: 16,
    marginTop: 22,
  },

  noticeIcon: {
    fontSize: 19,
  },

  noticeContent: {
    flex: 1,
  },

  noticeTitle: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },

  noticeText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 19,
  },

  editor: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 17,
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
    marginBottom: 20,
  },

  eventEditor: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FCFCFA',
    borderRadius: 14,
    padding: 13,
    marginBottom: 15,
  },

  eventEditorTitle: {
    color: COLORS.darkGreen,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },

  fieldLabel: {
    color: COLORS.darkGreen,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 7,
  },

  editorInput: {
    borderWidth: 1,
    borderColor: '#DCE4D9',
    borderRadius: 11,
    backgroundColor: '#FAFBF8',
    color: COLORS.text,
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 13,
  },

  editorTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  saveButton: {
    backgroundColor: COLORS.darkGreen,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },

  disabledButton: {
    opacity: 0.5,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 8,
  },

  footerTitle: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 7,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
  },
});
