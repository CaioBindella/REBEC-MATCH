import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

//importando os arquivos de tradução
import en from './en.json'
import pt from './pt.json';

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'en', // Define o idioma padrão
    resources:{
        en: en,
        pt: pt
    },
    react: {
        useSuspense: false, // Desativa o suspense para evitar problemas de carregamento
    },
    interpolation: {
        escapeValue: false, // React já faz a sanitização
    },
})

export default i18n;