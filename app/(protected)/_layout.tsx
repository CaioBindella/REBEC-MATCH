import { Redirect, Stack} from "expo-router";
import { useEffect } from "react";

const isLoggedIn = false;

export default function ProtectedLayout() {
  
  if(!isLoggedIn) {
    // Redirect to the login page if not logged in
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
