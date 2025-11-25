# Obligatorio Bases de Datos I 2025

## Información general

Este proyecto es una implementación del sistema de gestión de salas de estudios
descrito.

Consiste de un frontend, un backend, y una base de datos, que funcionan para
implementar el sistema de gestión.

El proyecto, cuando es corrido como es descrito abajo, para propósito de probar
la aplicación precarga la base de datos con datos de prueba.

Los dos usuarios para probar la aplicación que se pueden usar son:
- Ana: email: ana@uni.edu, pass: p1
- Admin: email: admin@uni.edu, pass: admin123

El usuario de Ana cuenta con varias reservas de prueba que uno puede
inspeccionar. Si se requiere probar otros usuarios, uno puede revisar en [este
archivo](./db/02_insert_data.sql) los usuarios de prueba creados.

## Correr el proyecto

El proyecto consiste de tres servicios distintos intercomunicados:

- Backend (Python)
- Frontend (JavaScript)
- DB (MySQL)

Para el correcto funcionamiento de los tres, deben estar corriendo todos
simultaneamente.

### Corriendo con docker

Con `docker` y `docker-compose` instalados, se puede correr el siguiente
comando para iniciar el proyecto.

```bash
docker compose up --detach --build
```

Este comando levantará 3 contenedores, uno para cada servicio del proyecto, y
automáticamente estarán configurados para conectarse. Para acceder al frontend,
el mismo está expuesto en el puerto `3000` de `localhost` automáticamente.

Para apagar los 3 servidores, simplemente:

```bash
docker compose down
```

En caso de que se cambie algún archivo del código, es necesario correr el comando
de inicialización de la siguiente manera

```bash
docker compose up --detach --build
```

Cada vez que se realice un cambio se debe recorrer este comando.

> [!WARNING]
> Debido a esto, utilizar esta método no es recomendado para desarrollar el
> proyecto, ya que no provee recarga automática del código. Sin embargo, es la
> manera más fácil de correr el proyecto para probarlo.

### Desarrollo local

#### Comandos rápidos para desarrollo local (Windows PowerShell)

```powershell
# En ./db
# Para bajar el servicio de base de datos
docker compose down
# Para empezar la base de datos (borra y recrea los datos de la base)
docker compose up -d

# En ./front
# Para instalar las dependencias del proyecto
npm install
# Para levantar el proyecto (puerto 5173)
npm run dev

# En ./back, depende de la base de datos prendida para correr, y se debe crear
# el archivo .env o inicializar la variable de entorno DATABASE_URL
# correctamente.
# Levantar el proyecto (autorecarga si un archivo cambia) (puero 8000)
uv run fastapi dev
```

> **Nota:** La base de datos se recrea desde cero cada vez que ejecutas
> `docker-compose up -d`. Esto ejecuta los scripts:
> - `00_init.sql` - DROP y CREATE de la base de datos
> - `01_create_tables.sql` - Creación de todas las tablas
> - `02_insert_data.sql` - Inserción de datos de prueba

**Puertos:**
- Base de datos: `3307`
- Frontend: `5173`
- Backend: `8000`

#### Python
El proyecto de Python está creado con [uv](https://docs.astral.sh/uv/).
Consultar el link para una guía general de utilización.

Antes de cualquier paso, se debe entrar al directorio `back`.

Para este proyecto, se debe correr el comando `fastapi dev` para desarrollo
local, esto se puede lograr haciendo:

```bash
uv run fastapi dev
```

Este comando levantará el servidor en el puerto `8000` por defecto y
automáticamente recargará el proyecto si algún archivo es cambiado.

Si no se quiere usar `uv` al correr el comando, se puede correr:

```bash
uv sync --locked
```

Luego, [entrar al entorno
virtual](https://docs.python.org/3/library/venv.html#how-venvs-work) creado en
`.venv` y simplemente correr:

```bash
fastapi dev
```

#### Base de datos

En la carpeta `db` hay un archivo `compose.yml` que permite levantar la base de
datos. La misma escuchará en el puerto `3306` y la contraseña está escrita en
el archivo.

#### Frontend

El proyecto de frontend está creado con React + Vite.

Antes de cualquier paso, se debe entrar al directorio `front` e instalar las
dependencias:

```bash
npm install
```

Para desarrollo local, se debe correr:

```bash
npm run dev
```

Este comando levantará el servidor en el puerto `5173` por defecto y
automáticamente recargará el proyecto si algún archivo es cambiado.
