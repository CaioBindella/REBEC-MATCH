import { Redirect, Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedLayout() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#166865" />
      </View>
    );
  }

  // if (!user) {
  //   return <Redirect href="/login" />;
  // }

  return <Stack screenOptions={{ headerShown: false }} />;
}
