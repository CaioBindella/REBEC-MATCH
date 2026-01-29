import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api/apiClient';

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // ID do Estudo
  const { user } = useAuth();
  const router = useRouter();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages();
    // Opcional: Polling para atualizar mensagens a cada 5s
    const interval = setInterval(fetchMessages, 5000); 
    return () => clearInterval(interval);
  }, [id]);

  const fetchMessages = async () => {
    if (!user || !id) return;
    try {
        // Busca mensagens trocadas neste estudo
        const data = await apiService.mensagem.listarPorEstudo(Number(id), user.id);
        setMessages(data);
        setLoading(false);
    } catch (error) {
        console.log("Erro ao buscar mensagens (Backend pode não estar pronto ainda)");
        setLoading(false);
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || !user) return;
    setSending(true);
    try {
      // Envia para a API
      await apiService.mensagem.enviar({
          autorId: user.id,
          leitorId: 0, // O backend deve descobrir quem é o leitor (Pesquisador/Voluntário) baseado no Estudo
          estudoId: Number(id),
          conteudo: inputText
      });
      setInputText('');
      fetchMessages(); // Recarrega imediatamente
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isMe = item.autorId === user?.id;
    return (
      <View style={[styles.bubbleContainer, isMe ? styles.rightContainer : styles.leftContainer]}>
        <View style={[styles.bubble, isMe ? styles.rightBubble : styles.leftBubble]}>
          <Text style={[styles.msgText, isMe ? styles.rightText : styles.leftText]}>
            {item.conteudo}
          </Text>
          <Text style={[styles.timeText, isMe ? {color: '#e0f2f1'} : {color: '#888'}]}>
             {new Date(item.dataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header Simples */}
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