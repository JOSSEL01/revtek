# 🛠️ Revtek - Sistema de Gestión de Servicio Técnico

**Revtek** es una aplicación web diseñada para talleres de servicio técnico. Permite gestionar clientes, equipos (PC, laptops, celulares), servicios realizados, actualizaciones, limpieza, compatibilidad, y generar reportes en PDF y estadísticas, todo con una interfaz moderna inspirada en terminales de sistemas operativos (estilo Termux/Linux).

## 🎓 Información Académica

- **Estudiante:** José Andrés Mamani Mollericona
- **Materia:** Desarrollo Web Backend
- **Proyecto:** Frontend funcional con simulación de base de datos local (`localStorage`)

## 🚀 Tecnologías Utilizadas

### Frontend (Completado)

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Estilos y diseño responsive)
- **React Router v6** (Navegación protegida)
- **Zustand** (Estado global de autenticación)
- **Recharts** (Gráficos estadísticos)
- **jsPDF + jspdf-autotable** (Generación de reportes PDF)
- **Lucide React** (Iconografía)

### Backend (Próximamente)

- **NestJS** (API REST)
- **MySQL / PostgreSQL** (Base de datos)
- **TypeORM / SQL Puro**

## ✨ Características Principales

- **Seguridad:**
  - Login con CAPTCHA matemático.
  - Bloqueo de cuenta tras 3 intentos fallidos (con contador de 5 minutos).
  - Indicador de fuerza de contraseña en el registro.
  - Recuperación de contraseña (mockeado).
- **Gestión Completa (CRUD):**
  - Clientes, Equipos, Servicios, Actualizaciones, Limpieza, Compatibilidad, Usuarios.
  - Eliminación lógica (`deleted: true`) en todos los módulos.
- **Reportes:**
  - Generación de PDFs de Clientes, Equipos y Servicios con diseño personalizado.
- **Estadísticas:**
  - KPIs en tiempo real (Clientes, Equipos, Servicios, Ingresos).
  - Gráficos de Barras, Dona y Líneas con datos reales.
- **Logs de Acceso:**
  - Registro de ingresos y salidas con detección de dispositivo (Escritorio/Móvil).
- **Diseño:**
  - Interfaz oscura estilo terminal (Termux/Linux) con acentos en verde neón.
  - Totalmente responsive (adaptado a móviles y escritorio).

## 📂 Estructura del Proyecto

```text
revtek/
├── frontend/
│   ├── src/
│   │   ├── api/          # Configuración de Axios (para futuro backend)
│   │   ├── components/   # Componentes reutilizables (UI, Layout)
│   │   ├── features/     # Módulos de la aplicación (auth, clients, devices, etc.)
│   │   ├── lib/          # Utilidades (PDF, validadores Zod)
│   │   ├── routes/       # Configuración de rutas protegidas
│   │   ├── store/        # Estado global (Zustand)
│   │   └── types/        # Interfaces TypeScript
│   ├── package.json
│   └── vite.config.ts
├── backend/              # (Próximamente - NestJS)
└── README.md
```

## 🚀 Cómo Ejecutar el Proyecto Localmente

1. Clona el repositorio y entra a la carpeta del frontend:

   ```bash
   git clone [https://github.com/JOSSEL01/revtek.git](https://github.com/JOSSEL01/revtek.git)
   cd revtek/frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre `http://localhost:5173` en tu navegador.

## 🌐 Demo en Vivo

Puedes ver la aplicación desplegada en Vercel:
🔗 [https://revtek.vercel.app](https://revtek.vercel.app)

## 🔑 Credenciales de Prueba

- **Admin:** `admin@revtek.com` / `admin123`
- **Técnico:** `tecnico@revtek.com` / `tecnico123`

## 👨‍💻 Autor

**José Andrés Mamani Mollericona**
- GitHub: [@JOSSEL01](https://github.com/JOSSEL01)

Proyecto desarrollado para la materia de Desarrollo Web Backend - 2026