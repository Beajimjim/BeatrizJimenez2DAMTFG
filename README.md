# Smart3Z

> Plataforma web + móvil para **planificar, estimar y hacer seguimiento de proyectos** con una interfaz moderna basada en Ionic + Angular.

## ✨ Descripción breve
Smart3Z centraliza la creación de proyectos, la asignación de tareas y la estimación de recursos en un único entorno responsive.  
Incluye autenticación por roles (ADMIN, PM, EMP) y se comunica con un backend REST PHP que forma parte del TFG.

## 🔑 Funcionalidades principales
| Módulo | Qué aporta |
| ------ | ---------- |
| **Login & Auth** | Inicio de sesión con almacenamiento seguro de la sesión en _localStorage_. |
| **Escritorio (Dashboard)** | Vista general de proyectos activos, métricas clave y accesos rápidos. |
| **Gestión de Proyectos** | Creación de proyectos mediante modal, asignación de PM y departamentos. |
| **Tareas** | CRUD completo de tareas con dependencias, horas estimadas, estado y responsable. |
| **Estimador de Recursos** | Configuración de calendario laboral, perfiles de equipo y cálculo de coste total. |
| **Gráfica Gantt** | Visualización interactiva del cronograma, con filtros por perfil, usuario y rango de fechas. |
| **Resumen de Estimación** | Informe agregado del esfuerzo por perfil y coste para validación final. |

## 🛠️ Tecnologías empleadas
- **Angular & Ionic** (stand‑alone components, routing, SCSS).
- **TypeScript / RxJS** para lógica reactiva.
- **Ionic UI Components** para layouts móviles/desktop.
- **REST API PHP** (ejemplos: `login.php`, `proyectos.php`, `pm-lista.php`).
- **HTML + SCSS** con diseño responsive.

## ⚡ Instalación rápida

```bash
# 1. Clonar el repositorio
git clone https://github.com/<tu‑usuario>/smart3z.git
cd smart3z

# 2. Instalar dependencias
npm install

# 3. Levantar en modo desarrollo
ionic serve          # o bien: npm run start

## ⚡ Estructura de carpetas

├── app/
│   ├── app.module.ts
│   └── app-routing.module.ts
├── pages/
│   ├── escritorio/
│   ├── login/
│   └── supercontrolador/
│       ├── tareas/
│       ├── estimador/
│       └── grafica-gantt/
└── services/
    ├── auth.service.ts
    ├── login.service.ts
    ├── proyectos.service.ts
    └── estimador.service.ts
