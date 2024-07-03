import axios from 'axios';
import { PokemonData } from '../types';
import { randomNumbers, shuffleCards } from './utils';

export const loadPokemon = async () => {
  const randomIds = new Set();
  while (randomIds.size < 8) {
    randomIds.add(randomNumbers());
  }
  const pokePromises = [...randomIds].map((id) =>
    axios
      .get(process.env.POKE_API_URL! + id)
      .then<PokemonData>((res) => res.data)
  );

  const results = await Promise.all(pokePromises);
  const pokemon = [...results, ...results];
  return shuffleCards(pokemon);
};
