import { Redirect, Stack } from "expo-router";
// Importe o ActivityIndicator para uma melhor experiência de carregamento
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout() {
  // --- CORREÇÃO 1: Usar 'user' em vez de 'isAuthenticated' ---
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#166865" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="home/page" options={{ headerShown: false }} />
    </Stack>
  );
}