import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  //função logOut do seu contexto de autenticação
  const { logOut } = useAuth();

  return (
    <View style={styles.header}>
      <Image
        source={require('@/assets/images/MatchLogo.png')}
        style={styles.logo}
      />

      <Menu>
        <MenuTrigger>
          <Image
            source={require('@/assets/images/HeaderMenu.png')}
            style={styles.menuIcon}
          />
        </MenuTrigger>
        
        {/* 4. Defina as opções que aparecerão no menu */}
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption onSelect={() => alert('Abrir Perfil')}>
            <Text style={styles.menuOptionText}>Meu Perfil</Text>
          </MenuOption>
          <View style={styles.divider} />
          <MenuOption onSelect={() => alert('Abrir Configurações')}>
            <Text style={styles.menuOptionText}>Configurações</Text>
          </MenuOption>
          <View style={styles.divider} />
          {/* Adicione a opção de Sair que chama a função logOut */}
          <MenuOption onSelect={() => logOut()}>
            <Text style={[styles.menuOptionText, { color: 'red' }]}>Sair</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15, // Ajuste para melhor alinhamento
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 120, // Ajustado para um visual mais limpo
    height: 40,
    resizeMode: 'contain',
  },
  menuIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  // Estilos para o texto dentro das opções do menu
  menuOptionText: {
    fontSize: 16,
    color: '#333',
  },
  // Linha divisória entre as opções
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
});

// Estilos customizados para o container do menu dropdown
const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 35, // Desce o menu um pouco para não cobrir o ícone
  },
  optionWrapper: {
    padding: 10,
  },
};