export interface TierEntry {
  leaderId: string;
  leaderName: string;
  leaderNameJa: string;
  color: string[];
  tier: 'S' | 'A' | 'B' | 'C';
  winRate: number;
  popularity: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

export const tierList: TierEntry[] = [
  {
    leaderId: 'OP01-001',
    leaderName: 'Monkey D. Luffy',
    leaderNameJa: 'モンキー・D・ルフィ (OP01)',
    color: ['Red'],
    tier: 'S',
    winRate: 58.2,
    popularity: 24.5,
    trend: 'stable',
    description:
      'コスト5以下への速攻付与が強力。序盤から一気にライフを削れる攻撃的なリーダー。環境最強格として長期間君臨。',
  },
  {
    leaderId: 'OP02-001',
    leaderName: 'Edward Newgate',
    leaderNameJa: 'エドワード・ニューゲート (OP02)',
    color: ['Purple'],
    tier: 'S',
    winRate: 56.8,
    popularity: 18.2,
    trend: 'up',
    description:
      'DON!!を戻してキャラを展開するリーダー。高コストキャラを素早く展開でき、圧倒的なボードアドバンテージを獲得。',
  },
  {
    leaderId: 'OP01-060',
    leaderName: 'Trafalgar Law',
    leaderNameJa: 'トラファルガー・ロー (OP01)',
    color: ['Blue'],
    tier: 'A',
    winRate: 53.1,
    popularity: 15.8,
    trend: 'stable',
    description:
      'バウンス効果で相手の展開を阻害するコントロールリーダー。テクニカルで上位者に人気。',
  },
  {
    leaderId: 'OP01-091',
    leaderName: 'Charlotte Katakuri',
    leaderNameJa: 'シャーロット・カタクリ (OP01)',
    color: ['Black'],
    tier: 'A',
    winRate: 52.4,
    popularity: 12.3,
    trend: 'down',
    description:
      'デッキトップを操作してDON!!を回収できるリーダー。安定性が高く、長期戦に強い。',
  },
  {
    leaderId: 'OP02-049',
    leaderName: 'Monkey D. Garp',
    leaderNameJa: 'モンキー・D・ガープ (OP02)',
    color: ['Blue'],
    tier: 'B',
    winRate: 49.7,
    popularity: 9.1,
    trend: 'up',
    description:
      '海軍タイプへのパワーバフが強力。海軍カードが増えるにつれて評価が上昇中。',
  },
];

export interface Article {
  id: string;
  title: string;
  category: 'beginner' | 'deck-guide' | 'meta' | 'strategy';
  categoryLabel: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  thumbnail?: string;
}

export const articles: Article[] = [
  {
    id: 'art-001',
    title: 'ワンピースカードゲーム 初心者ガイド：ゲームの基本ルール',
    category: 'beginner',
    categoryLabel: '初心者向け',
    summary:
      'ゲームの基本ルール、ターンの流れ、DON!!システムなど、はじめてプレイする方向けの総合ガイドです。',
    content: `## ゲームの概要

ワンピースカードゲームは、人気漫画「ONE PIECE」を題材にした対戦型カードゲームです。
各プレイヤーはリーダーカードとデッキ（50枚）でゲームをプレイします。

## 勝利条件

相手のライフカードをすべて取り除き、その後リーダーを攻撃することで勝利します。

## ターンの流れ

1. **リフレッシュフェイズ** - レストカードをアクティブにし、DON!!カードを追加
2. **ドローフェイズ** - カードを1枚ドロー
3. **DON!!フェイズ** - DON!!デッキからDON!!カードを2枚追加
4. **メインフェイズ** - キャラや道具をプレイ、起動効果を使用
5. **アタックフェイズ** - リーダーやキャラでアタック
6. **エンドフェイズ** - ターン終了

## DON!!システム

DON!!カードはゲームのリソースシステムです。カードを出したり効果を使うためのコストとして使用します。
また、DON!!をキャラにアタッチすることでパワーを上げることもできます。`,
    author: 'OneCardAdmin',
    publishedAt: '2024-11-15',
    readTime: 8,
    tags: ['初心者', 'ルール', 'DON!!'],
  },
  {
    id: 'art-002',
    title: '赤ルフィデッキ完全攻略ガイド【OP01】',
    category: 'deck-guide',
    categoryLabel: 'デッキガイド',
    summary:
      '環境Tier1の赤ルフィデッキを徹底解説。採用カード選択からプレイング理論まで詳しく解説します。',
    content: `## デッキコンセプト

赤ルフィデッキは、リーダー「モンキー・D・ルフィ」の起動効果でコスト5以下のキャラに速攻を付与し、
一気に相手のライフを削ることを狙うアグロデッキです。

## コアカード

- **ルフィ (5コスト)** - 速攻持ちのアタッカー
- **ゾロ** - ブロッカーで守りの要
- **サンジ** - パワーバフで盤面を強化

## プレイング指南

序盤はDON!!を確保しながら低コストキャラを展開。
中盤からリーダー効果を活用して積極的にアタック。
相手のライフが2以下になったら総攻撃で勝負を決める。

## マッチアップ

- vs 青ロー: バウンスに注意。速度で上回ることを意識。
- vs 黒カタクリ: 長期戦を避け、素早くライフを削る。`,
    author: 'RedDeckWins',
    publishedAt: '2024-12-01',
    readTime: 12,
    tags: ['赤', 'ルフィ', 'アグロ', 'OP01'],
  },
  {
    id: 'art-003',
    title: '最新環境分析：OP02参入後のTierリスト',
    category: 'meta',
    categoryLabel: 'メタ分析',
    summary:
      'PARAMOUNT WAR (OP02) 発売後の環境変化を分析。新たなTierリストと各デッキの立ち位置を解説。',
    content: `## 環境概況

OP02「頂上決戦」の発売により、紫色のカードが大幅に強化されました。
特に白ひげリーダーは圧倒的な展開力で環境トップに躍り出ています。

## Tier S

### 赤ルフィ
変わらぬ速攻力で環境最上位をキープ。

### 紫白ひげ
OP02の新リーダー。DON!!を戻すことで高コストキャラを素早く展開できる。

## 環境の注目ポイント

OP02環境では「ドン!!戻し」効果が強力なメカニズムとして確立されました。
これに対抗するため、青系のバウンスデッキが再評価されています。`,
    author: 'MetaWatcher',
    publishedAt: '2024-12-15',
    readTime: 10,
    tags: ['メタ', 'OP02', 'Tierリスト'],
  },
  {
    id: 'art-004',
    title: 'カウンター管理の重要性とプレイング基礎',
    category: 'strategy',
    categoryLabel: '戦略・テクニック',
    summary:
      'カウンターカードの効果的な使い方、手札管理の考え方など、上達するためのプレイング基礎を解説。',
    content: `## カウンターとは

カウンターカードは相手のアタック時に使用でき、自分のリーダーまたはキャラのパワーを上げることができます。

## カウンターの使い時

カウンターを使うべき状況：
- ライフが残り1枚で確実に守りたい時
- 重要なキャラが攻撃されている時
- アタックをブロックした後の追撃に対して

カウンターを温存すべき状況：
- ライフが多く残っている早期
- 相手の手札が少ない時（返しでの展開が弱い）

## 手札管理の考え方

理想的な手札枚数は5〜7枚。カウンターを使いながらも、
次のターンのプレイの選択肢を確保することが重要です。`,
    author: 'ProPlayer_Ken',
    publishedAt: '2024-12-20',
    readTime: 7,
    tags: ['テクニック', 'カウンター', '手札管理', '中級者'],
  },
];
