
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { router } from 'expo-router';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { trilhas as trilhasLocais } from './data/trilhas';

type Trilha = {
  id: string;
  nome: string;
  descricao: string;
  dificuldade: string;
  duracao: string;
  imagem: string;
};

const CORES = {
  fundo: '#F8F4F0',
  verdeEscuro: '#1A481F',
  verde: '#246D2C',
  verdeClaro: '#EDF3E9',
  branco: '#FFFFFF',
  texto: '#263529',
  secundario: '#777D75',
  borda: '#E2E7DE',
  vermelho: '#A43232',
};

const trilhasIniciais: Trilha[] = trilhasLocais.map((trilha) => ({
  id: trilha.id,
  nome: trilha.nome,
  descricao: trilha.descricao,
  dificuldade: trilha.dificuldade,
  duracao: trilha.duracao,
  imagem: trilha.imagem,
}));

const formularioVazio: Trilha = {
  id: '',
  nome: '',
  descricao: '',
  dificuldade: 'Moderada',
  duracao: '',
  imagem: '',
};

export default function AdminTrilhasScreen() {
  const { user, role, loading } = useAuth();

  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [selecionada, setSelecionada] = useState<Trilha | null>(null);
  const [formulario, setFormulario] =
    useState<Trilha>(formularioVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [criando, setCriando] = useState(false);

  const primeiraLeitura = useRef(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (role !== 'admin') {
      Alert.alert(
        'Acesso restrito',
        'Esta página está disponível somente para administradores.',
        [{ text: 'Voltar', onPress: () => router.replace('/') }],
      );
    }
  }, [user, role, loading]);

  useEffect(() => {
    if (loading || !user || role !== 'admin') return;

    const cancelar = onSnapshot(
      collection(db, 'trails'),
      (snapshot) => {
        const dados = snapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            nome: data.nome ?? '',
            descricao: data.descricao ?? '',
            dificuldade: data.dificuldade ?? 'Moderada',
            duracao: data.duracao ?? '',
            imagem: data.imagem ?? '',
          } as Trilha;
        });

        if (dados.length > 0) {
          setTrilhas(dados);

          if (selecionada) {
            const atualizada = dados.find(
              (trilha) => trilha.id === selecionada.id,
            );

            if (atualizada) {
              setSelecionada(atualizada);
              setFormulario(atualizada);
            }
          }
        } else if (primeiraLeitura.current) {
          setTrilhas(trilhasIniciais);
        } else {
          setTrilhas([]);
          setSelecionada(null);
          setFormulario(formularioVazio);
        }

        primeiraLeitura.current = false;
        setCarregando(false);
      },
      (erro) => {
        console.error('Erro ao carregar trilhas:', erro);
        setCarregando(false);

        Alert.alert(
          'Erro ao carregar',
          'Não foi possível acessar as trilhas. Verifique as regras do Firestore.',
        );
      },
    );

    return cancelar;
  }, [user, role, loading]);

  function editarTrilha(trilha: Trilha) {
    setSelecionada(trilha);
    setFormulario({ ...trilha });
    setCriando(false);
  }

  function novaTrilha() {
    setSelecionada(null);
    setFormulario(formularioVazio);
    setCriando(true);
  }

  function atualizarCampo(
    campo: keyof Trilha,
    valor: string,
  ) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  async function salvarTrilha() {
    if (salvando) return;

    if (
      !formulario.nome.trim() ||
      !formulario.descricao.trim()
    ) {
      Alert.alert(
        'Campos obrigatórios',
        'Preencha pelo menos o nome e a descrição da trilha.',
      );
      return;
    }

    try {
      setSalvando(true);

      const dados = {
        nome: formulario.nome.trim(),
        descricao: formulario.descricao.trim(),
        dificuldade: formulario.dificuldade.trim(),
        duracao: formulario.duracao.trim(),
        imagem: formulario.imagem.trim(),
        atualizadoEm: new Date().toISOString(),
      };

      if (criando) {
        const referencia = await addDoc(
          collection(db, 'trails'),
          dados,
        );

        const criada = {
          id: referencia.id,
          ...dados,
        };

        setSelecionada(criada);
        setFormulario(criada);
        setCriando(false);
      } else if (selecionada) {
        await setDoc(
          doc(db, 'trails', selecionada.id),
          dados,
          { merge: true },
        );
      } else {
        Alert.alert(
          'Selecione uma trilha',
          'Escolha uma trilha ou clique em Nova trilha.',
        );
        return;
      }

      Alert.alert(
        'Salvo',
        'As informações foram salvas no Firestore.',
      );
    } catch (erro) {
      console.error('Erro ao salvar trilha:', erro);

      Alert.alert(
        'Não foi possível salvar',
        'Verifique sua conexão e as permissões da coleção trails no Firestore.',
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao() {
    if (!selecionada || criando) return;

    Alert.alert(
      'Excluir trilha',
      `Deseja excluir "${selecionada.nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(
                doc(db, 'trails', selecionada.id),
              );

              setSelecionada(null);
              setFormulario(formularioVazio);

              Alert.alert(
                'Trilha excluída',
                'A operação foi concluída.',
              );
            } catch (erro) {
              console.error('Erro ao excluir trilha:', erro);

              Alert.alert(
                'Erro',
                'Não foi possível excluir. Verifique as permissões do Firestore.',
              );
            }
          },
        },
      ],
    );
  }

  if (loading || carregando) {
    return (
      <View style={styles.carregamento}>
        <ActivityIndicator
          size="large"
          color={CORES.verde}
        />
        <Text style={styles.textoCarregamento}>
          Carregando gerenciamento de trilhas...
        </Text>
      </View>
    );
  }

  if (!user || role !== 'admin') {
    return (
      <View style={styles.carregamento}>
        <Text style={styles.textoCarregamento}>
          Verificando acesso administrativo...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tela}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.voltar}
          onPress={() => router.back()}
        >
          <Text style={styles.textoVoltar}>
            ← Voltar ao painel
          </Text>
        </Pressable>

        <Text style={styles.marca}>CIRCUITO TERÊ VERDE</Text>
        <Text style={styles.titulo}>
          Trilhas e destinos
        </Text>
        <Text style={styles.subtitulo}>
          Gerencie as informações das atrações naturais.
        </Text>

        <View style={styles.resumo}>
          <View style={styles.resumoTexto}>
            <Text style={styles.resumoTitulo}>
              Área administrativa
            </Text>
            <Text style={styles.resumoDescricao}>
              Selecione um destino para editar ou cadastre um novo.
            </Text>
          </View>

          <Pressable
            style={styles.botaoNovo}
            onPress={novaTrilha}
          >
            <Text style={styles.botaoNovoTexto}>
              + Nova
            </Text>
          </Pressable>
        </View>

        <Text style={styles.tituloSecao}>
          Destinos cadastrados ({trilhas.length})
        </Text>

        {trilhas.length === 0 && (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>
              Nenhuma trilha cadastrada
            </Text>
            <Text style={styles.vazioTexto}>
              Use “Nova” para cadastrar o primeiro destino.
            </Text>
          </View>
        )}

        {trilhas.map((trilha) => {
          const ativa =
            !criando && selecionada?.id === trilha.id;

          return (
            <Pressable
              key={trilha.id}
              style={[
                styles.itemTrilha,
                ativa && styles.itemSelecionado,
              ]}
              onPress={() => editarTrilha(trilha)}
            >
              <View style={styles.itemTexto}>
                <Text style={styles.itemNome}>
                  {trilha.nome}
                </Text>
                <Text style={styles.itemDetalhe}>
                  {trilha.dificuldade} · {trilha.duracao}
                </Text>
              </View>

              <Text style={styles.itemAcao}>
                {ativa ? 'Editando' : 'Editar →'}
              </Text>
            </Pressable>
          );
        })}

        {(selecionada || criando) && (
          <View style={styles.editor}>
            <Text style={styles.tituloSecao}>
              {criando ? 'Cadastrar destino' : 'Editar destino'}
            </Text>

            <Text style={styles.rotulo}>Nome da trilha *</Text>
            <TextInput
              style={styles.input}
              value={formulario.nome}
              onChangeText={(valor) =>
                atualizarCampo('nome', valor)
              }
              placeholder="Ex.: Pedra do Sino"
              placeholderTextColor="#92998F"
            />

            <Text style={styles.rotulo}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.multilinha]}
              value={formulario.descricao}
              onChangeText={(valor) =>
                atualizarCampo('descricao', valor)
              }
              placeholder="Descreva a trilha ou atração"
              placeholderTextColor="#92998F"
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.rotulo}>Dificuldade</Text>
            <View style={styles.opcoes}>
              {['Fácil', 'Moderada', 'Difícil'].map((opcao) => (
                <Pressable
                  key={opcao}
                  style={[
                    styles.opcao,
                    formulario.dificuldade === opcao &&
                      styles.opcaoAtiva,
                  ]}
                  onPress={() =>
                    atualizarCampo('dificuldade', opcao)
                  }
                >
                  <Text
                    style={[
                      styles.opcaoTexto,
                      formulario.dificuldade === opcao &&
                        styles.opcaoTextoAtivo,
                    ]}
                  >
                    {opcao}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.rotulo}>
              Duração estimada
            </Text>
            <TextInput
              style={styles.input}
              value={formulario.duracao}
              onChangeText={(valor) =>
                atualizarCampo('duracao', valor)
              }
              placeholder="Ex.: Aproximadamente 4 horas"
              placeholderTextColor="#92998F"
            />

            <Text style={styles.rotulo}>
              URL da imagem
            </Text>
            <TextInput
              style={styles.input}
              value={formulario.imagem}
              onChangeText={(valor) =>
                atualizarCampo('imagem', valor)
              }
              placeholder="https://..."
              placeholderTextColor="#92998F"
              autoCapitalize="none"
              keyboardType="url"
            />

            <Pressable
              style={[
                styles.botaoSalvar,
                salvando && styles.botaoDesabilitado,
              ]}
              disabled={salvando}
              onPress={salvarTrilha}
            >
              {salvando ? (
                <ActivityIndicator color={CORES.branco} />
              ) : (
                <Text style={styles.botaoSalvarTexto}>
                  {criando
                    ? 'Cadastrar trilha'
                    : 'Salvar alterações'}
                </Text>
              )}
            </Pressable>

            {!criando && selecionada && (
              <Pressable
                style={styles.botaoExcluir}
                onPress={confirmarExclusao}
              >
                <Text style={styles.botaoExcluirTexto}>
                  Excluir destino
                </Text>
              </Pressable>
            )}

            <Pressable
              style={styles.botaoCancelar}
              onPress={() => {
                setSelecionada(null);
                setFormulario(formularioVazio);
                setCriando(false);
              }}
            >
              <Text style={styles.botaoCancelarTexto}>
                Fechar editor
              </Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.rodape}>
          CIRCUITO TERÊ VERDE · ADMINISTRAÇÃO
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.fundo,
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  carregamento: {
    flex: 1,
    backgroundColor: CORES.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  textoCarregamento: {
    color: CORES.verdeEscuro,
    fontSize: 14,
    textAlign: 'center',
  },
  voltar: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    marginBottom: 20,
  },
  textoVoltar: {
    color: CORES.verde,
    fontSize: 14,
    fontWeight: '700',
  },
  marca: {
    color: CORES.verde,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  titulo: {
    color: CORES.verdeEscuro,
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitulo: {
    color: CORES.secundario,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },
  resumo: {
    backgroundColor: CORES.verdeClaro,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 26,
  },
  resumoTexto: {
    flex: 1,
  },
  resumoTitulo: {
    color: CORES.verdeEscuro,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 5,
  },
  resumoDescricao: {
    color: CORES.texto,
    fontSize: 12,
    lineHeight: 18,
  },
  botaoNovo: {
    backgroundColor: CORES.verdeEscuro,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  botaoNovoTexto: {
    color: CORES.branco,
    fontSize: 12,
    fontWeight: '800',
  },
  tituloSecao: {
    color: CORES.verdeEscuro,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 13,
  },
  itemTrilha: {
    backgroundColor: CORES.branco,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  itemSelecionado: {
    borderColor: CORES.verde,
    backgroundColor: CORES.verdeClaro,
  },
  itemTexto: {
    flex: 1,
  },
  itemNome: {
    color: CORES.texto,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  itemDetalhe: {
    color: CORES.secundario,
    fontSize: 11,
  },
  itemAcao: {
    color: CORES.verde,
    fontSize: 11,
    fontWeight: '800',
  },
  editor: {
    backgroundColor: CORES.branco,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 17,
    marginTop: 18,
  },
  rotulo: {
    color: CORES.verdeEscuro,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 15,
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#FCFCFA',
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 11,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: CORES.texto,
    fontSize: 14,
  },
  multilinha: {
    minHeight: 100,
  },
  opcoes: {
    flexDirection: 'row',
    gap: 8,
  },
  opcao: {
    flex: 1,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
  },
  opcaoAtiva: {
    backgroundColor: CORES.verdeClaro,
    borderColor: CORES.verde,
  },
  opcaoTexto: {
    color: CORES.secundario,
    fontSize: 11,
    fontWeight: '700',
  },
  opcaoTextoAtivo: {
    color: CORES.verdeEscuro,
  },
  botaoSalvar: {
    backgroundColor: CORES.verdeEscuro,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 24,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoSalvarTexto: {
    color: CORES.branco,
    fontWeight: '900',
    fontSize: 13,
  },
  botaoExcluir: {
    borderWidth: 1,
    borderColor: CORES.vermelho,
    borderRadius: 12,
    padding: 13,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoExcluirTexto: {
    color: CORES.vermelho,
    fontWeight: '800',
    fontSize: 13,
  },
  botaoCancelar: {
    padding: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  botaoCancelarTexto: {
    color: CORES.secundario,
    fontWeight: '700',
    fontSize: 12,
  },
  vazio: {
    backgroundColor: CORES.branco,
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
  },
  vazioTitulo: {
    color: CORES.verdeEscuro,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  vazioTexto: {
    color: CORES.secundario,
    fontSize: 12,
    lineHeight: 18,
  },
  rodape: {
    color: '#899184',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 30,
  },
});
