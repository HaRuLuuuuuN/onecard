import Link from 'next/link';
import { Database, Layers, BarChart2, BookOpen, TrendingUp, Zap, Shield } from 'lucide-react';
import { articles, tierList } from '@/data/meta';
import { sampleDecks } from '@/data/decks';
import { cards } from '@/data/cards';

const featureCards = [
  {
    icon: Database,
    title: 'カードデータベース',
    description: '全カードの情報を検索・フィルタ。色、コスト、レアリティで絞り込み。',
    href: '/cards',
    color: 'text-blue-400',
    bg: 'bg-blue-950/30 border-blue-800/50',
  },
  {
    icon: Layers,
    title: 'デッキビルダー',
    description: 'オリジナルデッキを作成・保存・共有。リーダーを選んで構築開始。',
    href: '/deck-builder',
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
  { label: 'カード総数', value: String(cards.length) + '+', icon: Database },
  { label: 'サンプルデッキ', value: String(sampleDecks.length), icon: Layers },
  { label: 'Tierリスト収録', value: String(tierList.length), icon: TrendingUp },
  { label: '攻略記事', value: String(articles.length), icon: BookOpen },
];

export default function HomePage() {
  const topTier = tierList.filter((t) => t.tier === 'S');
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/10 to-transparent rounded-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-yellow-600/20 border border-yellow-600/40 rounded-full px-4 py-1.5 text-yellow-400 text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            OP02 PARAMOUNT WAR 対応
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
            ONE PIECE カードゲーム
            <br />
            <span className="text-yellow-400">攻略サイト</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            カードDB・デッキビルダー・環境Tier・攻略記事を完備。
            <br />
            初心者から競技プレイヤーまで使える本格的な攻略情報を提供します。
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/cards"
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg transition-colors"
            >
              カードを検索する
            </Link>
            <Link
              href="/deck-builder"
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg border border-gray-700 transition-colors"
            >
              デッキを作る
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
        <div className="grid md:grid-cols-2 gap-4">
          {topTier.map((entry) => (
            <div
              key={entry.leaderId}
              className="bg-gray-900 border border-yellow-600/30 rounded-xl p-5 flex items-start gap-4"
            >
              <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg px-3 py-2 text-yellow-400 font-black text-2xl min-w-[60px] text-center">
                S
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
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
                            : c === 'Purple'
                            ? '#9333ea'
                            : '#374151',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                  <span
                    className={`text-xs font-bold ${
                      entry.trend === 'up'
                        ? 'text-green-400'
                        : entry.trend === 'down'
                        ? 'text-red-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {entry.trend === 'up' ? '↑' : entry.trend === 'down' ? '↓' : '→'}
                  </span>
                </div>
                <p className="font-bold text-white">{entry.leaderNameJa}</p>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{entry.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>勝率: <span className="text-green-400 font-bold">{entry.winRate}%</span></span>
                  <span>使用率: <span className="text-blue-400 font-bold">{entry.popularity}%</span></span>
                </div>
              </div>
            </div>
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
