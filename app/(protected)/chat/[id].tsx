import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter  } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

// Nossa própria interface de mensagem simples
interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date;
  user: {
    _id: string | number;
    name: string;
  };
}

// Simulação de histórico de mensagens e usuários
const mockMessages: { [key: string]: IMessage[] } = {
  '1': [
    {
      _id: 1,
      text: 'Olá! Bem-vindo ao estudo. Estou à disposição para qualquer dúvida.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // ontem
      user: { _id: 2, name: 'Dr. Alvares' },
    },
  ],
  '4': [],
};

const VOLUNTEER_USER = { _id: 1, name: 'Voluntário' };
const RESEARCHER_USER = { _id: 2, name: 'Pesquisador' };

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setMessages(mockMessages[id as keyof typeof mockMessages] || []);
  }, [id]);

  const onSend = () => {
    if (inputText.trim().length === 0) {
      return;
    }

    const newMessage: IMessage = {
      _id: Math.random().toString(),
      text: inputText,
      createdAt: new Date(),
      user: VOLUNTEER_USER,
    };
    
    // Adiciona a nova mensagem à lista
    setMessages(previousMessages => [newMessage, ...previousMessages]);
    setInputText('');

    // Simula a resposta do pesquisador
    setTimeout(() => {
      const responseMessage: IMessage = {
        _id: Math.random().toString(),
        text: 'Mensagem recebida. Em breve retornarei.',
        createdAt: new Date(),
        user: RESEARCHER_USER,
      };
      setMessages(previousMessages => [responseMessage, ...previousMessages]);
    }, 1500);
  };

  const renderMessageBubble = ({ item }: { item: IMessage }) => {
    const isMyMessage = item.user._id === VOLUNTEER_USER._id;
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.bubble,
          isMyMessage ? styles.myBubble : styles.otherBubble
        ]}>
          <Text style={isMyMessage ? styles.myMessageText : styles.otherMessageText}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <> 
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitleAlign: 'left',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#0d9371' },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 10 }}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <FontAwesome name="user-circle" size={32} color="#fff" />
              <Text style={styles.headerTitleText}>PS243RJ</Text>
            </View>
          ),
        }} 
      />

      {/* O resto da sua UI continua dentro do SafeAreaView */}
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          style={styles.container}
          keyboardVerticalOffset={90}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageBubble}
            keyExtractor={(item) => item._id.toString()}
            style={styles.messageList}
            inverted
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.sendButton} onPress={onSend}>
              <Text style={styles.sendButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 10,
    color: '#fff',
  },
  messageList: { paddingHorizontal: 10, flex: 1 },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15715A',
    borderRadius: 20,
  },
  sendButtonText: { color: '#fff', fontWeight: 'bold' },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessageContainer: { alignSelf: 'flex-end' },
  otherMessageContainer: { alignSelf: 'flex-start' },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: '#15715A',
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  myMessageText: { color: '#fff' },
  otherMessageText: { color: '#333' },
});