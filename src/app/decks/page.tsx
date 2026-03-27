import { Heart, Clock, Tag } from 'lucide-react';
import { sampleDecks } from '@/data/decks';

const colorMap: Record<string, string> = {
  Red: '#dc2626',
  Blue: '#2563eb',
  Purple: '#9333ea',
  Black: '#374151',
  Green: '#16a34a',
  Yellow: '#ca8a04',
};

function ColorDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-full border border-white/20"
      style={{ backgroundColor: colorMap[color] ?? '#374151' }}
    />
  );
}

export default function DecksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">デッキ一覧</h1>
        <p className="text-gray-400 mt-1">{sampleDecks.length} 件のデッキ</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleDecks.map((deck) => (
          <div
            key={deck.id}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:bg-gray-800/50 transition-all"
          >
            {/* Leader banner */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 p-4 flex items-start gap-3">
              <div className="bg-gray-700 rounded-lg w-16 h-20 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-xs text-center">
                  {deck.leader.color[0][0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  {deck.leader.color.map((c) => (
                    <ColorDot key={c} color={c} />
                  ))}
                  <span className="text-gray-500 text-xs ml-1">リーダー</span>
                </div>
                <p className="text-white font-bold text-sm">{deck.leader.nameJa}</p>
                <p className="text-gray-400 text-xs">{deck.leader.name}</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-white font-bold">{deck.name}</h3>
              <p className="text-gray-400 text-sm line-clamp-2">{deck.description}</p>

              {/* Tags */}
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

              {/* Card count */}
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-2">デッキ内容</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-white">
                    <span className="text-yellow-400 font-bold">
                      {deck.cards.reduce((sum, dc) => sum + dc.count, 0)}
                    </span>
                    /50枚
                  </span>
                  <span className="text-gray-400">{deck.cards.length}種類</span>
                </div>
              </div>

              {/* Footer */}
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
    </div>
  );
}
