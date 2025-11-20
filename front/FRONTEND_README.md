# Sistema de Gestión de Reservas de Salas - Frontend

Este es el frontend del sistema de gestión de reservas de salas de estudio de la UCU.

## 🚀 Estructura del Proyecto

```
front/
├── src/
│   ├── components/
│   │   ├── Auth/              # Autenticación
│   │   │   ├── Login.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── Layout/            # Layout común
│   │   │   ├── Layout.jsx
│   │   │   └── Navbar.jsx
│   │   ├── User/              # Componentes de usuario
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MisReservas.jsx
│   │   │   ├── NuevaReserva.jsx
│   │   │   └── SalasDisponibles.jsx
│   │   └── Admin/             # Componentes de administrador
│   │       ├── AdminDashboard.jsx
│   │       ├── Participantes/
│   │       ├── Salas/
│   │       ├── Reservas/
│   │       └── Sanciones/
│   ├── context/
│   │   └── AuthContext.jsx    # Contexto de autenticación
│   ├── hooks/
│   │   └── useAuth.js         # Hook personalizado de auth
│   ├── services/
│   │   └── api.js             # Llamadas al backend
│   ├── utils/
│   │   └── helpers.js         # Funciones auxiliares
│   ├── App.jsx                # Configuración de rutas
│   └── main.jsx               # Entry point
```

## 👥 Roles y Permisos

### Usuario Normal (Estudiante de Grado)
- ✅ Ver salas de uso "libre"
- ✅ Crear reservas (máximo 2 horas/día, 3 reservas activas/semana)
- ✅ Ver mis reservas
- ✅ Registrar asistencia
- ✅ Ver mis sanciones

### Estudiante de Posgrado
- ✅ Todo lo anterior +
- ✅ Acceso a salas de "posgrado" (sin límites)

### Docente
- ✅ Todo lo anterior +
- ✅ Acceso a salas de "docente" (sin límites)

### Administrador
- ✅ ABM de Participantes
- ✅ ABM de Salas
- ✅ ABM de Reservas
- ✅ ABM de Sanciones
- ✅ Ver estadísticas del sistema

## 🎨 Características del Frontend

### Autenticación y Seguridad
- Login con correo y contraseña
- Rutas protegidas según rol
- Context API para manejo de sesión
- Persistencia de sesión en localStorage

### Dashboard de Usuario
- Estadísticas rápidas (reservas activas, esta semana, hoy)
- Alertas de sanciones activas
- Acciones rápidas
- Últimas reservas

### Gestión de Reservas
- Selección de sala con filtros por permisos
- Selección de fecha y turnos horarios (bloques de 1 hora)
- Selección múltiple de participantes
- Validación de capacidad de sala
- Validación de límites según rol

### Panel de Administración
- Dashboard con estadísticas globales
- Tablas de gestión para todas las entidades
- Operaciones CRUD completas

## 🔗 Endpoints del Backend Requeridos

El frontend está preparado para conectarse con estos endpoints:

### Autenticación
- `POST /login` - Iniciar sesión
- `GET /me` - Obtener perfil del usuario

### Participantes
- `GET /participantes` - Listar todos
- `GET /participantes/{ci}` - Obtener uno
- `POST /participantes` - Crear
- `PUT /participantes/{ci}` - Actualizar
- `DELETE /participantes/{ci}` - Eliminar

### Salas
- `GET /salas` - Listar todas
- `GET /salas/{nombre_sala}/{edificio}` - Obtener una
- `POST /salas` - Crear
- `PUT /salas/{nombre_sala}/{edificio}` - Actualizar
- `DELETE /salas/{nombre_sala}/{edificio}` - Eliminar

### Reservas
- `GET /reservas` - Listar todas
- `GET /reservas/{id}` - Obtener una
- `POST /reservas` - Crear (ya existe)
- `PUT /reservas/{id}` - Actualizar
- `DELETE /reservas/{id}` - Cancelar
- `PATCH /reservas/{id}/asistencia` - Registrar asistencia

### Sanciones
- `GET /sanciones` - Listar todas
- `GET /sanciones/participante/{ci}` - Por participante
- `POST /sanciones` - Crear
- `PUT /sanciones/{id}` - Actualizar
- `DELETE /sanciones/{id}` - Eliminar

### Otros
- `GET /turnos` - Listar turnos horarios
- `GET /edificios` - Listar edificios
- `GET /programas` - Listar programas académicos
- `GET /stats` - Estadísticas (admin)

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## ⚙️ Configuración

El backend debe estar ejecutándose en `http://localhost:8000`

Puedes cambiar la URL en `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

## 📝 Próximos Pasos

1. **Backend**: La otra persona debe implementar los endpoints faltantes
2. **Formularios de Admin**: Expandir los formularios de creación/edición en los ABM
3. **Validaciones**: Agregar más validaciones del lado del cliente
4. **Filtros Avanzados**: Agregar filtros y búsquedas en las listas
5. **Paginación**: Implementar paginación en las tablas grandes
6. **Notificaciones**: Sistema de notificaciones más robusto
7. **Tests**: Agregar tests unitarios y de integración

## 🎯 Reglas de Negocio Implementadas

- ✅ Turnos de 8:00 AM a 11:00 PM (bloques de 1 hora)
- ✅ Máximo 2 horas diarias en salas libres (estudiantes de grado)
- ✅ Máximo 3 reservas activas por semana (estudiantes de grado)
- ✅ Sin límites para docentes y posgrado en sus salas exclusivas
- ✅ Validación de capacidad de sala
- ✅ Sistema de sanciones (2 meses sin reservar)
- ✅ Registro de asistencia

## 🤝 Contribuciones

Este frontend está completo y funcional. Coordina con la persona del backend para:
1. Implementar los endpoints faltantes
2. Ajustar los modelos de datos si es necesario
3. Probar la integración completa
