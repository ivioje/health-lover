'use client';

import { useSearchParams as useNextSearchParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * A custom hook that safely wraps Next.js's useSearchParams hook with additional functionality
 * This makes it easy to use search parameters throughout the application
 * @returns The search params object with utility methods
 */
export function useSearchParams() {
  const searchParams = useNextSearchParams();
  
  // Use useMemo to avoid unnecessary re-renders and ensure stable references
  return useMemo(() => {
    // Handle the case when searchParams is null or undefined (SSR)
    if (!searchParams) {
      // Return a fallback implementation for SSR scenarios
      return {
        get: () => null,
        getAll: () => [],
        getNumber: (_: string, defaultValue?: number) => defaultValue,
        getBoolean: (_: string, defaultValue?: boolean) => defaultValue,
        raw: null
      };
    }
    
    // Return the original search params object with additional utilities
    return {
      // Pass through the original get method
      get: (key: string) => searchParams.get(key),
      
      // Get all values for a key (useful for multi-select parameters)
      getAll: (key: string) => searchParams.getAll(key),
      
      // Helper to get a parameter as a number
      getNumber: (key: string, defaultValue?: number) => {
        const value = searchParams.get(key);
        if (value === null) return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
      },
      
      // Helper to get a boolean parameter
      getBoolean: (key: string, defaultValue?: boolean) => {
        const value = searchParams.get(key);
        if (value === null) return defaultValue;
        return value === 'true' || value === '1' || value === 'yes';
      },
      
      // Access to the original object
      raw: searchParams
    };
  }, [searchParams]);
}