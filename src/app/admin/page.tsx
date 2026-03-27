'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTierStore } from '@/lib/tierStore';
import { useArticlesStore } from '@/lib/articlesStore';
import { useDecksStore, ManagedDeck, DeckColor } from '@/lib/decksStore';
import { TierEntry, TierLevel, CardColorJa, TierData, Article } from '@/data/meta';
import {
  Plus, Trash2, Edit2, Save, X, RotateCcw, ExternalLink,
  BarChart2, BookOpen, Layers,
} from 'lucide-react';

// ─── shared helpers ───────────────────────────────────────────────────────────

function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string | number; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 4, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none resize-y font-mono"
      />
    </div>
  );
}

function SaveBtn({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
    >
      <Save className="w-4 h-4" />保存
    </button>
  );
}

function CancelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
    >
      <X className="w-4 h-4" />キャンセル
    </button>
  );
}

// ─── TIER TAB ─────────────────────────────────────────────────────────────────

const ALL_CARD_COLORS: CardColorJa[] = ['赤', '青', '緑', '黄', '紫', '黒'];
const ALL_TIERS: TierLevel[] = ['S', 'A+', 'A', 'B+'];
const TIER_BADGE: Record<TierLevel, string> = {
  S: 'bg-amber-900/50 text-amber-300 border-amber-600/50',
  'A+': 'bg-orange-900/50 text-orange-300 border-orange-600/50',
  A: 'bg-lime-900/50 text-lime-300 border-lime-600/50',
  'B+': 'bg-sky-900/50 text-sky-300 border-sky-600/50',
};
const COLOR_DOT_TIER: Record<CardColorJa, string> = {
  赤: 'bg-red-600', 青: 'bg-blue-600', 緑: 'bg-green-600',
  黄: 'bg-yellow-500', 紫: 'bg-purple-600', 黒: 'bg-gray-600',
};

type EditingTierEntry = Omit<TierEntry, 'id'> & { id: string | null };
const emptyTierEntry = (): EditingTierEntry => ({ id: null, name: '', colors: ['赤'], tier: 'A', trend: 'stable' });

function TierColorToggle({ colors, onChange }: { colors: CardColorJa[]; onChange: (c: CardColorJa[]) => void }) {
  const toggle = (c: CardColorJa) => {
    if (colors.includes(c)) {
      if (colors.length === 1) return;
      onChange(colors.filter((x) => x !== c));
    } else {
      onChange([...colors, c]);
    }
  };
  return (
    <div className="flex gap-1 flex-wrap">
      {ALL_CARD_COLORS.map((c) => (
        <button key={c} type="button" onClick={() => toggle(c)}
          className={`px-2 py-1 rounded text-xs font-bold border transition-all ${colors.includes(c) ? `${COLOR_DOT_TIER[c]} text-white border-white/30` : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
          {c}
        </button>
      ))}
    </div>
  );
}

function TierEntryForm({ initial, onSave, onCancel }: {
  initial: EditingTierEntry; onSave: (e: EditingTierEntry) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  return (
    <div className="bg-gray-900 border border-yellow-600/40 rounded-xl p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="リーダー名" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="例: 赤青ルーシー" />
        <Input label="画像URL（省略可）" value={form.imageUrl ?? ''} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="https://..." />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-gray-400 text-xs block mb-1">色</label>
          <TierColorToggle colors={form.colors} onChange={(c) => setForm({ ...form, colors: c })} />
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">Tier</label>
          <select value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as TierLevel })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none">
            {ALL_TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-xs block mb-1">トレンド</label>
          <select value={form.trend} onChange={(e) => setForm({ ...form, trend: e.target.value as 'up' | 'down' | 'stable' })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none">
            <option value="up">↑ 上昇</option>
            <option value="stable">→ 安定</option>
            <option value="down">↓ 下降</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <SaveBtn onClick={() => { if (form.name.trim()) onSave(form); }} disabled={!form.name.trim()} />
        <CancelBtn onClick={onCancel} />
      </div>
    </div>
  );
}

function TierTab() {
  const { data, save, reset, loaded } = useTierStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editEdition, setEditEdition] = useState<Pick<TierData, 'edition' | 'editionName' | 'updatedAt'> | null>(null);

  if (!loaded) return <div className="py-8 text-center text-gray-500">読み込み中...</div>;

  const updateEntry = (updated: EditingTierEntry) => {
    save({ ...data, entries: data.entries.map((e) => e.id === updated.id ? { ...updated, id: updated.id! } : e) });
    setEditingId(null);
  };
  const addEntry = (entry: EditingTierEntry) => {
    save({ ...data, entries: [...data.entries, { ...entry, id: `entry-${Date.now()}` }] });
    setShowAdd(false);
  };
  const deleteEntry = (id: string) => {
    if (!confirm('削除しますか？')) return;
    save({ ...data, entries: data.entries.filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-5">
      {/* Edition */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold text-sm">エディション設定</h3>
          {!editEdition && (
            <button onClick={() => setEditEdition({ edition: data.edition, editionName: data.editionName, updatedAt: data.updatedAt })}
              className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-xs transition-colors">
              <Edit2 className="w-3.5 h-3.5" />編集
            </button>
          )}
        </div>
        {editEdition ? (
          <div className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <Input label="弾番号（例: OP-15）" value={editEdition.edition} onChange={(v) => setEditEdition({ ...editEdition, edition: v })} />
              <Input label="弾名" value={editEdition.editionName} onChange={(v) => setEditEdition({ ...editEdition, editionName: v })} />
              <Input label="更新日（例: 2026/3/3）" value={editEdition.updatedAt} onChange={(v) => setEditEdition({ ...editEdition, updatedAt: v })} />
            </div>
            <div className="flex gap-2">
              <SaveBtn onClick={() => { save({ ...data, ...editEdition }); setEditEdition(null); }} />
              <CancelBtn onClick={() => setEditEdition(null)} />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            {[['弾番号', data.edition], ['弾名', data.editionName], ['更新日', data.updatedAt]].map(([k, v]) => (
              <div key={k}><p className="text-gray-500">{k}</p><p className="text-white font-bold mt-0.5">{v}</p></div>
            ))}
          </div>
        )}
      </div>

      {/* Entry list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-white font-bold text-sm">リーダー一覧 <span className="text-gray-500 font-normal">({data.entries.length}件)</span></span>
          <div className="flex gap-2">
            <button onClick={() => { if (confirm('デフォルトにリセットしますか？')) reset(); }}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2 py-1.5 rounded border border-red-800/50 hover:bg-red-950/30 transition-colors">
              <RotateCcw className="w-3 h-3" />リセット
            </button>
            {!showAdd && (
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
                <Plus className="w-3.5 h-3.5" />追加
              </button>
            )}
          </div>
        </div>
        {showAdd && (
          <div className="p-4 border-b border-gray-800">
            <p className="text-yellow-400 text-xs font-bold mb-3">新規追加</p>
            <TierEntryForm initial={emptyTierEntry()} onSave={addEntry} onCancel={() => setShowAdd(false)} />
          </div>
        )}
        <div className="divide-y divide-gray-800">
          {ALL_TIERS.map((tier) => {
            const entries = data.entries.filter((e) => e.tier === tier);
            if (entries.length === 0) return null;
            return (
              <div key={tier}>
                <div className="px-4 py-2 bg-gray-950/50 flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${TIER_BADGE[tier]}`}>{tier}</span>
                  <span className="text-gray-500 text-xs">{entries.length}件</span>
                </div>
                {entries.map((entry) => (
                  <div key={entry.id}>
                    {editingId === entry.id ? (
                      <div className="p-4">
                        <TierEntryForm initial={{ ...entry }} onSave={updateEntry} onCancel={() => setEditingId(null)} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800/50 transition-colors">
                        <div className="flex gap-0.5">
                          {entry.colors.map((c) => <span key={c} className={`w-2.5 h-2.5 rounded-full ${COLOR_DOT_TIER[c]}`} />)}
                        </div>
                        <span className="text-white text-sm flex-1">{entry.name}</span>
                        <span className="text-sm w-4 text-center">
                          {entry.trend === 'up' ? <span className="text-blue-400">↑</span> : entry.trend === 'down' ? <span className="text-red-400">↓</span> : <span className="text-gray-500">→</span>}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => setEditingId(entry.id)} className="p-1.5 text-gray-400 hover:text-yellow-400 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => deleteEntry(entry.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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

// ─── ARTICLES TAB ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'beginner', label: '初心者向け' },
  { value: 'deck-guide', label: 'デッキガイド' },
  { value: 'meta', label: 'メタ分析' },
  { value: 'strategy', label: '戦略・テクニック' },
] as const;

type EditingArticle = Omit<Article, 'id'> & { id: string | null };
const emptyArticle = (): EditingArticle => ({
  id: null, title: '', category: 'meta', categoryLabel: 'メタ分析',
  summary: '', content: '', author: '', publishedAt: new Date().toISOString().slice(0, 10),
  readTime: 5, tags: [],
});

function ArticleForm({ initial, onSave, onCancel }: {
  initial: EditingArticle; onSave: (a: EditingArticle) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [tagsInput, setTagsInput] = useState(initial.tags.join(', '));

  const handleSave = () => {
    if (!form.title.trim()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, tags });
  };

  const handleCategory = (v: string) => {
    const cat = CATEGORIES.find((c) => c.value === v);
    setForm({ ...form, category: v as Article['category'], categoryLabel: cat?.label ?? v });
  };

  return (
    <div className="bg-gray-900 border border-yellow-600/40 rounded-xl p-4 space-y-3">
      <Input label="タイトル" value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="記事タイトル" />
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-gray-400 text-xs block mb-1">カテゴリ</label>
          <select value={form.category} onChange={(e) => handleCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-yellow-500 outline-none">
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <Input label="著者" value={form.author} onChange={(v) => setForm({ ...form, author: v })} placeholder="ニックネーム" />
        <Input label="読了時間（分）" value={form.readTime} onChange={(v) => setForm({ ...form, readTime: parseInt(v) || 0 })} type="number" />
      </div>
      <Input label="公開日" value={form.publishedAt} onChange={(v) => setForm({ ...form, publishedAt: v })} placeholder="2026-03-27" />
      <Textarea label="概要（サマリー）" value={form.summary} onChange={(v) => setForm({ ...form, summary: v })} rows={2} placeholder="記事の簡単な説明" />
      <Textarea label="本文（Markdownライク: ## 見出し, - リスト）" value={form.content} onChange={(v) => setForm({ ...form, content: v })} rows={10} placeholder={`## はじめに\n\n記事本文をここに書きます。\n\n## 次のセクション\n\n- リスト項目1\n- リスト項目2`} />
      <Input label="タグ（カンマ区切り）" value={tagsInput} onChange={setTagsInput} placeholder="赤, ルフィ, アグロ" />
      <div className="flex gap-2">
        <SaveBtn onClick={handleSave} disabled={!form.title.trim()} />
        <CancelBtn onClick={onCancel} />
      </div>
    </div>
  );
}

function ArticlesTab() {
  const { articles, save, reset, loaded } = useArticlesStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  if (!loaded) return <div className="py-8 text-center text-gray-500">読み込み中...</div>;

  const updateArticle = (updated: EditingArticle) => {
    save(articles.map((a) => a.id === updated.id ? { ...updated, id: updated.id! } : a));
    setEditingId(null);
  };
  const addArticle = (entry: EditingArticle) => {
    const newArticle: Article = { ...entry, id: `art-${Date.now()}` };
    save([...articles, newArticle]);
    setShowAdd(false);
  };
  const deleteArticle = (id: string) => {
    if (!confirm('この記事を削除しますか？')) return;
    save(articles.filter((a) => a.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <span className="text-white font-bold text-sm">記事一覧 <span className="text-gray-500 font-normal">({articles.length}件)</span></span>
        <div className="flex gap-2">
          <button onClick={() => { if (confirm('デフォルトにリセットしますか？')) reset(); }}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2 py-1.5 rounded border border-red-800/50 hover:bg-red-950/30 transition-colors">
            <RotateCcw className="w-3 h-3" />リセット
          </button>
          {!showAdd && (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Plus className="w-3.5 h-3.5" />追加
            </button>
          )}
        </div>
      </div>
      {showAdd && (
        <div className="p-4 border-b border-gray-800">
          <p className="text-yellow-400 text-xs font-bold mb-3">新規記事</p>
          <ArticleForm initial={emptyArticle()} onSave={addArticle} onCancel={() => setShowAdd(false)} />
        </div>
      )}
      <div className="divide-y divide-gray-800">
        {articles.map((article) => (
          <div key={article.id}>
            {editingId === article.id ? (
              <div className="p-4">
                <ArticleForm initial={{ ...article }} onSave={updateArticle} onCancel={() => setEditingId(null)} />
              </div>
            ) : (
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug">{article.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{article.categoryLabel} · {article.author} · {article.publishedAt}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditingId(article.id)} className="p-1.5 text-gray-400 hover:text-yellow-400 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteArticle(article.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DECKS TAB ────────────────────────────────────────────────────────────────

const ALL_DECK_COLORS: DeckColor[] = ['赤', '青', '緑', '黄', '紫', '黒'];
const COLOR_DOT_DECK: Record<DeckColor, string> = {
  赤: 'bg-red-600', 青: 'bg-blue-600', 緑: 'bg-green-600',
  黄: 'bg-yellow-500', 紫: 'bg-purple-600', 黒: 'bg-gray-600',
};

type EditingDeck = Omit<ManagedDeck, 'id'> & { id: string | null };
const emptyDeck = (): EditingDeck => ({
  id: null, name: '', leaderName: '', colors: ['赤'], description: '',
  author: '', createdAt: new Date().toISOString().slice(0, 10), tags: [], likes: 0, cardCount: 50,
});

function DeckColorToggle({ colors, onChange }: { colors: DeckColor[]; onChange: (c: DeckColor[]) => void }) {
  const toggle = (c: DeckColor) => {
    if (colors.includes(c)) {
      if (colors.length === 1) return;
      onChange(colors.filter((x) => x !== c));
    } else {
      onChange([...colors, c]);
    }
  };
  return (
    <div className="flex gap-1 flex-wrap">
      {ALL_DECK_COLORS.map((c) => (
        <button key={c} type="button" onClick={() => toggle(c)}
          className={`px-2 py-1 rounded text-xs font-bold border transition-all ${colors.includes(c) ? `${COLOR_DOT_DECK[c]} text-white border-white/30` : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
          {c}
        </button>
      ))}
    </div>
  );
}

function DeckForm({ initial, onSave, onCancel }: {
  initial: EditingDeck; onSave: (d: EditingDeck) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [tagsInput, setTagsInput] = useState(initial.tags.join(', '));

  const handleSave = () => {
    if (!form.name.trim()) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, tags });
  };

  return (
    <div className="bg-gray-900 border border-yellow-600/40 rounded-xl p-4 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="デッキ名" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="例: 赤ルフィ 速攻型" />
        <Input label="リーダー名" value={form.leaderName} onChange={(v) => setForm({ ...form, leaderName: v })} placeholder="例: モンキー・D・ルフィ" />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-gray-400 text-xs block mb-1">色</label>
          <DeckColorToggle colors={form.colors} onChange={(c) => setForm({ ...form, colors: c })} />
        </div>
        <Input label="著者" value={form.author} onChange={(v) => setForm({ ...form, author: v })} placeholder="ニックネーム" />
        <Input label="枚数" value={form.cardCount} onChange={(v) => setForm({ ...form, cardCount: parseInt(v) || 50 })} type="number" />
      </div>
      <Textarea label="デッキ説明" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} placeholder="デッキのコンセプト・戦略を説明してください" />
      <Input label="タグ（カンマ区切り）" value={tagsInput} onChange={setTagsInput} placeholder="速攻, 赤, 初心者向け" />
      <div className="flex gap-2">
        <SaveBtn onClick={handleSave} disabled={!form.name.trim()} />
        <CancelBtn onClick={onCancel} />
      </div>
    </div>
  );
}

function DecksTab() {
  const { decks, save, reset, loaded } = useDecksStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  if (!loaded) return <div className="py-8 text-center text-gray-500">読み込み中...</div>;

  const updateDeck = (updated: EditingDeck) => {
    save(decks.map((d) => d.id === updated.id ? { ...updated, id: updated.id! } : d));
    setEditingId(null);
  };
  const addDeck = (entry: EditingDeck) => {
    save([...decks, { ...entry, id: `deck-${Date.now()}` }]);
    setShowAdd(false);
  };
  const deleteDeck = (id: string) => {
    if (!confirm('このデッキを削除しますか？')) return;
    save(decks.filter((d) => d.id !== id));
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <span className="text-white font-bold text-sm">デッキ一覧 <span className="text-gray-500 font-normal">({decks.length}件)</span></span>
        <div className="flex gap-2">
          <button onClick={() => { if (confirm('デフォルトにリセットしますか？')) reset(); }}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs px-2 py-1.5 rounded border border-red-800/50 hover:bg-red-950/30 transition-colors">
            <RotateCcw className="w-3 h-3" />リセット
          </button>
          {!showAdd && (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">
              <Plus className="w-3.5 h-3.5" />追加
            </button>
          )}
        </div>
      </div>
      {showAdd && (
        <div className="p-4 border-b border-gray-800">
          <p className="text-yellow-400 text-xs font-bold mb-3">新規デッキ</p>
          <DeckForm initial={emptyDeck()} onSave={addDeck} onCancel={() => setShowAdd(false)} />
        </div>
      )}
      <div className="divide-y divide-gray-800">
        {decks.map((deck) => (
          <div key={deck.id}>
            {editingId === deck.id ? (
              <div className="p-4">
                <DeckForm initial={{ ...deck }} onSave={updateDeck} onCancel={() => setEditingId(null)} />
              </div>
            ) : (
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors">
                <div className="flex gap-0.5 mt-0.5">
                  {deck.colors.map((c) => <span key={c} className={`w-2.5 h-2.5 rounded-full ${COLOR_DOT_DECK[c]}`} />)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{deck.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{deck.leaderName} · {deck.author}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => setEditingId(deck.id)} className="p-1.5 text-gray-400 hover:text-yellow-400 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteDeck(deck.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

type Tab = 'tier' | 'articles' | 'decks';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'tier', label: 'Tier表', icon: BarChart2 },
  { id: 'articles', label: '攻略記事', icon: BookOpen },
  { id: 'decks', label: 'デッキ', icon: Layers },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('tier');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">管理ページ</h1>
          <p className="text-gray-400 text-sm mt-0.5">コンテンツの編集・更新</p>
        </div>
        <Link href={tab === 'tier' ? '/meta' : tab === 'articles' ? '/articles' : '/decks'}
          className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-700 transition-colors">
          <ExternalLink className="w-4 h-4" />
          プレビュー
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              tab === id ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'tier' && <TierTab />}
      {tab === 'articles' && <ArticlesTab />}
      {tab === 'decks' && <DecksTab />}
    </div>
  );
}
