import { Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';

//Components
import { InitialButton } from '@/components/reusable/InitialButton';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../assets/images/BackgroundLogin.png')}
      style={{ flex: 1, height: '100%'}}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/images/MatchLogo.png')}
          style={{ marginBottom: 20 }}
        />
        <Image
          source={require('../assets/images/LineLogin.png')}
          style={{ marginBottom: 20 }}
        />

        <Text style={styles.title}>Precisa de Voluntários?</Text>
        <Text style={styles.text}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor vel accusamus recusandae! Sapiente eius harum veniam magnam libero ab quia labore possimus, ratione aspernatur est dignissimos voluptatem! Dolor, magnam assumenda.
        </Text>

        <InitialButton 
          text="Entre como Pesquisador" 
          color='#166865'
        />

        <Text style={styles.text}>- - - - - - - ou - - - - - - -</Text>

        <InitialButton 
          text="Entre como Voluntário" 
          color='#15715A'
          onPress={() => useRouter().push('/(auth)/voluntaryRegister')}
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
    wordWrap: 'break-word',
    margin: 20
  },
  title: {
    color: '#1A514D', 
    fontSize: 38.36, 
    fontFamily: 'Inter', 
    fontWeight: '800', 
    lineHeight: 37, 
    wordWrap: 'break-word',
    textAlign: 'center',
  },
});
