'use client';

import Link from 'next/link';
import { Heart, Clock, Tag } from 'lucide-react';
import { useDecksStore } from '@/lib/decksStore';

const COLOR_BG: Record<string, string> = {
  赤: '#7f1d1d',
  青: '#1e3a8a',
  緑: '#14532d',
  黄: '#78350f',
  紫: '#581c87',
  黒: '#111827',
};

export default function DecksPage() {
  const { decks, loaded } = useDecksStore();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">デッキ一覧</h1>
        <p className="text-gray-400 mt-1">{decks.length} 件のデッキ</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {decks.map((deck) => {
          const totalCards = deck.cards.reduce((s, c) => s + c.count, 0);
          return (
            <Link key={deck.id} href={`/decks/${deck.id}`}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:shadow-lg hover:shadow-black/50 transition-all h-full flex flex-col">
                {/* Banner */}
                <div
                  className="h-32 relative overflow-hidden flex-shrink-0"
                  style={{
                    background: deck.bannerImageUrl
                      ? undefined
                      : `linear-gradient(135deg, ${COLOR_BG[deck.colors[0]] ?? '#111827'} 0%, #1f2937 100%)`,
                  }}
                >
                  {deck.bannerImageUrl && (
                    <img src={deck.bannerImageUrl} alt={deck.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  {/* Leader image bottom-left */}
                  <div className="absolute bottom-2 left-3 flex items-end gap-2">
                    {deck.leaderImageUrl ? (
                      <img
                        src={deck.leaderImageUrl}
                        alt={deck.leaderName}
                        className="w-12 h-16 object-cover rounded border border-white/20 shadow"
                      />
                    ) : (
                      <div
                        className="w-12 h-16 rounded border border-white/20 flex items-center justify-center text-xs font-bold text-white/40"
                        style={{ backgroundColor: COLOR_BG[deck.colors[0]] ?? '#374151' }}
                      >
                        {deck.colors[0]}
                      </div>
                    )}
                    <div className="pb-0.5">
                      <p className="text-white text-xs font-bold drop-shadow">{deck.leaderName}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col">
                  <h3 className="text-white font-bold">{deck.name}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2 flex-1">{deck.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {deck.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-800">
                    <span>{deck.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 font-bold">{totalCards}/50枚</span>
                      <span className="flex items-center gap-1 text-red-400">
                        <Heart className="w-3 h-3" />{deck.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {decks.length === 0 && (
        <div className="text-center py-16 text-gray-500">デッキがありません</div>
      )}
    </div>
  );
}
