from sqlalchemy.orm import Session, sessionmaker

from core.config import Config
from db.engine import make_engine

_engine = None
_session_factory: sessionmaker[Session] | None = None


def get_engine():
    """Create engine on first use so missing DATABASE_URL does not crash import (Azure warmup)."""
    global _engine
    if _engine is None:
        database_url = (Config.get("DATABASE_URL") or "").strip()
        if not database_url:
            raise ValueError("DATABASE_URL is not configured")
        _engine = make_engine(database_url)
    return _engine


def get_session_local() -> sessionmaker[Session]:
    global _session_factory
    if _session_factory is None:
        _session_factory = sessionmaker(
            bind=get_engine(),
            autocommit=False,
            autoflush=False,
            class_=Session,
            expire_on_commit=False,
        )
    return _session_factory
