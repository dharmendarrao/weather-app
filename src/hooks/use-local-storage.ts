// src/hooks/use-local-storage.ts
"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // This effect runs only on the client, after initial hydration
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      } else {
        // If no item in localStorage, and initialValue is not null/undefined,
        // we could optionally set it in localStorage here.
        // For this app, we'll just use the initialValue in state.
        // If initialValue itself needs to be persisted if not found, uncomment below:
        // window.localStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // initialValue removed from deps to prevent re-setting if initialValue object reference changes but key content is same

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn(`Tried to set localStorage key "${key}" on the server.`);
        setStoredValue(prev => (value instanceof Function ? value(prev) : value));
        return;
      }
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const clearValue = useCallback(() => {
    if (typeof window === 'undefined') {
      console.warn(`Tried to clear localStorage key "${key}" on the server.`);
      setStoredValue(initialValue);
      return;
    }
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue); // Reset state to initial value
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}

export default useLocalStorage;
