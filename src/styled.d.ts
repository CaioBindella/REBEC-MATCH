// Importa o módulo original para podermos estendê-lo
import 'styled-components';

// Estende a interface DefaultTheme do styled-components
declare module 'styled-components' {
  // Adiciona aqui todas as propriedades que o seu objeto 'theme' terá
  export interface DefaultTheme {
    mainColor: string;
  }
}