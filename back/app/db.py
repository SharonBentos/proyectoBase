import pymysql
import os
from urllib.parse import urlparse

_conn = None
_url = None

def conn():
    global _conn
    global _url
    _url = urlparse(os.getenv("DATABASE_URL"))

    if _conn is None or not _conn.open:
        assert _url.hostname is not None and not isinstance(_url.hostname, bytes)
        assert _url.username is not None and not isinstance(_url.username, bytes)
        assert _url.password is not None
        assert not isinstance(_url.path, bytes)

        _conn = pymysql.connect(
            host=_url.hostname,
            user=_url.username,
            password=_url.password,
            database=_url.path.lstrip("/"),
            port=_url.port or 3306,
        )
    return _conn
