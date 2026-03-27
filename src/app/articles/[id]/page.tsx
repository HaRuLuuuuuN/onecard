import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Tag, BookOpen } from 'lucide-react';
import { articles } from '@/data/meta';

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ id: a.id }));
}

const categoryColors: Record<string, string> = {
  beginner: 'bg-green-600/20 text-green-400 border-green-600/30',
  'deck-guide': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  meta: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  strategy: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
};

function renderContent(content: string) {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      result.push(
        <h2 key={key++} className="text-2xl font-black text-white mt-8 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      result.push(
        <h3 key={key++} className="text-lg font-bold text-white mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      result.push(
        <li key={key++} className="text-gray-300 ml-4 mb-1">
          {line.slice(2)}
        </li>
      );
    } else if (line.startsWith('**') && line.endsWith('**')) {
      result.push(
        <p key={key++} className="text-white font-bold mb-2">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.trim() === '') {
      result.push(<div key={key++} className="mb-2" />);
    } else {
      result.push(
        <p key={key++} className="text-gray-300 leading-relaxed mb-3">
          {line}
        </p>
      );
    }
  }
  return result;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;
  const article = articles.find((a) => a.id === id);
  if (!article) notFound();

  const relatedArticles = articles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/articles"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        記事一覧に戻る
      </Link>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
              categoryColors[article.category] ?? 'bg-gray-700/30 text-gray-400 border-gray-600/30'
            }`}
          >
            {article.categoryLabel}
          </span>
        </div>

        <h1 className="text-3xl font-black text-white mb-4 leading-snug">{article.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-800">
          <span className="text-white font-medium">{article.author}</span>
          <span>{article.publishedAt}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}分で読める
          </span>
        </div>

        {/* Summary */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 my-6">
          <p className="text-yellow-300 font-medium text-sm">{article.summary}</p>
        </div>

        {/* Content */}
        <div className="prose-custom">{renderContent(article.content)}</div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-800">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 bg-gray-800 text-gray-400 px-3 py-1.5 rounded-lg text-sm"
            >
              <Tag className="w-3.5 h-3.5" />
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div>
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-500" />
            関連記事
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {relatedArticles.map((a) => (
              <Link key={a.id} href={`/articles/${a.id}`}>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors h-full">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      categoryColors[a.category] ?? 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                    }`}
                  >
                    {a.categoryLabel}
                  </span>
                  <p className="text-white font-bold text-sm mt-2 line-clamp-2">{a.title}</p>
                  <p className="text-gray-500 text-xs mt-2">{a.readTime}分</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
