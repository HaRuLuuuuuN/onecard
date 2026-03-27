import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { tierList } from '@/data/meta';

const tierColors: Record<string, string> = {
  S: 'text-yellow-400 bg-yellow-600/20 border-yellow-600/50',
  A: 'text-orange-400 bg-orange-600/20 border-orange-600/50',
  B: 'text-blue-400 bg-blue-600/20 border-blue-600/50',
  C: 'text-gray-400 bg-gray-700/30 border-gray-600/50',
};

const tiers = ['S', 'A', 'B', 'C'] as const;

export default function MetaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-yellow-500" />
          環境Tierリスト
        </h1>
        <p className="text-gray-400 mt-1">
          OP02「頂上決戦」環境 — 2024年12月現在
        </p>
      </div>

      {/* Legend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-gray-400 text-sm font-medium mb-3">指標の説明</p>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-white font-bold">勝率</span>
            <p className="text-gray-400 mt-0.5">大会・ランク戦での勝率 (全試合)</p>
          </div>
          <div>
            <span className="text-white font-bold">使用率</span>
            <p className="text-gray-400 mt-0.5">大会での使用者の割合</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>上昇傾向</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-400">
              <TrendingDown className="w-4 h-4" />
              <span>下降傾向</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Minus className="w-4 h-4" />
              <span>安定</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier sections */}
      {tiers.map((tier) => {
        const entries = tierList.filter((e) => e.tier === tier);
        if (entries.length === 0) return null;
        return (
          <div key={tier}>
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`text-3xl font-black px-5 py-2 rounded-xl border ${tierColors[tier]}`}
              >
                Tier {tier}
              </div>
              <div className="h-px flex-1 bg-gray-800" />
            </div>
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.leaderId}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Tier badge */}
                    <div
                      className={`text-xl font-black px-3 py-2 rounded-lg border ${tierColors[tier]} min-w-[52px] text-center flex-shrink-0`}
                    >
                      {tier}
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {entry.color.map((c) => (
                          <span
                            key={c}
                            className="text-xs px-2 py-0.5 rounded font-bold text-white"
                            style={{
                              backgroundColor:
                                c === 'Red'
                                  ? '#dc2626'
                                  : c === 'Blue'
                                  ? '#2563eb'
                                  : c === 'Green'
                                  ? '#16a34a'
                                  : c === 'Yellow'
                                  ? '#ca8a04'
                                  : c === 'Purple'
                                  ? '#9333ea'
                                  : '#4b5563',
                            }}
                          >
                            {c}
                          </span>
                        ))}
                        <span className="text-white font-bold text-lg">{entry.leaderNameJa}</span>
                        {entry.trend === 'up' && (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        )}
                        {entry.trend === 'down' && (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                        {entry.trend === 'stable' && (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">{entry.description}</p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-6 mt-3">
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">勝率</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${entry.winRate}%` }}
                              />
                            </div>
                            <span className="text-green-400 font-bold text-sm">{entry.winRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs mb-0.5">使用率</p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-blue-500"
                                style={{ width: `${entry.popularity * 2}%` }}
                              />
                            </div>
                            <span className="text-blue-400 font-bold text-sm">{entry.popularity}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Disclaimer */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-500 text-sm">
        ※ データは大会結果・コミュニティ情報を元にした参考値です。実際の環境は変動します。
      </div>
    </div>
  );
}
