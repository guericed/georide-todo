import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, msDelay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, msDelay);

    return () => clearTimeout(handler);
  }, [value, msDelay]);

  return debouncedValue;
}
