
# TMDB Terminal

**Explorador de Cine y Televisión**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-FF0055?logo=framer&logoColor=white)

---

## Tabla de Contenidos

1. [Descripción General](#descripcion-general)
2. [Nuevos Módulos del Sistema](#nuevos-modulos-del-sistema)
3. [Capturas de Pantalla](#capturas-de-pantalla)
4. [Decisión Técnica: TMDB vs OMDb](#decision-tecnica-tmdb-vs-omdb)
5. [Características Principales](#caracteristicas-principales)
6. [Stack Tecnológico](#stack-tecnologico)
7. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
8. [Instalación y Configuración](#instalacion-y-configuracion)
9. [Variables de Entorno](#variables-de-entorno)
10. [Scripts Disponibles](#scripts-disponibles)
11. [Estructura de Directorios](#estructura-de-directorios)
12. [Componentes Principales](#componentes-principales)
13. [Custom Hooks](#custom-hooks)
14. [Servicios](#servicios)
15. [Optimizaciones de Rendimiento](#optimizaciones-de-rendimiento)
16. [Accesibilidad](#accesibilidad)
17. [Responsividad](#responsividad)
18. [Despliegue](#despliegue)
19. [Decisiones de Diseño](#decisiones-de-diseno)
20. [Licencia](#licencia)
21. [Autor](#autor)

---

## Descripción General

**TMDB Terminal** es una aplicación web moderna para la exploración, búsqueda y gestión de películas y series de televisión. Desarrollada como parte del **IEEE ESTl Frontend Hackathon 2025**, esta aplicación implementa una arquitectura modular basada en componentes con React 19, gestión de estado mediante Context API, y una estética visual inspirada en terminales retro con un toque cinematográfico contemporáneo.

La aplicación permite a los usuarios:

- Explorar contenido en tendencia actualizado semanalmente
- Buscar películas y series con filtros avanzados
- Visualizar información detallada incluyendo tráilers, reparto y títulos similares
- Gestionar una lista de favoritos persistente
- Alternar entre modo claro y oscuro

**URL de Producción:** [movie-finder-tau-eight.vercel.app](https://movie-finder-tau-eight.vercel.app/)

**Repositorio:** [https://github.com/Juliocpo946/movie-finder](https://github.com/Juliocpo946/movie-finder)

---

## Nuevos Módulos del Sistema (Actualización v2.0)

Se han integrado nuevas secciones de inteligencia visual para mejorar la experiencia de descubrimiento:

### 📡 Incoming Signals (Próximos Estrenos)
Un carrusel de scroll horizontal libre que muestra las películas próximas a estrenarse.
- **Efecto Visual:** Las tarjetas emergen desde las profundidades ("Deep Rise Animation") con un efecto de desenfoque (blur) que se limpia al entrar en el viewport.
- **Interacción:** Scroll fluido sin atascos ("snap-free").

### HEX Active Operatives (Actores Populares)
Base de datos visual de las personalidades más populares del momento.
- **Diseño:** Grid hexagonal/geométrico con máscaras de recorte (`clip-path`).
- **Animación:** Efecto cascada (stagger) al cargar los perfiles y transformación a color al pasar el cursor (hover).

### 📟 System Ticker (Barra de Estado)
Barra de noticias en movimiento continuo estilo teletipo.
- **Función:** Muestra el estado del sistema y mensajes decorativos ("SYSTEM STATUS: ONLINE", "DECRYPTING FILES") para inmersión total.
- **Ubicación:** Anclada bajo la barra de búsqueda para visibilidad constante.

### 📂 System Directories (Accesos Rápidos)
Botones de acceso directo a géneros cinematográficos simulando carpetas del sistema.
- **Estilo:** Botones minimalistas con indicadores visuales y micro-interacciones.

### 🔄 Multi-Tab Sync (Sincronización en Tiempo Real)
Los favoritos ahora se sincronizan instantáneamente entre pestañas abiertas. Si agregas una película en una ventana, aparecerá automáticamente en las demás sin recargar la página.

---

## Capturas de Pantalla

### Página Principal (Home)

![Home Page](./images/home.png)

*Vista principal con hero dinámico, ticker de estado y secciones modulares de contenido trending y popular.*

---

### Página de Búsqueda

![Search Page](./images/search.png)

*Resultados de búsqueda con filtros avanzados por tipo, género, año y ordenamiento. Incluye toggle para vista grid/lista.*

---

### Página de Detalle

![Detail Page](./images/detail.png)

*Vista detallada con póster, información completa, tráiler embebido de YouTube y sección de títulos relacionados.*

---

### Vista Móvil

![Mobile View](./images/movil.png)

*Diseño responsive adaptado para dispositivos móviles con navegación hamburguesa y componentes optimizados.*

---

### Página 404

![404 Page](./images/404.png)

*Página de error personalizada con diseño consistente y navegación de retorno.*

---

## Decisión Técnica: TMDB vs OMDb

Este proyecto implementa **TMDB (The Movie Database) API** como fuente principal de datos. Esta elección está **explícitamente contemplada en las reglas del hackathon**, donde se menciona en la sección de "APIs Adicionales (Opcionales)":

> *"TMDB API: Como alternativa o complemento a OMDb"*

La decisión de utilizar TMDB como API principal (en lugar de complementaria) se fundamenta en las siguientes limitaciones técnicas detectadas en OMDb durante la fase de análisis:

### Limitaciones de OMDb

| Aspecto | OMDb | TMDB |
|---------|------|------|
| **Endpoints de Descubrimiento** | No disponible | `/trending`, `/discover`, `/similar` |
| **Calidad de Imágenes** | Baja/variable | Múltiples resoluciones optimizadas |
| **Filtros Combinados** | Limitado | Soporte completo vía `/discover` |
| **Cuota de Peticiones** | 1,000/día | 40 req/10s (más flexible) |
| **Datos de Videos** | No disponible | Tráilers y clips de YouTube |

### Justificación Detallada

Al estar TMDB listada como API permitida en las reglas oficiales del hackathon, se optó por utilizarla como fuente principal debido a:

1. **Endpoints de Descubrimiento:** OMDb carece de endpoints nativos para obtener "Trending" o "Títulos Similares". TMDB ofrece endpoints específicos que permiten una implementación real sin datos estáticos.

2. **Calidad de Recursos Gráficos:** La interfaz requiere pósters y backdrops de alta resolución. TMDB proporciona múltiples tamaños optimizados (`w300`, `w500`, `original`).

3. **Capacidades de Filtrado:** El endpoint `/discover` de TMDB permite combinar múltiples parámetros (género, año, tipo, ordenamiento) en una sola consulta.

4. **Integración de Tráilers:** TMDB incluye datos de videos de YouTube directamente en sus respuestas, permitiendo embeber tráilers oficiales sin necesidad de una segunda API.

Esta decisión permite cumplir de manera más robusta con los requerimientos de la rúbrica, especialmente en los criterios de "Funcionalidades", "Creatividad" y "Experiencia de Usuario".

---

## Características Principales

### Búsqueda y Filtrado

- **Búsqueda en Tiempo Real:** Custom hook con debouncing de 500ms para minimizar llamadas a la API
- **Filtros Avanzados:**
  - Tipo de contenido (Película/Serie)
  - Género (18 categorías disponibles)
  - Año de lanzamiento
  - Ordenamiento (Popularidad, Valoración, Fecha)
- **Vistas Dinámicas:** Alternancia entre grid y lista con persistencia de preferencia
- **Paginación Infinita:** Carga progresiva de resultados sin recarga de página

### Experiencia de Usuario

- **Diseño Responsive:** Mobile-first con breakpoints optimizados
- **Animaciones Fluidas:** Transiciones entre rutas y micro-interacciones con Framer Motion
- **Feedback Visual:** Skeletons de carga, indicadores de estado y mensajes de error claros
- **Tema Oscuro/Claro:** Detección automática de preferencia del sistema con toggle manual

### Gestión de Contenido

- **Vista Detallada:** Sinopsis, reparto, director, metadatos técnicos y tráiler embebido
- **Sistema de Favoritos:** Persistencia en LocalStorage con conteo por tipo y sincronización multi-pestaña.
- **Títulos Similares:** Recomendaciones basadas en el contenido actual
- **Compartir:** Funcionalidad nativa de Web Share API con fallback a clipboard

### Optimizaciones

- **Sistema de Caché:** Caché en memoria con TTL de 5 minutos para reducir peticiones
- **Cancelación de Peticiones:** AbortController para evitar race conditions
- **Lazy Loading:** Carga diferida de imágenes con fallback a placeholder
- **Normalización de Datos:** Capa de abstracción para estandarizar respuestas de API

---

## Stack Tecnológico

### Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 19.2.0 | Biblioteca UI con hooks y componentes funcionales |
| Vite | 7.2.4 | Build tool con HMR ultrarrápido |
| React Router DOM | 7.9.6 | Enrutamiento declarativo con layouts anidados |

### Estilos y UI

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Tailwind CSS | 4.1.17 | Framework CSS utility-first |
| Framer Motion | 12.23.24 | Animaciones declarativas y transiciones |
| clsx + tailwind-merge | 2.1.1 / 3.4.0 | Utilidades para clases condicionales |

### Herramientas de Desarrollo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| ESLint | 9.39.1 | Linting y estandarización de código |
| PostCSS | 8.5.6 | Procesamiento de CSS |
| Autoprefixer | 10.4.22 | Compatibilidad cross-browser |

### Tipografías

- **Oswald:** Títulos y headers (peso 500, 700)
- **Space Mono:** Cuerpo de texto y elementos UI (peso 400, 700)

---

## Arquitectura del Proyecto

```

Arquitectura basada en capas con separación de responsabilidades:

\+------------------+     +------------------+     +------------------+
|     PAGES        |     |   COMPONENTS     |     |     CONTEXT      |
|  (Vistas/Rutas)  |\<---\>|   (UI Atómica)   |\<---\>|  (Estado Global) |
\+------------------+     +------------------+     +------------------+
|                       |                       |
v                       v                       v
\+------------------+     +------------------+     +------------------+
|     HOOKS        |     |    SERVICES      |     |     UTILS        |
| (Lógica Negocio) |\<---\>| (Cache/Storage)  |\<---\>| (Helpers/Const)  |
\+------------------+     +------------------+     +------------------+
|
v
\+------------------+
|       API        |
|  (TMDB Client)   |
\+------------------+

````

### Flujo de Datos

1. **Usuario interactúa** con un componente de UI
2. **Componente dispara** un custom hook
3. **Hook gestiona** la lógica de negocio y llama al servicio de API
4. **Servicio de caché** verifica si existe data válida
5. **API Client** realiza la petición si es necesario
6. **Respuesta normalizada** se propaga hacia arriba
7. **Context actualiza** estado global si aplica
8. **UI re-renderiza** con los nuevos datos

---

## Instalación y Configuración

### Prerrequisitos

- Node.js >= 20.19.0
- pnpm >= 8.0.0 (recomendado) o npm >= 10.0.0
- Cuenta en TMDB para obtener API Key

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone [https://github.com/Juliocpo946/movie-finder.git](https://github.com/Juliocpo946/movie-finder.git)
cd movie-finder

# 2. Instalar dependencias con pnpm (recomendado)
pnpm install

# 3. Copiar archivo de variables de entorno
cp .env.example .env

# 4. Configurar variables de entorno (ver sección siguiente)

# 5. Iniciar servidor de desarrollo
pnpm dev
````

La aplicación estará disponible en `http://localhost:5173`

-----

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API Key de TMDB (obtenida en [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))
VITE_TMDB_API_KEY=tu_api_key_aqui

# Access Token de TMDB (Bearer Token para autenticación)
VITE_TMDB_ACCESS_TOKEN=tu_access_token_aqui

# URL base de la API de TMDB
VITE_TMDB_BASE_URL=[https://api.themoviedb.org/3](https://api.themoviedb.org/3)

# URL base para imágenes de TMDB
VITE_TMDB_IMAGE_URL=[https://image.tmdb.org/t/p/original](https://image.tmdb.org/t/p/original)
```

### Obtención de Credenciales TMDB

1.  Crear cuenta en [TMDB](https://www.themoviedb.org/signup)
2.  Ir a Settings \> API
3.  Solicitar una API Key (tipo: Developer)
4.  Copiar tanto la API Key como el Access Token (Bearer)

**Importante:** Nunca subir el archivo `.env` al repositorio. Está incluido en `.gitignore`.

-----

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo con HMR

# Construcción
pnpm build        # Genera build de producción en /dist

# Preview
pnpm preview      # Sirve el build de producción localmente

# Linting
pnpm lint         # Ejecuta ESLint en todo el proyecto
```

-----

## Estructura de Directorios

```
tmdb-terminal/
|
|-- public/                    # Assets estáticos
|   |-- vite.svg              # Favicon
|
|-- src/
|   |-- api/                  # Capa de comunicación con APIs externas
|   |   |-- endpoints.js      # Definición de constantes de endpoints
|   |   |-- index.js          # Barrel export
|   |   |-- tmdb.js           # Cliente HTTP para TMDB API
|   |
|   |-- components/           # Componentes React reutilizables
|   |   |-- ActiveOperatives.jsx #  Grid de actores
|   |   |-- Button.jsx        # Botón con variantes y animaciones
|   |   |-- Card.jsx          # Tarjeta de película/serie
|   |   |-- Directories.jsx   #  Accesos rápidos a géneros
|   |   |-- Hero.jsx          # Sección hero de página principal
|   |   |-- IncomingSignals.jsx #  Carrusel de estrenos
|   |   |-- Input.jsx         # Input estilizado con indicador
|   |   |-- Layout.jsx        # Layout principal con Outlet
|   |   |-- Loader.jsx        # Indicador de carga animado
|   |   |-- Navbar.jsx        # Barra de navegación responsive
|   |   |-- PopularSection.jsx # Sección reutilizable de contenido popular
|   |   |-- Ticker.jsx        #  Barra de estado animada
|   |
|   |-- context/              # Proveedores de estado global
|   |   |-- FavoritesContext.jsx  # Gestión de lista de favoritos
|   |   |-- ThemeContext.jsx      # Gestión de tema claro/oscuro
|   |   |-- index.js              # Barrel export
|   |
|   |-- hooks/                # Custom hooks para lógica de negocio
|   |   |-- index.js              # Barrel export
|   |   |-- useClickOutside.js    # Detecta clicks fuera de un elemento
|   |   |-- useDebounce.js        # Debouncing de valores
|   |   |-- useFetch.js           # Wrapper genérico para peticiones
|   |   |-- useLocalStorage.js    # Persistencia en localStorage
|   |   |-- useMediaDetails.js    # Obtiene detalles de película/serie
|   |   |-- useSearch.js          # Lógica de búsqueda con paginación
|   |   |-- useTrending.js        # Obtiene contenido en tendencia
|   |   |-- useWindowSize.js      # Dimensiones de viewport reactivas
|   |
|   |-- pages/                # Componentes de página (rutas)
|   |   |-- DetailPage.jsx    # Vista de detalle de contenido
|   |   |-- FavoritesPage.jsx # Lista de favoritos del usuario
|   |   |-- HomePage.jsx      # Página principal con trending
|   |   |-- NotFoundPage.jsx  # Página 404 personalizada
|   |   |-- SearchPage.jsx    # Búsqueda con filtros avanzados
|   |
|   |-- services/             # Servicios de infraestructura
|   |   |-- cache.js          # Sistema de caché en memoria
|   |   |-- index.js          # Barrel export
|   |   |-- storage.js        # Wrapper de localStorage
|   |
|   |-- utils/                # Utilidades y constantes
|   |   |-- constants.js      # Constantes de la aplicación
|   |   |-- helpers.js        # Funciones de utilidad
|   |   |-- index.js          # Barrel export
|   |
|   |-- App.jsx               # Componente raíz con providers
|   |-- index.css             # Estilos globales y configuración Tailwind
|   |-- main.jsx              # Punto de entrada de React
|   |-- routes.jsx            # Configuración de React Router
|
|-- images/                   # Capturas de pantalla para documentación
|   |-- 404.png
|   |-- detail.png
|   |-- home.png
|   |-- movil.png
|   |-- search.png
|
|-- .env.example              # Plantilla de variables de entorno
|-- .gitignore                # Archivos ignorados por Git
|-- eslint.config.js          # Configuración de ESLint
|-- index.html                # HTML template
|-- LICENSE                   # Licencia MIT
|-- package.json              # Dependencias y scripts
|-- pnpm-lock.yaml            # Lockfile de pnpm
|-- postcss.config.js         # Configuración de PostCSS
|-- README.md                 # Este archivo
|-- tailwind.config.js        # Configuración de Tailwind CSS
|-- vite.config.js            # Configuración de Vite
```

-----

## Componentes Principales

### ActiveOperatives 

Grid visual que muestra actores y personalidades populares usando formas hexagonales generadas mediante `clip-path` CSS. Incluye animaciones de entrada en cascada y efectos hover de color.

### Button

Botón reutilizable con tres variantes (`primary`, `secondary`, `danger`) y animaciones de hover/tap vía Framer Motion.

```jsx
<Button variant="primary" onClick={handleClick}>
  CLICK ME
</Button>
```

### Card

Tarjeta de contenido polimórfica con soporte para vista grid y lista. Incluye animaciones de entrada con efecto de desenfoque (`blur`), lazy loading de imágenes y transiciones de layout compartidas para evitar saltos visuales.

```jsx
<Card 
  item={movieData} 
  viewMode="grid" 
  onClick={(id) => navigate(`/movie/${id}`)} 
/>
```

### Hero

Sección hero dinámica con imagen de fondo, información del contenido destacado y acciones rápidas (ver detalles, agregar a watchlist).

### IncomingSignals 

Módulo de scroll horizontal fluido ("snap-free") que consume el endpoint `/movie/upcoming` para mostrar próximos estrenos. Utiliza variantes de animación para crear una sensación de profundidad al hacer scroll.

### Input

Input de texto con estilo terminal, indicador de cursor animado y soporte para refs.

### Loader

Indicador de carga con barra de progreso animada y texto parpadeante.

### Navbar

Barra de navegación fija con:

  - Logo con indicador animado
  - Links de navegación con underline animado
  - Menú hamburguesa para móviles
  - Contador de favoritos en tiempo real

### Ticker

Barra de estado estilo teletipo que muestra mensajes del sistema en un loop infinito, aumentando la inmersión de la interfaz.

-----

## Custom Hooks

### useDebounce

Retrasa la actualización de un valor para evitar llamadas excesivas.

```javascript
const debouncedQuery = useDebounce(query, 500);
```

### useSearch

Gestiona la lógica de búsqueda incluyendo:

  - Selección de estrategia (search vs discover)
  - Cancelación de peticiones previas con AbortController
  - Paginación con prevención de duplicados
  - Estados de carga y error

<!-- end list -->

```javascript
const { results, status, search, loadMore } = useSearch();
```

### useMediaDetails

Obtiene detalles completos de una película o serie, intentando primero como movie y luego como TV si falla.

```javascript
const { details, status, fetchById } = useMediaDetails();
```

### useTrending

Carga contenido en tendencia semanal con detalles extendidos para el item destacado.

```javascript
const { trending, featuredMovie, isLoading } = useTrending();
```

### useFetch

Hook genérico para peticiones HTTP con soporte de caché, estados de carga y manejo de errores.

### useClickOutside

Detecta clicks fuera de un elemento referenciado.

### useWindowSize

Proporciona dimensiones del viewport y flags de breakpoints (`isMobile`, `isTablet`, `isDesktop`).

-----

## Servicios

### Cache Service

Sistema de caché en memoria con TTL configurable (5 minutos por defecto).

```javascript
// Características:
// - Almacenamiento en Map para acceso O(1)
// - Validación de expiración automática
// - Generación de claves únicas por endpoint+params
// - Método de limpieza proactiva

cacheService.get(key);
cacheService.set(key, data);
cacheService.has(key);
cacheService.cleanup();
```

### Storage Service

Wrapper de localStorage con:

  - Validación de disponibilidad
  - Serialización/deserialización JSON automática
  - Manejo de errores de cuota excedida
  - Valores por defecto

<!-- end list -->

```javascript
storageService.set('key', { data: 'value' });
storageService.get('key', defaultValue);
storageService.remove('key');
```

-----

## Optimizaciones de Rendimiento

### Implementadas

1.  **Sistema de Caché en Memoria**

      - Evita peticiones redundantes a la API
      - TTL de 5 minutos configurable
      - Limpieza automática de entradas expiradas

2.  **Debouncing de Búsqueda**

      - Delay de 500ms antes de ejecutar búsqueda
      - Reduce llamadas a API mientras el usuario escribe

3.  **Cancelación de Peticiones**

      - AbortController para cancelar peticiones obsoletas
      - Previene race conditions en búsquedas rápidas

4.  **Lazy Loading de Imágenes**

      - Atributo `loading="lazy"` en imágenes no críticas
      - `fetchPriority="high"` para imágenes del hero (LCP)
      - Placeholders mientras cargan las imágenes

5.  **Optimización de Renders**

      - useCallback para funciones de context
      - Lazy initialization en useState
      - Keys únicas con prefijos para evitar conflictos de animación

6.  **Code Splitting Implícito**

      - Vite divide automáticamente el bundle por rutas
      - Chunks separados para dependencias grandes

### Métricas Objetivo

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| LCP | \< 2.5s | Lighthouse |
| FID | \< 100ms | Lighthouse |
| CLS | \< 0.1 | Lighthouse |
| Bundle Size | \< 200KB gzipped | Vite |
| TTI | \< 3s | Lighthouse |

-----

## Accesibilidad

### Implementaciones

  - **ARIA Labels:** Todos los controles interactivos tienen labels descriptivos
  - **Roles Semánticos:** Uso de `role="group"` para conjuntos de filtros
  - **Estados ARIA:** `aria-pressed` en toggles de vista
  - **Contraste:** Colores verificados para ratio WCAG AA
  - **Focus Visible:** Indicadores claros de foco en elementos interactivos
  - **Navegación por Teclado:** Soporte completo de Tab y Enter
  - **Alt Text:** Todas las imágenes tienen texto alternativo

### Ejemplo de Implementación

```jsx
<button
  onClick={() => setViewMode('grid')}
  aria-label="Switch to grid view"
  aria-pressed={viewMode === 'grid'}
>
  <svg aria-hidden="true">...</svg>
</button>
```

-----

## Responsividad

### Breakpoints

| Breakpoint | Ancho | Dispositivos |
|------------|-------|--------------|
| sm | 640px | Móviles grandes |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |

### Estrategia Mobile-First

```css
/* Base (mobile) */
.grid-cols-1

/* Tablet */
md:grid-cols-2

/* Desktop */
lg:grid-cols-4
```

### Adaptaciones por Dispositivo

**Móvil:**

  - Menú hamburguesa colapsable
  - Cards de ancho completo
  - Búsqueda simplificada
  - Touch targets de 44px mínimo

**Tablet:**

  - Grid de 2 columnas
  - Filtros en fila
  - Navegación híbrida

**Desktop:**

  - Grid de 4+ columnas
  - Filtros expandidos
  - Animaciones completas
  - Hover states

-----

## Despliegue

### Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desplegar
vercel

# 3. Configurar variables de entorno en Vercel Dashboard
```

### Netlify

```bash
# 1. Build local
pnpm build

# 2. Desplegar carpeta dist
netlify deploy --prod --dir=dist
```

### Variables de Entorno en Producción

Configurar en el dashboard del proveedor:

```
VITE_TMDB_API_KEY=xxx
VITE_TMDB_ACCESS_TOKEN=xxx
VITE_TMDB_BASE_URL=[https://api.themoviedb.org/3](https://api.themoviedb.org/3)
VITE_TMDB_IMAGE_URL=[https://image.tmdb.org/t/p/original](https://image.tmdb.org/t/p/original)
```

-----

## Decisiones de Diseño

### Estética Visual

  - **Inspiración Terminal:** Tipografía monoespaciada, cursores animados, estética hacker
  - **Paleta de Colores:** - Fondo: `#0a0a0a` (oscuro) / `#f3f4f6` (claro)
      - Acento: `#ff2e00` (rojo terminal)
      - Texto: `#ededed` (oscuro) / `#0a0a0a` (claro)
  - **Tipografía:** Oswald para impacto, Space Mono para legibilidad

### Patrones de UX

  - **Progressive Disclosure:** Información detallada solo en página de detalle
  - **Feedback Inmediato:** Estados de carga y confirmaciones visuales
  - **Consistencia:** Mismo lenguaje visual en toda la aplicación
  - **Recuperación de Errores:** Mensajes claros y acciones sugeridas

### Arquitectura de Componentes

  - **Atomic Design:** Componentes pequeños y reutilizables
  - **Composition over Inheritance:** Props para variaciones
  - **Single Responsibility:** Cada componente hace una cosa bien
  - **Colocation:** Lógica relacionada cerca del componente

-----

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](https://www.google.com/search?q=LICENSE) para más detalles.

-----

## Autor

**Julio César Pérez Ortiz**

  - GitHub: [github.com/Juliocpo946](https://github.com/Juliocpo946)

-----

## Agradecimientos

  - **IEEE ESTl** por organizar el hackathon
  - **TMDB** por proporcionar una API robusta y bien documentada
  - **Comunidad React** por las herramientas y librerías utilizadas

-----

*Desarrollado con dedicación para el IEEE ESTl Frontend Hackathon 2025*

