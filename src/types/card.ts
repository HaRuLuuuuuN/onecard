export type CardColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Purple' | 'Black' | 'Multi';
export type CardType = 'Leader' | 'Character' | 'Event' | 'Stage';
export type CardAttribute = 'Strike' | 'Slash' | 'Ranged' | 'Special' | 'Wisdom';
export type CardRarity = 'C' | 'UC' | 'R' | 'SR' | 'L' | 'SEC' | 'P';

export interface Card {
  id: string;
  name: string;
  nameJa: string;
  color: CardColor[];
  type: CardType;
  cost?: number;
  power?: number;
  counter?: number;
  life?: number;
  attribute?: CardAttribute;
  ability: string;
  abilityJa: string;
  set: string;
  setName: string;
  rarity: CardRarity;
  imageUrl?: string;
  affiliations: string[];
}

export interface DeckCard {
  card: Card;
  count: number;
}

export interface Deck {
  id: string;
  name: string;
  leader: Card;
  cards: DeckCard[];
  description: string;
  author: string;
  createdAt: string;
  tags: string[];
  likes: number;
}
