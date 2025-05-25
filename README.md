# Smart3Z

> Plataforma web + móvil para **planificar, estimar y hacer seguimiento de proyectos** con una interfaz moderna basada en Ionic + Angular (front‑end) y un backend RESTful en PHP 8.

![Smart3Z banner](docs/banner-smart3z.png)

## Tabla de contenidos

* [✨ Descripción breve](#-descripción-breve)
* [🔑 Funcionalidades](#-funcionalidades-principales)
* [📱 Capturas](#-capturas-rápidas)
* [🏗️ Arquitectura](#-arquitectura)
* [🛠️ Tecnologías](#-tecnologías-empleadas)
* [📂 Estructura de carpetas](#-estructura-de-carpetas)
* [🚀 Instalación](#-instalación)

  * [Frontend (Ionic + Angular)](#frontend-ionic-angular)
  * [Backend (API PHP)](#backend-api-php)
* [🌐 API reference](#-api-reference)
* [🗄️ Base de datos](#-base-de-datos)
* [📜 License](#-license)

## ✨ Descripción breve

Smart3Z centraliza la creación de proyectos, la asignación de tareas y la estimación de recursos en un único entorno responsive.
Incluye autenticación por roles (**ADMIN**, **PM**, **EMP**) y se comunica con un backend REST PHP que forma parte del TFG.

## 🔑 Funcionalidades principales

| Módulo                              | Qué aporta                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| **Login & Auth**                    | Inicio de sesión seguro (JWT opcional) y persistencia de sesión en *localStorage*.          |
| **Escritorio (Dashboard)**          | Vista general de proyectos activos, KPIs e indicadores de riesgo.                           |
| **Gestión de Proyectos**            | CRUD de proyectos con asignación de PM, departamentos y fechas.                             |
| **Tareas**                          | CRUD completo de tareas, dependencias, horas estimadas y estado.                            |
| **Asignación de Personal**          | Búsqueda y asignación de personal por perfil, disponibilidad y vacaciones.                  |
| **Estimador de Recursos**           | Configuración de calendario laboral, perfiles de equipo y cálculo de coste total.           |
| **Gráfica Gantt**                   | Visualización interactiva del cronograma con filtros por perfil, usuario y rango de fechas. |
| **Resumen de Estimación**           | Informe agregado del esfuerzo por perfil y coste para validación final.                     |
| **Planificador Automático**         | Algoritmo que genera turnos semanales teniendo en cuenta disponibilidad y vacaciones.       |
| **Seguimiento de Horas Incurridas** | Registro y visualización del progreso real vs. planificado.                                 |

## 📱 Capturas rápidas

<!-- coloca tus GIF o PNG en la carpeta /docs y enlázalos aquí -->

| Escritorio                               | Gantt                            | Estimador                                | Planificador                                   |
| ---------------------------------------- | -------------------------------- | ---------------------------------------- | ---------------------------------------------- |
| ![Dashboard](docs/smart3z-dashboard.png) | ![Gantt](docs/smart3z-gantt.png) | ![Estimador](docs/smart3z-estimador.png) | ![Planificador](docs/smart3z-planificador.png) |

## 🏗️ Arquitectura

```text
Frontend (Ionic + Angular)  ←→  REST API (PHP 8)  ←→  MySQL 8
          |                              |
     RxJS Observables             Procedimientos SQL
          |
  Capacitor (iOS / Android)
```

* **Comunicaciones**: HTTP + JSON; CORS entre `http://localhost:8100` y `http://localhost/smart3z/api`.
* **Autenticación**: sesión almacenada en el front; preparado para JWT.
* **Persistencia**: MySQL (`smart3z_db`) con claves foráneas y triggers de integridad.

## 🛠️ Tecnologías empleadas

### Frontend

* **Angular 17** + **Ionic 7** (stand‑alone components, SCSS, lazy routing).
* **TypeScript 5 / RxJS 7** para lógica reactiva.
* **Capacitor 5** para build móvil (iOS / Android).

### Backend

* **PHP 8.2** estilo REST sin framework.
* **mysqli** + consultas parametrizadas.
* **JSON** como formato de intercambio.
* Configurado para **Apache 2.4** con *mod\_rewrite* deshabilitado (endpoints basados en scripts).

## 📂 Estructura de carpetas

```text
smart3z/
├── app/                 # Frontend Angular
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   └── pages/
│       ├── escritorio/
│       ├── login/
│       └── supercontrolador/
│           ├── tareas/
│           ├── estimador/
│           ├── asignacion-personal/
│           ├── grafica-gantt/
│           └── incurrido-tareas/
└── api/                 # Backend PHP
    ├── db.php
    ├── login.php
    ├── proyectos.php
    ├── tareas.php
    ├── planificar.php
    ├── estimaciones.php
    ├── personal.php
    ├── perfiles.php
    ├── pm-lista.php
    ├── departamentos-lista.php
    ├── usuarios-lista.php
    └── ver-usuarios.php
```

## 🚀 Instalación

> Requisitos: **Node >= 20**, **npm >= 10**, **Ionic CLI >= 7** y **PHP >= 8.1** con acceso a MySQL 8.

### Frontend (Ionic + Angular)

```bash
git clone https://github.com/<tu‑usuario>/smart3z.git
cd smart3z/app
npm install
ionic serve          # http://localhost:8100
```

Para construir las apps móviles:

```bash
ionic build
npx cap copy
npx cap open android   # o: npx cap open ios
```

### Backend (API PHP)

```bash
cd smart3z/api
cp .env.example .env   # edita credenciales de MySQL

# Importa la base de datos
mysql -u root -p < db/schema.sql

# En Apache 2.4 (XAMPP / Laragon)
# Coloca la carpeta `api` en htdocs y accede vía:
#   http://localhost/smart3z/api/login.php
```

#### Variables de entorno (`.env`)

| Variable       | Ejemplo                 | Descripción       |
| -------------- | ----------------------- | ----------------- |
| `DB_HOST`      | `localhost`             | Host MySQL        |
| `DB_USER`      | `root`                  | Usuario MySQL     |
| `DB_PASS`      | `secret`                | Contraseña        |
| `DB_NAME`      | `smart3z_db`            | Base de datos     |
| `CORS_ORIGINS` | `http://localhost:8100` | Separar por comas |

## 🌐 API reference

| Endpoint                       | Método                      | Payload / Query                                                                            | Respuesta                    |
| ------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------- |
| `/api/login.php`               | `POST`                      | `{ email, contrasena }`                                                                    | Datos de sesión o `401`.     |
| `/api/proyectos.php`           | `POST`                      | Rama 1: `{ id_usuario }` lista proyectos.<br>Rama 2: `{ nuevoProyecto... }` alta proyecto. | JSON array / objeto          |
| `/api/tareas.php`              | `GET / POST / PUT / DELETE` | Ver código para combinaciones (CRUD).                                                      | JSON                         |
| `/api/planificar.php`          | `POST`                      | `{ id_proyecto }`                                                                          | Turnos semanales detallados. |
| `/api/estimaciones.php`        | `POST`                      | `{ id_proyecto }` devuelve estimaciones<br>`{ id_estimacion }` elimina                     | JSON                         |
| `/api/perfiles.php`            | `GET`                       | —                                                                                          | Lista de perfiles.           |
| `/api/personal.php`            | `GET`                       | `?id_perfil=3` opcional                                                                    | Lista de personal.           |
| `/api/pm-lista.php`            | `GET`                       | —                                                                                          | Lista PM.                    |
| `/api/departamentos-lista.php` | `GET`                       | —                                                                                          | Lista departamentos.         |
| `/api/usuarios-lista.php`      | `GET`                       | —                                                                                          | Lista usuarios simplificada. |

> Cada script PHP retorna `Content-Type: application/json` y gestiona preflight `OPTIONS` para CORS.

## 🗄️ Base de datos

* **smart3z\_db** con tablas `usuarios`, `proyectos`, `tareas`, `personal`, `asignaciones`, `estimaciones`…
* Incluye *foreign keys*, índices compuestos y `ON DELETE CASCADE`.
* Script en `db/schema.sql`.


