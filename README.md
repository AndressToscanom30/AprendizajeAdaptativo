# 🧠 Plataforma de Aprendizaje Adaptativo con IA

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Plataforma educativa inteligente que utiliza IA para analizar el rendimiento de estudiantes y generar tests adaptativos personalizados.**

[Características](#-características) • [Instalación](#-instalación-rápida) • [Uso](#-uso) • [Tecnologías](#-tecnologías) • [Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración Detallada](#-configuración-detallada)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [Scripts Disponibles](#-scripts-disponibles)
- [Variables de Entorno](#-variables-de-entorno)
- [Documentación Adicional](#-documentación-adicional)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎯 Descripción

Sistema de aprendizaje adaptativo que utiliza **Inteligencia Artificial (Groq API)** para:

- ✅ Analizar automáticamente el rendimiento de estudiantes en evaluaciones
- ✅ Identificar fortalezas y debilidades por categorías de conocimiento
- ✅ Generar tests adaptativos personalizados según las necesidades de cada estudiante
- ✅ Proporcionar recomendaciones de estudio basadas en IA
- ✅ Ejecutar código en el navegador para preguntas de programación
- ✅ Gestionar cursos, evaluaciones y estudiantes

---

## ✨ Características

### Para Profesores
- 📝 Crear evaluaciones con múltiples tipos de preguntas (código, opción múltiple, verdadero/falso)
- 👥 Gestionar cursos y estudiantes
- 📊 Ver estadísticas de rendimiento en tiempo real
- 🤖 Análisis automático con IA de los resultados de estudiantes

### Para Estudiantes
- 📚 Realizar evaluaciones con temporizador
- 💻 Ejecutar código JavaScript en tiempo real
- 🎯 Recibir análisis personalizado con IA
- 📈 Ver progreso y áreas de mejora
- 🧪 Tests adaptativos generados automáticamente

### Tecnología
- 🚀 Interfaz moderna con React + Tailwind CSS
- 🔐 Autenticación JWT con refresh tokens
- 🧠 Integración con Groq AI (LLaMA)
- 💾 Base de datos PostgreSQL con Sequelize ORM
- ⚡ Performance optimizada con useCallback y memoización

---

## 📦 Requisitos Previos

Asegúrate de tener instalado:

- **Node.js** >= 18.0.0 ([Descargar](https://nodejs.org/))
- **npm** >= 9.0.0 (incluido con Node.js)
- **PostgreSQL** >= 14.0 ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))

> 💡 **Verificar instalación:**
> ```bash
> node --version    # Debe mostrar v18.0.0 o superior
> npm --version     # Debe mostrar 9.0.0 o superior
> psql --version    # Verificar PostgreSQL
> ```

---

## 🚀 Instalación Rápida

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/AndressToscanom30/AprendizajeAdaptativo.git
cd AprendizajeAdaptativo
```

### 2️⃣ Configurar Backend

```bash
# Navegar a la carpeta Backend
cd Backend

# Instalar dependencias
npm install

# Crear archivo .env (ver sección Variables de Entorno)
cp .env.example .env
# Editar .env con tus credenciales

# Sincronizar base de datos
npm run sync-db

# Iniciar servidor
npm run dev
```

El backend estará corriendo en `http://localhost:4000`

### 3️⃣ Configurar Frontend

```bash
# Abrir nueva terminal y navegar a Frontend
cd Frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

### 4️⃣ Acceder a la Aplicación

Abre tu navegador en: **`http://localhost:5173`**

---

## ⚙️ Configuración Detallada

### Base de Datos PostgreSQL

1. **Crear base de datos:**

```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE aprendizaje_adaptativo;

-- Crear usuario (opcional)
CREATE USER tu_usuario WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE aprendizaje_adaptativo TO tu_usuario;
```

2. **Configurar conexión en `.env`:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aprendizaje_adaptativo
DB_USER=tu_usuario
DB_PASSWORD=tu_password
```

### Obtener API Key de Groq

1. Visita [https://console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita
3. Genera una API Key
4. Agrégala al archivo `.env`:

```env
GROQ_API_KEY=gsk_tu_api_key_aqui
```

---

## 🎮 Uso

### Crear Usuario Administrador

```bash
cd Backend
npm run create-admin
# Seguir las instrucciones para crear el primer usuario
```

### Ejecutar Tests de Prueba

```bash
# Crear evaluación de prueba
cd Backend
node scripts/crearEvaluacionSimple_clean.js
```

### Acceder al Sistema

1. **Profesor:**
   - Email: `aa@gmail.com`
   - Contraseña: `123456` (cambiar en producción)

2. **Estudiante:**
   - Crear desde panel de administrador
   - O registrarse en `/register`

### Flujo Típico

1. **Profesor crea evaluación** → Dashboard Profesor → Crear Evaluación
2. **Profesor asigna a estudiantes** → Evaluación → Asignar
3. **Estudiante realiza evaluación** → Mis Evaluaciones → Iniciar
4. **Sistema califica automáticamente** → Resultados visibles
5. **IA genera análisis** → Análisis IA (automático o manual)
6. **Estudiante ve recomendaciones** → Dashboard → Ver Análisis

---

## 📁 Estructura del Proyecto

```
AprendizajeAdaptativo/
├── Backend/                    # Servidor Node.js + Express
│   ├── src/
│   │   ├── M01Auth/           # Autenticación (Login, JWT)
│   │   ├── M02Usuarios/       # Gestión de usuarios
│   │   ├── M03Diagnostico/    # Diagnósticos iniciales
│   │   ├── M04Curso/          # Gestión de cursos
│   │   ├── M05Evaluacion/     # CRUD Evaluaciones
│   │   │   ├── Evaluacion.js
│   │   │   ├── Pregunta.js
│   │   │   ├── Intento.js
│   │   │   └── evaluacionController.js
│   │   ├── M06IA/             # Inteligencia Artificial
│   │   │   ├── services/
│   │   │   │   ├── groqService.js      # ✅ Servicio Groq AI
│   │   │   │   ├── analysisService.js
│   │   │   │   └── adaptiveService.js
│   │   │   ├── iaController.js         # ✅ Controlador IA
│   │   │   └── models/
│   │   ├── config/
│   │   │   ├── db.js          # Conexión PostgreSQL
│   │   │   └── relaciones.js  # Relaciones Sequelize
│   │   └── server.js          # Punto de entrada
│   ├── scripts/
│   │   └── crearEvaluacionSimple_clean.js  # ✅ Script de prueba
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── Frontend/                   # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   ├── evaluaciones/
│   │   │   │   ├── PreguntaCodigoIntento.jsx  # ✅ Editor código
│   │   │   │   ├── FormularioEvaluacion.jsx
│   │   │   │   └── ...
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── evaluaciones/
│   │   │   │   └── estudiante/
│   │   │   │       ├── AnalisisIA.jsx         # ✅ Vista análisis
│   │   │   │       ├── EvaluacionIntento.jsx
│   │   │   │       └── ...
│   │   │   ├── DashboardEstudiante.jsx
│   │   │   ├── DashboardProfesor.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.jsx               # ✅ Contexto auth
│   │   │   └── SidebarContext.jsx
│   │   ├── services/
│   │   │   └── evaluacionesService.js        # ✅ API service
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── MEJORAS_CODIGO.md          # ✅ Documentación mejoras
├── FINIQUITADO.md             # ✅ Reporte final
└── README.md                  # Este archivo

✅ = Archivos refactorizados con mejores prácticas
```

---

## 🛠️ Tecnologías

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.2.0 | Framework principal |
| **Vite** | 5.0.0 | Build tool |
| **Tailwind CSS** | 3.4.0 | Estilos |
| **React Router** | 6.20.0 | Navegación |
| **Chart.js** | 4.4.0 | Gráficos |
| **Lucide React** | latest | Iconos |
| **SweetAlert2** | 11.10.0 | Alertas |
| **Axios** | 1.6.0 | HTTP Client |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Node.js** | >= 18.0 | Runtime |
| **Express** | 4.18.0 | Framework web |
| **Sequelize** | 6.35.0 | ORM |
| **PostgreSQL** | >= 14.0 | Base de datos |
| **JWT** | 9.0.0 | Autenticación |
| **Bcrypt** | 5.1.0 | Encriptación |
| **Groq SDK** | latest | IA (LLaMA) |
| **Nodemailer** | 6.9.0 | Email |

---

## 📜 Scripts Disponibles

### Backend

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start

# Sincronizar base de datos
npm run sync-db

# Crear evaluación de prueba
node scripts/crearEvaluacionSimple_clean.js

# Limpiar datos
node scripts/limpiarEvaluacionUsuarios.js
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview build
npm run preview

# Lint
npm run lint
```

---

## 🔐 Variables de Entorno

### Backend `.env`

```env
# === SERVIDOR ===
PORT=4000
NODE_ENV=development

# === BASE DE DATOS ===
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aprendizaje_adaptativo
DB_USER=postgres
DB_PASSWORD=tu_password

# === JWT ===
JWT_SECRET=tu_super_secret_key_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=otro_secret_para_refresh_token
JWT_REFRESH_EXPIRES_IN=7d

# === GROQ AI ===
GROQ_API_KEY=gsk_tu_api_key_de_groq_aqui

# === EMAIL (Opcional) ===
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# === FRONTEND ===
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` (si es necesario)

```env
VITE_API_URL=http://localhost:4000/api
```

---

## 📚 Documentación Adicional

- **[MEJORAS_CODIGO.md](./MEJORAS_CODIGO.md)** - Guía completa de mejores prácticas implementadas
- **[FINIQUITADO.md](./FINIQUITADO.md)** - Reporte ejecutivo de refactorización
- **JSDoc Inline** - Documentación en código fuente

### Recursos Útiles

- [Documentación Groq](https://console.groq.com/docs)
- [Sequelize ORM](https://sequelize.org/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- ✅ Usar JSDoc para documentar funciones
- ✅ Extraer constantes para valores mágicos
- ✅ Funciones pequeñas (Single Responsibility)
- ✅ useCallback para optimización en React
- ✅ Manejo de errores consistente

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql status  # Linux
brew services list              # macOS

# Verificar credenciales en .env
# Crear base de datos si no existe
```

### Error: "Groq API authentication failed"

```bash
# Verificar API Key en .env
# Generar nueva key en console.groq.com
```

### Error: "Port already in use"

```bash
# Backend (puerto 4000)
lsof -ti:4000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :4000   # Windows

# Frontend (puerto 5173)
lsof -ti:5173 | xargs kill -9
```

### Frontend no carga

```bash
cd Frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Autores

- **Equipo de Desarrollo** - [AndressToscanom30](https://github.com/AndressToscanom30)

---

## 🙏 Agradecimientos

- Groq por proporcionar acceso a su API de IA
- Comunidad de React y Node.js
- Todos los contribuidores del proyecto

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

**Hecho con ❤️ y ☕**

</div>
