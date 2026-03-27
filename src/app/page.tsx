import Link from 'next/link';
import { Layers, BarChart2, BookOpen, TrendingUp, Zap, Shield } from 'lucide-react';
import { articles, defaultTierData } from '@/data/meta';
import { sampleDecks } from '@/data/decks';

const featureCards = [
  {
    icon: Layers,
    title: 'デッキ一覧',
    description: '環境デッキのサンプルを一覧で閲覧。リーダー別に絞り込んで参考にしよう。',
    href: '/decks',
    color: 'text-green-400',
    bg: 'bg-green-950/30 border-green-800/50',
  },
  {
    icon: BarChart2,
    title: '環境/Tierリスト',
    description: '現環境のデッキTierと勝率データ。最強デッキを把握しよう。',
    href: '/meta',
    color: 'text-yellow-400',
    bg: 'bg-yellow-950/30 border-yellow-800/50',
  },
  {
    icon: BookOpen,
    title: '攻略記事',
    description: 'プレイング解説から環境分析まで。初心者から上級者まで役立つ情報。',
    href: '/articles',
    color: 'text-purple-400',
    bg: 'bg-purple-950/30 border-purple-800/50',
  },
];

const stats = [
  { label: 'サンプルデッキ', value: String(sampleDecks.length), icon: Layers },
  { label: 'Tier収録リーダー', value: String(defaultTierData.entries.length), icon: TrendingUp },
  { label: '攻略記事', value: String(articles.length), icon: BookOpen },
];

export default function HomePage() {
  const topTier = defaultTierData.entries.filter((e) => e.tier === 'S');
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 to-transparent rounded-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-yellow-600/20 border border-yellow-600/40 rounded-full px-4 py-1.5 text-yellow-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            OP-15 神の島の冒険 対応
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
            ONE PIECE カードゲーム
            <br />
            <span className="text-yellow-400">攻略サイト</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            環境Tier・デッキ一覧・攻略記事を完備。
            <br />
            初心者から競技プレイヤーまで使える本格的な攻略情報を提供します。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/meta"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              環境Tierを見る
            </Link>
            <Link
              href="/articles"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg border border-gray-700 transition-colors"
            >
              攻略記事を読む
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <s.icon className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6 text-yellow-500" />
          サイト機能
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((f) => (
            <Link key={f.href} href={f.href}>
              <div
                className={`border rounded-xl p-5 h-full transition-all hover:-translate-y-1 hover:shadow-lg ${f.bg} hover:shadow-black/50`}
              >
                <f.icon className={`w-8 h-8 ${f.color} mb-3`} />
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tier S leaders */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            現環境 Tier S リーダー
          </h2>
          <Link href="/meta" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
            全て見る →
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          {topTier.map((entry) => (
            <Link key={entry.id} href="/meta">
              <div className="bg-gray-900 border border-yellow-600/30 hover:border-yellow-500/60 rounded-xl px-4 py-3 flex items-center gap-3 transition-colors">
                <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg px-2 py-1 text-yellow-400 font-black text-lg">
                  S
                </div>
                <span className="text-white font-bold text-sm">{entry.name}</span>
                {entry.trend === 'up' && <span className="text-blue-400 font-bold">↑</span>}
                {entry.trend === 'down' && <span className="text-red-400 font-bold">↓</span>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-yellow-500" />
            最新攻略記事
          </h2>
          <Link href="/articles" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
            全て見る →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {latestArticles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-full hover:border-gray-700 hover:bg-gray-800 transition-all">
                <span className="text-xs px-2 py-1 rounded bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 font-medium">
                  {article.categoryLabel}
                </span>
                <h3 className="text-white font-bold mt-3 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3">{article.summary}</p>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                  <span>{article.author}</span>
                  <span>{article.readTime}分で読める</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
