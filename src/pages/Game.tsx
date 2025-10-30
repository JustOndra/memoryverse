import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import { useFlipCard } from '../hooks/useFlipCard';
import { fetchGameData } from '../services/api';
import { GameSettings } from '../types';

interface GameProps {
  settings: GameSettings;
  score: number;
  setScore: (score: number) => void;
  timer: number;
  onRestart: () => void;
  onReturnToMenu: () => void;
}

const Game = ({
  settings,
  score,
  setScore,
  timer,
  onRestart,
  onReturnToMenu,
}: GameProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['game-data', settings.gameType],
    queryFn: () => fetchGameData(settings.gameType),
  });

  // Custom hook for flipping logic
  const { flippedCards, matchedCards, handleFlip } = useFlipCard(data, {
    onMatch: () => setScore(score + 10),
  });

  // Format timer as mm:ss
  const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-row justify-between w-full max-w-2xl mb-4">
        <button
          className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
          onClick={onReturnToMenu}
        >
          Return to Main Menu
        </button>
        <button
          className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
          onClick={onRestart}
        >
          Restart Game
        </button>
      </div>
      <div className="flex flex-row justify-between w-full max-w-2xl mb-2">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="text-lg font-bold">
          Time: {minutes}:{seconds}
        </div>
      </div>
      <div className={`grid grid-cols-4 gap-4 perspective`}>
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
