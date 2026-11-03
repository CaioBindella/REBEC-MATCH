import { Alert, Platform } from 'react-native';

// Na versão web, o Alert do React Native não exibe nada nem executa os botões; por isso as
// mensagens usam os diálogos do navegador nessa plataforma.
const isWeb = Platform.OS === 'web';

/**
 * Exibe uma mensagem ao usuário e chama `aoFechar` quando ela é dispensada. Use `aoFechar` para
 * levar o usuário à próxima tela depois de uma ação concluída.
 */
export function avisar(titulo: string, mensagem: string, aoFechar?: () => void) {
  if (isWeb) {
    window.alert(`${titulo}\n\n${mensagem}`);
    aoFechar?.();
    return;
  }
  Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: aoFechar }], { cancelable: false });
}

/**
 * Pede a confirmação do usuário antes de uma ação. Resolve `true` se ele confirmar.
 */
export function confirmar(
  titulo: string,
  mensagem: string,
  { textoConfirmar = 'Confirmar', destrutivo = false }: { textoConfirmar?: string; destrutivo?: boolean } = {}
): Promise<boolean> {
  if (isWeb) {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) =>
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: destrutivo ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    )
  );
}
