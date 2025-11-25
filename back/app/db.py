from dotenv import load_dotenv
from pathlib import Path
from pymysql.err import MySQLError
from urllib.parse import urlparse
from dbutils.pooled_db import PooledDB
import os
import pymysql

class DatabaseError(Exception):
    pass


_pool = None
_url = None

def get_connection():
    global _pool
    global _url

    if _pool is not None:
        return _pool.connection()

    if _url is None:
        raw_url = os.getenv("DATABASE_URL")
        if not raw_url:
            raise DatabaseError(
                """La variable de entorno DATABASE_URL no está definida.
                Verificá el archivo .env en la carpeta 'back'."""
            )

        url = urlparse(raw_url)
        _url = url

    url = _url

    assert url.hostname is not None and not isinstance(url.hostname, bytes)
    assert url.username is not None and not isinstance(url.username, bytes)
    assert not isinstance(url.path, bytes)

    try:
        print('Abriendo una conexión nueva con MySQL...')
        _pool = PooledDB(
            creator=pymysql,
            maxconnections=10,
            blocking=True,             # wait if pool full
            ping=1,                    # check connection health
            host=url.hostname,
            user=url.username,
            password=url.password or "",
            database=url.path.lstrip("/"),
            port=url.port or 3306,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False,
        )
        print("Conexión a MySQL OK")

        return _pool.connection()
    except MySQLError as e:
        raise DatabaseError(f"Error conectando a la base de datos: {e}") from e


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
