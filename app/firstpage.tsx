import { Text, View, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

// Contexto
import { useAuth } from '@/context/AuthContext';

// Components
import { InitialButton } from '@/components/reusable/InitialButton';
import { TermsModal } from '@/components/reusable/TermsModal';

export default function HomeScreen() {
  const router = useRouter();
  const { user, isReady } = useAuth(); 

  // Estados de Navegação
  const [modalVisible, setModalVisible] = useState(false);
  const [navigationPath, setNavigationPath] = useState('');

  // Estados de Controle LGPD
  const [showLGPD, setShowLGPD] = useState(false);
  const [checkingConfigs, setCheckingConfigs] = useState(true);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  // --- 1. Efeito Inicial ---
  useEffect(() => {
    async function initCheck() {
      if (!isReady) return;

      // Auto-Login
      if (user) {
        router.replace('/(protected)/home/page');
        return;
      }

      // Verifica LGPD
      try {
        const accepted = await SecureStore.getItemAsync('lgpd_accepted');
        if (accepted === 'true') {
          setLgpdAccepted(true); // Marca que já aceitou
        } else {
          setShowLGPD(true); // Mostra o aviso inicial
        }
      } catch (error) {
        console.log('Erro LGPD:', error);
      } finally {
        setCheckingConfigs(false);
      }
    }

    initCheck();
  }, [isReady, user]);

  // --- Lógica Inteligente dos Botões ---
  const handlePress = (path: string) => {
    // SE já aceitou a LGPD, navega direto sem perguntar de novo
    if (lgpdAccepted) {
      router.push(path as Href);
    } else {
      // SE não aceitou, abre o modal para confirmar
      setNavigationPath(path);
      setModalVisible(true);
    }
  };

  // Aceite vindo do Modal de Navegação (Login/Cadastro)
  const handleAcceptNavigation = async () => {
    try {
      await SecureStore.setItemAsync('lgpd_accepted', 'true'); // Salva
      setLgpdAccepted(true); // Atualiza estado
    } catch (e) { console.log(e); }

    setModalVisible(false);
    if (navigationPath) {
      router.push(navigationPath as Href);
    }
  };

  const handleCloseNavigation = () => {
    setModalVisible(false);
    setNavigationPath('');
  };

  // Aceite vindo do Modal Inicial (Ao abrir o app)
  const handleAcceptLGPD = async () => {
    try {
      await SecureStore.setItemAsync('lgpd_accepted', 'true'); // Salva
      setLgpdAccepted(true); // Atualiza estado
      setShowLGPD(false);
    } catch (error) {
      console.log('Erro ao salvar aceite:', error);
    }
  };

  if (!isReady || checkingConfigs) {
      return (
        <ImageBackground
          source={require('../assets/images/BackgroundLogin.png')}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
           <ActivityIndicator size="large" color="#166865" />
        </ImageBackground>
      );
  }

  return (
    <ImageBackground
      source={require('../assets/images/BackgroundLogin.png')}
      style={{ flex: 1, height: '100%'}}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/MatchLogo.png')} style={{ marginBottom: 20 }} />
        <Image source={require('../assets/images/LineLogin.png')} style={{ marginBottom: 20 }} />

        <Text style={styles.title}>Precisa de Voluntários?</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor vel accusamus recusandae! 
          Sapiente eius harum veniam magnam libero ab quia labore possimus.
        </Text>

        <InitialButton 
          text="Crie sua conta" 
          color='#166865'
          onPress={() => handlePress('/(auth)/voluntaryRegister')}
        />

        <Text style={styles.text}>- - - - - - - ou - - - - - - -</Text>

        <InitialButton 
          text="Fazer login" 
          color='#15715A'
          onPress={() => handlePress('/(auth)/login')}
         />

         {/* Modal de Navegação (Só aparece se lgpdAccepted for false) */}
         <TermsModal
          visible={modalVisible}
          onClose={handleCloseNavigation}
          onAccept={handleAcceptNavigation}
        />

        {/* Modal Inicial (Só aparece se lgpdAccepted for false ao abrir o app) */}
        <TermsModal
          visible={showLGPD}
          onClose={() => setShowLGPD(false)}
          onAccept={handleAcceptLGPD}
        />

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    marginBottom: 30
  },
  text: {
    color: '#776D6D', 
    fontSize: 14, 
    fontFamily: 'Inter', 
    fontWeight: '300', 
    lineHeight: 17, 
    margin: 20
  },
  title: {
    color: '#1A514D', 
    fontSize: 38.36, 
    fontFamily: 'Inter', 
    fontWeight: '800', 
    lineHeight: 37, 
    textAlign: 'center',
  },
});