'use client';

import { useState, useRef } from 'react';
import { Sparkles, Copy, Check, Loader2, FileText, List, AlignLeft, Send } from 'lucide-react';
import clsx from 'clsx';

interface Sections {
  title: string;
  structure: string;
  body: string;
  xpost: string;
}

function parseSections(text: string): Partial<Sections> {
  const result: Partial<Sections> = {};

  const titleMatch = text.match(/===TITLE===\n([\s\S]*?)(?====\w+===|$)/);
  if (titleMatch) result.title = titleMatch[1].trim();

  const structureMatch = text.match(/===STRUCTURE===\n([\s\S]*?)(?====\w+===|$)/);
  if (structureMatch) result.structure = structureMatch[1].trim();

  const bodyMatch = text.match(/===BODY===\n([\s\S]*?)(?====\w+===|$)/);
  if (bodyMatch) result.body = bodyMatch[1].trim();

  const xpostMatch = text.match(/===XPOST===\n([\s\S]*?)(?====\w+===|$)/);
  if (xpostMatch) result.xpost = xpostMatch[1].trim();

  return result;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-400" />
          コピー済み
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          コピー
        </>
      )}
    </button>
  );
}

function SectionCard({
  icon,
  label,
  content,
  mono = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  content: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  if (!content) return null;

  return (
    <div
      className={clsx(
        'rounded-xl border p-5 space-y-3',
        highlight
          ? 'border-yellow-600/50 bg-yellow-950/20'
          : 'border-gray-700 bg-gray-900'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
          {icon}
          {label}
        </div>
        <CopyButton text={content} />
      </div>
      <pre
        className={clsx(
          'whitespace-pre-wrap text-sm text-gray-300 leading-relaxed',
          mono ? 'font-mono' : 'font-sans'
        )}
      >
        {content}
      </pre>
    </div>
  );
}

export default function GeneratorPage() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState('');
  const [sections, setSections] = useState<Partial<Sections>>({});
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const generate = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');
    setRawText('');
    setSections({});

    abortRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'エラーが発生しました');
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setRawText(accumulated);
        setSections(parseSections(accumulated));
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message ?? 'エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  const hasResults =
    sections.title || sections.structure || sections.body || sections.xpost;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          記事コンテンツジェネレーター
        </h1>
        <p className="text-gray-400 mt-1">
          キーワードを入力すると、記事タイトル・構成・本文・X投稿文を自動生成します
        </p>
      </div>

      {/* Input */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4">
        <label className="block text-sm font-semibold text-gray-200">
          キーワードを入力
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !loading) generate();
            }}
            placeholder="例: ゾロデッキ、赤青コントロール、ルフィリーダー..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
            disabled={loading}
          />
          {loading ? (
            <button
              onClick={handleStop}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-red-700 hover:bg-red-600 text-white transition-colors flex items-center gap-2 shrink-0"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              停止
            </button>
          ) : (
            <button
              onClick={generate}
              disabled={!keyword.trim()}
              className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-gray-950 transition-colors flex items-center gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              生成する
            </button>
          )}
        </div>
        {loading && (
          <p className="text-xs text-yellow-400 animate-pulse flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            AIがコンテンツを生成中です...
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-950/50 border border-red-700 rounded-xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="space-y-4">
          <SectionCard
            icon={<FileText className="w-4 h-4 text-yellow-400" />}
            label="記事タイトル"
            content={sections.title ?? ''}
            highlight
          />
          <SectionCard
            icon={<List className="w-4 h-4 text-blue-400" />}
            label="記事構成"
            content={sections.structure ?? ''}
          />
          <SectionCard
            icon={<AlignLeft className="w-4 h-4 text-green-400" />}
            label="記事本文の下書き"
            content={sections.body ?? ''}
          />
          <SectionCard
            icon={<Send className="w-4 h-4 text-sky-400" />}
            label="X（Twitter）投稿文"
            content={sections.xpost ?? ''}
            highlight
          />
        </div>
      )}

      {/* Raw output while streaming (before sections are parsed) */}
      {loading && !hasResults && rawText && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono leading-relaxed">
            {rawText}
          </pre>
        </div>
      )}
    </div>
  );
}
