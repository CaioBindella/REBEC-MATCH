import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { chatApi } from '@/services/api/apiClient';

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Parâmetros recebidos na navegação
  // 'id' é o ID do estudo.
  // 'voluntarioId' e 'pesquisadorId' devem ser passados na navegação para a tela de chat saber quem é quem
  const { id, voluntarioId, pesquisadorId } = useLocalSearchParams<{ id: string, voluntarioId?: string, pesquisadorId?: string }>();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Lógica para definir os IDs corretamente para a API do Node.js
  const myId = user?.id; // Assumindo que user.id seja o ID da tabela Usuario
  const isVolunteer = user?.tipoEspecifico === 'VOLUNTARIO'; // Ajuste conforme a propriedade do seu AuthContext
  
  // O ID do voluntário usado na rota GET
  const targetVoluntarioId = isVolunteer ? myId : Number(voluntarioId);
  // Quem vai ler a mensagem (O oposto de quem está logado)
  const targetLeitorId = isVolunteer ? Number(pesquisadorId) : Number(voluntarioId);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, [id, myId, targetLeitorId]); // <-- Atualizei as dependências aqui

  const fetchMessages = async () => {
    // Verificamos se temos quem está enviando (myId) e quem vai ler (targetLeitorId)
    if (!myId || !id || !targetLeitorId) return;
    
    try {
        // Usa a ROTA DO NODE.JS: GET /mensagens/:estudoId/:usuario1/:usuario2
        // Enviando exatamente os 3 parâmetros que o Node.js espera!
        const response = await chatApi.get(`/mensagens/${id}/${myId}/${targetLeitorId}`);
        setMessages(response.data);
    } catch (error) {
        console.log("Erro ao buscar mensagens do Node.js", error);
    } finally {
        setLoading(false);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || !myId || !targetLeitorId) {
        console.warn("Faltam dados para enviar a mensagem (leitorId não encontrado)");
        return;
    }
    
    setSending(true);
    try {
      // Usa a ROTA DO NODE.JS: POST /mensagens
      await chatApi.post('/mensagens', {
          autorId: myId,
          leitorId: targetLeitorId, // Agora o backend Node.js recebe exatamente para quem é
          estudoId: Number(id),
          conteudo: inputText
      });
      setInputText('');
      fetchMessages(); // Recarrega imediatamente
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // O Node retorna "autor_id" na consulta SQL, então pegamos assim:
    const isMe = item.autor_id === myId; 
    
    return (
      <View style={[styles.bubbleContainer, isMe ? styles.rightContainer : styles.leftContainer]}>
        <View style={[styles.bubble, isMe ? styles.rightBubble : styles.leftBubble]}>
          <Text style={[styles.msgText, isMe ? styles.rightText : styles.leftText]}>
            {item.conteudo}
          </Text>
          <Text style={[styles.timeText, isMe ? {color: '#e0f2f1'} : {color: '#888'}]}>
             {new Date(item.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat do Estudo</Text>
        <View style={{width: 24}} />
      </View>

      {loading ? (
          <ActivityIndicator size="large" color="#15715A" style={{marginTop: 50}} />
      ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, sending && {opacity: 0.7}]} 
            onPress={handleSend}
            disabled={sending}
          >
            {sending ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#15715A' },
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
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100, marginRight: 10 },
  sendBtn: { backgroundColor: '#15715A', width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center' }
});