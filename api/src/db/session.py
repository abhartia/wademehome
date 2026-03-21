from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from core.config import Config


def get_engine():
    database_url = Config.get("DATABASE_URL", "")
    if not database_url:
        raise ValueError("DATABASE_URL is not configured")
    return create_engine(database_url, future=True)


def get_session_local() -> sessionmaker[Session]:
    return sessionmaker(
        bind=get_engine(),
        autocommit=False,
        autoflush=False,
        class_=Session,
        expire_on_commit=False,
    )
