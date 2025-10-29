import { MAX_POKEMON_ID, MIN_POKEMON_ID } from '../constants';
import { CardData, FortniteData, PokemonData, StarWarsData } from '../types';

export const shuffleCards = <T>(data: T[]): T[] => {
  return [...data].sort(() => Math.random() - 0.5);
};

export const randomNumbers = (): number => {
  return (
    Math.floor(Math.random() * (MAX_POKEMON_ID - MIN_POKEMON_ID + 1)) +
    MIN_POKEMON_ID
  );
};

export const transformPokemonData = (data: PokemonData): CardData => ({
  id: data.id,
  name: data.name,
  image: data.sprites.front_default,
});

export const transformFortniteData = (data: FortniteData): CardData => ({
  id: data.id.toLowerCase(),
  name: data.name,
  image: data.images.icon ?? data.images.smallIcon,
});

export const transformStarWarsData = (data: StarWarsData): CardData => ({
  id: data.id,
  name: data.name,
  image: data.image,
});
