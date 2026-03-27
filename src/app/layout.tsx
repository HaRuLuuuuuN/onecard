import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ONECARD攻略 - ワンピースカードゲーム攻略サイト',
  description:
    'ワンピースカードゲームの攻略情報を提供するサイト。カードDB、デッキビルダー、環境Tierリスト、攻略記事など。',
  keywords: ['ワンピース', 'カードゲーム', '攻略', 'デッキ', 'Tier', 'ONE PIECE'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        <footer className="border-t border-gray-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-black text-lg">ONE</span>
                <span className="text-white font-black text-lg">CARD攻略</span>
              </div>
              <p className="text-gray-500 text-sm">
                ※当サイトはファンサイトです。ONE PIECEはOda Eiichiro / Shueisha の著作物です。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
