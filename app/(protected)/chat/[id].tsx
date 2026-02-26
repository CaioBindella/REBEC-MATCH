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
  
  // Adicionados nomeContato e tituloEstudo nos parâmetros
  const { 
      id, 
      voluntarioId, 
      pesquisadorId, 
      nomeContato, 
      tituloEstudo 
  } = useLocalSearchParams<{ 
      id: string, 
      voluntarioId?: string, 
      pesquisadorId?: string,
      nomeContato?: string,
      tituloEstudo?: string
  }>();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const myId = user?.id; 
  const isVolunteer = user?.tipoEspecifico === 'VOLUNTARIO'; 
  
  const targetVoluntarioId = isVolunteer ? myId : Number(voluntarioId);
  const targetLeitorId = isVolunteer ? Number(pesquisadorId) : Number(voluntarioId);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, [id, myId, targetLeitorId]); 

  const fetchMessages = async () => {
    if (!myId || !id || !targetLeitorId) {
        console.warn("Faltam parâmetros para abrir o chat:", { myId, id, targetLeitorId });
        setLoading(false);
        return;
    }
    
    try {
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
        return;
    }
    
    setSending(true);
    try {
      await chatApi.post('/mensagens', {
          autorId: myId,
          leitorId: targetLeitorId, 
          estudoId: Number(id),
          conteudo: inputText
      });
      setInputText('');
      fetchMessages(); 
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
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
      
      {/* HEADER ATUALIZADO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        {/* Ícone de Avatar genérico para dar um ar mais profissional */}
        <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#fff" />
        </View>

        <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {nomeContato || 'Usuário'}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
                {tituloEstudo || 'Chat do Estudo'}
            </Text>
        </View>
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
            />
        )}
      </View>

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
  // Estilos do Novo Header
  header: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 12, 
      backgroundColor: '#fff', 
      elevation: 3,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0'
  },
  backButton: {
      padding: 5,
      marginRight: 5
  },
  avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#15715A',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12
  },
  headerTextContainer: {
      flex: 1,
      justifyContent: 'center'
  },
  headerTitle: { 
      fontSize: 16, 
      fontWeight: 'bold', 
      color: '#333' 
  },
  headerSubtitle: {
      fontSize: 12,
      color: '#666',
      marginTop: 2
  },

  // Restante dos estilos
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
  sendBtn: { backgroundColor: '#15715A', width: 45, height: 45, borderRadius: 23, justifyContent: 'center', alignItems: 'center' }
});