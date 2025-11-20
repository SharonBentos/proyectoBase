# Lista de Endpoints que el Backend debe Implementar

## 📋 Estado Actual

✅ **Implementado:**
- `POST /reservas` - Crear reserva

❌ **Faltantes (necesarios para el frontend):**

## 🔐 Autenticación

### POST /login
**Request:**
```json
{
  "correo": "ana@uni.edu",
  "password": "p1"
}
```

**Response:**
```json
{
  "correo": "ana@uni.edu",
  "ci": "101",
  "nombre": "Ana",
  "apellido": "Pérez",
  "es_administrador": false,
  "rol": "alumno",
  "tipo_programa": "grado"
}
```

### GET /me
Obtiene información del usuario autenticado (si implementan JWT/sesiones)

---

## 👥 Participantes

### GET /participantes
**Response:**
```json
[
  {
    "ci": "101",
    "nombre": "Ana",
    "apellido": "Pérez",
    "email": "ana@uni.edu"
  }
]
```

### GET /participantes/{ci}
**Response:** Un participante

### POST /participantes
**Request:**
```json
{
  "ci": "125",
  "nombre": "Juan",
  "apellido": "García",
  "email": "juan@uni.edu"
}
```

### PUT /participantes/{ci}
**Request:** Mismo formato que POST

### DELETE /participantes/{ci}
**Response:** Confirmación de eliminación

---

## 🚪 Salas

### GET /salas
**Response:**
```json
[
  {
    "nombre_sala": "101",
    "edificio": "Aulario Central",
    "capacidad": 40,
    "tipo_sala": "libre"
  }
]
```

### GET /salas/{nombre_sala}/{edificio}
**Response:** Una sala

### POST /salas
**Request:**
```json
{
  "nombre_sala": "Lab 5",
  "edificio": "Ingeniería",
  "capacidad": 25,
  "tipo_sala": "docente"
}
```

### PUT /salas/{nombre_sala}/{edificio}
**Request:** Mismo formato que POST

### DELETE /salas/{nombre_sala}/{edificio}
**Response:** Confirmación

---

## 📅 Reservas (ampliar endpoint existente)

### GET /reservas
**Response:**
```json
[
  {
    "id_reserva": 2001,
    "nombre_sala": "101",
    "edificio": "Aulario Central",
    "fecha": "2025-11-20",
    "id_turno": 1,
    "hora_inicio": "08:00:00",
    "hora_fin": "09:00:00",
    "estado": "activa",
    "participantes_ci": ["101", "105"],
    "asistencia": false
  }
]
```

### GET /reservas/{id}
**Response:** Una reserva

### PUT /reservas/{id}
**Request:**
```json
{
  "estado": "cancelada"
}
```

### DELETE /reservas/{id}
Cancelar reserva

### PATCH /reservas/{id}/asistencia
**Request:**
```json
{
  "ci_participante": "101",
  "asistencia": true
}
```

---

## ⚠️ Sanciones

### GET /sanciones
**Response:**
```json
[
  {
    "id_sancion": 101,
    "ci_participante": "101",
    "fecha_inicio": "2025-09-01",
    "fecha_fin": "2025-09-30"
  }
]
```

### GET /sanciones/participante/{ci}
**Response:** Lista de sanciones del participante

### POST /sanciones
**Request:**
```json
{
  "ci_participante": "101",
  "fecha_inicio": "2025-11-01",
  "fecha_fin": "2026-01-01"
}
```

### PUT /sanciones/{id}
**Request:** Mismo formato que POST

### DELETE /sanciones/{id}
**Response:** Confirmación

---

## ⏰ Turnos

### GET /turnos
**Response:**
```json
[
  {
    "id_turno": 1,
    "hora_inicio": "08:00:00",
    "hora_fin": "09:00:00"
  }
]
```

---

## 🏢 Edificios

### GET /edificios
**Response:**
```json
[
  {
    "nombre_edificio": "Aulario Central",
    "direccion": "Av. Universitaria 1234",
    "departamento": "Montevideo"
  }
]
```

---

## 📚 Programas Académicos

### GET /programas
**Response:**
```json
[
  {
    "nombre_programa": "Ingeniería Informática",
    "id_facultad": 1,
    "tipo": "grado"
  }
]
```

---

## 📊 Estadísticas (Admin)

### GET /stats
**Response:**
```json
{
  "totalParticipantes": 20,
  "totalSalas": 10,
  "reservasActivas": 15,
  "sancionesActivas": 2
}
```

---

## 🔧 Configuración CORS

El backend debe permitir peticiones desde `http://localhost:5173` (puerto de Vite)

**FastAPI:**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📝 Notas Importantes

1. **Formato de fechas:** YYYY-MM-DD
2. **Formato de horas:** HH:MM:SS
3. **Estados de reserva:** 'activa', 'cancelada', 'sin asistencia', 'finalizada'
4. **Tipos de sala:** 'libre', 'posgrado', 'docente'
5. **Roles:** 'alumno', 'docente'
6. **Tipos de programa:** 'grado', 'posgrado'

---

## 🚀 Prioridades de Implementación

1. **Alta prioridad (para funcionalidad básica):**
   - POST /login
   - GET /salas
   - GET /turnos
   - GET /reservas
   - GET /participantes

2. **Media prioridad (para funcionalidad completa):**
   - GET /sanciones/participante/{ci}
   - PATCH /reservas/{id}/asistencia
   - DELETE /reservas/{id}

3. **Baja prioridad (admin):**
   - ABM completo de participantes
   - ABM completo de salas
   - ABM completo de sanciones
   - GET /stats
