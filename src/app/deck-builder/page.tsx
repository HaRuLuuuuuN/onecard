'use client';

import { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, Download, Info } from 'lucide-react';
import { cards } from '@/data/cards';
import { Card, DeckCard } from '@/types/card';
import { ColorBadge, TypeBadge } from '@/components/CardBadge';
import clsx from 'clsx';

const MAX_DECK_SIZE = 50;
const MAX_COPIES = 4;

export default function DeckBuilderPage() {
  const [leader, setLeader] = useState<Card | null>(null);
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [query, setQuery] = useState('');
  const [deckName, setDeckName] = useState('マイデッキ');

  const leaders = useMemo(() => cards.filter((c) => c.type === 'Leader'), []);
  const nonLeaders = useMemo(() => cards.filter((c) => c.type !== 'Leader'), []);

  const filteredCards = useMemo(() => {
    if (!query) return nonLeaders;
    const q = query.toLowerCase();
    return nonLeaders.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameJa.includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }, [nonLeaders, query]);

  const totalCards = deckCards.reduce((s, dc) => s + dc.count, 0);

  const addCard = (card: Card) => {
    if (totalCards >= MAX_DECK_SIZE) return;
    setDeckCards((prev) => {
      const existing = prev.find((dc) => dc.card.id === card.id);
      if (existing) {
        if (existing.count >= MAX_COPIES) return prev;
        return prev.map((dc) =>
          dc.card.id === card.id ? { ...dc, count: dc.count + 1 } : dc
        );
      }
      return [...prev, { card, count: 1 }];
    });
  };

  const removeCard = (cardId: string) => {
    setDeckCards((prev) => {
      const existing = prev.find((dc) => dc.card.id === cardId);
      if (!existing) return prev;
      if (existing.count <= 1) return prev.filter((dc) => dc.card.id !== cardId);
      return prev.map((dc) =>
        dc.card.id === cardId ? { ...dc, count: dc.count - 1 } : dc
      );
    });
  };

  const deleteCard = (cardId: string) => {
    setDeckCards((prev) => prev.filter((dc) => dc.card.id !== cardId));
  };

  const getCount = (cardId: string) =>
    deckCards.find((dc) => dc.card.id === cardId)?.count ?? 0;

  const colorCounts = deckCards.reduce<Record<string, number>>((acc, dc) => {
    dc.card.color.forEach((c) => {
      acc[c] = (acc[c] ?? 0) + dc.count;
    });
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">デッキビルダー</h1>
        <p className="text-gray-400 mt-1">リーダーを選んでデッキを組もう</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Card search */}
        <div className="lg:col-span-3 space-y-4">
          {/* Leader selection */}
          {!leader && (
            <div className="bg-gray-900 border border-yellow-600/30 rounded-xl p-4">
              <p className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                まずリーダーカードを選んでください
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {leaders.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLeader(l)}
                    className="bg-gray-800 border border-gray-700 hover:border-yellow-600/50 hover:bg-gray-750 rounded-lg p-3 text-left transition-all"
                  >
                    <div className="flex gap-1 mb-1">
                      {l.color.map((c) => (
                        <ColorBadge key={c} color={c} />
                      ))}
                    </div>
                    <p className="text-white text-sm font-bold leading-tight">{l.nameJa}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{l.id}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {leader && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-gray-800 rounded-lg w-16 h-20 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-lg font-black">{leader.color[0][0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs mb-1">選択中のリーダー</p>
                <div className="flex gap-1 mb-1">
                  {leader.color.map((c) => (
                    <ColorBadge key={c} color={c} />
                  ))}
                </div>
                <p className="text-white font-bold">{leader.nameJa}</p>
                <p className="text-gray-400 text-sm">{leader.id}</p>
              </div>
              <button
                onClick={() => setLeader(null)}
                className="text-gray-500 hover:text-red-400 transition-colors text-sm"
              >
                変更
              </button>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="カードを検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
            />
          </div>

          {/* Card list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCards.map((card) => {
              const count = getCount(card.id);
              return (
                <div
                  key={card.id}
                  className={clsx(
                    'bg-gray-900 border rounded-lg p-3 flex items-center gap-3 transition-colors',
                    count > 0 ? 'border-yellow-600/30' : 'border-gray-800'
                  )}
                >
                  {/* Color indicator */}
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{
                      background:
                        card.color[0] === 'Red'
                          ? '#dc2626'
                          : card.color[0] === 'Blue'
                          ? '#2563eb'
                          : card.color[0] === 'Green'
                          ? '#16a34a'
                          : card.color[0] === 'Yellow'
                          ? '#ca8a04'
                          : card.color[0] === 'Purple'
                          ? '#9333ea'
                          : '#4b5563',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <TypeBadge type={card.type} />
                      {card.cost !== undefined && (
                        <span className="text-yellow-400 text-xs font-bold">{card.cost}コスト</span>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium">{card.nameJa}</p>
                    <p className="text-gray-500 text-xs">{card.id}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {count > 0 && (
                      <>
                        <button
                          onClick={() => removeCard(card.id)}
                          className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-white font-bold text-sm w-5 text-center">{count}</span>
                      </>
                    )}
                    <button
                      onClick={() => addCard(card)}
                      disabled={count >= MAX_COPIES || totalCards >= MAX_DECK_SIZE || !leader}
                      className={clsx(
                        'w-7 h-7 rounded-full flex items-center justify-center transition-colors',
                        count >= MAX_COPIES || totalCards >= MAX_DECK_SIZE || !leader
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-yellow-600 hover:bg-yellow-500 text-black'
                      )}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Deck list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sticky top-20">
            {/* Deck name */}
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-yellow-600 mb-4"
            />

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-400">デッキ枚数</span>
                <span className={totalCards === MAX_DECK_SIZE ? 'text-green-400 font-bold' : 'text-white'}>
                  {totalCards} / {MAX_DECK_SIZE}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all',
                    totalCards === MAX_DECK_SIZE ? 'bg-green-500' : 'bg-yellow-500'
                  )}
                  style={{ width: `${(totalCards / MAX_DECK_SIZE) * 100}%` }}
                />
              </div>
            </div>

            {/* Color breakdown */}
            {Object.keys(colorCounts).length > 0 && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-xs mb-2">色の内訳</p>
                <div className="space-y-1.5">
                  {Object.entries(colorCounts).map(([color, count]) => (
                    <div key={color} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-300 w-14">{color}</span>
                      <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(count / totalCards) * 100}%`,
                            background:
                              color === 'Red'
                                ? '#dc2626'
                                : color === 'Blue'
                                ? '#2563eb'
                                : color === 'Green'
                                ? '#16a34a'
                                : color === 'Yellow'
                                ? '#ca8a04'
                                : color === 'Purple'
                                ? '#9333ea'
                                : '#4b5563',
                          }}
                        />
                      </div>
                      <span className="text-gray-400 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deck card list */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto mb-4">
              {deckCards.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-6">
                  カードを追加してください
                </p>
              ) : (
                deckCards.map((dc) => (
                  <div
                    key={dc.card.id}
                    className="flex items-center gap-2 text-sm py-1.5 px-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-yellow-400 font-bold w-5 text-center">{dc.count}</span>
                    <span className="text-white flex-1 truncate">{dc.card.nameJa}</span>
                    <span className="text-gray-500 text-xs">{dc.card.id}</span>
                    <button
                      onClick={() => deleteCard(dc.card.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Export button */}
            <button
              className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2.5 rounded-lg transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!leader || totalCards === 0}
            >
              <Download className="w-4 h-4" />
              デッキをエクスポート
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
