'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cards } from '@/data/cards';
import CardCard from '@/components/CardCard';
import { CardColor, CardType, CardRarity } from '@/types/card';
import clsx from 'clsx';

const colors: CardColor[] = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black'];
const types: CardType[] = ['Leader', 'Character', 'Event', 'Stage'];
const rarities: CardRarity[] = ['C', 'UC', 'R', 'SR', 'L', 'SEC'];

const colorStyle: Record<CardColor, string> = {
  Red: 'bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30',
  Blue: 'bg-blue-600/20 border-blue-600/50 text-blue-400 hover:bg-blue-600/30',
  Green: 'bg-green-600/20 border-green-600/50 text-green-400 hover:bg-green-600/30',
  Yellow: 'bg-yellow-600/20 border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/30',
  Purple: 'bg-purple-600/20 border-purple-600/50 text-purple-400 hover:bg-purple-600/30',
  Black: 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/70',
  Multi: 'bg-pink-600/20 border-pink-600/50 text-pink-400 hover:bg-pink-600/30',
};

const colorActiveStyle: Record<CardColor, string> = {
  Red: 'bg-red-600 border-red-500 text-white',
  Blue: 'bg-blue-600 border-blue-500 text-white',
  Green: 'bg-green-600 border-green-500 text-white',
  Yellow: 'bg-yellow-500 border-yellow-400 text-black',
  Purple: 'bg-purple-600 border-purple-500 text-white',
  Black: 'bg-gray-600 border-gray-500 text-white',
  Multi: 'bg-pink-600 border-pink-500 text-white',
};

export default function CardsPage() {
  const [query, setQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState<CardColor[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<CardType[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<CardRarity[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'id' | 'cost' | 'power' | 'name'>('id');

  const toggleColor = (c: CardColor) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const toggleType = (t: CardType) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const toggleRarity = (r: CardRarity) =>
    setSelectedRarities((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedTypes([]);
    setSelectedRarities([]);
    setQuery('');
  };

  const hasFilters =
    selectedColors.length > 0 ||
    selectedTypes.length > 0 ||
    selectedRarities.length > 0 ||
    query.length > 0;

  const filtered = useMemo(() => {
    let result = cards;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.nameJa.includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.affiliations.some((a) => a.toLowerCase().includes(q))
      );
    }
    if (selectedColors.length > 0) {
      result = result.filter((c) => c.color.some((col) => selectedColors.includes(col)));
    }
    if (selectedTypes.length > 0) {
      result = result.filter((c) => selectedTypes.includes(c.type));
    }
    if (selectedRarities.length > 0) {
      result = result.filter((c) => selectedRarities.includes(c.rarity));
    }
    return [...result].sort((a, b) => {
      if (sortBy === 'cost') return (a.cost ?? 99) - (b.cost ?? 99);
      if (sortBy === 'power') return (b.power ?? 0) - (a.power ?? 0);
      if (sortBy === 'name') return a.nameJa.localeCompare(b.nameJa, 'ja');
      return a.id.localeCompare(b.id);
    });
  }, [query, selectedColors, selectedTypes, selectedRarities, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">カードデータベース</h1>
          <p className="text-gray-400 mt-1">{filtered.length} 件のカードが見つかりました</p>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors border border-gray-700 hover:border-red-700 rounded-lg px-3 py-1.5"
          >
            <X className="w-4 h-4" />
            フィルタをクリア
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="カード名、ID、勢力で検索..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors text-sm',
            showFilters
              ? 'bg-yellow-600/20 border-yellow-600/50 text-yellow-400'
              : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-600'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          フィルタ
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="bg-gray-900 border border-gray-700 text-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-600"
        >
          <option value="id">カードID順</option>
          <option value="cost">コスト順</option>
          <option value="power">パワー順</option>
          <option value="name">名前順</option>
        </select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          {/* Color filter */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">色</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleColor(c)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors',
                    selectedColors.includes(c) ? colorActiveStyle[c] : colorStyle[c]
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">タイプ</p>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
                    selectedTypes.includes(t)
                      ? 'bg-yellow-600/30 border-yellow-600 text-yellow-300'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity filter */}
          <div>
            <p className="text-gray-400 text-sm font-medium mb-2">レアリティ</p>
            <div className="flex flex-wrap gap-2">
              {rarities.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRarity(r)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg border text-sm font-bold transition-colors',
                    selectedRarities.includes(r)
                      ? 'bg-yellow-600/30 border-yellow-600 text-yellow-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">カードが見つかりませんでした</p>
          <p className="text-sm mt-1">検索条件を変更してください</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((card) => (
            <CardCard key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
