import { useEffect, useState } from "react";

/**
 * Returns `value` only after it has stayed unchanged for `delayMs` (trailing debounce).
 * Use for search-as-you-type so work runs after the user pauses, not on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
