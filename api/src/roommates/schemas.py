from __future__ import annotations

from pydantic import BaseModel, Field


class RoommateProfilePayload(BaseModel):
    id: str
    name: str = ""
    age: int = 0
    occupation: str = ""
    bio: str = ""
    avatar_initials: str = ""
    sleep_schedule: str = ""
    cleanliness_level: str = ""
    noise_level: str = ""
    guest_policy: str = ""
    smoking: str = ""
    languages_spoken: list[str] = Field(default_factory=list)
    target_city: str = ""
    max_budget: str = ""
    move_timeline: str = ""
    bedrooms_wanted: str = ""
    has_pets: bool = False
    pet_details: str = ""
    interests: list[str] = Field(default_factory=list)
    university: str | None = None
    compatibility_score: int | None = None
    compatibility_reasons: list[str] = Field(default_factory=list)


class MyRoommateProfileOut(BaseModel):
    name: str = ""
    age: int = 0
    occupation: str = ""
    sleep_schedule: str = ""
    cleanliness_level: str = ""
    noise_level: str = ""
    guest_policy: str = ""
    smoking: str = ""
    languages_spoken: list[str] = Field(default_factory=list)
    preferred_languages: list[str] = Field(default_factory=list)
    must_have_preferred_languages: bool = False
    interests: list[str] = Field(default_factory=list)
    bio: str = ""
    profile_completed: bool = False


class MyRoommateProfilePatch(BaseModel):
    name: str | None = None
    age: int | None = None
    occupation: str | None = None
    sleep_schedule: str | None = None
    cleanliness_level: str | None = None
    noise_level: str | None = None
    guest_policy: str | None = None
    smoking: str | None = None
    languages_spoken: list[str] | None = None
    preferred_languages: list[str] | None = None
    must_have_preferred_languages: bool | None = None
    interests: list[str] | None = None
    bio: str | None = None
    profile_completed: bool | None = None


class RoommateMessagePayload(BaseModel):
    role: str
    content: str
    time: str = ""


class RoommateConnectionOut(BaseModel):
    id: str
    roommate: RoommateProfilePayload
    connected_at: str = ""
    messages: list[RoommateMessagePayload] = Field(default_factory=list)


class RoommateConnectionCreate(BaseModel):
    roommate: RoommateProfilePayload


class RoommateConnectionListResponse(BaseModel):
    connections: list[RoommateConnectionOut] = Field(default_factory=list)


class RoommateMatchesListResponse(BaseModel):
    matches: list[RoommateProfilePayload] = Field(default_factory=list)

