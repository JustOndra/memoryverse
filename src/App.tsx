import { useQuery } from '@tanstack/react-query';
import { loadPokemon } from './utils/fetchPokemons';
import Card from './components/Card';

function App() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['pokemons'],
    queryFn: loadPokemon,
  });

  if (isError) {
    return <p>{error.message}</p>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container m-auto h-screen">
        <div className="grid grid-cols-4 justify-center items-center h-full">
          {data.map((pokemon, index) => (
            <Card
              name={pokemon.name}
              id={pokemon.id}
              sprites={pokemon.sprites}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
