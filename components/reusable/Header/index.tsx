import React, { useCallback, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useFocusEffect, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api/apiClient';
import { preferencias } from '@/services/preferences';

export default function Header() {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [naoLidas, setNaoLidas] = useState(0);

  // Indicador de notificações não lidas, atualizado sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      (async () => {
        if (!user || !(await preferencias.alertasAtivos())) {
          if (ativo) setNaoLidas(0);
          return;
        }
        try {
          const notificacoes = await apiService.notificacao.listar(user.id);
          if (ativo) setNaoLidas(notificacoes.filter((n) => !n.lida).length);
        } catch {
          if (ativo) setNaoLidas(0);
        }
      })();
      return () => {
        ativo = false;
      };
    }, [user])
  );

  const canGoBack = router.canGoBack();

  // Na tela principal a seta de voltar nunca aparece
  const isHomePage = pathname.includes('/home');

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {/* Só mostra a seta se puder voltar E se NÃO for a home page */}
        {canGoBack && !isHomePage && (
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
            <View>
              <Image
                source={require('@/assets/images/HeaderMenu.png')}
                style={styles.menuIcon}
              />
              {naoLidas > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{naoLidas > 9 ? '9+' : naoLidas}</Text>
                </View>
              )}
            </View>
          </MenuTrigger>
          
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption onSelect={() => router.push('/(protected)/profile/page')}>
              <Text style={styles.menuOptionText}>Meu Perfil</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={() => router.push('/(protected)/settings/page')}>
              <Text style={styles.menuOptionText}>Configurações</Text>
            </MenuOption>
            <View style={styles.divider} />
            <MenuOption onSelect={() => router.push('/(protected)/notifications/page')}>
              <Text style={styles.menuOptionText}>Notificações{naoLidas > 0 ? ` (${naoLidas})` : ''}</Text>
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
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
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