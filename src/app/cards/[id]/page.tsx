import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Zap, Heart, Swords } from 'lucide-react';
import { cards, getCardById } from '@/data/cards';
import { ColorBadge, RarityBadge, TypeBadge } from '@/components/CardBadge';
import CardCard from '@/components/CardCard';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return cards.map((c) => ({ id: c.id }));
}

export default async function CardDetailPage({ params }: Props) {
  const { id } = await params;
  const card = getCardById(id);
  if (!card) notFound();

  // Related cards: same color or same affiliation
  const related = cards
    .filter(
      (c) =>
        c.id !== card.id &&
        (c.color.some((col) => card.color.includes(col)) ||
          c.affiliations.some((a) => card.affiliations.includes(a)))
    )
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <Link
        href="/cards"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        カード一覧に戻る
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card image */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm aspect-[3/4] bg-gray-900 border-2 border-gray-700 rounded-2xl flex items-center justify-center overflow-hidden">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.nameJa} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-600 p-8 text-center">
                <div className="text-8xl font-black opacity-20">{card.color[0][0]}</div>
                <div className="space-y-1">
                  <p className="text-gray-500 font-bold">{card.nameJa}</p>
                  <p className="text-gray-600 text-sm">{card.id}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <RarityBadge rarity={card.rarity} />
              <span className="text-gray-500 text-sm">{card.id}</span>
            </div>
            <h1 className="text-3xl font-black text-white">{card.nameJa}</h1>
            <p className="text-gray-400 text-lg">{card.name}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {card.color.map((c) => (
              <ColorBadge key={c} color={c} />
            ))}
            <TypeBadge type={card.type} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {card.cost !== undefined && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{card.cost}</div>
                <div className="text-gray-500 text-xs">コスト</div>
              </div>
            )}
            {card.power !== undefined && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <Swords className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{(card.power / 1000).toFixed(0)}k</div>
                <div className="text-gray-500 text-xs">パワー</div>
              </div>
            )}
            {card.counter !== undefined && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <Shield className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{(card.counter / 1000).toFixed(0)}k</div>
                <div className="text-gray-500 text-xs">カウンター</div>
              </div>
            )}
            {card.life !== undefined && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-center">
                <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <div className="text-2xl font-black text-white">{card.life}</div>
                <div className="text-gray-500 text-xs">ライフ</div>
              </div>
            )}
          </div>

          {/* Attribute */}
          {card.attribute && (
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm w-20">属性</span>
              <span className="bg-gray-800 text-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                {card.attribute}
              </span>
            </div>
          )}

          {/* Set info */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm w-20">収録セット</span>
            <span className="text-white text-sm font-medium">
              {card.set} - {card.setName}
            </span>
          </div>

          {/* Affiliations */}
          {card.affiliations.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-gray-400 text-sm w-20 pt-1">タイプ</span>
              <div className="flex flex-wrap gap-2">
                {card.affiliations.map((a) => (
                  <span
                    key={a}
                    className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ability */}
          {card.abilityJa && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2 font-medium">テキスト（日本語）</p>
              <p className="text-white text-sm leading-relaxed">{card.abilityJa}</p>
            </div>
          )}
          {card.ability && card.ability !== card.abilityJa && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-2 font-medium">テキスト（英語）</p>
              <p className="text-gray-300 text-sm leading-relaxed italic">{card.ability}</p>
            </div>
          )}
        </div>
      </div>

      {/* Related cards */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-white mb-4">関連カード</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {related.map((c) => (
              <CardCard key={c.id} card={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
