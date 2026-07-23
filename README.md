# 🎮 Interactive 3D Portfolio - Game Mode + City Explorer

## 🌟 Overview

This is not just a portfolio—it's an **interactive 3D experience** with **TWO MODES**:

### 🎮 **Game Mode** - Drive Around Like Bruno Simon!
Inspired by [Bruno Simon's legendary portfolio](https://bruno-simon.com/), you can **drive a car** through the city to explore portfolio content!

### 🚶 **Walk Mode** - First-Person City Explorer
Explore an anime-style city on foot with first-person navigation!

### 📄 **Traditional Mode** - Classic Portfolio
Professional scrolling portfolio with all the content neatly organized.

---

## ✨ Features

### Game Mode 🎮
- ✅ **Third-person driving** with physics-based vehicle
- ✅ **WASD/Arrow controls** + SHIFT for boost
- ✅ **Speedometer HUD** with real-time display
- ✅ **Drive to buildings** to discover content
- ✅ **Boost effects** with particle systems
- ✅ **Cinematic camera** following the car

### Walk Mode 🚶
- ✅ **First-person navigation** (WASD + Mouse)
- ✅ **6 interactive buildings** with content
- ✅ **Anime-style architecture**
- ✅ **Pointer lock controls**
- ✅ **Immersive exploration**

### Shared Features 🌟
- ✅ **3D Certificate Carousel**
- ✅ **3D Photo Gallery**
- ✅ **3D Achievement Cards**
- ✅ **Dark/Light/System themes**
- ✅ **Fully responsive**
- ✅ **Material-UI v7**
- ✅ **Three.js + React Three Fiber**
- ✅ **TypeScript strict mode**

---

## 🚀 Quick Start

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit: **http://localhost:5173/**

---

## 🎮 How to Play

### Game Mode:
1. Click **"🎮 Play Game Mode"** button
2. Use **W/A/S/D** or **Arrow Keys** to drive
3. Hold **SHIFT** for boost
4. Drive near buildings and **press E** or **click** to view content
5. Click **Home** button to exit

### Walk Mode:
1. Click **"🏙️ Walk Mode"** button
2. Click anywhere to lock pointer
3. Use **WASD** to move, **Mouse** to look
4. **Click buildings** to view content
5. Press **ESC** to unlock pointer
6. Click **Home** button to exit

---

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool
- **Three.js 0.180** - 3D graphics
- **React Three Fiber 9.3** - React renderer for Three.js
- **@react-three/drei 10.7** - Three.js helpers
- **Material-UI v7** - UI components
- **Emotion** - CSS-in-JS

---

## 📚 Documentation

- **`GAME_MODE_GUIDE.md`** - Complete game mode documentation
- **`3D_CITY_IMPLEMENTATION.md`** - City explorer guide
- **`copilot.md`** - Comprehensive project reference
- **`WARP.md`** - Development commands
- **`QUICK_START_CITY.md`** - Quick controls reference

---

## 🎨 Inspired By

This project draws inspiration from:
- **[Bruno Simon](https://bruno-simon.com/)** - Driving game portfolio
- **Studio Ghibli** - Anime aesthetic
- **Modern web games** - Interactive experiences

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameCity3D.tsx              ← Game mode (driving)
│   ├── InteractiveCity3D.tsx       ← Walk mode (first-person)
│   ├── Certificate3DCarousel.tsx   ← 3D certifications
│   ├── Gallery3D.tsx               ← 3D photo gallery
│   ├── Achievement3DCards.tsx      ← 3D achievements
│   └── sections/
│       └── HeroSection.tsx         ← Landing section
├── contexts/
│   └── ThemeContext.tsx            ← Theme management
├── data/
│   └── portfolioData.ts            ← Content data
└── theme/
    └── theme.ts                    ← MUI theme config
```

---

## React + TypeScript + Vite

This project uses:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) - Babel for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) - SWC for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
