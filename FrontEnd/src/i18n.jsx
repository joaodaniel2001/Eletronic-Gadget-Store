import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    // Carrega as traduções através de HTTP (public/locales/{{lng}}/translation.json)
    .use(Backend)
    // Detecta o idioma do usuário
    .use(LanguageDetector)
    // Conecta o i18next com o React
    .use(initReactI18next)
    .init({
        // Idioma fallback caso o idioma principal não tenha uma tradução
        fallbackLng: 'en',

        // Debug ajuda a ver o que está acontecendo no console
        debug: false,

        // Configuração para o backend HTTP
        backend: {
            loadPath: '/locales/{{lng}}/translation.json', // Caminho onde os arquivos de tradução estão
        },

        // Opções de detecção de idioma (opcional, mas útil)
        detection: {
            order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
            caches: ['cookie'], // Armazena o idioma detectado em um cookie
        },

        // Namespace padrão para as traduções
        ns: ['translation'],
        defaultNS: 'translation',

        // Desativa a sanitização do HTML (opcional, dependendo do caso)
        interpolation: {
            escapeValue: false,
        },

        react: {
            // Garante que o suspense funcione durante o carregamento
            useSuspense: true,
        }
    });

export default i18n;