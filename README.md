# Librería Escolarium - Sistema de Gestión Interna
## Objetivo del Proyecto
Este sistema web fue desarrollado para gestionar las operaciones internas de una librería. Permite controlar productos, ventas, usuarios, asistencias e ingresos de stock, diferenciando accesos y funcionalidades según el rol del usuario (admin, encargado, empleado).
El objetivo es brindar una solución digital simple, clara y adaptable para la administración diaria de una librería, facilitando la gestión y el registro de actividades clave.

---

## Beneficios del Sistema
-  **Interfaz moderna y responsiva (SPA con React)**.
-  **Inicio de sesión con distinción de roles:** admin, encargado y empleado.
-  **Gestión completa de:** productos, ventas, usuarios, asistencias e ingresos.
-  **Filtros y búsquedas** en los listados principales.
-  **Escalabilidad:** el sistema puede ampliarse fácilmente con nuevas funcionalidades.
-  **Código organizado** y buenas prácticas para facilitar el aprendizaje y la colaboración.

---

## Tecnologías utilizadas
- **React JS** (con Vite) – frontend SPA
- **Zustand** – manejo global del estado (autenticación y usuario)
- **React Router DOM** – navegación entre páginas
- **Axios** – comunicación HTTP con backend
- **Node.js + Express** – backend y API REST
- **MySQL** – base de datos relacional
- **dotenv** – manejo de variables de entorno
- **Nodemon** – recarga automática del backend en desarrollo
- **Bootstrap** – diseño responsivo y estilizado rápido
- **CSS personalizado** – estilos únicos para marca y estética propia
- **Git y GitHub** – control de versiones y colaboración

---

##  Requisistos del sistema
Las aplicaciones necesarias para ejecutar correctamente la aplicación son:
-  **Visual Studio Code:** o otro editor de código, necesario para ejecutar el código.
-  **MySQL:** necesario para almacenar y gestionar los datos del sistema en la base de datos.
-  **XAMPP:** opcional, dependiendo de la instalación de tu MySQL.
-  **Navegador web:** se recomienda usar chrome, firefox o edge, necesario para abrir la pagina que ejecuta el sistema de gestión.

---

##  Instalación y uso

### 1. Clonar el repositorio
```bash
git clone [https://github.com/pauloled/libreria-final]
cd libreria-final
```

### 2. Configurar la base de datos
-  Importa el archivo libreria-final.sql en tu servidor MySQL para crear la base de datos y las tablas necesarias.
-  Importa el archivo inserts.sql en tu servidor MySQL para introducir datos en las tablas.

### 3. Configurar variables de entorno
-  Editar el archivo ".env" con los datos de tu base de datos:
```
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=libreria
-- Si se usa XAMPP para ingresar la contraseña suele estar vacía.
```
   
### 4. Instalar dependencias
**Backend:**
```bash
cd backend
npm install
```
**Frontend:**
```bash
cd ../frontend
npm install
```

### 5. Iniciar el backend
```bash
npm start
```
o
```bash
npx nodemon index.js
```

### 6. Iniciar el frontend
```bash
npm run dev
```

### 7. Acceder a la app
-  **Navegador**: http://localhost:5173
-  **Usuarios de prueba**:
  -  **Admin**: usuario: `admin` / contraseña: `123`
  -  **Empleado**: usuario: `empleado1` / contraseña: `123`
  -  **Encargado**: usuario: `encargado1` / contraseña: `123`

---

##  Funcionalidades del sistema

| Módulo         | Funciones disponibles                                                                |
|----------------|--------------------------------------------------------------------------------------|
| **Login**      | Acceso seguro y distinción de roles (admin, encargado, empleado)                     |
| **Productos**  | Visualización, filtrado, alta, edición y baja de productos (según rol)               |
| **Ventas**     | Registro, listado y filtrado de ventas  (segun rol)                                  |
| **Usuarios**   | Listado, alta, edición, baja y asignación de roles (admin)                           |
| **Asistencias** | Registro y corrección de asistencias, filtrado por usuario y fecha (segun rol)      |
| **Ingresos**   | Registro de ingresos de stock, filtrado edición y eliminación (admin y encargado)    |
| **Proveedores** | Registro, listado, alta, edición y eliminación de proveedores (admin y encargado)   |
| **Paneles Home** | Panel de inicio personalizado según el rol con accesos rápidos a los módulos clave |

---

## Estructura de carpetas
```
backend/
  ├── configDB/
  ├── controllers/
  ├── router/
  ├── libreria-final.sql
  ├── .env
  └── index.js

frontend/
  ├── src/
      ├── pages/
      ├── enpoints/
      ├── router/
      ├── store/
      └── components/
  ├── package.json
  └── vite.config.js
```

---

## Notas
- Este proyecto puede ser ampliado con más validaciones, seguridad y funcionalidades.
- Si tiene dudas sobre la estructura o el uso, revisar los comentarios en el código.

---

## Autores y colaboradores
-  Desarrollado por: Ledesma Paulo, Ledesma Santiago, Navarro Santiago, Quiroga Jose, Ramirez Leonardo
-  Materia: Programación III
-  Año: 2025



---

# Documentación Formal - Sistema de Gestión "Librería Escolarium"

---

## Carátula

- **Título:** Sistema de Gestión Interna para Librería Escolarium
- **Autores:** Ledesma Paulo, Ledesma Santiago, Navarro Santiago, Quiroga Jose, Ramirez Leonardo
- **Materia:** Programación III
- **Año:** 2025
- **Docente:** [Completar]
- **Curso/Comisión:** [Completar]
- **Fecha de entrega:** [Completar]

---

## Índice

1. Introducción
2. Objetivos
3. Fundamentación / Investigación [Completar]
4. Tecnologías Utilizadas
5. Instalación y Puesta en Marcha
6. Estructura del Proyecto
7. Funcionalidades del Sistema
8. Manual de Usuario
9. Pruebas Realizadas [Completar]
10. Conclusiones y Mejoras Futuras [Completar]
11. Anexos (código, diagramas, capturas, etc.) [Completar]

---

## 1. Introducción

El presente documento describe el desarrollo e implementación de un sistema web para la gestión interna de una librería, denominado "Librería Escolarium". El sistema permite controlar productos, ventas, usuarios, asistencias e ingresos de stock, diferenciando accesos y funcionalidades según el rol del usuario (admin, encargado, empleado).

---

## 2. Objetivos

- Brindar una solución digital simple, clara y adaptable para la administración diaria de una librería.
- Facilitar la gestión y el registro de actividades clave.
- Permitir la diferenciación de roles y accesos.
- Mejorar la eficiencia y trazabilidad de las operaciones internas.

---

## 3. Fundamentación / Investigación

*[Completar: aquí puedes explicar por qué elegiste estas tecnologías, qué problemas resuelve el sistema, referencias a sistemas similares, etc.]*

---

## 4. Tecnologías Utilizadas

- **Frontend:**
  - React JS (con Vite)
  - Zustand (manejo global del estado)
  - React Router DOM (navegación)
  - Axios (HTTP)
  - Bootstrap y CSS personalizado
- **Backend:**
  - Node.js + Express (API REST)
  - MySQL (base de datos)
  - dotenv (variables de entorno)
  - Nodemon (desarrollo)
- **Control de versiones:** Git y GitHub

---

## 5. Instalación y Puesta en Marcha

### 5.1. Requisitos

- Visual Studio Code (u otro editor)
- MySQL
- XAMPP (opcional)
- Navegador web (Chrome, Firefox, Edge)

### 5.2. Pasos

1. **Clonar el repositorio**
    ```bash
    git clone https://github.com/pauloled/libreria-final
    cd libreria-final
    ```
2. **Configurar la base de datos**
    - Importar libreria-final.sql y luego inserts.sql en MySQL.
3. **Configurar variables de entorno**
    - Editar `.env` en backend con los datos de tu base.
4. **Instalar dependencias**
    - Backend: `cd backend && npm install`
    - Frontend: `cd ../frontend && npm install`
5. **Iniciar el backend**
    - `npm start` o `npx nodemon index.js`
6. **Iniciar el frontend**
    - `npm run dev`
7. **Acceder a la app**
    - Navegador: [http://localhost:5173](http://localhost:5173)
    - Usuarios de prueba:
      - Admin: usuario: `admin` / contraseña: `123`
      - Empleado: usuario: `empleado1` / contraseña: `123`
      - Encargado: usuario: `encargado1` / contraseña: `123`

---

## 6. Estructura del Proyecto

```
backend/
  ├── configDB/
  ├── controllers/
  ├── router/
  ├── libreria-final.sql
  ├── .env
  └── index.js

frontend/
  ├── src/
      ├── pages/
      ├── enpoints/
      ├── router/
      ├── store/
      └── components/
  ├── package.json
  └── vite.config.js
```

---

## 7. Funcionalidades del Sistema

| Módulo         | Funciones disponibles                                                                |
|----------------|--------------------------------------------------------------------------------------|
| **Login**      | Acceso seguro y distinción de roles (admin, encargado, empleado)                     |
| **Productos**  | Visualización, filtrado, alta, edición y baja de productos (según rol)               |
| **Ventas**     | Registro, listado y filtrado de ventas  (según rol)                                  |
| **Usuarios**   | Listado, alta, edición, baja y asignación de roles (admin)                           |
| **Asistencias** | Registro y corrección de asistencias, filtrado por usuario y fecha (según rol)      |
| **Ingresos**   | Registro de ingresos de stock, filtrado, edición y eliminación (admin y encargado)   |
| **Proveedores** | Registro, listado, alta, edición y eliminación de proveedores (admin y encargado)   |
| **Paneles Home** | Panel de inicio personalizado según el rol con accesos rápidos a los módulos clave |

---

## 8. Manual de Usuario

### 8.1. Inicio de sesión

- Acceder con usuario y contraseña.
- El sistema muestra diferentes paneles según el rol.

### 8.2. Gestión de productos

- Visualizar, buscar y filtrar productos.
- Crear, editar y eliminar productos (según permisos).

### 8.3. Ventas

- Registrar una nueva venta, seleccionando productos y métodos de pago.
- Ver listado de ventas, filtrar por fecha, usuario y método de pago.
- Eliminar ventas (según permisos).

### 8.4. Usuarios

- Listar usuarios.
- Crear, editar, eliminar y asignar roles (solo admin).

### 8.5. Asistencias

- Registrar ingreso y salida.
- Corregir asistencias (admin/encargado).
- Filtrar por usuario y fecha.

### 8.6. Ingresos de stock

- Registrar ingresos de productos al stock.
- Editar y eliminar ingresos (admin/encargado).

### 8.7. Proveedores

- Registrar, editar y eliminar proveedores (admin/encargado).

*[Puedes agregar capturas de pantalla de cada módulo aquí]*

---

## 9. Pruebas Realizadas

*[Completar: Detalla pruebas funcionales, de usuario, casos de prueba, etc. Puedes incluir capturas de pantalla.]*

---

## 10. Conclusiones y Mejoras Futuras

*[Completar: Reflexiona sobre el desarrollo, dificultades, logros y posibles mejoras o ampliaciones.]*

---

## 11. Anexos

- Código fuente relevante.
- Diagramas de base de datos, de flujo, de arquitectura.
- Capturas de pantalla adicionales.
- Manual técnico para desarrolladores (opcional).

---

**Fin del documento**