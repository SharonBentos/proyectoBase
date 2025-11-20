# 🎨 Sistema de Estilos Consolidado

## 📁 Nueva Estructura

```
src/
├── styles/                    ← TODO EL CSS ESTÁ AQUÍ
│   ├── variables.css         ← Variables globales (colores, espaciado)
│   ├── utilities.css         ← Clases reutilizables
│   ├── global.css            ← Importa todo + estilos base
│   │
│   ├── auth.css              ← Login y autenticación
│   ├── layout.css            ← Navbar y estructura general
│   ├── dashboard.css         ← Dashboard del usuario
│   ├── reservas.css          ← Lista de reservas
│   ├── nueva-reserva.css     ← Formulario de reserva
│   ├── salas.css             ← Salas disponibles
│   └── sanciones.css         ← Sanciones del usuario
│
├── components/
│   ├── Common/               ← Componentes reutilizables
│   │   ├── Card.jsx
│   │   ├── Alert.jsx
│   │   ├── Button.jsx
│   │   ├── Loading.jsx
│   │   ├── EmptyState.jsx
│   │   └── index.js          ← Exporta todos
│   │
│   ├── User/                 ← SIN archivos .css
│   ├── Auth/                 ← SIN archivos .css
│   └── Layout/               ← SIN archivos .css
│
└── main.jsx                  ← Importa styles/global.css
```

## ✅ Ventajas del nuevo sistema

### 1. **Centralización**
- ✅ Todo el CSS en una carpeta `styles/`
- ✅ Fácil de encontrar y modificar
- ✅ No más archivos CSS dispersos

### 2. **Variables CSS Reutilizables**
```css
/* En lugar de hardcodear colores */
background: #667eea;  ❌

/* Usa variables */
background: var(--primary-color);  ✅
```

**Variables disponibles:**
- `--primary-color`, `--primary-dark`
- `--success-color`, `--warning-color`, `--error-color`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, `--spacing-lg`
- `--border-radius`, `--shadow-md`, etc.

### 3. **Clases Utilitarias**
```jsx
// Antes
<div className="custom-card with-shadow">

// Ahora
<div className="card">
```

**Clases disponibles:**
- `.card`, `.card-header`, `.card-body`
- `.alert`, `.alert-success`, `.alert-warning`, `.alert-error`
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.badge`, `.badge-success`, `.badge-warning`
- `.grid-2`, `.grid-3`
- `.form-group`, `.form-label`, `.form-input`
- `.loading-container`, `.empty-state`
- `.mt-1`, `.mb-2`, etc.

### 4. **Componentes Reutilizables**
```jsx
import { Card, Alert, Button, Loading } from '../Common';

// Antes: mucho JSX y CSS custom
<div className="custom-card">
  <div className="custom-header">...</div>
</div>

// Ahora: componentes limpios
<Card>
  <CardHeader>...</CardHeader>
  <CardBody>...</CardBody>
</Card>
```

## 🎯 Cómo usar

### Cambiar colores globalmente
Edita `styles/variables.css`:
```css
:root {
  --primary-color: #667eea;  /* Cambia esto y afecta TODO */
}
```

### Agregar nuevos estilos
1. Si es global → `styles/utilities.css`
2. Si es de un componente específico → archivo correspondiente en `styles/`

### Crear componente nuevo
```jsx
import Layout from '../Layout/Layout';
import { Card, Alert, Button } from '../Common';

const MiComponente = () => {
  return (
    <Layout>
      <div className="mi-componente">
        <Card>
          <Alert type="success">¡Éxito!</Alert>
          <Button variant="primary">Guardar</Button>
        </Card>
      </div>
    </Layout>
  );
};
```

## 📊 Resultado

- ❌ **Antes:** 10+ archivos CSS dispersos en componentes
- ✅ **Ahora:** 10 archivos CSS organizados en `styles/`

- ❌ **Antes:** Código duplicado, difícil de mantener
- ✅ **Ahora:** Variables y clases reutilizables, fácil de mantener

- ❌ **Antes:** Componentes mezclados con estilos
- ✅ **Ahora:** Componentes limpios + estilos centralizados
