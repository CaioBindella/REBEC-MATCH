import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Chaves usadas no armazenamento seguro do dispositivo
export const STORAGE_KEYS = {
  TOKEN: 'user_token',
  USER: 'user_data',
  LGPD: 'lgpd_accepted',
  ALERTAS: 'alertas_notificacoes',
} as const;

const isWeb = Platform.OS === 'web';

/**
 * Armazenamento da sessão: no Android/iOS usa o Expo SecureStore (Keystore/Keychain, criptografado);
 * na versão web, onde o SecureStore não existe, usa o localStorage do navegador.
 */
export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    if (isWeb) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
