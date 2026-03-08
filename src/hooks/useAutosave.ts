import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';

export function useAutosave<T>(
  data: T,
  saveFunction: (data: T) => void,
  delay = 3000
) {
  const prevData = useRef(data);

  const debouncedSave = useRef(
    debounce((newData: T) => {
      saveFunction(newData);
    }, delay)
  ).current;

  useEffect(() => {
    if (JSON.stringify(prevData.current) !== JSON.stringify(data)) {
      debouncedSave(data);
      prevData.current = data;
    }
    return () => debouncedSave.cancel();
  }, [data, debouncedSave]);
}
