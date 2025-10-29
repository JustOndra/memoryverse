import { MAX_POKEMON_ID, MIN_POKEMON_ID } from '../constants';

export const shuffleCards = <T>(data: T[]): T[] => {
  return [...data].sort(() => Math.random() - 0.5);
};

export const randomNumbers = (): number => {
  return (
    Math.floor(Math.random() * (MAX_POKEMON_ID - MIN_POKEMON_ID + 1)) +
    MIN_POKEMON_ID
  );
};
