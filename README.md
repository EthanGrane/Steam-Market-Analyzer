<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" width="80" alt="Steam Logo" />

# 🎮 Steam Market Analyzer

**Herramienta móvil para el análisis del mercado de videojuegos en Steam**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Steam API](https://img.shields.io/badge/Steam_API-1b2838?style=for-the-badge&logo=steam&logoColor=white)](https://steamcommunity.com/dev)
[![Platform](https://img.shields.io/badge/Platform-Android_|_iOS-brightgreen?style=for-the-badge)](https://github.com/EthanGrane/Steam-Market-Analyzer)
[![Status](https://img.shields.io/badge/Estado-En_Desarrollo-orange?style=for-the-badge)](https://github.com/EthanGrane/Steam-Market-Analyzer)

---

*Consulta datos de mercado, ventas estimadas, géneros y juegos similares de cualquier título en Steam, directamente desde tu móvil.*

</div>

---

## ⬇️ Download APK
[Download APK here](https://github.com/EthanGrane/Steam-Market-Analyzer/releases/tag/Demo_1)

---

## 📖 Descripción

**Steam Market Analyzer** es una aplicación móvil desarrollada con **React Native** que permite a desarrolladores, analistas y entusiastas del sector del videojuego estudiar el mercado de Steam de forma rápida e intuitiva.

A través de múltiples APIs —tanto oficiales como no oficiales de Steam— la app recopila y presenta datos clave de cualquier juego: desde ventas aproximadas hasta géneros, tags, precio, reseñas y títulos similares. Es una herramienta pensada para tomar decisiones informadas sobre el mercado de PC gaming.

---

## ✨ Funcionalidades principales

| Feature | Descripción |
|---|---|
| 🔍 **Búsqueda de juegos** | Busca cualquier título del catálogo de Steam por nombre |
| 📊 **Datos de mercado** | Consulta ventas aproximadas, precio y valoraciones |
| 🏷️ **Géneros y tags** | Visualiza los géneros y etiquetas del juego |
| 🎮 **Juegos similares** | Descubre títulos relacionados en el mismo nicho |
| 📈 **Análisis comparativo** | Compara datos entre diferentes juegos del mercado |
| 💡 **Interfaz mobile-first** | Diseñada para ser fluida y cómoda en dispositivos móviles |

---

## 📱 Capturas de pantalla

<img width="30%" height="auto" alt="Screenshoot_1" src="https://github.com/user-attachments/assets/32630c4d-7720-498e-bb49-8023379c0feb" />
<img width="30%" height="auto" alt="Screenshoot_2" src="https://github.com/user-attachments/assets/b48e860d-8b88-4ac4-9018-10a6f7c0538c" />
<img width="30%" height="auto" alt="Screenshoot_3" src="https://github.com/user-attachments/assets/01121ce6-4667-415a-bb64-8b0d0d61fb54" />

---

## 🛠️ Tecnologías utilizadas

- **[React Native](https://reactnative.dev/)** — Framework principal para desarrollo móvil multiplataforma
- **[Steam Web API](https://steamcommunity.com/dev)** — API oficial de Steam para datos de juegos
- **APIs no oficiales de Steam** — Para datos extendidos como ventas estimadas (ej. SteamSpy)
- **JavaScript / JSX** — Lenguaje de desarrollo

---

## 🚀 Instalación y uso

### Prerrequisitos

- Node.js ≥ 18
- npm o Yarn
- React Native CLI
- Android Studio (para Android) o Xcode (para iOS)

### Clonar el repositorio

```bash
git clone https://github.com/EthanGrane/Steam-Market-Analyzer.git
cd Steam-Market-Analyzer
```

### Instalar dependencias

```bash
npm install
# o
yarn install
```

### Ejecutar en Android

```bash
npx react-native run-android
```

### Ejecutar en iOS

```bash
npx react-native run-ios
```

---

## 🌐 APIs utilizadas

La aplicación integra las siguientes fuentes de datos:

| API | Uso |
|---|---|
| **Steam Store API** | Detalles del juego, precio, descripciones, capturas |
| **Steam Web API** | Información general de la plataforma |
| **SteamSpy API** *(no oficial)* | Estimaciones de ventas, jugadores, tags populares |
| **APIs complementarias** | Juegos similares y datos de mercado extendidos |

> ⚠️ Las APIs no oficiales pueden tener limitaciones de rate limit o cambios inesperados. Los datos de ventas son **estimaciones**, no cifras oficiales de Valve.

---

## 📦 Estructura del proyecto

```
Steam-Market-Analyzer/
├── src/
│   ├── components/       # Componentes reutilizables de UI
│   ├── screens/          # Pantallas principales de la app
│   ├── services/         # Llamadas a APIs de Steam
│   └── utils/            # Funciones auxiliares
├── assets/               # Imágenes y recursos estáticos
├── index.html            # Entry point web (preview)
└── README.md
```

---

## 🎯 Casos de uso

- 🧑‍💻 **Desarrolladores indie** que quieren estudiar el mercado antes de lanzar un juego
- 📊 **Analistas de videojuegos** que necesitan datos rápidos desde el móvil
- 🎮 **Entusiastas** curiosos por las cifras del mercado Steam
- 📋 **Investigadores** del sector gaming que necesitan comparar nichos y géneros

---

## 🗺️ Roadmap

- [x] Búsqueda de juegos por nombre
- [x] Visualización de datos de mercado básicos
- [x] Integración con APIs no oficiales (ventas estimadas)
- [x] Sección de juegos similares
- [ ] Guardado de juegos en favoritos
- [ ] Historial de búsquedas
- [ ] Gráficos de tendencias por género
- [ ] Exportar datos a CSV
- [ ] Publicación en Google Play Store

---

## 👤 Autor

**EthanGrane**

Proyecto personal desarrollado como parte de mi portfolio de desarrollo móvil.

[![GitHub](https://img.shields.io/badge/GitHub-EthanGrane-181717?style=flat-square&logo=github)](https://github.com/EthanGrane)

---

## 📄 Licencia

Este proyecto está disponible de forma pública en GitHub. Si quieres contribuir o reutilizar partes del código, por favor menciona al autor original.

---

<div align="center">

**Steam Market Analyzer** — Hecho con ❤️ por EthanGrane

*Los datos de ventas son estimaciones obtenidas de fuentes no oficiales y no representan cifras oficiales de Valve Corporation. Steam es una marca registrada de Valve Corporation.*

</div>
