export const shuffleCards = <T>(data: T[]): T[] => {
  return [...data].sort(() => Math.random() - 0.5);
};

export const randomNumbers = (): number => {
  const MIN_POKEMON_ID = 1;
  const MAX_POKEMON_ID = 151; // Limiting to original 151 Pokemon
  return (
    Math.floor(Math.random() * (MAX_POKEMON_ID - MIN_POKEMON_ID + 1)) +
    MIN_POKEMON_ID
  );
};
