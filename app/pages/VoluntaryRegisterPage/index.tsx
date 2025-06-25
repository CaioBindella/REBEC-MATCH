import { Stack } from 'expo-router';

//Components
import RegisterForm from '../../../components/VoluntaryRegisterForm';
import Header from '@/components/Header';

export default function RegisterPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header/>
      <RegisterForm />
    </>
  );
}
