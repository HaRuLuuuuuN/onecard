'use client';

import { useEffect, useState } from 'react';
import { TierData, defaultTierData } from '@/data/meta';

const STORAGE_KEY = 'onecard-tier-data-v1';

export function useTierStore() {
  const [data, setData] = useState<TierData>(defaultTierData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // corrupted data, use default
      }
    }
    setLoaded(true);
  }, []);

  const save = (newData: TierData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    setData(newData);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultTierData);
  };

  return { data, save, reset, loaded };
}
