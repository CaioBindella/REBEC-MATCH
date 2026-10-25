import { Stack } from 'expo-router';
import { View, Image, StyleSheet } from 'react-native';

//Components
import RegisterForm from '@/components/volunteerComponents/VolunteerRegisterForm';

export default function RegisterPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerContainer}>
        <Image 
          source={require('@/assets/images/MatchLogo.png')}
          style={styles.logo} 
        />
      </View>
      <RegisterForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfc',
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 45,   
    paddingHorizontal: 20,  
    alignItems: 'center',
    justifyContent: 'center',
    
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    
    elevation: 5,

    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  logo: {
    width: 130,
    height: 40,
    resizeMode: 'contain',
  },
});
