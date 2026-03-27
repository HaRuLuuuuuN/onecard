'use client';

import { useEffect, useState } from 'react';

export type DeckColor = '赤' | '青' | '緑' | '黄' | '紫' | '黒';

export interface DeckCardEntry {
  id: string;
  cardName: string;
  cardId?: string;
  imageUrl?: string;
  cost?: number;
  power?: number;
  type: 'キャラクター' | 'イベント' | 'ステージ';
  count: number;
}

export interface ManagedDeck {
  id: string;
  name: string;
  leaderName: string;
  leaderImageUrl?: string;
  bannerImageUrl?: string;
  colors: DeckColor[];
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  likes: number;
  cards: DeckCardEntry[];
}

const defaultDecks: ManagedDeck[] = [
  {
    id: 'deck-001',
    name: '赤ルフィ 速攻型',
    leaderName: 'モンキー・D・ルフィ',
    colors: ['赤'],
    description: '速攻キャラを多数採用した攻撃的なデッキ。リーダー効果でコスト5以下のキャラに速攻を付与し、一気に攻め込む。',
    author: 'OneCardAdmin',
    createdAt: '2024-12-01',
    tags: ['速攻', '赤', '初心者向け', '環境デッキ'],
    likes: 342,
    cards: [],
  },
  {
    id: 'deck-002',
    name: '青ロー バウンス型',
    leaderName: 'トラファルガー・ロー',
    colors: ['青'],
    description: '相手のキャラをバウンスしながら展開を制御するコントロールデッキ。',
    author: 'Tactician_Blue',
    createdAt: '2024-12-05',
    tags: ['コントロール', '青', '上級者向け'],
    likes: 218,
    cards: [],
  },
  {
    id: 'deck-003',
    name: '紫白ひげ 展開型',
    leaderName: 'エドワード・ニューゲート',
    colors: ['紫'],
    description: 'リーダー効果でDON!!を戻してキャラを展開するアグロデッキ。白ひげ海賊団のシナジーを活かして戦う。',
    author: 'NewgateStrong',
    createdAt: '2024-12-10',
    tags: ['アグロ', '紫', '中級者向け', '環境デッキ'],
    likes: 189,
    cards: [],
  },
];

const STORAGE_KEY = 'onecard-decks-v2';

export function useDecksStore() {
  const [decks, setDecks] = useState<ManagedDeck[]>(defaultDecks);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDecks(JSON.parse(stored));
      } catch {
        // corrupted, use default
      }
    }
    setLoaded(true);
  }, []);

  const save = (next: ManagedDeck[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDecks(next);
  };

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDecks(defaultDecks);
  };

  return { decks, save, reset, loaded };
}
