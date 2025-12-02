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

export interface StarWarsData {
  id: number;
  name: string;
  image: string;
  gender: string;
  species: string;
  homeworld: string;
}

export type GameType = 'pokemon' | 'fortnite' | 'starwars';

export interface Player {
  id: string;
  name: string;
  score: number;
  isActive?: boolean;
}

export interface GameSettings {
  playerName: string;
  gameType: GameType;
  isMultiplayer?: boolean;
  players?: Player[];
}
