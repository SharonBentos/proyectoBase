import pymysql
import os
from urllib.parse import urlparse

_conn = None
url = urlparse(os.getenv("DATABASE_URL"))

def conn():
    global _conn
    if _conn is None or not _conn.open:
        assert url.hostname is not None and not isinstance(url.hostname, bytes)
        assert url.username is not None and not isinstance(url.username, bytes)
        assert url.password is not None
        assert not isinstance(url.path, bytes)

        _conn = pymysql.connect(
            host=url.hostname,
            user=url.username,
            password=url.password,
            database=url.path.lstrip("/"),
            port=url.port or 3306,
        )
    return _conn
