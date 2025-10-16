export interface CardData {
  id: string | number;
  name: string;
  image: string;
}

export interface PokemonData {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export interface FortniteData {
  id: string;
  name: string;
  images: {
    icon: string;
    featured: string;
    smallIcon: string;
  };
  description: string;
  rarity: {
    value: string;
  };
}

export type GameType = 'pokemon' | 'fortnite';

export interface GameSettings {
  playerName: string;
  gameType: GameType;
}
