export type TierLevel = 'S' | 'A+' | 'A' | 'B+';
export type CardColorJa = '赤' | '青' | '緑' | '黄' | '紫' | '黒';

export interface TierEntry {
  id: string;
  name: string;
  colors: CardColorJa[];
  tier: TierLevel;
  trend: 'up' | 'down' | 'stable';
  imageUrl?: string;
}

export interface TierData {
  edition: string;
  editionName: string;
  updatedAt: string;
  entries: TierEntry[];
}

export const defaultTierData: TierData = {
  edition: 'OP-15',
  editionName: '神の島の冒険',
  updatedAt: '2026/3/3',
  entries: [
    // S (Tier1)
    { id: 's-1', name: '青黄ハンコック', colors: ['青', '黄'], tier: 'S', trend: 'stable' },
    { id: 's-2', name: '赤青ルーシー', colors: ['赤', '青'], tier: 'S', trend: 'up' },
    { id: 's-3', name: '紫エネル', colors: ['紫'], tier: 'S', trend: 'up' },
    // A+ (Tier1.5)
    { id: 'ap-1', name: '赤青エース', colors: ['赤', '青'], tier: 'A+', trend: 'stable' },
    { id: 'ap-2', name: '黒イム', colors: ['黒'], tier: 'A+', trend: 'stable' },
    { id: 'ap-3', name: '紫ドフラ', colors: ['紫'], tier: 'A+', trend: 'up' },
    { id: 'ap-4', name: '緑ミホーク', colors: ['緑'], tier: 'A+', trend: 'stable' },
    { id: 'ap-5', name: '赤黒サボ', colors: ['赤', '黒'], tier: 'A+', trend: 'stable' },
    { id: 'ap-6', name: '紫黄ロシナンテ', colors: ['紫', '黄'], tier: 'A+', trend: 'stable' },
    { id: 'ap-7', name: '赤黒コビー', colors: ['赤', '黒'], tier: 'A+', trend: 'up' },
    { id: 'ap-8', name: '緑黒ブルック', colors: ['緑', '黒'], tier: 'A+', trend: 'up' },
    // A (Tier2)
    { id: 'a-1', name: '青黄ナミ', colors: ['青', '黄'], tier: 'A', trend: 'stable' },
    { id: 'a-2', name: '青紫ルフィ', colors: ['青', '紫'], tier: 'A', trend: 'down' },
    { id: 'a-3', name: '黒クロコダイル', colors: ['黒'], tier: 'A', trend: 'stable' },
    { id: 'a-4', name: '青紫サンジ', colors: ['青', '紫'], tier: 'A', trend: 'down' },
    { id: 'a-5', name: '緑ゾロ', colors: ['緑'], tier: 'A', trend: 'stable' },
    { id: 'a-6', name: '赤青ビビ', colors: ['赤', '青'], tier: 'A', trend: 'up' },
    { id: 'a-7', name: '赤黄ボニー', colors: ['赤', '黄'], tier: 'A', trend: 'stable' },
    { id: 'a-8', name: '緑黄しらほし', colors: ['緑', '黄'], tier: 'A', trend: 'stable' },
    { id: 'a-9', name: '空島ルフィ', colors: ['赤'], tier: 'A', trend: 'up' },
    { id: 'a-10', name: '黄カルガラ', colors: ['黄'], tier: 'A', trend: 'up' },
    // B+ (Tier2.5)
    { id: 'bp-1', name: '青クザン', colors: ['青'], tier: 'B+', trend: 'down' },
    { id: 'bp-2', name: '青ジンベエ', colors: ['青'], tier: 'B+', trend: 'stable' },
    { id: 'bp-3', name: '緑ボニー', colors: ['緑'], tier: 'B+', trend: 'stable' },
    { id: 'bp-4', name: '赤緑スモーカー', colors: ['赤', '緑'], tier: 'B+', trend: 'stable' },
    { id: 'bp-5', name: 'エグヘルフィ', colors: ['赤'], tier: 'B+', trend: 'stable' },
    { id: 'bp-6', name: '赤緑ルフィ', colors: ['赤', '緑'], tier: 'B+', trend: 'up' },
    { id: 'bp-7', name: '赤緑クリーク', colors: ['赤', '緑'], tier: 'B+', trend: 'up' },
    { id: 'bp-8', name: '黒黄モリア', colors: ['黒', '黄'], tier: 'B+', trend: 'up' },
    { id: 'bp-9', name: '黒ルッチ', colors: ['黒'], tier: 'B+', trend: 'stable' },
    { id: 'bp-10', name: '紫黒ルフィ', colors: ['紫', '黒'], tier: 'B+', trend: 'up' },
  ],
};

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
    title: '最新環境分析：OP15参入後のTierリスト',
    category: 'meta',
    categoryLabel: 'メタ分析',
    summary:
      '神の島の冒険 (OP15) 発売後の環境変化を分析。新たなTierリストと各デッキの立ち位置を解説。',
    content: `## 環境概況

OP15「神の島の冒険」の発売により、青黄・赤青カラーが大幅に強化されました。
特に青黄ハンコックと赤青ルーシーが環境トップに君臨しています。

## Tier S

### 青黄ハンコック
圧倒的なコントロール性能でTier1に。

### 赤青ルーシー
速攻力とコントロールを兼ね備えた万能デッキ。

## 環境の注目ポイント

OP15環境では多色デッキが台頭。単色デッキは苦戦を強いられる場面が増えています。`,
    author: 'MetaWatcher',
    publishedAt: '2026-03-05',
    readTime: 10,
    tags: ['メタ', 'OP15', 'Tierリスト'],
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
