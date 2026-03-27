import Link from 'next/link';
import { Card } from '@/types/card';
import { ColorBadge, RarityBadge, TypeBadge } from './CardBadge';
import { Shield, Zap, Heart } from 'lucide-react';

interface Props {
  card: Card;
}

const colorBorderMap: Record<string, string> = {
  Red: 'border-red-700 hover:border-red-500',
  Blue: 'border-blue-700 hover:border-blue-500',
  Green: 'border-green-700 hover:border-green-500',
  Yellow: 'border-yellow-700 hover:border-yellow-500',
  Purple: 'border-purple-700 hover:border-purple-500',
  Black: 'border-gray-700 hover:border-gray-500',
  Multi: 'border-pink-700 hover:border-pink-500',
};

export default function CardCard({ card }: Props) {
  const borderClass = colorBorderMap[card.color[0]] ?? 'border-gray-700 hover:border-gray-500';

  return (
    <Link href={`/cards/${card.id}`}>
      <div
        className={`bg-gray-900 border-2 ${borderClass} rounded-lg p-4 h-full flex flex-col gap-3 transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-black/50 hover:-translate-y-0.5 cursor-pointer`}
      >
        {/* Card image placeholder */}
        <div className="aspect-[3/4] bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 overflow-hidden relative">
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.nameJa} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-600">
              <div className="text-4xl font-black opacity-30">{card.color[0][0]}</div>
              <span className="text-xs">{card.id}</span>
            </div>
          )}
          {card.type === 'Leader' && (
            <div className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
              LEADER
            </div>
          )}
        </div>

        {/* Card info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="font-bold text-white text-sm leading-tight">{card.nameJa}</p>
              <p className="text-gray-400 text-xs">{card.name}</p>
            </div>
            <RarityBadge rarity={card.rarity} />
          </div>

          <div className="flex flex-wrap gap-1">
            {card.color.map((c) => (
              <ColorBadge key={c} color={c} />
            ))}
            <TypeBadge type={card.type} />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm">
            {card.cost !== undefined && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Zap className="w-3 h-3" />
                <span className="font-bold">{card.cost}</span>
              </div>
            )}
            {card.power !== undefined && (
              <div className="flex items-center gap-1 text-orange-400">
                <span className="text-xs font-bold">P</span>
                <span className="font-bold">{card.power.toLocaleString()}</span>
              </div>
            )}
            {card.counter !== undefined && (
              <div className="flex items-center gap-1 text-cyan-400">
                <Shield className="w-3 h-3" />
                <span className="font-bold">{card.counter.toLocaleString()}</span>
              </div>
            )}
            {card.life !== undefined && (
              <div className="flex items-center gap-1 text-red-400">
                <Heart className="w-3 h-3" />
                <span className="font-bold">{card.life}</span>
              </div>
            )}
          </div>

          {card.ability && (
            <p className="text-gray-400 text-xs line-clamp-2">{card.abilityJa}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
