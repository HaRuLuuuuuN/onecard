'use client';

import { useState } from 'react';
import { useTierStore } from '@/lib/tierStore';
import { TierEntry, TierLevel, CardColorJa, TierData } from '@/data/meta';
import { Plus, Trash2, Edit2, Save, X, RotateCcw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const ALL_COLORS: CardColorJa[] = ['赤', '青', '緑', '黄', '紫', '黒'];
const ALL_TIERS: TierLevel[] = ['S', 'A+', 'A', 'B+'];
const TREND_OPTIONS = [
  { value: 'up', label: '↑ 上昇' },
  { value: 'stable', label: '→ 安定' },
  { value: 'down', label: '↓ 下降' },
] as const;

const COLOR_DOT: Record<CardColorJa, string> = {
  赤: 'bg-red-600',
  青: 'bg-blue-600',
  緑: 'bg-green-600',
  黄: 'bg-yellow-500',
  紫: 'bg-purple-600',
  黒: 'bg-gray-600',
};

const TIER_BADGE: Record<TierLevel, string> = {
  S: 'bg-amber-900/50 text-amber-300 border-amber-600/50',
  'A+': 'bg-orange-900/50 text-orange-300 border-orange-600/50',
  A: 'bg-lime-900/50 text-lime-300 border-lime-600/50',
  'B+': 'bg-sky-900/50 text-sky-300 border-sky-600/50',
};

type EditingEntry = Omit<TierEntry, 'id'> & { id: string | null };

const emptyEntry = (): EditingEntry => ({
  id: null,
  name: '',
  colors: ['赤'],
  tier: 'A',
  trend: 'stable',
  imageUrl: '',
});

function ColorToggle({
  colors,
  onChange,
}: {
  colors: CardColorJa[];
  onChange: (c: CardColorJa[]) => void;
}) {
  const toggle = (c: CardColorJa) => {
    if (colors.includes(c)) {
      if (colors.length === 1) return; // minimum 1 color
      onChange(colors.filter((x) => x !== c));
    } else {
      onChange([...colors, c]);
    }
  };
  return (
    <div className="flex gap-1 flex-wrap">
      {ALL_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => toggle(c)}
          className={`px-2 py-1 rounded text-xs font-bold border transition-all ${
            colors.includes(c)
              ? `${COLOR_DOT[c]} text-white border-white/30`
              : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function EntryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: EditingEntry;
  onSave: (e: EditingEntry) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<EditingEntry>(initial);

  return (
    <div className="bg-gray-900 border border-yellow-600/40 rounded-xl p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-gray-400 text-xs block mb-1">リーダー名</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="例: 赤青ルーシー"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">画像URL（省略可）</label>
          <input
            value={form.imageUrl ?? ''}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-gray-400 text-xs block mb-1">色</label>
          <ColorToggle colors={form.colors} onChange={(c) => setForm({ ...form, colors: c })} />
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Tier</label>
          <select
            value={form.tier}
            onChange={(e) => setForm({ ...form, tier: e.target.value as TierLevel })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
          >
            {ALL_TIERS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">トレンド</label>
          <select
            value={form.trend}
            onChange={(e) =>
              setForm({ ...form, trend: e.target.value as 'up' | 'down' | 'stable' })
            }
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
          >
            {TREND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => { if (form.name.trim()) onSave(form); }}
          disabled={!form.name.trim()}
          className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
          キャンセル
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data, save, reset, loaded } = useTierStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editionForm, setEditionForm] = useState<Pick<TierData, 'edition' | 'editionName' | 'updatedAt'> | null>(null);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const updateEntry = (updated: EditingEntry) => {
    const newEntries = data.entries.map((e) =>
      e.id === updated.id ? { ...updated, id: updated.id! } : e
    );
    save({ ...data, entries: newEntries });
    setEditingId(null);
  };

  const addEntry = (entry: EditingEntry) => {
    const newEntry: TierEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
    };
    save({ ...data, entries: [...data.entries, newEntry] });
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    if (!confirm('このエントリーを削除しますか？')) return;
    save({ ...data, entries: data.entries.filter((e) => e.id !== id) });
  };

  const saveEdition = () => {
    if (!editionForm) return;
    save({ ...data, ...editionForm });
    setEditionForm(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">管理ページ</h1>
          <p className="text-gray-400 text-sm mt-0.5">Tier表の編集・更新</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/meta"
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Tier表を見る
          </Link>
          <button
            onClick={() => {
              if (confirm('デフォルトデータにリセットしますか？')) reset();
            }}
            className="flex items-center gap-1.5 bg-red-950/50 hover:bg-red-900/50 text-red-400 px-3 py-2 rounded-lg text-sm border border-red-800/50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            リセット
          </button>
        </div>
      </div>

      {/* Edition settings */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">エディション設定</h2>
          {!editionForm && (
            <button
              onClick={() =>
                setEditionForm({
                  edition: data.edition,
                  editionName: data.editionName,
                  updatedAt: data.updatedAt,
                })
              }
              className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              編集
            </button>
          )}
        </div>
        {editionForm ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">弾番号（例: OP-15）</label>
                <input
                  value={editionForm.edition}
                  onChange={(e) => setEditionForm({ ...editionForm, edition: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">弾名</label>
                <input
                  value={editionForm.editionName}
                  onChange={(e) => setEditionForm({ ...editionForm, editionName: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">更新日（例: 2026/3/3）</label>
                <input
                  value={editionForm.updatedAt}
                  onChange={(e) => setEditionForm({ ...editionForm, updatedAt: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveEdition}
                className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
              <button
                onClick={() => setEditionForm(null)}
                className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">弾番号</p>
              <p className="text-white font-bold mt-0.5">{data.edition}</p>
            </div>
            <div>
              <p className="text-gray-500">弾名</p>
              <p className="text-white font-bold mt-0.5">{data.editionName}</p>
            </div>
            <div>
              <p className="text-gray-500">更新日</p>
              <p className="text-white font-bold mt-0.5">{data.updatedAt}</p>
            </div>
          </div>
        )}
      </div>

      {/* Entry list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white font-bold">
            リーダー一覧
            <span className="text-gray-500 font-normal text-sm ml-2">{data.entries.length}件</span>
          </h2>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              追加
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="p-4 border-b border-gray-800">
            <p className="text-yellow-400 text-sm font-bold mb-3">新規追加</p>
            <EntryForm
              initial={emptyEntry()}
              onSave={addEntry}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <div className="divide-y divide-gray-800">
          {ALL_TIERS.map((tier) => {
            const tierEntries = data.entries.filter((e) => e.tier === tier);
            if (tierEntries.length === 0) return null;
            return (
              <div key={tier}>
                <div className="px-4 py-2 bg-gray-950/50">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TIER_BADGE[tier]}`}>
                    {tier}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">{tierEntries.length}件</span>
                </div>
                {tierEntries.map((entry) => (
                  <div key={entry.id}>
                    {editingId === entry.id ? (
                      <div className="p-4">
                        <EntryForm
                          initial={{ ...entry }}
                          onSave={updateEntry}
                          onCancel={() => setEditingId(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
                        <div className="flex gap-0.5">
                          {entry.colors.map((c) => (
                            <span key={c} className={`w-3 h-3 rounded-full ${COLOR_DOT[c]}`} />
                          ))}
                        </div>
                        <span className="text-white text-sm font-medium flex-1">{entry.name}</span>
                        <span className="text-sm">
                          {entry.trend === 'up' && <span className="text-blue-400">↑</span>}
                          {entry.trend === 'down' && <span className="text-red-400">↓</span>}
                          {entry.trend === 'stable' && <span className="text-gray-500">→</span>}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingId(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-950/30 rounded transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
