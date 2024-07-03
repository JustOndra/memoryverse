import { PokemonData } from '../types';

export const shuffleCards = (data: PokemonData[]) => {
  return data.sort(() => Math.random() - 0.5);
};

export const randomNumbers = () => {
  return Math.floor(Math.random() * 101);
};
