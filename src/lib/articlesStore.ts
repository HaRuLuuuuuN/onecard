'use client';

import { useEffect, useState } from 'react';
import { Article, articles as defaultArticles } from '@/data/meta';

const STORAGE_KEY = 'onecard-articles-v1';

export function useArticlesStore() {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setArticles(JSON.parse(stored));
      } catch {
        // corrupted, use default
      }
    }
    setLoaded(true);
  }, []);

  const save = (next: Article[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setArticles(next);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setArticles(defaultArticles);
  };

  return { articles, save, reset, loaded };
}
