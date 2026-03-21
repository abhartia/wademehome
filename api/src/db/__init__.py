from db.base import Base

# Import models so metadata is registered for Alembic.
from db import models as _models  # noqa: F401

__all__ = ["Base"]
