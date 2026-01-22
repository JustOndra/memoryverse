import React, { useEffect, useState } from 'react';
import { getTopScores } from '../services/supabase';
import { GameType, Score } from '../types';

interface LeaderboardsProps {
  onBack: () => void;
}

const Leaderboards: React.FC<LeaderboardsProps> = ({ onBack }) => {
  const [selectedGameType, setSelectedGameType] = useState<GameType>('pokemon');
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedGameType]);

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTopScores(selectedGameType, 10);
      setScores(data || []);
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${rank + 1}.`;
    }
  };

  const getGameTypeColor = (gameType: GameType) => {
    switch (gameType) {
      case 'pokemon':
        return 'from-red-500 to-yellow-500';
      case 'fortnite':
        return 'from-blue-500 to-purple-500';
      case 'simpsons':
        return 'from-yellow-400 to-orange-500';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl max-w-4xl w-full">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-5xl font-bold text-center bg-linear-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl tracking-wider">
            Leaderboards
          </h1>
          <p className="text-center text-white text-lg mt-2 drop-shadow-lg font-medium">
            Top players across the universe
          </p>
        </div>

        {/* Game Type Selector */}
        <div className="flex gap-3 justify-center">
          {(['pokemon', 'fortnite', 'simpsons'] as GameType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedGameType(type)}
              className={`py-2 px-6 rounded-lg font-bold text-sm uppercase transition-all duration-200 ${
                selectedGameType === type
                  ? `bg-linear-to-r ${getGameTypeColor(type)} text-white shadow-lg scale-105`
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white/10 rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-white text-xl">
              Loading...
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400 text-xl">
              {error}
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12 text-white/70 text-xl">
              No scores yet. Be the first to play!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-left text-white font-bold uppercase text-sm">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-white font-bold uppercase text-sm">
                      Player
                    </th>
                    <th className="px-6 py-4 text-center text-white font-bold uppercase text-sm">
                      Score
                    </th>
                    <th className="px-6 py-4 text-center text-white font-bold uppercase text-sm">
                      Time
                    </th>
                    <th className="px-6 py-4 text-right text-white font-bold uppercase text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr
                      key={score.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        index < 3 ? 'bg-white/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-white font-bold text-lg">
                        {getMedalEmoji(index)}
                      </td>
                      <td className="px-6 py-4 text-white font-medium text-lg">
                        {score.player_name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-yellow-300 font-bold text-lg">
                          {score.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-blue-300 font-medium">
                        {formatTime(score.time_seconds)}
                      </td>
                      <td className="px-6 py-4 text-right text-white/70 text-sm">
                        {formatDate(score.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onBack}
            className="bg-linear-to-r from-gray-600 to-gray-700 text-white py-3 px-8 rounded-xl font-bold text-lg shadow-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 border-2 border-gray-400/50"
          >
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboards;
