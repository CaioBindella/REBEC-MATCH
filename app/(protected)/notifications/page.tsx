import React, { useState, useCallback } from 'react';
import { 
  SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator 
} from 'react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/reusable/Header';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api/apiClient';

// Tipo de dado (adaptado para o retorno do backend)
interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // useFocusEffect garante que a lista recarregue sempre que o usuário entrar na tela
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [user])
  );

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      // Chama a API real
      const data = await apiService.notificacao.listar(user.id);
      
      // Mapeia os dados do Backend (Notificacao) para o Frontend (NotificationItem)
      const formatted = data.map((n: any) => ({
        id: String(n.id),
        title: n.titulo,
        description: n.mensagem,
        // Formata a data (ex: 29/01/2026)
        time: new Date(n.dataCriacao).toLocaleDateString('pt-BR', { 
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
        }), 
        read: n.lida,
        type: n.tipo || 'info', // Fallback se vier null
      }));
      
      setNotifications(formatted);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      // Chama o endpoint de marcar todas como lidas
      await apiService.notificacao.marcarLidas(user.id);
      
      // Atualiza o estado local para refletir a mudança instantaneamente
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erro ao marcar como lidas:", error);
    }
  };

  const renderNotification = ({ item }: { item: NotificationItem }) => {
    // Define ícone e cor com base no tipo vindo do banco
    let iconName: keyof typeof Ionicons.glyphMap = 'notifications';
    let iconColor = '#15715A';
    let bgColor = '#E0F2F1';

    if (item.type === 'success') {
      iconName = 'checkmark-circle';
      iconColor = '#15715A';
      bgColor = '#d1fae5';
    } else if (item.type === 'warning') {
      iconName = 'alert-circle';
      iconColor = '#d97706';
      bgColor = '#fef3c7';
    } else {
      // Tipo 'info' ou padrão
      iconName = 'chatbubble-ellipses';
      iconColor = '#2563eb';
      bgColor = '#dbeafe';
    }

    return (
      <TouchableOpacity style={[styles.card, !item.read && styles.unreadCard]}>
        <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>
        </View>
        {!item.read && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      
      <View style={styles.content}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Notificações</Text>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markReadText}>Marcar lidas</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#15715A" style={{ marginTop: 50 }} />
        ) : (
            <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={renderNotification}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Você não tem novas notificações.</Text>
                </View>
            }
            />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { flex: 1, padding: 20 },
  
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#212529' },
  markReadText: { color: '#15715A', fontWeight: '600', fontSize: 14 },

  // Card styles
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#15715A',
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444', // Vermelho para não lido
    position: 'absolute',
    top: 16,
    right: 16,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
});