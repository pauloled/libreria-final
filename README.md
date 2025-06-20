# Librería " " - Sistema de Gestión Interna
## Objetivo del Proyecto

Este sistema web fue desarrollado como proyecto académico para gestionar las operaciones internas de una librería. Permite controlar productos, ventas, usuarios, asistencias e ingresos de stock, diferenciando accesos y funcionalidades según el rol del usuario (admin, encargado, empleado).

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

##  Instalación y uso

### 1. Clonar el repositorio
```bash
git clone [https://github.com/pauloled/libreria-final]
cd libreria-final
```

### 2. Configurar la base de datos
-  Importa el archivo libreria-final.sql en tu servidor MySQL para crear la base de datos y las tablas necesarias.
-  Crea usuarios de prueba en la tabla usuario (admin, encargado, empleado):
```bash
-- Usuarios de prueba para la tabla `usuario`
INSERT INTO usuario (nombre_usuario, correo, contrasena, fecha_registro, rol) VALUES
('admin', 'admin@libreria.com', '123', NOW(), 'admin'),
('empleado1', 'empleado1@libreria.com', '123', NOW(), 'empleado'),
('encargado1', 'encargado1@libreria.com', '123', NOW(), 'encargado');
```

### 3. Configurar variables de entorno
-  Crea el archivo ".env" con los datos de tu base de datos:
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
| **Productos**  | Visualización, alta, edición y baja de productos (según rol)                         |
| **Ventas**     | Registro, listado y filtrado de ventas                                               |
| **Usuarios**   | Alta, edición, baja y asignación de roles                                            |
| **Asistencias**| Registro y corrección de asistencias, filtrado por usuario y fecha                   |
| **Ingresos**   | Registro de ingresos de stock, edición y eliminación                                 |
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

- Este proyecto es una base académica y puede ser ampliado con más validaciones, seguridad y funcionalidades.
- Si tiene dudas sobre la estructura o el uso, revisa los archivos README y los comentarios en el código.

---

## Autores y colaboradores
-  Desarrollado por: Ledesma Paulo, Ledesma Santiago, Navarro Santiago, Quiroga Jose, Ramirez Leonardo
-  Materia: Programación III
-  Año: 2025
