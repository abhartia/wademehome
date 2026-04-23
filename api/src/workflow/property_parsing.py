import json
from typing import Any

from pydantic import ValidationError

from workflow.events import PropertyDataList


def parse_property_data_list_from_llm_content(content: Any) -> PropertyDataList:
    """
    Parse structured listing output from LlamaIndex (string JSON, dict, or empty).

    Never raises: returns PropertyDataList(properties=[]) on failure.
    """
    if content is None:
        return PropertyDataList(properties=[])
    if isinstance(content, dict):
        try:
            return PropertyDataList.model_validate(content)
        except ValidationError:
            return PropertyDataList(properties=[])
    if isinstance(content, str):
        try:
            return parse_property_data_list_from_json(content)
        except (json.JSONDecodeError, ValidationError):
            return PropertyDataList(properties=[])
    try:
        return parse_property_data_list_from_json(str(content))
    except (json.JSONDecodeError, ValidationError):
        return PropertyDataList(properties=[])


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
