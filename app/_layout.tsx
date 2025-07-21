import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';

// Provider
import { AuthProvider } from '@/context/AuthContext';
import { MenuProvider } from 'react-native-popup-menu'

export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#166865" />
      </View>
    )
  }

  return (
      <MenuProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="firstpage" />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/voluntaryRegister" />
            <Stack.Screen name="(protected)" />
          </Stack>
        </AuthProvider>
      </MenuProvider>
  );
}
