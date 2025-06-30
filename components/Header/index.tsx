import { View, Image, StyleSheet } from 'react-native';

export default function Header() {
 return (
   <View style={styles.header}>
        <Image
        source={require('@/assets/images/MatchLogo.png')}
        style={styles.logo}
        />
        <Image
        source={require('@/assets/images/HeaderMenu.png')}
        style={styles.menuIcon}
        />
   </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  logo: {
    width: 140, // Defina a largura desejada
    height: 60, // Defina a altura desejada
    resizeMode: 'contain', // Essencial para não distorcer a imagem
  },
  menuIcon: {
    width: 25, // Tamanho para o ícone de menu
    height: 25,
    resizeMode: 'contain',
  }
});