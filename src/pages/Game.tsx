import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import { useMemoryGame } from '../hooks/useMemoryGame';
import { fetchGameData } from '../services/api';
import { GameSettings } from '../types';

interface GameProps {
  settings: GameSettings;
}

const Game = ({ settings }: GameProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['game-data', settings.gameType],
    queryFn: () => fetchGameData(settings.gameType),
  });

  const { flippedCards, matchedCards, handleFlip } = useMemoryGame(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="grid grid-cols-4 gap-4 perspective">
        {data?.map((card, index) => (
          <Card
            key={index}
            card={card}
            index={index}
            isFlipped={flippedCards.includes(index)}
            isMatched={matchedCards.includes(card.id)}
            handleFlip={handleFlip}
            gameType={settings.gameType}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
