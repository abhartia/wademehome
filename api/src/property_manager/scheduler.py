"""In-app scheduler for property-manager weekly report emails.

Uses APScheduler so the Azure-deployed app triggers reports on its own,
removing the need for an external GitHub Actions cron job.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from core.logger import get_logger
from db.session import get_session_local
from property_manager import service as pm_service

logger = get_logger(__name__)

scheduler = AsyncIOScheduler()


def _send_weekly_reports() -> None:
    """Job callback: open a DB session, send reports, then close."""
    logger.info("pm-weekly-report job started")
    db = get_session_local()()
    try:
        sent, failed = pm_service.send_weekly_reports_for_all_active(db)
        logger.info("pm-weekly-report job finished: sent=%s failed=%s", sent, failed)
    except Exception:
        logger.exception("pm-weekly-report job failed")
    finally:
        db.close()


def start_scheduler() -> None:
    """Register the weekly report job and start the scheduler."""
    scheduler.add_job(
        _send_weekly_reports,
        trigger=CronTrigger(day_of_week="mon", hour=14, minute=0, timezone="UTC"),
        id="pm_weekly_report",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("pm-weekly-report scheduler started (Monday 14:00 UTC)")


def shutdown_scheduler() -> None:
    """Gracefully shut down the scheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("pm-weekly-report scheduler shut down")
