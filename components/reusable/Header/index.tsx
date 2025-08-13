import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  const { logOut } = useAuth();
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {canGoBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerContainer}>
        <Image
          source={require('@/assets/images/MatchLogo.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.rightContainer}>
        <Menu>
          <MenuTrigger>
            <Image
              source={require('@/assets/images/HeaderMenu.png')}
              style={styles.menuIcon}
            />
          </MenuTrigger>
          
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption onSelect={() => alert('Abrir Perfil')}>
              <Text style={styles.menuOptionText}>Meu Perfil</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={() => alert('Abrir Configurações')}>
              <Text style={styles.menuOptionText}>Configurações</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={() => alert('Abrir Configurações')}>
              <Text style={styles.menuOptionText}>Notificações</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={logOut}>
              <Text style={[styles.menuOptionText, { color: 'red' }]}>Sair</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 90,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 5,
  },
  menuIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
  },
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    elevation: 5,
    marginTop: 35,
  },
  optionWrapper: {
    padding: 10,
  },
};