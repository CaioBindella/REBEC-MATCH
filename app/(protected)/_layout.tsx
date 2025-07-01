import { Redirect, Stack } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    // Se o estado de autenticação ainda não estiver carregado, não renderiza nada
    return null;
  }

  if (!isAuthenticated) {
    Alert.alert("Não foi possível acessar a página!","Você precisa estar logado para acessar esta página.");
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}