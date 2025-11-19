# Obligatorio Bases de Datos I 2025

## Correr el proyecto

El proyecto consiste de tres servicios distintos intercomunicados:

- Backend (Python)
- Frontend (JavaScript)
- DB (MySQL)

Para el correcto funcionamiento de los tres, deben estar corriendo todos
simultaneamente.

### Corriendo con docker

> [!WARNING]
> Utilizar esta método no es recomendado para desarrollar el proyecto, ya que
> no provee recarga automática del código. Sin embargo, es la manera más fácil
> de correr el proyecto para probarlo.

Con `docker` y `docker-compose` instalados, se puede correr el siguiente
comando para iniciar el proyecto.

```bash
docker compose up --detach
```

Este comando levantará 3 contenedores, uno para cada servicio del proyecto, y
automáticamente estarán configurados para conectarse. Para acceder al frontend,
el mismo está expuesto en el puerto `8001` automáticamente.

Para bajar los 3 servidores, simplemente:

```bash
docker compose down
```

En caso de que se cambie algún archivo del código, es necesario correr el comando
de inicialización de la siguiente manera

```bash
docker compose up --detach --build
```

Cada vez que se realice un cambio se debe recorrer este comando.

### Desarrollo local

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

Todavía no hay :v
