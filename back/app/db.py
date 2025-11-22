import os
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

# Cargar .env desde la carpeta back
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

import pymysql
from pymysql.err import MySQLError


class DatabaseError(Exception):
    pass


def get_connection():
    """Crea una nueva conexión a la base de datos"""
    raw_url = os.getenv("DATABASE_URL")
    if not raw_url:
        raise DatabaseError(
            "DATABASE_URL no está definida. "
            "Verificá el archivo .env en la carpeta 'back'."
        )

    url = urlparse(raw_url)

    assert url.hostname is not None and not isinstance(url.hostname, bytes)
    assert url.username is not None and not isinstance(url.username, bytes)
    assert not isinstance(url.path, bytes)

    try:
        connection = pymysql.connect(
            host=url.hostname,
            user=url.username,
            password=url.password or "",
            database=url.path.lstrip("/"),
            port=url.port or 3307,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False,
        )
        return connection
    except MySQLError as e:
        raise DatabaseError(f"Error conectando a la base de datos: {e}") from e


def conn():
    """Alias para compatibilidad con código existente"""
    return get_connection()



def query_all(sql: str, params: tuple | dict | None = None):
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cur:
            cur.execute(sql, params or ())
            rows = cur.fetchall()
        return rows
    except MySQLError as e:
        raise DatabaseError(f"Error al ejecutar query_all: {e}") from e
    finally:
        if connection:
            connection.close()


def query_one(sql: str, params: tuple | dict | None = None):
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cur:
            cur.execute(sql, params or ())
            row = cur.fetchone()
        return row
    except MySQLError as e:
        raise DatabaseError(f"Error al ejecutar query_one: {e}") from e
    finally:
        if connection:
            connection.close()


def execute(sql: str, params: tuple | dict | None = None) -> int:
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cur:
            affected = cur.execute(sql, params or ())
        connection.commit()
        return affected
    except MySQLError as e:
        if connection:
            connection.rollback()
        raise DatabaseError(f"Error al ejecutar execute: {e}") from e
    finally:
        if connection:
            connection.close()


def insert_and_get_id(sql: str, params: tuple | dict | None = None) -> int:
    connection = None
    try:
        connection = get_connection()
        with connection.cursor() as cur:
            cur.execute(sql, params or ())
            last_id = cur.lastrowid
        connection.commit()
        return int(last_id)
    except MySQLError as e:
        if connection:
            connection.rollback()
        raise DatabaseError(f"Error al ejecutar insert_and_get_id: {e}") from e
    finally:
        if connection:
            connection.close()
