Extract only durable renter preference facts that should be saved in a profile memory bank.

Return strict JSON matching the schema below. If nothing reliable is present, return empty values.

Rules:
- Use recent conversation context, but prioritize the latest user message.
- Save only these fields:
  - preferredCities (array of city names)
  - maxMonthlyRent (string as user phrased it)
  - bedroomsNeeded (string as user phrased it, e.g. "2 bedrooms")
  - dealbreakers (array)
  - neighbourhoodPriorities (array)
  - moveTimeline (string)
- Do not infer sensitive/private traits.
- Do not invent missing values.
- `updated_fields` must list only keys you are actually setting in this response.

Schema:
{
  "preferredCities": string[],
  "maxMonthlyRent": string | null,
  "bedroomsNeeded": string | null,
  "dealbreakers": string[],
  "neighbourhoodPriorities": string[],
  "moveTimeline": string | null,
  "updated_fields": string[]
}
