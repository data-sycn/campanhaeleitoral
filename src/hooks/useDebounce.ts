import { useState, useEffect } from "react";

/**
 * Debounces a value by `delay` ms.
 * Usage: const debouncedSearch = useDebounce(searchTerm, 400);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
