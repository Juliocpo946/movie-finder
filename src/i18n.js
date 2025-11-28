import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: {
          common: {
            loading: 'LOADING...',
            search: 'SEARCH',
            favorites: 'SAVED',
            settings: 'CONFIG',
            no_results: 'NO_RESULTS',
            error: 'ERROR',
            go_back: 'GO_BACK'
          },
          home: {
            welcome: 'Search movies and series...',
            subtitle: 'Access the global cinema database'
          },
          filters: {
            all: 'ALL',
            movies: 'MOVIES',
            series: 'SERIES'
          }
        }
      },
      es: {
        translation: {
          common: {
            loading: 'CARGANDO...',
            search: 'BUSCAR',
            favorites: 'GUARDADOS',
            settings: 'CONFIG',
            no_results: 'SIN_RESULTADOS',
            error: 'ERROR',
            go_back: 'VOLVER'
          },
          home: {
            welcome: 'Buscar peliculas y series...',
            subtitle: 'Acceso a la base de datos global de cine'
          },
          filters: {
            all: 'TODO',
            movies: 'PELICULAS',
            series: 'SERIES'
          }
        }
      }
    }
  });

export default i18n;