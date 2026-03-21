import json
from typing import Any

from pydantic import ValidationError

from workflow.events import PropertyDataList


def parse_property_data_list_from_json(listings_properties_json: str) -> PropertyDataList:
    """
    Parse model JSON emitted by the structured extraction step.

    Raises `json.JSONDecodeError` and/or `pydantic.ValidationError` on invalid input.
    """
    listings_properties_json = (listings_properties_json or "").strip()
    if not listings_properties_json:
        return PropertyDataList(properties=[])

    parsed_data: dict[str, Any] = json.loads(listings_properties_json)
    listings_properties: PropertyDataList = PropertyDataList.model_validate(parsed_data)

    return listings_properties

