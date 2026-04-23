# Import models so metadata is registered for Alembic.
from db import models as _models  # noqa: F401
from db.base import Base

__all__ = ["Base"]
