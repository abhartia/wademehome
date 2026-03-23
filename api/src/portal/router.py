from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from portal.schemas import (
    MoveInStatePayload,
    ProfileOut,
    ProfilePatch,
    RoommateStatePayload,
    ToursStatePayload,
)
from portal.lease_routes import router as lease_router
from portal.service import (
    get_movein_state,
    get_profile,
    get_roommate_state,
    get_tours_state,
    patch_profile,
    replace_movein,
    replace_roommates,
    replace_tours,
)

router = APIRouter(prefix="/portal", tags=["portal"])
router.include_router(lease_router)


@router.get("/profile", response_model=ProfileOut)
def read_profile(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    out = get_profile(db, user.id)
    if not out:
        # Match PATCH behaviour (creates row on first write). Avoid 404 so the client can
        # load server state before any debounced sync — otherwise a default profile PATCH
        # can clear onboarding_completed in the database.
        return ProfileOut()
    return out


@router.patch("/profile", response_model=ProfileOut)
def update_profile(
    body: ProfilePatch,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return patch_profile(db, user.id, body)


@router.get("/tours")
def read_tours(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_tours_state(db, user.id)


@router.put("/tours")
def sync_tours(
    body: ToursStatePayload,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    replace_tours(db, user.id, body)
    return get_tours_state(db, user.id)


@router.get("/move-in")
def read_move_in(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_movein_state(db, user.id)


@router.put("/move-in")
def sync_move_in(
    body: MoveInStatePayload,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    replace_movein(db, user.id, body)
    return get_movein_state(db, user.id)


@router.get("/roommates")
def read_roommates(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_roommate_state(db, user.id)


@router.put("/roommates")
def sync_roommates(
    body: RoommateStatePayload,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    replace_roommates(db, user.id, body)
    return get_roommate_state(db, user.id)
