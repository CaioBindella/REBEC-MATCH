import { storage, STORAGE_KEYS } from '@/services/storage';

/**
 * Preferência local "Alertas de novas notificações": quando ativa, o cabeçalho exibe o número de
 * notificações não lidas da central de notificações. Padrão: ativa.
 */
export const preferencias = {
  alertasAtivos: async () => (await storage.getItem(STORAGE_KEYS.ALERTAS)) !== 'false',
  definirAlertas: (ativos: boolean) => storage.setItem(STORAGE_KEYS.ALERTAS, String(ativos)),
};
