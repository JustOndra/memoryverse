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

export interface SimpsonsData {
  id: number;
  name: string;
  portrait_path: string;
  occupation: string;
  gender: string;
  status: string;
}

export type GameType = 'pokemon' | 'fortnite' | 'simpsons';

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

export interface Score {
  id: string;
  player_name: string;
  score: number;
  game_type: string;
  time_seconds: number | null;
  streak_best: number;
  created_at: string;
}
