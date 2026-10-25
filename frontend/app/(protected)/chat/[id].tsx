import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { io, Socket } from 'socket.io-client';

import { useAuth } from '@/context/AuthContext';
import { apiService, CHAT_URL, getErrorMessage } from '@/services/api/apiClient';
import { storage, STORAGE_KEYS } from '@/services/storage';
import { MensagemDTO } from '@/types/types';
import { formatTime } from '@/utils/formatters';

// Intervalo da sondagem de reserva, usada apenas enquanto a conexão em tempo real estiver indisponível
const INTERVALO_SONDAGEM_MS = 5000;

/**
 * Chat entre voluntário e pesquisador de um estudo, liberado após o match.
 * Parâmetros: id (estudo), contatoUsuarioId (usuário do outro participante), nomeContato e tituloEstudo.
 */
export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id, contatoUsuarioId, nomeContato, tituloEstudo } = useLocalSearchParams<{
    id: string;
    contatoUsuarioId: string;
    nomeContato?: string;
    tituloEstudo?: string;
  }>();

  const estudoId = Number(id);
  const contatoId = Number(contatoUsuarioId);
  const myId = user?.id;

  const [messages, setMessages] = useState<MensagemDTO[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conectado, setConectado] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const adicionarMensagem = useCallback((mensagem: MensagemDTO) => {
    setMessages((atuais) => (atuais.some((m) => m.id === mensagem.id) ? atuais : [...atuais, mensagem]));
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!myId || !estudoId || !contatoId) return;
    try {
      setMessages(await apiService.mensagem.listar(estudoId, myId, contatoId));
    } catch (error) {
      Alert.alert('Chat indisponível', getErrorMessage(error, 'Não foi possível carregar as mensagens.'));
      router.back();
    } finally {
      setLoading(false);
    }
  }, [myId, estudoId, contatoId, router]);

  // Carrega o histórico e abre a conexão em tempo real com o serviço de chat
  useEffect(() => {
    fetchMessages();
    let socket: Socket | null = null;
    let ativo = true;

    storage.getItem(STORAGE_KEYS.TOKEN).then((token) => {
      if (!ativo || !token) return;
      socket = io(CHAT_URL, { auth: { token }, transports: ['websocket'] });
      socket.on('connect', () => setConectado(true));
      socket.on('disconnect', () => setConectado(false));
      socket.on('connect_error', () => setConectado(false));
      socket.on('nova-mensagem', (mensagem: MensagemDTO) => {
        const daConversa =
          mensagem.estudo_id === estudoId &&
          (mensagem.autor_id === contatoId || mensagem.leitor_id === contatoId);
        if (daConversa) adicionarMensagem(mensagem);
      });
    });

    return () => {
      ativo = false;
      socket?.disconnect();
    };
  }, [fetchMessages, adicionarMensagem, estudoId, contatoId]);

  // Sondagem de reserva enquanto o socket estiver desconectado
  useEffect(() => {
    if (conectado) return;
    const interval = setInterval(fetchMessages, INTERVALO_SONDAGEM_MS);
    return () => clearInterval(interval);
  }, [conectado, fetchMessages]);

  const handleSend = async () => {
    const conteudo = inputText.trim();
    if (!conteudo || !contatoId) return;

    setSending(true);
    try {
      const enviada = await apiService.mensagem.enviar({ leitorId: contatoId, estudoId, conteudo });
      adicionarMensagem(enviada);
      setInputText('');
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível enviar a mensagem.'));
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: MensagemDTO }) => {
    const isMe = item.autor_id === myId;
    return (
      <View style={[styles.bubbleContainer, isMe ? styles.rightContainer : styles.leftContainer]}>
        <View style={[styles.bubble, isMe ? styles.rightBubble : styles.leftBubble]}>
          <Text style={[styles.msgText, isMe ? styles.rightText : styles.leftText]}>{item.conteudo}</Text>
          <Text style={[styles.timeText, isMe ? { color: '#e0f2f1' } : { color: '#888' }]}>{formatTime(item.data_envio)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{nomeContato || 'Contato'}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>{tituloEstudo || 'Chat do Estudo'}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: conectado ? '#22c55e' : '#adb5bd' }]} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#15715A" />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma mensagem ainda. Envie a primeira!</Text>}
          />
        )}
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChangeText={setInputText}
            maxLength={2000}
            multiline
          />
          <TouchableOpacity style={[styles.sendBtn, sending && { opacity: 0.7 }]} onPress={handleSend} disabled={sending}>
            {sending ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 5, marginRight: 5 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#15715A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextContainer: { flex: 1, justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
  bubbleContainer: { flexDirection: 'row', marginBottom: 10 },
  rightContainer: { justifyContent: 'flex-end' },
  leftContainer: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 12 },
  rightBubble: { backgroundColor: '#15715A', borderBottomRightRadius: 0 },
  leftBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 0, borderWidth: 1, borderColor: '#e0e0e0' },
  msgText: { fontSize: 16 },
  rightText: { color: '#fff' },
  leftText: { color: '#333' },
  timeText: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  input: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100, marginRight: 10 },
  sendBtn: { backgroundColor: '#15715A', width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center' },
});
