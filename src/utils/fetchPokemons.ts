import axios from 'axios';

export type PokemonData = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
};

const randomNumbers = () => {
  return Math.floor(Math.random() * 101);
};

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
  return sortResults(pokemon);
};

const sortResults = (data: PokemonData[]) => {
  return data.sort((_) => Math.random() - 0.5);
};
