const STORAGE_KEY = "wademehome_commute_destinations_v1";

export type CommuteDestination = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

function readAll(): CommuteDestination[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (d): d is CommuteDestination =>
        typeof d === "object" &&
        d !== null &&
        typeof (d as CommuteDestination).id === "string" &&
        typeof (d as CommuteDestination).label === "string" &&
        typeof (d as CommuteDestination).latitude === "number" &&
        typeof (d as CommuteDestination).longitude === "number",
    );
  } catch {
    return [];
  }
}

function writeAll(items: CommuteDestination[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function loadCommuteDestinations(): CommuteDestination[] {
  return readAll();
}

export function saveCommuteDestinations(items: CommuteDestination[]) {
  writeAll(items);
}

export function addCommuteDestination(item: CommuteDestination) {
  const cur = readAll();
  writeAll([...cur.filter((x) => x.id !== item.id), item]);
}

export function removeCommuteDestination(id: string) {
  writeAll(readAll().filter((x) => x.id !== id));
}
