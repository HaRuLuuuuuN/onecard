import clsx from 'clsx';
import { CardColor, CardRarity, CardType } from '@/types/card';

const colorMap: Record<CardColor, string> = {
  Red: 'bg-red-600 text-white',
  Blue: 'bg-blue-600 text-white',
  Green: 'bg-green-600 text-white',
  Yellow: 'bg-yellow-500 text-black',
  Purple: 'bg-purple-600 text-white',
  Black: 'bg-gray-700 text-white',
  Multi: 'bg-gradient-to-r from-red-600 to-blue-600 text-white',
};

const colorDotMap: Record<CardColor, string> = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500',
  Green: 'bg-green-500',
  Yellow: 'bg-yellow-400',
  Purple: 'bg-purple-500',
  Black: 'bg-gray-500',
  Multi: 'bg-gradient-to-r from-red-500 to-blue-500',
};

const rarityMap: Record<CardRarity, string> = {
  C: 'text-gray-400 border-gray-600',
  UC: 'text-green-400 border-green-600',
  R: 'text-blue-400 border-blue-600',
  SR: 'text-yellow-400 border-yellow-600',
  L: 'text-red-400 border-red-600',
  SEC: 'text-purple-400 border-purple-600',
  P: 'text-pink-400 border-pink-600',
};

const typeMap: Record<CardType, string> = {
  Leader: 'bg-red-900/50 text-red-300 border-red-700',
  Character: 'bg-blue-900/50 text-blue-300 border-blue-700',
  Event: 'bg-green-900/50 text-green-300 border-green-700',
  Stage: 'bg-purple-900/50 text-purple-300 border-purple-700',
};

export function ColorBadge({ color }: { color: CardColor }) {
  return (
    <span className={clsx('px-2 py-0.5 rounded text-xs font-bold', colorMap[color])}>
      {color}
    </span>
  );
}

export function ColorDot({ color }: { color: CardColor }) {
  return <span className={clsx('inline-block w-3 h-3 rounded-full', colorDotMap[color])} />;
}

export function RarityBadge({ rarity }: { rarity: CardRarity }) {
  return (
    <span
      className={clsx(
        'px-2 py-0.5 rounded text-xs font-bold border',
        rarityMap[rarity]
      )}
    >
      {rarity}
    </span>
  );
}

export function TypeBadge({ type }: { type: CardType }) {
  return (
    <span
      className={clsx(
        'px-2 py-0.5 rounded text-xs font-bold border',
        typeMap[type]
      )}
    >
      {type}
    </span>
  );
}
