import os
from urllib.parse import urlparse
from dotenv import load_dotenv
load_dotenv()


import pymysql
from pymysql.err import MySQLError

_conn = None


class DatabaseError(Exception):
    pass


def conn():

    global _conn

    if _conn is not None and _conn.open:
        return _conn

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
        _conn = pymysql.connect(
            host=url.hostname,
            user=url.username,
            password=url.password or "",
            database=url.path.lstrip("/"),
            port=url.port or 3306,
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False,
        )
    except MySQLError as e:
        raise DatabaseError(f"Error conectando a la base de datos: {e}") from e

    return _conn



def query_all(sql: str, params: tuple | dict | None = None):

    try:
        cn = conn()
        with cn.cursor() as cur:
            cur.execute(sql, params or ())
            rows = cur.fetchall()
        return rows
    except MySQLError as e:
        raise DatabaseError(f"Error al ejecutar query_all: {e}") from e


def query_one(sql: str, params: tuple | dict | None = None):

    try:
        cn = conn()
        with cn.cursor() as cur:
            cur.execute(sql, params or ())
            row = cur.fetchone()
        return row
    except MySQLError as e:
        raise DatabaseError(f"Error al ejecutar query_one: {e}") from e


def execute(sql: str, params: tuple | dict | None = None) -> int:

    cn = conn()
    try:
        with cn.cursor() as cur:
            affected = cur.execute(sql, params or ())
        cn.commit()
        return affected
    except MySQLError as e:
        cn.rollback()
        raise DatabaseError(f"Error al ejecutar execute: {e}") from e


def insert_and_get_id(sql: str, params: tuple | dict | None = None) -> int:

    cn = conn()
    try:
        with cn.cursor() as cur:
            cur.execute(sql, params or ())
            last_id = cur.lastrowid
        cn.commit()
        return int(last_id)
    except MySQLError as e:
        cn.rollback()
        raise DatabaseError(f"Error al ejecutar insert_and_get_id: {e}") from e
