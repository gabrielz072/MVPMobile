import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';

type BlocoNatureza = {
  id: string;
  tipo: 'texto' | 'imagem';
  titulo: string;
  conteudo: string;
  imagem: string;
};

type ConteudoNatureza = {
  subtitle: string;
  heroImage: string;
  heroTitle: string;
  heroDescription: string;
  contentBlocks: BlocoNatureza[];
};

const CORES = {
  fundo: '#F8F4F0',
  verdeEscuro: '#1A481F',
  verde: '#246D2C',
  verdeClaro: '#2F8F3A',
  branco: '#FFFFFF',
  texto: '#263528',
  cinza: '#68736A',
  borda: '#DDE5DA',
  vermelho: '#B42318',
};

const DOCUMENTO_NATUREZA = doc(db, 'natureza', 'pagina');

const CONTEUDO_PADRAO: ConteudoNatureza = {
  subtitle:
    'Biodiversidade e montanhas que fazem de Teresópolis um destino especial.',
  heroImage:
    'https://images.unsplash.com/photo-1448375240586-882707db888b',
  heroTitle: 'Um encontro com a natureza',
  heroDescription:
    'Descubra a beleza da Mata Atlântica e das montanhas da Serra dos Órgãos.',
  contentBlocks: [
    {
      id: 'biodiversidade',
      tipo: 'texto',
      titulo: 'Biodiversidade da Mata Atlântica',
      conteudo:
        'Teresópolis está inserida em uma região de grande riqueza natural, com florestas, rios, nascentes e uma diversidade de espécies. A Mata Atlântica desempenha um papel importante na conservação da água, na proteção do solo e no equilíbrio ambiental.',
      imagem: '',
    },
    {
      id: 'imagem-montanhas',
      tipo: 'imagem',
      titulo: 'As montanhas da Serra dos Órgãos',
      conteudo: '',
      imagem:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    },
    {
      id: 'montanhismo',
      tipo: 'texto',
      titulo: 'A Capital Nacional do Montanhismo',
      conteudo:
        'Conhecida por suas montanhas e trilhas, Teresópolis atrai visitantes interessados em caminhadas, escaladas e contemplação da natureza. Essas atividades devem ser realizadas com planejamento, respeito às regras locais e atenção à segurança.',
      imagem: '',
    },
    {
      id: 'conservacao',
      tipo: 'texto',
      titulo: 'Preserve para continuar descobrindo',
      conteudo:
        'Preservar a natureza é responsabilidade de todos. Não deixe lixo nas trilhas, evite retirar plantas ou animais de seu ambiente natural, respeite as sinalizações e procure reduzir os impactos da sua visita.',
      imagem: '',
    },
  ],
};

export default function AdminNatureza() {
  const { user, role } = useAuth();

  const [conteudo, setConteudo] =
    useState<ConteudoNatureza>(CONTEUDO_PADRAO);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alterado, setAlterado] = useState(false);

  useEffect(() => {
    if (!user || role !== 'admin') {
      setCarregando(false);
      return;
    }

    const unsubscribe = onSnapshot(
      DOCUMENTO_NATUREZA,
      (snapshot) => {
        if (snapshot.exists()) {
          const dados = snapshot.data() as Partial<ConteudoNatureza>;

          setConteudo({
            ...CONTEUDO_PADRAO,
            ...dados,
            contentBlocks: Array.isArray(dados.contentBlocks)
              ? dados.contentBlocks
              : CONTEUDO_PADRAO.contentBlocks,
          });
        } else {
          setConteudo(CONTEUDO_PADRAO);
        }

        setCarregando(false);
        setAlterado(false);
      },
      (error) => {
        console.error('Erro ao carregar a página Natureza:', error);
        setCarregando(false);
        Alert.alert(
          'Erro ao carregar',
          'Não foi possível carregar o conteúdo. Confira as regras do Firestore e sua conexão.',
        );
      },
    );

    return unsubscribe;
  }, [user, role]);

  function atualizarCampo(
    campo: keyof Omit<ConteudoNatureza, 'contentBlocks'>,
    valor: string,
  ) {
    setConteudo((atual) => ({
      ...atual,
      [campo]: valor,
    }));
    setAlterado(true);
  }

  function atualizarBloco(
    id: string,
    campo: keyof BlocoNatureza,
    valor: string,
  ) {
    setConteudo((atual) => ({
      ...atual,
      contentBlocks: atual.contentBlocks.map((bloco) =>
        bloco.id === id ? { ...bloco, [campo]: valor } : bloco,
      ),
    }));
    setAlterado(true);
  }

  function adicionarBloco(tipo: 'texto' | 'imagem') {
    const novoBloco: BlocoNatureza = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tipo,
      titulo: tipo === 'texto' ? 'Novo tópico' : 'Nova imagem',
      conteudo: '',
      imagem: '',
    };

    setConteudo((atual) => ({
      ...atual,
      contentBlocks: [...atual.contentBlocks, novoBloco],
    }));
    setAlterado(true);
  }

  function removerBloco(id: string) {
    Alert.alert(
      'Remover conteúdo',
      'Deseja remover este bloco da página Natureza?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setConteudo((atual) => ({
              ...atual,
              contentBlocks: atual.contentBlocks.filter(
                (bloco) => bloco.id !== id,
              ),
            }));
            setAlterado(true);
          },
        },
      ],
    );
  }

  function moverBloco(id: string, direcao: -1 | 1) {
    setConteudo((atual) => {
      const blocos = [...atual.contentBlocks];
      const indice = blocos.findIndex((bloco) => bloco.id === id);
      const novoIndice = indice + direcao;

      if (
        indice < 0 ||
        novoIndice < 0 ||
        novoIndice >= blocos.length
      ) {
        return atual;
      }

      [blocos[indice], blocos[novoIndice]] = [
        blocos[novoIndice],
        blocos[indice],
      ];

      return {
        ...atual,
        contentBlocks: blocos,
      };
    });

    setAlterado(true);
  }

  async function salvarConteudo() {
    if (!user || role !== 'admin') {
      Alert.alert(
        'Acesso negado',
        'Somente administradores podem salvar alterações.',
      );
      return;
    }

    try {
      setSalvando(true);

      await setDoc(DOCUMENTO_NATUREZA, {
        ...conteudo,
        atualizadoEm: new Date().toISOString(),
        atualizadoPor: user.uid,
      });

      setAlterado(false);
      Alert.alert('Sucesso', 'O conteúdo foi salvo no Firestore.');
    } catch (error) {
      console.error('Erro ao salvar a página Natureza:', error);
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível salvar. Confira sua conexão e as regras do Firestore.',
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={CORES.verde} />
        <Text style={styles.textoCarregando}>
          Carregando conteúdo...
        </Text>
      </View>
    );
  }

  if (!user || role !== 'admin') {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.tituloBloqueio}>Acesso restrito</Text>
        <Text style={styles.textoBloqueio}>
          Esta área é exclusiva para administradores.
        </Text>

        <Pressable
          style={styles.botaoPrincipal}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.textoBotaoPrincipal}>
            Ir para o login
          </Text>
        </Pressable>

        <Pressable
          style={styles.botaoSecundario}
          onPress={() => router.back()}
        >
          <Text style={styles.textoBotaoSecundario}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudoTela}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cabecalho}>
          <Pressable
            onPress={() => router.back()}
            style={styles.botaoVoltar}
          >
            <Text style={styles.textoVoltar}>‹ Voltar</Text>
          </Pressable>

          <Text style={styles.sobretitulo}>
            CIRCUITO TERÊ VERDE
          </Text>

          <Text style={styles.tituloPagina}>
            Gerenciar Natureza
          </Text>

          <Text style={styles.descricaoPagina}>
            Edite os textos e as imagens da página ambiental.
          </Text>
        </View>

        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            As alterações são salvas no Firestore. Para aparecerem
            na página pública, ela também precisa estar configurada
            para carregar este conteúdo.
          </Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>Apresentação</Text>

          <Text style={styles.rotulo}>Subtítulo da página</Text>
          <TextInput
            style={styles.campo}
            value={conteudo.subtitle}
            onChangeText={(valor) =>
              atualizarCampo('subtitle', valor)
            }
            placeholder="Digite o subtítulo"
            placeholderTextColor={CORES.cinza}
            multiline
          />

          <Text style={styles.rotulo}>Título principal</Text>
          <TextInput
            style={styles.campo}
            value={conteudo.heroTitle}
            onChangeText={(valor) =>
              atualizarCampo('heroTitle', valor)
            }
            placeholder="Digite o título principal"
            placeholderTextColor={CORES.cinza}
          />

          <Text style={styles.rotulo}>
            Descrição principal
          </Text>
          <TextInput
            style={[styles.campo, styles.campoMultilinha]}
            value={conteudo.heroDescription}
            onChangeText={(valor) =>
              atualizarCampo('heroDescription', valor)
            }
            placeholder="Descreva a página"
            placeholderTextColor={CORES.cinza}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.rotulo}>
            URL da imagem de capa
          </Text>
          <TextInput
            style={styles.campo}
            value={conteudo.heroImage}
            onChangeText={(valor) =>
              atualizarCampo('heroImage', valor)
            }
            placeholder="https://..."
            placeholderTextColor={CORES.cinza}
            autoCapitalize="none"
            keyboardType="url"
          />

          {conteudo.heroImage.trim() !== '' && (
            <Image
              source={{ uri: conteudo.heroImage }}
              style={styles.imagemCapa}
              resizeMode="cover"
              onError={() => {
                console.warn('Não foi possível carregar a imagem de capa.');
              }}
            />
          )}
        </View>

        <View style={styles.cabecalhoBlocos}>
          <View style={styles.tituloBlocosContainer}>
            <Text style={styles.tituloSecao}>
              Conteúdo da página
            </Text>
            <Text style={styles.descricaoSecao}>
              {conteudo.contentBlocks.length} bloco(s)
            </Text>
          </View>
        </View>

        {conteudo.contentBlocks.map((bloco, indice) => (
          <View key={bloco.id} style={styles.cartaoBloco}>
            <View style={styles.topoBloco}>
              <View style={styles.identificacaoBloco}>
                <Text style={styles.numeroBloco}>
                  {String(indice + 1).padStart(2, '0')}
                </Text>
                <View>
                  <Text style={styles.nomeBloco}>
                    {bloco.tipo === 'texto'
                      ? 'Bloco de texto'
                      : 'Bloco de imagem'}
                  </Text>
                  <Text style={styles.descricaoBloco}>
                    {bloco.tipo === 'texto'
                      ? 'Título e descrição'
                      : 'Título e URL da imagem'}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => removerBloco(bloco.id)}
                style={styles.botaoRemover}
              >
                <Text style={styles.textoRemover}>Remover</Text>
              </Pressable>
            </View>

            <Text style={styles.rotulo}>Título</Text>
            <TextInput
              style={styles.campo}
              value={bloco.titulo}
              onChangeText={(valor) =>
                atualizarBloco(bloco.id, 'titulo', valor)
              }
              placeholder="Título do bloco"
              placeholderTextColor={CORES.cinza}
            />

            {bloco.tipo === 'texto' ? (
              <>
                <Text style={styles.rotulo}>Texto</Text>
                <TextInput
                  style={[styles.campo, styles.campoMultilinha]}
                  value={bloco.conteudo}
                  onChangeText={(valor) =>
                    atualizarBloco(bloco.id, 'conteudo', valor)
                  }
                  placeholder="Escreva o conteúdo deste tópico"
                  placeholderTextColor={CORES.cinza}
                  multiline
                  textAlignVertical="top"
                />
              </>
            ) : (
              <>
                <Text style={styles.rotulo}>URL da imagem</Text>
                <TextInput
                  style={styles.campo}
                  value={bloco.imagem}
                  onChangeText={(valor) =>
                    atualizarBloco(bloco.id, 'imagem', valor)
                  }
                  placeholder="https://..."
                  placeholderTextColor={CORES.cinza}
                  autoCapitalize="none"
                  keyboardType="url"
                />

                {bloco.imagem.trim() !== '' && (
                  <Image
                    source={{ uri: bloco.imagem }}
                    style={styles.imagemBloco}
                    resizeMode="cover"
                  />
                )}
              </>
            )}

            <View style={styles.acoesBloco}>
              <Pressable
                style={[
                  styles.botaoMover,
                  indice === 0 && styles.botaoDesabilitado,
                ]}
                disabled={indice === 0}
                onPress={() => moverBloco(bloco.id, -1)}
              >
                <Text style={styles.textoMover}>↑ Subir</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.botaoMover,
                  indice === conteudo.contentBlocks.length - 1 &&
                    styles.botaoDesabilitado,
                ]}
                disabled={
                  indice === conteudo.contentBlocks.length - 1
                }
                onPress={() => moverBloco(bloco.id, 1)}
              >
                <Text style={styles.textoMover}>↓ Descer</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <View style={styles.cartao}>
          <Text style={styles.tituloSecao}>
            Adicionar conteúdo
          </Text>
          <Text style={styles.descricaoSecao}>
            Escolha o tipo de bloco que deseja inserir.
          </Text>

          <View style={styles.linhaBotoes}>
            <Pressable
              style={styles.botaoAdicionar}
              onPress={() => adicionarBloco('texto')}
            >
              <Text style={styles.textoBotaoAdicionar}>
                + Bloco de texto
              </Text>
            </Pressable>

            <Pressable
              style={styles.botaoAdicionar}
              onPress={() => adicionarBloco('imagem')}
            >
              <Text style={styles.textoBotaoAdicionar}>
                + Bloco de imagem
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={[
            styles.botaoSalvar,
            salvando && styles.botaoDesabilitado,
          ]}
          onPress={salvarConteudo}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color={CORES.branco} />
          ) : (
            <Text style={styles.textoBotaoSalvar}>
              {alterado ? 'Salvar alterações' : 'Salvar conteúdo'}
            </Text>
          )}
        </Pressable>

        <Text style={styles.rodape}>
          Circuito Terê Verde · Painel administrativo
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudoTela: {
    padding: 20,
    paddingBottom: 48,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: CORES.fundo,
  },
  textoCarregando: {
    marginTop: 12,
    color: CORES.verdeEscuro,
    fontSize: 15,
  },
  tituloBloqueio: {
    color: CORES.verdeEscuro,
    fontSize: 25,
    fontWeight: '800',
    marginBottom: 10,
  },
  textoBloqueio: {
    color: CORES.cinza,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 22,
  },
  cabecalho: {
    marginBottom: 22,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 14,
    marginBottom: 20,
  },
  textoVoltar: {
    color: CORES.verde,
    fontSize: 16,
    fontWeight: '700',
  },
  sobretitulo: {
    color: CORES.verdeClaro,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  tituloPagina: {
    color: CORES.verdeEscuro,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  descricaoPagina: {
    color: CORES.cinza,
    fontSize: 15,
    lineHeight: 22,
  },
  aviso: {
    padding: 14,
    backgroundColor: '#E8F0E5',
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: CORES.verde,
  },
  avisoTexto: {
    color: CORES.verdeEscuro,
    fontSize: 13,
    lineHeight: 20,
  },
  cartao: {
    backgroundColor: CORES.branco,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  tituloSecao: {
    color: CORES.verdeEscuro,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
  },
  descricaoSecao: {
    color: CORES.cinza,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  rotulo: {
    color: CORES.texto,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 7,
  },
  campo: {
    backgroundColor: '#FCFCFA',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: CORES.texto,
    fontSize: 14,
    minHeight: 46,
  },
  campoMultilinha: {
    minHeight: 112,
    textAlignVertical: 'top',
  },
  imagemCapa: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: '#E5E7E5',
  },
  cabecalhoBlocos: {
    marginTop: 4,
    marginBottom: 12,
  },
  tituloBlocosContainer: {
    marginBottom: 2,
  },
  cartaoBloco: {
    backgroundColor: CORES.branco,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.borda,
  },
  topoBloco: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  identificacaoBloco: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  numeroBloco: {
    color: CORES.verde,
    fontSize: 17,
    fontWeight: '900',
  },
  nomeBloco: {
    color: CORES.verdeEscuro,
    fontSize: 14,
    fontWeight: '800',
  },
  descricaoBloco: {
    color: CORES.cinza,
    fontSize: 12,
    marginTop: 3,
  },
  botaoRemover: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FDECEA',
  },
  textoRemover: {
    color: CORES.vermelho,
    fontSize: 12,
    fontWeight: '700',
  },
  imagemBloco: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: '#E5E7E5',
  },
  acoesBloco: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  botaoMover: {
    backgroundColor: '#E8F0E5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  textoMover: {
    color: CORES.verdeEscuro,
    fontSize: 13,
    fontWeight: '700',
  },
  botaoDesabilitado: {
    opacity: 0.4,
  },
  linhaBotoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  botaoAdicionar: {
    flexGrow: 1,
    backgroundColor: '#E8F0E5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  textoBotaoAdicionar: {
    color: CORES.verdeEscuro,
    fontSize: 13,
    fontWeight: '800',
  },
  botaoPrincipal: {
    backgroundColor: CORES.verde,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 10,
  },
  textoBotaoPrincipal: {
    color: CORES.branco,
    fontWeight: '800',
  },
  botaoSecundario: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textoBotaoSecundario: {
    color: CORES.verde,
    fontWeight: '700',
  },
  botaoSalvar: {
    backgroundColor: CORES.verdeEscuro,
    borderRadius: 12,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    marginTop: 2,
  },
  textoBotaoSalvar: {
    color: CORES.branco,
    fontSize: 15,
    fontWeight: '800',
  },
  rodape: {
    color: CORES.cinza,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22,
  },
});
