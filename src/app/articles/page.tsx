'use client';

import Link from 'next/link';
import { BookOpen, Clock, Tag } from 'lucide-react';
import { useArticlesStore } from '@/lib/articlesStore';

const categoryColors: Record<string, string> = {
  beginner: 'bg-green-600/20 text-green-400 border-green-600/30',
  'deck-guide': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  meta: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  strategy: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
};

export default function ArticlesPage() {
  const { articles, loaded } = useArticlesStore();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-yellow-500" />
          攻略記事
        </h1>
        <p className="text-gray-400 mt-1">プレイング解説・デッキガイド・環境分析</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <article className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-full hover:border-gray-700 hover:bg-gray-800/50 transition-all flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                    categoryColors[article.category] ?? 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                  }`}
                >
                  {article.categoryLabel}
                </span>
              </div>
              <h2 className="text-white font-bold text-lg leading-snug mb-2">{article.title}</h2>
              <p className="text-gray-400 text-sm flex-1 line-clamp-3">{article.summary}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500">
                <span className="font-medium">{article.author}</span>
                <div className="flex items-center gap-3">
                  <span>{article.publishedAt}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}分
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-16 text-gray-500">記事がありません</div>
      )}
    </div>
  );
}
