import { Deck } from '@/types/card';
import { cards } from './cards';

export const sampleDecks: Deck[] = [
  {
    id: 'deck-001',
    name: '赤ルフィ 速攻型',
    leader: cards.find((c) => c.id === 'OP01-001')!,
    cards: [
      { card: cards.find((c) => c.id === 'OP01-024')!, count: 4 },
      { card: cards.find((c) => c.id === 'OP01-025')!, count: 4 },
      { card: cards.find((c) => c.id === 'OP01-016')!, count: 4 },
      { card: cards.find((c) => c.id === 'OP01-017')!, count: 4 },
      { card: cards.find((c) => c.id === 'OP01-003')!, count: 4 },
      { card: cards.find((c) => c.id === 'OP01-033')!, count: 4 },
    ].filter((d) => d.card !== undefined),
    description:
      '速攻キャラを多数採用した攻撃的なデッキ。リーダー効果でコスト5以下のキャラに速攻を付与し、一気に攻め込む。序盤から積極的にアタックし、相手のライフを削ることを優先。',
    author: 'OneCardAdmin',
    createdAt: '2024-12-01',
    tags: ['速攻', '赤', '初心者向け', '環境デッキ'],
    likes: 342,
  },
  {
    id: 'deck-002',
    name: '青ロー バウンス型',
    leader: cards.find((c) => c.id === 'OP01-060')!,
    cards: [
      { card: cards.find((c) => c.id === 'OP01-062')!, count: 4 },
    ].filter((d) => d.card !== undefined),
    description:
      '相手のキャラをバウンスしながら展開を制御するコントロールデッキ。リーダー効果でコスト3以下のキャラを毎ターン戻せるため、相手の盤面を常に薄い状態に保てる。',
    author: 'Tactician_Blue',
    createdAt: '2024-12-05',
    tags: ['コントロール', '青', '上級者向け'],
    likes: 218,
  },
  {
    id: 'deck-003',
    name: '紫白ひげ 展開型',
    leader: cards.find((c) => c.id === 'OP02-001')!,
    cards: [
      { card: cards.find((c) => c.id === 'OP02-002')!, count: 4 },
      { card: cards.find((c) => c.id === 'OP02-013')!, count: 4 },
    ].filter((d) => d.card !== undefined),
    description:
      'リーダー効果でDON!!を戻してキャラを展開するアグロデッキ。マルコのブロッカー効果で守りも固い。白ひげ海賊団のキャラを大量に採用し、シナジーを活かして戦う。',
    author: 'NewgateStrong',
    createdAt: '2024-12-10',
    tags: ['アグロ', '紫', '中級者向け', '環境デッキ'],
    likes: 189,
  },
];
