
# TMDB Terminal - Explorador de Cine y Televisión

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

Una aplicación web moderna y responsiva diseñada para la exploración, búsqueda y gestión de películas y series de televisión. Este proyecto fue desarrollado como parte del **IEEE ESTl Frontend Hackathon 2025**, implementando una arquitectura modular basada en componentes y gestión de estado global.

## Enlaces de Despliegue

* **URL de Producción:** [INSERTAR_TU_LINK_AQUI]
* **Repositorio:** [INSERTAR_TU_REPO_AQUI]

## 📸 Galería de Capturas

| Home Page | Búsqueda & Filtros |
|:---:|:---:|
| ![Home](LINK_A_TU_CAPTURA_HOME) | ![Search](LINK_A_TU_CAPTURA_SEARCH) |

| Detalle de Película | Favoritos | Modo Móvil |
|:---:|:---:|:---:|
| ![Detail](LINK_A_TU_CAPTURA_DETAIL) | ![Favorites](LINK_A_TU_CAPTURA_FAV) | ![Mobile](LINK_A_TU_CAPTURA_MOBILE) |

## Decisión Técnica: Estrategia de API (TMDB vs OMDb)

Aunque el planteamiento inicial del reto sugería el uso de OMDb API, este proyecto ha optado por implementar una integración completa con **TMDB (The Movie Database) API**. Esta decisión técnica se fundamenta en las siguientes limitaciones críticas detectadas en OMDb durante la fase de análisis y diseño, las cuales comprometían la experiencia de usuario (UX) y los requerimientos de "Creatividad" y "Funcionalidad" de la rúbrica:

1.  **Limitación de Endpoints de Descubrimiento:** OMDb carece de endpoints nativos para obtener "Tendencias" (Trending) o "Títulos Similares". Para cumplir con el requerimiento de la página de inicio (secciones de destacados y populares) y la página de detalle (recomendaciones), TMDB ofrece endpoints específicos (`/trending`, `/movie/{id}/similar`) que permiten una implementación real y performante sin depender de datos estáticos o múltiples peticiones secuenciales ineficientes.
2.  **Calidad de los Recursos Gráficos:** La interfaz de usuario (UI) requiere pósters y backdrops de alta resolución para lograr el impacto visual deseado (especialmente en la sección "Hero" y "Detalle"). TMDB proporciona múltiples tamaños de imagen optimizados, mientras que OMDb suele ofrecer imágenes de menor calidad o enlaces rotos en títulos menos conocidos.
3.  **Capacidades de Filtrado Avanzado:** El requerimiento de filtros combinados (Género + Año + Tipo + Ordenamiento) se resuelve de manera nativa con el endpoint `/discover` de TMDB. OMDb presenta restricciones significativas al intentar combinar múltiples parámetros de filtrado en una sola consulta.
4.  **Estabilidad y Latencia:** En pruebas de carga, TMDB demostró tiempos de respuesta más consistentes y una mayor cuota de peticiones, lo cual es crítico para la implementación de la búsqueda en tiempo real (debouncing) implementada en este proyecto.

## Características Principales

### Búsqueda y Filtrado
* **Búsqueda en Tiempo Real:** Implementación de un custom hook con "debouncing" para minimizar llamadas a la API mientras el usuario escribe.
* **Filtros Avanzados:** Capacidad de filtrar resultados por Tipo de Contenido (Película/Serie), Género específico, Año de lanzamiento y Criterio de ordenamiento (Popularidad, Valoración, Novedades).
* **Vistas Dinámicas:** Opción para alternar la visualización de resultados entre cuadrícula (Grid) y lista detallada.

### Experiencia de Usuario (UX/UI)
* **Diseño Responsivo:** Interfaz adaptativa "Mobile-First" que asegura funcionalidad completa en dispositivos móviles, tablets y escritorio.
* **Animaciones de Interfaz:** Transiciones suaves entre rutas y micro-interacciones en componentes utilizando Framer Motion.

* **Feedback Visual:** Indicadores de carga (Skeletons/Spinners) y estados de error o "sin resultados" claramente definidos.

### Gestión de Contenido
* **Detalle Profundo:** Vista detallada con sinopsis, reparto, director, metadatos técnicos y visualización de tráiler oficial embebido (YouTube).
* **Sistema de Favoritos:** Persistencia de datos local (LocalStorage) que permite al usuario guardar y gestionar su lista de seguimiento ("Watchlist") entre sesiones.
* **Algoritmo de Caché:** Implementación de un servicio de caché personalizado en memoria para almacenar respuestas de la API, reduciendo el tráfico de red y mejorando la velocidad de navegación al volver a visitar secciones previas.

## Stack Tecnológico

La arquitectura del proyecto se basa en un ecosistema moderno de JavaScript:

* **Core:** React 19
* **Build Tool:** Vite 7
* **Estilos:** Tailwind CSS 4
* **Animaciones:** Framer Motion
* **Enrutamiento:** React Router DOM 7
* **HTTP Client:** Fetch API nativa con AbortController para cancelación de peticiones.
* **Calidad de Código:** ESLint para linting y estandarización.

## Estructura del Proyecto

El código sigue una estructura modular para facilitar la escalabilidad y el mantenimiento:

* `src/api`: Configuración de clientes HTTP y definiciones de endpoints.
* `src/components`: Componentes de UI reutilizables (atómicos y moleculares).
* `src/context`: Gestión de estado global (Temas y Favoritos) mediante React Context API.
* `src/hooks`: Lógica de negocio encapsulada en Custom Hooks (`useFetch`, `useSearch`, `useMediaDetails`).
* `src/pages`: Vistas principales de la aplicación correspondientes a las rutas.
* `src/services`: Servicios de infraestructura (Almacenamiento Local, Caché).
* `src/utils`: Funciones de utilidad, constantes y helpers de formateo.

## Instalación y Ejecución

Este proyecto utiliza **pnpm** como gestor de paquetes.

1.  **Clonar el repositorio:**
    ```bash
    git clone [URL_DEL_REPOSITORIO]
    cd movie-finder
    ```

2.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```

3.  **Configuración de Variables de Entorno:**
    Cree un archivo `.env` en la raíz del proyecto basándose en el archivo `.env.example` proporcionado. Debe obtener sus credenciales en [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).

    ```env
    VITE_TMDB_API_KEY=su_api_key
    VITE_TMDB_ACCESS_TOKEN=su_access_token
    VITE_TMDB_BASE_URL=[https://api.themoviedb.org/3](https://api.themoviedb.org/3)
    VITE_TMDB_IMAGE_URL=[https://image.tmdb.org/t/p/original](https://image.tmdb.org/t/p/original)
    ```

4.  **Ejecutar servidor de desarrollo:**
    ```bash
    pnpm dev
    ```

La aplicación estará disponible en `http://localhost:5173`.

## Testing

Para ejecutar las pruebas unitarias:

```bash
pnpm test
````

## Licencia
a
Este proyecto se distribuye bajo la licencia MIT. Consulte el archivo `LICENSE` para más detalles.

-----

**Autor:** Julio César Pérez Ortiz

