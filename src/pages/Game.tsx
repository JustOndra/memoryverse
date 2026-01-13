import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import Card from '../components/Card';
import { useFlipCard } from '../hooks/useFlipCard';
import { fetchGameData } from '../services/api';
import { GameSettings, Player } from '../types';

interface GameProps {
  settings: GameSettings;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  activePlayerIndex: number;
  setActivePlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  timer: number;
  onRestart: () => void;
  onReturnToMenu: () => void;
  onGameWon?: (score: number, time: number, players: Player[]) => void;
  resetTrigger?: number;
}

const Game = ({
  settings,
  score,
  setScore,
  players,
  setPlayers,
  activePlayerIndex,
  setActivePlayerIndex,
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

  const calculateScore = (streak: number) => {
    const basePoints = 10;
    if (streak === 2) return basePoints * 1.5;
    if (streak === 3) return basePoints * 2;
    if (streak >= 4) return basePoints * 2.5;
    return basePoints;
  };

  const switchPlayer = () => {
    if (settings.isMultiplayer && players.length > 1) {
      setActivePlayerIndex((prev) => (prev + 1) % players.length);
    }
  };

  const { flippedCards, matchedCards, handleFlip, streak } = useFlipCard(data, {
    onMatch: (currentStreak) => {
      const points = calculateScore(currentStreak);
      if (settings.isMultiplayer && players.length > 1) {
        setPlayers((prev) =>
          prev.map((p, idx) =>
            idx === activePlayerIndex ? { ...p, score: p.score + points } : p
          )
        );
      } else {
        setScore((prevScore) => prevScore + points);
      }
    },
    onMismatch: () => {
      switchPlayer();
    },
    resetTrigger,
  });

  useEffect(() => {
    gameWonRef.current = false;
  }, [resetTrigger]);

  useEffect(() => {
    if (
      data &&
      matchedCards.length === data.length / 2 &&
      matchedCards.length > 0
    ) {
      if (onGameWon && !gameWonRef.current) {
        gameWonRef.current = true;
        onGameWon(score, timer, players);
      }
    }
  }, [matchedCards, data, score, timer, onGameWon, players]);

  const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (timer % 60).toString().padStart(2, '0');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border-2 border-violet-400/50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
            <p className="text-xl font-semibold text-violet-600">
              Loading cards...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-[400px]">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border-2 border-red-400/50">
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl font-semibold text-red-600">
              Failed to load game data
            </p>
            <button
              className="bg-violet-500 text-white py-2 px-6 rounded-lg hover:bg-violet-600 transition-colors"
              onClick={onReturnToMenu}
            >
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="w-full max-w-2xl mb-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border-2 border-violet-400/50">
          <div className="flex flex-row justify-between items-center">
            <div
              className={`flex flex-col p-2 rounded-lg transition-all ${
                settings.isMultiplayer && activePlayerIndex === 0
                  ? 'bg-violet-100 ring-2 ring-violet-500'
                  : ''
              }`}
            >
              <span className="text-sm text-gray-600 font-medium">
                {settings.isMultiplayer ? 'Player 1' : 'Player'}
              </span>
              <span className="text-2xl font-bold text-violet-600">
                {settings.isMultiplayer && players[0]
                  ? players[0].name
                  : settings.playerName}
              </span>
              {settings.isMultiplayer && players[0] && (
                <span className="text-lg font-semibold text-blue-600">
                  {players[0].score} pts
                </span>
              )}
            </div>

            {settings.isMultiplayer && players[1] && (
              <div
                className={`flex flex-col p-2 rounded-lg transition-all ${
                  activePlayerIndex === 1
                    ? 'bg-fuchsia-100 ring-2 ring-fuchsia-500'
                    : ''
                }`}
              >
                <span className="text-sm text-gray-600 font-medium">
                  Player 2
                </span>
                <span className="text-2xl font-bold text-fuchsia-600">
                  {players[1].name}
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {players[1].score} pts
                </span>
              </div>
            )}

            {!settings.isMultiplayer && (
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-600 font-medium">Score</span>
                <span className="text-2xl font-bold text-blue-600">
                  {score}
                </span>
              </div>
            )}

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
            key={`${card.id}-${index}`}
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
