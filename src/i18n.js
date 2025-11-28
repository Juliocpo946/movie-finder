// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: {
          common: {
            loading: 'INITIALIZING_SYSTEM...',
            search: 'SEARCH_DATABASE',
            favorites: 'SAVED_FILES',
            settings: 'CONFIG',
            no_results: 'DATA_NOT_FOUND',
            error: 'Ooooops system failure',
            go_back: 'RETURN_TO_ROOT'
          },
          home: {
            welcome: 'ARCHIVE_PROTOCOL_V1',
            subtitle: 'ACCESS_GLOBAL_CINEMA_DATABASE'
          },
          filters: {
            all: 'ALL_VX',
            movies: 'MOVIES.EQ',
            series: 'SERIES.EQ'
          }
        }
      },
      es: {
        translation: {
          common: {
            loading: 'INICIALIZANDO_SISTEMA...',
            search: 'BUSCAR_EN_BASE_DE_DATOS',
            favorites: 'ARCHIVOS_GUARDADOS',
            settings: 'CONFIGURACION',
            no_results: 'DATOS_NO_ENCONTRADOS',
            error: 'Falla critica del sistema',
            go_back: 'RETORNAR_A_RAIZ'
          },
          home: {
            welcome: 'PROTOCOLO_ARCHIVO_V1',
            subtitle: 'ACCESO_BASE_DATOS_CINE_GLOBAL'
          },
          filters: {
            all: 'TODO_VX',
            movies: 'PELICULAS.EQ',
            series: 'SERIES.EQ'
          }
        }
      }
    }
  });

export default i18n;