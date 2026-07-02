# 🥙 Döner Gourmet - App de Pedidos

App web para que los clientes de **Döner Gourmet** hagan sus pedidos online y los envíen directamente al WhatsApp del dueño.

## 🚀 Cómo usar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar el número de WhatsApp
Edita `.env.local` y pon el número del dueño:
```
NEXT_PUBLIC_OWNER_PHONE=346XXXXXXXX
```
(Sin +, con código de país. Ej: 34600123456)

### 3. Iniciar en desarrollo
```bash
npm run dev
```

### 4. Build para producción
```bash
npm run build
```

### 5. Desplegar en GitHub Pages
El build genera una carpeta `out/`. Puedes subirla a GitHub Pages o Vercel.

## 📱 Funcionalidades

- 🍔 **Menú completo** con categorías y precios
- ✏️ **Personalizar pedido** (extra carne, extra salsa, notas como "sin lechuga")
- 🛒 **Carrito** con cantidades y total
- 📱 **Enviar por WhatsApp** con formato bonito de ticket
- 🌙 **Diseño oscuro** moderno y responsive
- ⚡ **Sin registro** — pide rápido

## 🛠️ Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

---

Hecho con ❤️ para Döner Gourmet
