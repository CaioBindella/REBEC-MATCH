import { Stack } from 'expo-router';

//Components
import RegisterForm from '@/components/volunteerComponents/VolunteerRegisterForm';
import Header from '@/components/reusable/Header';

export default function RegisterPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header/>
      <RegisterForm />
    </>
  );
}
