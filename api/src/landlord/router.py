from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth.router import get_current_user, get_db
from db.models import Users
from landlord.schemas import (
    LandlordApplicationCreate,
    LandlordApplicationDocumentCreate,
    LandlordApplicationDocumentsResponse,
    LandlordApplicationsResponse,
    LandlordApplicationUpdate,
    LandlordLeadCreate,
    LandlordLeadsResponse,
    LandlordLeadUpdate,
    LandlordLeaseOfferAction,
    LandlordLeaseOfferCreate,
    LandlordLeaseOffersResponse,
    LandlordLeaseSignatureCreate,
    LandlordLeaseSignaturesResponse,
    LandlordLeaseSignatureUpdate,
    LandlordMediaCreate,
    LandlordMediaResponse,
    LandlordMediaUpdate,
    LandlordProfileResponse,
    LandlordProfileUpdate,
    LandlordPropertiesResponse,
    LandlordPropertyCreate,
    LandlordPropertyResponse,
    LandlordPropertyUpdate,
    LandlordTourBookingCreate,
    LandlordTourBookingsResponse,
    LandlordTourBookingUpdate,
    LandlordTourSlotCreate,
    LandlordTourSlotsResponse,
    LandlordTourSlotUpdate,
    LandlordUnitCreate,
    LandlordUnitsResponse,
    LandlordUnitUpdate,
)
from landlord.service import (
    apply_lease_offer_action,
    create_application,
    create_application_document,
    create_lead,
    create_lease_offer,
    create_lease_signature,
    create_media,
    create_property,
    create_tour_booking,
    create_tour_slot,
    create_unit,
    delete_media,
    delete_property,
    delete_tour_slot,
    delete_unit,
    get_landlord_profile,
    get_property,
    list_application_documents,
    list_applications,
    list_leads,
    list_lease_offers,
    list_lease_signatures,
    list_media,
    list_properties,
    list_tour_bookings,
    list_tour_slots,
    list_units,
    set_property_publish_state,
    update_application,
    update_landlord_profile,
    update_lead,
    update_lease_signature,
    update_media,
    update_property,
    update_tour_booking,
    update_tour_slot,
    update_unit,
)

router = APIRouter(prefix="/landlord", tags=["landlord"])


@router.get("/profile", response_model=LandlordProfileResponse)
def read_profile(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordProfileResponse(profile=get_landlord_profile(db, user))


@router.patch("/profile", response_model=LandlordProfileResponse)
def patch_profile(
    payload: LandlordProfileUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordProfileResponse(profile=update_landlord_profile(db, user, payload))


@router.get("/properties", response_model=LandlordPropertiesResponse)
def read_properties(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordPropertiesResponse(properties=list_properties(db, user))


@router.post("/properties", response_model=LandlordPropertyResponse)
def create_property_route(
    payload: LandlordPropertyCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordPropertyResponse(property=create_property(db, user, payload))


@router.get("/properties/{property_id}", response_model=LandlordPropertyResponse)
def read_property(property_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordPropertyResponse(property=get_property(db, user, property_id))


@router.patch("/properties/{property_id}", response_model=LandlordPropertyResponse)
def patch_property(
    property_id: str,
    payload: LandlordPropertyUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordPropertyResponse(property=update_property(db, user, property_id, payload))


@router.delete("/properties/{property_id}", status_code=204)
def remove_property(property_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_property(db, user, property_id)
    return None


@router.post("/properties/{property_id}/publish", response_model=LandlordPropertyResponse)
def publish_property(property_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordPropertyResponse(property=set_property_publish_state(db, user, property_id, publish=True))


@router.post("/properties/{property_id}/unpublish", response_model=LandlordPropertyResponse)
def unpublish_property(property_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordPropertyResponse(property=set_property_publish_state(db, user, property_id, publish=False))


@router.get("/properties/{property_id}/media", response_model=LandlordMediaResponse)
def read_media(property_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordMediaResponse(media=list_media(db, user, property_id))


@router.post("/properties/{property_id}/media", response_model=LandlordMediaResponse)
def create_media_route(
    property_id: str,
    payload: LandlordMediaCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordMediaResponse(media=create_media(db, user, property_id, payload))


@router.patch("/properties/{property_id}/media/{media_id}", response_model=LandlordMediaResponse)
def patch_media(
    property_id: str,
    media_id: str,
    payload: LandlordMediaUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordMediaResponse(media=update_media(db, user, property_id, media_id, payload))


@router.delete("/properties/{property_id}/media/{media_id}", response_model=LandlordMediaResponse)
def remove_media(
    property_id: str, media_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return LandlordMediaResponse(media=delete_media(db, user, property_id, media_id))


@router.get("/properties/{property_id}/units", response_model=LandlordUnitsResponse)
def read_units(property_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordUnitsResponse(units=list_units(db, user, property_id))


@router.post("/properties/{property_id}/units", response_model=LandlordUnitsResponse)
def create_unit_route(
    property_id: str,
    payload: LandlordUnitCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordUnitsResponse(units=create_unit(db, user, property_id, payload))


@router.patch("/properties/{property_id}/units/{unit_id}", response_model=LandlordUnitsResponse)
def patch_unit(
    property_id: str,
    unit_id: str,
    payload: LandlordUnitUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordUnitsResponse(units=update_unit(db, user, property_id, unit_id, payload))


@router.delete("/properties/{property_id}/units/{unit_id}", response_model=LandlordUnitsResponse)
def remove_unit(property_id: str, unit_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordUnitsResponse(units=delete_unit(db, user, property_id, unit_id))


@router.get("/leads", response_model=LandlordLeadsResponse)
def read_leads(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordLeadsResponse(leads=list_leads(db, user))


@router.post("/leads", response_model=LandlordLeadsResponse)
def create_lead_route(
    payload: LandlordLeadCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    create_lead(db, user, payload)
    return LandlordLeadsResponse(leads=list_leads(db, user))


@router.patch("/leads/{lead_id}", response_model=LandlordLeadsResponse)
def patch_lead(
    lead_id: str,
    payload: LandlordLeadUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    update_lead(db, user, lead_id, payload)
    return LandlordLeadsResponse(leads=list_leads(db, user))


@router.get("/tours/slots", response_model=LandlordTourSlotsResponse)
def read_tour_slots(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordTourSlotsResponse(slots=list_tour_slots(db, user))


@router.post("/tours/slots", response_model=LandlordTourSlotsResponse)
def create_tour_slot_route(
    payload: LandlordTourSlotCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    return LandlordTourSlotsResponse(slots=create_tour_slot(db, user, payload))


@router.patch("/tours/slots/{slot_id}", response_model=LandlordTourSlotsResponse)
def patch_tour_slot(
    slot_id: str,
    payload: LandlordTourSlotUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordTourSlotsResponse(slots=update_tour_slot(db, user, slot_id, payload))


@router.delete("/tours/slots/{slot_id}", response_model=LandlordTourSlotsResponse)
def remove_tour_slot(slot_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordTourSlotsResponse(slots=delete_tour_slot(db, user, slot_id))


@router.get("/tours/bookings", response_model=LandlordTourBookingsResponse)
def read_tour_bookings(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordTourBookingsResponse(bookings=list_tour_bookings(db, user))


@router.post("/tours/bookings", response_model=LandlordTourBookingsResponse)
def create_tour_booking_route(
    payload: LandlordTourBookingCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    create_tour_booking(db, user, payload)
    return LandlordTourBookingsResponse(bookings=list_tour_bookings(db, user))


@router.patch("/tours/bookings/{booking_id}", response_model=LandlordTourBookingsResponse)
def patch_tour_booking(
    booking_id: str,
    payload: LandlordTourBookingUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    update_tour_booking(db, user, booking_id, payload)
    return LandlordTourBookingsResponse(bookings=list_tour_bookings(db, user))


@router.get("/applications", response_model=LandlordApplicationsResponse)
def read_applications(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordApplicationsResponse(applications=list_applications(db, user))


@router.post("/applications", response_model=LandlordApplicationsResponse)
def create_application_route(
    payload: LandlordApplicationCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    create_application(db, user, payload)
    return LandlordApplicationsResponse(applications=list_applications(db, user))


@router.patch("/applications/{application_id}", response_model=LandlordApplicationsResponse)
def patch_application(
    application_id: str,
    payload: LandlordApplicationUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    update_application(db, user, application_id, payload)
    return LandlordApplicationsResponse(applications=list_applications(db, user))


@router.get("/applications/{application_id}/documents", response_model=LandlordApplicationDocumentsResponse)
def read_application_documents(
    application_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    rows = list_application_documents(db, user, application_id)
    return LandlordApplicationDocumentsResponse(
        documents=[
            {
                "id": str(row.id),
                "application_id": str(row.application_id),
                "file_name": row.file_name,
                "file_url": row.file_url,
                "file_type": row.file_type,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
    )


@router.post("/applications/{application_id}/documents", response_model=LandlordApplicationDocumentsResponse)
def create_application_document_route(
    application_id: str,
    payload: LandlordApplicationDocumentCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = create_application_document(db, user, application_id, payload)
    return LandlordApplicationDocumentsResponse(
        documents=[
            {
                "id": str(row.id),
                "application_id": str(row.application_id),
                "file_name": row.file_name,
                "file_url": row.file_url,
                "file_type": row.file_type,
                "created_at": row.created_at.isoformat(),
            }
            for row in rows
        ]
    )


@router.get("/lease-offers", response_model=LandlordLeaseOffersResponse)
def read_lease_offers(user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordLeaseOffersResponse(lease_offers=list_lease_offers(db, user))


@router.post("/lease-offers", response_model=LandlordLeaseOffersResponse)
def create_lease_offer_route(
    payload: LandlordLeaseOfferCreate, user: Users = Depends(get_current_user), db: Session = Depends(get_db)
):
    create_lease_offer(db, user, payload)
    return LandlordLeaseOffersResponse(lease_offers=list_lease_offers(db, user))


@router.patch("/lease-offers/{lease_offer_id}", response_model=LandlordLeaseOffersResponse)
def patch_lease_offer_action(
    lease_offer_id: str,
    payload: LandlordLeaseOfferAction,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    apply_lease_offer_action(db, user, lease_offer_id, payload.action)
    return LandlordLeaseOffersResponse(lease_offers=list_lease_offers(db, user))


@router.get("/lease-offers/{lease_offer_id}/signatures", response_model=LandlordLeaseSignaturesResponse)
def read_lease_signatures(lease_offer_id: str, user: Users = Depends(get_current_user), db: Session = Depends(get_db)):
    return LandlordLeaseSignaturesResponse(signatures=list_lease_signatures(db, user, lease_offer_id))


@router.post("/lease-offers/{lease_offer_id}/signatures", response_model=LandlordLeaseSignaturesResponse)
def create_lease_signature_route(
    lease_offer_id: str,
    payload: LandlordLeaseSignatureCreate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return LandlordLeaseSignaturesResponse(signatures=create_lease_signature(db, user, lease_offer_id, payload))


@router.patch("/lease-signatures/{signature_id}", response_model=LandlordLeaseSignaturesResponse)
def patch_lease_signature(
    signature_id: str,
    payload: LandlordLeaseSignatureUpdate,
    user: Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.status is None:
        return LandlordLeaseSignaturesResponse(signatures=[])
    updated = update_lease_signature(db, user, signature_id, payload.status)
    return LandlordLeaseSignaturesResponse(signatures=[updated])
