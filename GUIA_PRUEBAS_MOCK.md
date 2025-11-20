# 🎭 Guía de Prueba del Frontend - Modo MOCK

## 🚀 Cómo Arrancar

```bash
cd front
npm install
npm run dev
```

Abre tu navegador en: `http://localhost:5173`

---

## 👥 Usuarios de Prueba

### 1️⃣ ALUMNO GRADO - Ana
**Email:** `ana@uni.edu`  
**Password:** `p1`

**Puede ver:**
- ✅ Salas libres
- ❌ Salas de posgrado
- ❌ Salas docentes

**Tiene datos mock:**
- 3 reservas activas hoy
- 1 reserva finalizada ayer
- Sin sanciones activas

**Puedes probar:**
1. Dashboard → Ver estadísticas y reservas
2. Mis Reservas → Filtrar, cancelar, registrar asistencia
3. Nueva Reserva → Crear reserva (verás todas las salas libres)
4. Mis Sanciones → Verificar que no tiene sanciones
5. Salas Disponibles → Ver salas agrupadas por edificio

---

### 2️⃣ DOCENTE - Marta
**Email:** `marta@uni.edu`  
**Password:** `p13`

**Puede ver:**
- ✅ Salas libres
- ✅ Salas de posgrado
- ✅ Salas docentes

**Tiene datos mock:**
- 1 reserva activa (Lab 2, Ingeniería)
- Sin límites de horas en salas docentes

**Puedes probar:**
1. Dashboard → Ver reservas como docente
2. Nueva Reserva → Ver TODAS las salas (incluidas docentes)
3. Verificar que puede seleccionar salas tipo "docente"

---

### 3️⃣ POSGRADO - Olga
**Email:** `olga@uni.edu`  
**Password:** `p15`

**Puede ver:**
- ✅ Salas libres
- ✅ Salas de posgrado
- ❌ Salas docentes

**Tiene datos mock:**
- 1 reserva activa (Sala A, Posgrados)
- Sin límites en salas de posgrado

**Puedes probar:**
1. Nueva Reserva → Ver salas libres + salas de posgrado
2. Verificar que NO ve "Lab 2" ni "Docente 1"
3. Dashboard específico de posgrado

---

### 4️⃣ ADMIN - Administrador
**Email:** `admin@uni.edu`  
**Password:** `admin123`

**Panel completo de administración**

**Puede ver:**
1. **Dashboard Admin:**
   - Estadísticas: 20 participantes, 10 salas, 15 reservas activas, 2 sanciones activas
   - Navegación a todas las secciones

2. **Gestión de Participantes:**
   - Lista completa de 10 participantes
   - Puede eliminar (mock, verás console.log)

3. **Gestión de Salas:**
   - Lista de 10 salas con tipos (libre/posgrado/docente)
   - Filtrar por edificio
   - Puede eliminar (mock)

4. **Gestión de Reservas:**
   - Ver todas las 7 reservas mock
   - Filtrar por estado
   - Ver participantes de cada reserva

5. **Gestión de Sanciones:**
   - Ver 3 sanciones (1 activa, 2 finalizadas)
   - Filtrar: Todas / Activas / Finalizadas
   - Ver días restantes de sanciones activas
   - Ver nombre y email del participante sancionado
   - Bruno (CI: 102) tiene sanción activa hasta 1 mes después de hoy

---

## 📊 Datos Mock Incluidos

### Participantes (10):
- Ana, Bruno, Carla, Diego, Elena (alumnos grado)
- Marta, Nico (docentes)
- Olga, Pablo (posgrado)
- Admin (administrador)

### Salas (10):
**Libres (6):**
- 101, 102, 201 (Aulario Central)
- Lab 1 (Ingeniería)
- 301, 302 (Biblioteca)

**Posgrado (2):**
- Sala A, Sala B (Posgrados)

**Docentes (2):**
- Lab 2 (Ingeniería)
- Docente 1 (Facultad)

### Reservas (7):
- 4 reservas para hoy
- 1 reserva de ayer (finalizada)
- 2 reservas para mañana

### Sanciones (3):
- Bruno: Activa (30 días restantes)
- Diego: Finalizada (Oct 2025)
- Elena: Finalizada (Nov 2025)

### Turnos (15):
- Desde 08:00 hasta 23:00
- Intervalos de 1 hora

### Edificios (5):
- Aulario Central, Ingeniería, Posgrados, Biblioteca, Facultad

---

## 🎯 Flujos de Prueba Recomendados

### Flujo 1: Usuario Alumno (Ana)
1. Login con `ana@uni.edu` / `p1`
2. Dashboard → Ver 3 reservas activas
3. Mis Reservas → Probar filtros (Todas/Activas/Finalizadas)
4. Click "Cancelar" en una reserva → Ver console.log
5. Click "Registrar Asistencia" → Ver console.log
6. Mis Sanciones → Verificar "Sin sanciones activas"
7. Nueva Reserva → Seleccionar sala libre, fecha, turnos, participantes
8. Click "Crear Reserva" → Ver console.log con datos
9. Salas Disponibles → Ver agrupación por edificio

### Flujo 2: Usuario Docente (Marta)
1. Login con `marta@uni.edu` / `p13`
2. Dashboard → Ver reserva en Lab 2
3. Nueva Reserva → Verificar que ve salas tipo "docente"
4. Seleccionar "Lab 2" o "Docente 1" → Debería poder
5. Verificar que ve también salas de posgrado

### Flujo 3: Usuario Posgrado (Olga)
1. Login con `olga@uni.edu` / `p15`
2. Nueva Reserva → Ver salas de posgrado
3. Verificar que NO aparece "Lab 2" (docente)
4. Seleccionar "Sala A" o "Sala B" → Debería poder

### Flujo 4: Administrador
1. Login con `admin@uni.edu` / `admin123`
2. Dashboard Admin → Ver estadísticas
3. **Participantes:**
   - Click "Eliminar" en uno → Ver console.log
4. **Salas:**
   - Ver lista completa
   - Probar filtro por edificio
5. **Reservas:**
   - Filtrar por "Activas"
   - Ver participantes de cada reserva
6. **Sanciones:**
   - Filtrar "Activas" → Ver solo Bruno
   - Ver "30 días restantes"
   - Filtrar "Finalizadas" → Ver Diego y Elena
   - Click "Eliminar" → Ver console.log

---

## 🔧 Qué Funciona en MOCK

✅ **Funcionan completamente:**
- Login y autenticación
- Navegación entre páginas
- Dashboards (usuario y admin)
- Listas de todas las entidades
- Filtros y búsquedas
- Validaciones de permisos (salas según rol)
- Cálculos (días restantes, estadísticas)
- UI completa con estilos

⚠️ **Solo hacen console.log (no persisten):**
- Crear reserva
- Cancelar reserva
- Registrar asistencia
- Eliminar participante
- Eliminar sala
- Eliminar sanción

❌ **No funcionan (falta backend):**
- Crear/editar participantes (botón existe pero no hace nada)
- Crear/editar salas
- Crear/editar sanciones
- Persistencia real de datos

---

## 🔄 Desactivar MOCK Mode

Cuando el backend esté listo:

1. Abre `front/src/services/api.js`
2. Cambia la línea 4:
```javascript
const MOCK_MODE = false; // ← Cambiar true a false
```
3. Asegúrate de que el backend esté corriendo en `http://localhost:8000`
4. Todos los datos pasarán a venir del backend real

---

## 📝 Console Logs

Abre las DevTools (F12) → Console para ver:
- ✅ Reserva creada (MOCK): {...}
- ✅ Reserva cancelada (MOCK): 2001
- ✅ Asistencia registrada (MOCK): 2001, 101, true
- ✅ Participante eliminado (MOCK): 101
- ✅ Sala eliminada (MOCK): 101, Aulario Central
- ✅ Sanción eliminada (MOCK): 101

---

## 🎨 Screenshots Esperados

**Login:**
- Formulario con gradiente púrpura
- 4 usuarios diferentes para probar

**Dashboard Usuario:**
- Cards con estadísticas
- Alertas de sanciones (si las tiene)
- Últimas 5 reservas

**Dashboard Admin:**
- 4 cards de estadísticas
- 4 botones de navegación

**Gestión de Sanciones:**
- Filtros funcionando
- Colores: rojo=activa, gris=finalizada
- Días restantes visibles

---

## 🐛 Si algo no funciona:

1. Verifica que estés en `http://localhost:5173`
2. Revisa la consola del navegador (F12)
3. Verifica que `MOCK_MODE = true` en `api.js`
4. Intenta con otro usuario
5. Recarga la página (Ctrl+R)

---

## 📧 Resumen de Credenciales

```
ALUMNO:   ana@uni.edu    / p1
DOCENTE:  marta@uni.edu  / p13
POSGRADO: olga@uni.edu   / p15
ADMIN:    admin@uni.edu  / admin123
```

¡Listo para probar! 🚀
