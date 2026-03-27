'use client';

import { Heart, Clock, Tag } from 'lucide-react';
import { useDecksStore } from '@/lib/decksStore';

const COLOR_DOT: Record<string, string> = {
  赤: '#dc2626',
  青: '#2563eb',
  緑: '#16a34a',
  黄: '#ca8a04',
  紫: '#9333ea',
  黒: '#374151',
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
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:bg-gray-800/50 transition-all"
          >
            {/* Leader banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 p-4 flex items-start gap-3">
              <div
                className="rounded-lg w-16 h-20 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLOR_DOT[deck.colors[0]] ?? '#374151' }}
              >
                <span className="text-white/60 text-lg font-black">
                  {deck.colors[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  {deck.colors.map((c) => (
                    <span
                      key={c}
                      className="inline-block w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: COLOR_DOT[c] ?? '#374151' }}
                    />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">リーダー</span>
                </div>
                <p className="text-white font-bold text-sm">{deck.leaderName}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-white font-bold">{deck.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{deck.description}</p>

              <div className="flex flex-wrap gap-1.5">
                {deck.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">デッキ枚数</p>
                <span className="text-yellow-400 font-bold">{deck.cardCount}</span>
                <span className="text-gray-400 text-sm">/50枚</span>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-800">
                <span>{deck.author}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {deck.createdAt}
                  </span>
                  <span className="flex items-center gap-1 text-red-400">
                    <Heart className="w-3 h-3" />
                    {deck.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center py-16 text-gray-500">デッキがありません</div>
      )}
    </div>
  );
}
