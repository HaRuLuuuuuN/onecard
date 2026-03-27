'use client';

import { useTierStore } from '@/lib/tierStore';
import { TierEntry, TierLevel, CardColorJa } from '@/data/meta';

const COLOR_GRADIENT: Record<CardColorJa, string> = {
  赤: 'from-red-900 to-red-700',
  青: 'from-blue-900 to-blue-700',
  緑: 'from-green-900 to-green-700',
  黄: 'from-yellow-800 to-yellow-600',
  紫: 'from-purple-900 to-purple-700',
  黒: 'from-gray-900 to-gray-700',
};

const COLOR_BG: Record<CardColorJa, string> = {
  赤: '#991b1b',
  青: '#1e3a8a',
  緑: '#14532d',
  黄: '#78350f',
  紫: '#581c87',
  黒: '#111827',
};

const TIER_CONFIG: Record<TierLevel, {
  label: string;
  sublabel: string;
  rowBg: string;
  labelColor: string;
  borderColor: string;
  glowColor: string;
}> = {
  S: {
    label: 'S',
    sublabel: '(Tier1)',
    rowBg: 'bg-gradient-to-r from-amber-950/40 to-gray-950',
    labelColor: 'text-amber-300',
    borderColor: 'border-amber-600/50',
    glowColor: 'shadow-amber-900/50',
  },
  'A+': {
    label: 'A⁺',
    sublabel: '(Tier1.5)',
    rowBg: 'bg-gradient-to-r from-orange-950/40 to-gray-950',
    labelColor: 'text-orange-300',
    borderColor: 'border-orange-600/50',
    glowColor: 'shadow-orange-900/50',
  },
  A: {
    label: 'A',
    sublabel: '(Tier2)',
    rowBg: 'bg-gradient-to-r from-lime-950/40 to-gray-950',
    labelColor: 'text-lime-300',
    borderColor: 'border-lime-600/50',
    glowColor: 'shadow-lime-900/50',
  },
  'B+': {
    label: 'B⁺',
    sublabel: '(Tier2.5)',
    rowBg: 'bg-gradient-to-r from-sky-950/40 to-gray-950',
    labelColor: 'text-sky-300',
    borderColor: 'border-sky-600/50',
    glowColor: 'shadow-sky-900/50',
  },
};

const TIERS: TierLevel[] = ['S', 'A+', 'A', 'B+'];

function CardItem({ entry }: { entry: TierEntry }) {
  const firstColor = entry.colors[0];
  const gradient = COLOR_GRADIENT[firstColor] ?? 'from-gray-900 to-gray-700';
  const secondBg = entry.colors[1] ? COLOR_BG[entry.colors[1]] : null;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative w-[100px] h-[138px] sm:w-[110px] sm:h-[152px] rounded-lg overflow-hidden border border-white/20 bg-gradient-to-b ${gradient} flex-shrink-0`}
        style={
          secondBg
            ? { background: `linear-gradient(135deg, ${COLOR_BG[firstColor]} 50%, ${secondBg} 50%)` }
            : undefined
        }
      >
        {entry.imageUrl ? (
          <img src={entry.imageUrl} alt={entry.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
            <div className="flex gap-0.5">
              {entry.colors.map((c) => (
                <span
                  key={c}
                  className="text-[10px] font-black text-white px-1 rounded"
                  style={{ backgroundColor: COLOR_BG[c] }}
                >
                  {c}
                </span>
              ))}
            </div>
            <span className="text-white/60 text-[9px] font-bold tracking-widest">SAMPLE</span>
          </div>
        )}
        {/* bottom name bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/75 px-1 py-1">
          <p className="text-white text-[10px] sm:text-[11px] font-bold text-center leading-tight truncate">
            {entry.name}
            {entry.trend === 'up' && <span className="text-blue-400 ml-0.5">↑</span>}
            {entry.trend === 'down' && <span className="text-red-400 ml-0.5">↓</span>}
          </p>
        </div>
      </div>
    </div>
  );
}

function TierRow({ tier, entries }: { tier: TierLevel; entries: TierEntry[] }) {
  const cfg = TIER_CONFIG[tier];

  if (entries.length === 0) return null;

  return (
    <div className={`rounded-xl border ${cfg.borderColor} ${cfg.rowBg} overflow-hidden`}>
      <div className="flex items-start gap-0">
        {/* Tier label */}
        <div className="flex flex-col items-center justify-center px-4 py-4 min-w-[72px] sm:min-w-[88px] border-r border-white/10 self-stretch">
          <span className={`text-4xl sm:text-5xl font-black leading-none ${cfg.labelColor}`}>
            {cfg.label}
          </span>
          <span className="text-gray-400 text-[10px] sm:text-xs font-medium mt-1">{cfg.sublabel}</span>
        </div>
        {/* Cards grid */}
        <div className="flex flex-wrap gap-2 sm:gap-3 p-3 sm:p-4 flex-1">
          {entries.map((entry) => (
            <CardItem key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MetaPage() {
  const { data, loaded } = useTierStore();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center py-6 relative">
        <div className="absolute inset-0 bg-gradient-radial from-yellow-900/10 to-transparent rounded-3xl pointer-events-none" />
        <div className="relative space-y-1">
          <p className="text-gray-400 text-sm">{data.updatedAt}更新</p>
          <p className="text-yellow-400 text-sm font-bold tracking-wider">
            【{data.edition}】スタンダード環境版
          </p>
          <h1 className="text-3xl sm:text-5xl font-black text-white" style={{ fontFamily: 'serif' }}>
            {data.editionName}
          </h1>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {data.edition.replace('OP-', '')}弾環境 <span className="text-yellow-400">Tier表</span>
          </p>
        </div>
      </div>

      {/* Tier rows */}
      <div className="space-y-3">
        {TIERS.map((tier) => (
          <TierRow
            key={tier}
            tier={tier}
            entries={data.entries.filter((e) => e.tier === tier)}
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-gray-500 text-xs text-center py-2">
        ※ Tier内のリーダー配置については順不同です
      </p>
    </div>
  );
}
