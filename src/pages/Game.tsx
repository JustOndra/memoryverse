import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
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
  onGameWon?: (score: number, time: number) => void;
  resetTrigger?: number;
}

const Game = ({
  settings,
  score,
  setScore,
  timer,
  onRestart,
  onReturnToMenu,
  onGameWon,
  resetTrigger,
}: GameProps) => {
  const gameWonRef = useRef(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['game-data', settings.gameType],
    queryFn: () => fetchGameData(settings.gameType),
  });

  // Calculate score based on streak: base 10 points + multiplier for streaks
  const calculateScore = (streak: number) => {
    const basePoints = 10;
    if (streak === 1) return basePoints; // First match: 10 points
    if (streak === 2) return basePoints * 1.5; // 2x streak: 15 points
    if (streak === 3) return basePoints * 2; // 3x streak: 20 points
    if (streak >= 4) return basePoints * 2.5; // 4+ streak: 25 points
    return basePoints;
  };

  const { flippedCards, matchedCards, handleFlip, streak } = useFlipCard(data, {
    onMatch: (currentStreak) => {
      const points = calculateScore(currentStreak);
      setScore(score + points);
    },
    resetTrigger,
  });

  // Reset gameWonRef when game is restarted
  useEffect(() => {
    gameWonRef.current = false;
  }, [resetTrigger]);

  // Check for win condition
  useEffect(() => {
    if (
      data &&
      matchedCards.length === data.length / 2 &&
      matchedCards.length > 0
    ) {
      if (onGameWon && !gameWonRef.current) {
        gameWonRef.current = true;
        onGameWon(score, timer);
      }
    }
  }, [matchedCards, data, score, timer, onGameWon]);

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

      {/* Player Info Section */}
      <div className="w-full max-w-2xl mb-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border-2 border-violet-400/50">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 font-medium">Player</span>
              <span className="text-2xl font-bold text-violet-600">
                {settings.playerName}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 font-medium">Score</span>
              <span className="text-2xl font-bold text-blue-600">{score}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 font-medium">Streak</span>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-orange-600">
                  {streak}
                </span>
                {streak >= 2 && (
                  <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-full">
                    {streak === 2 ? '1.5x' : streak === 3 ? '2x' : '2.5x'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600 font-medium">Time</span>
              <span className="text-2xl font-bold text-green-600">
                {minutes}:{seconds}
              </span>
            </div>
          </div>
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
