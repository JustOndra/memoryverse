import { useQuery } from '@tanstack/react-query';
import { loadPokemon } from './utils/pokemon';
import Game from './pages/Game';

function App() {
  const queryFn = loadPokemon;

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['pokemons'],
    queryFn: queryFn,
  });

  if (isError) {
    return <p>{error.message}</p>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-b from-teal-400 to-blue-500">
      {data && <Game data={data} />}
    </div>
  );
}

export default App;
