import { useState, useEffect } from 'react';

export function useStoredPage(key: string, initialValue: number) {
  const [page, setPage] = useState<number>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(page));
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  }, [key, page]);

  return [page, setPage] as const;
}
