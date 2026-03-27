'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Heart, Tag } from 'lucide-react';
import { useDecksStore, DeckCardEntry } from '@/lib/decksStore';

interface Props {
  params: Promise<{ id: string }>;
}

const COLOR_BG: Record<string, string> = {
  赤: '#7f1d1d', 青: '#1e3a8a', 緑: '#14532d',
  黄: '#78350f', 紫: '#581c87', 黒: '#111827',
};
const COLOR_DOT: Record<string, string> = {
  赤: '#dc2626', 青: '#2563eb', 緑: '#16a34a',
  黄: '#ca8a04', 紫: '#9333ea', 黒: '#374151',
};

function CardTile({ entry }: { entry: DeckCardEntry }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[72px] h-[100px] sm:w-[84px] sm:h-[116px] rounded-md overflow-hidden border border-white/20 bg-gray-800 flex-shrink-0">
        {entry.imageUrl ? (
          <img src={entry.imageUrl} alt={entry.cardName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-600">
            <span className="text-[9px] font-bold">{entry.type[0]}</span>
            {entry.cost !== undefined && (
              <span className="text-[11px] font-black text-gray-500">{entry.cost}</span>
            )}
          </div>
        )}
        {/* count badge */}
        <div className="absolute top-1 right-1 bg-black/80 text-yellow-400 text-[10px] font-black rounded px-1 leading-tight">
          ×{entry.count}
        </div>
      </div>
      <div className="mt-1 text-center max-w-[84px]">
        <p className="text-white text-[10px] leading-tight truncate font-medium">{entry.cardName}</p>
        {entry.cost !== undefined && (
          <p className="text-gray-500 text-[9px]">コスト {entry.cost}</p>
        )}
      </div>
    </div>
  );
}

// Expand cards so each copy is shown side-by-side (like the screenshot)
function CardRow({ entries }: { entries: DeckCardEntry[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map((entry) =>
        Array.from({ length: entry.count }).map((_, i) => (
          <div key={`${entry.id}-${i}`} className="flex flex-col items-center">
            <div className="relative w-[72px] h-[100px] sm:w-[84px] sm:h-[116px] rounded-md overflow-hidden border border-white/20 bg-gray-800">
              {entry.imageUrl ? (
                <img src={entry.imageUrl} alt={entry.cardName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-600">
                  <span className="text-[9px] font-bold">{entry.type[0]}</span>
                  {entry.cost !== undefined && (
                    <span className="text-[11px] font-black text-gray-500">{entry.cost}</span>
                  )}
                </div>
              )}
            </div>
            {i === 0 && (
              <div className="mt-1 text-center max-w-[84px]">
                <p className="text-white text-[10px] leading-tight truncate font-medium">{entry.cardName}</p>
                {entry.cost !== undefined && (
                  <p className="text-gray-500 text-[9px]">コスト {entry.cost}</p>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default function DeckDetailPage({ params }: Props) {
  const { id } = use(params);
  const { decks, loaded } = useDecksStore();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const deck = decks.find((d) => d.id === id);
  if (!deck) notFound();

  const totalCards = deck.cards.reduce((s, c) => s + c.count, 0);

  // Sort by cost (undefined cost goes last), then group into rows by cost
  const sorted = [...deck.cards].sort((a, b) => {
    const ca = a.cost ?? 99;
    const cb = b.cost ?? 99;
    return ca !== cb ? ca - cb : a.cardName.localeCompare(b.cardName);
  });

  // Group by cost for row display
  const costGroups: Map<string, DeckCardEntry[]> = new Map();
  for (const card of sorted) {
    const key = card.cost !== undefined ? `コスト ${card.cost}` : 'その他';
    if (!costGroups.has(key)) costGroups.set(key, []);
    costGroups.get(key)!.push(card);
  }

  return (
    <div className="space-y-6">
      <Link href="/decks" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />デッキ一覧に戻る
      </Link>

      {/* Banner */}
      <div
        className="relative rounded-2xl overflow-hidden h-44 sm:h-56"
        style={{
          background: deck.bannerImageUrl
            ? undefined
            : `linear-gradient(135deg, ${COLOR_BG[deck.colors[0]] ?? '#111827'} 0%, #1f2937 100%)`,
        }}
      >
        {deck.bannerImageUrl && (
          <img src={deck.bannerImageUrl} alt={deck.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/30 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-end gap-4">
          {deck.leaderImageUrl ? (
            <img src={deck.leaderImageUrl} alt={deck.leaderName}
              className="w-20 h-28 object-cover rounded-lg border-2 border-white/30 shadow-lg" />
          ) : (
            <div className="w-20 h-28 rounded-lg border-2 border-white/20 flex items-center justify-center text-white/30 font-black text-2xl shadow-lg"
              style={{ backgroundColor: COLOR_BG[deck.colors[0]] ?? '#374151' }}>
              {deck.colors[0]}
            </div>
          )}
          <div>
            <div className="flex gap-1 mb-1">
              {deck.colors.map((c) => (
                <span key={c} className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: COLOR_DOT[c] }} />
              ))}
            </div>
            <p className="text-gray-300 text-sm">{deck.leaderName}</p>
            <h1 className="text-white text-xl sm:text-2xl font-black">{deck.name}</h1>
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['作者', deck.author],
          ['登録日', deck.createdAt],
          ['枚数', `${totalCards} / 50`],
          ['いいね', String(deck.likes)],
        ].map(([k, v]) => (
          <div key={k} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
            <p className="text-gray-500 text-xs">{k}</p>
            <p className="text-white font-bold mt-0.5">{v}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {deck.description && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-300 text-sm leading-relaxed">{deck.description}</p>
        </div>
      )}

      {/* Tags */}
      {deck.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {deck.tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-xs bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg">
              <Tag className="w-3 h-3" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card list */}
      {deck.cards.length > 0 ? (
        <div className="space-y-5">
          <h2 className="text-white font-black text-xl">
            デッキ内容
            <span className="text-gray-500 font-normal text-sm ml-2">{deck.cards.length}種 / {totalCards}枚</span>
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-5">
            {Array.from(costGroups.entries()).map(([costLabel, entries]) => (
              <div key={costLabel}>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">{costLabel}</p>
                <CardRow entries={entries} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">
          カードリストが登録されていません
        </div>
      )}
    </div>
  );
}
