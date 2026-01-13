import React from 'react';
import { GameSettings, GameType } from '../types';

interface NewGameSetupProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onStartPlaying: (e: React.FormEvent) => void;
  onBack: () => void;
}

const NewGameSetup: React.FC<NewGameSetupProps> = ({
  settings,
  onSettingsChange,
  onStartPlaying,
  onBack,
}) => {
  const handleMultiplayerToggle = (enabled: boolean) => {
    onSettingsChange({
      ...settings,
      isMultiplayer: enabled,
      players: enabled
        ? [
            {
              id: '1',
              name: settings.playerName || 'Player 1',
              score: 0,
              isActive: true,
            },
            { id: '2', name: '', score: 0, isActive: false },
          ]
        : [],
    });
  };

  const handlePlayer1NameChange = (name: string) => {
    const updatedPlayers =
      settings.isMultiplayer && settings.players
        ? settings.players.map((p, i) => (i === 0 ? { ...p, name } : p))
        : [];
    onSettingsChange({
      ...settings,
      playerName: name,
      players: updatedPlayers,
    });
  };

  const handlePlayer2NameChange = (name: string) => {
    if (settings.players) {
      const updatedPlayers = settings.players.map((p, i) =>
        i === 1 ? { ...p, name } : p
      );
      onSettingsChange({
        ...settings,
        players: updatedPlayers,
      });
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-3xl p-10 border border-white/20 shadow-2xl">
      <div className="flex flex-col items-center gap-6 w-96">
        <div className="mb-4">
          <h2 className="text-5xl font-bold text-center bg-linear-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
            New Game
          </h2>
          <p className="text-center text-white text-base mt-2 drop-shadow-lg">
            Configure your adventure
          </p>
        </div>

        <form onSubmit={onStartPlaying} className="flex flex-col gap-5 w-full">
          <div className="flex items-center justify-between bg-white/10 rounded-xl p-4 border border-white/20">>
            <span className="text-white font-semibold text-lg drop-shadow-lg">
              Two Players
            </span>
            <button
              type="button"
              onClick={() => handleMultiplayerToggle(!settings.isMultiplayer)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                settings.isMultiplayer ? 'bg-violet-600' : 'bg-gray-400'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  settings.isMultiplayer ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold text-lg drop-shadow-lg">
              {settings.isMultiplayer ? 'Player 1 Name' : 'Player Name'}
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={settings.playerName}
              onChange={(e) => handlePlayer1NameChange(e.target.value)}
              className="p-4 rounded-xl border-2 border-violet-400/50 bg-white/90 backdrop-blur-sm text-lg font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 focus:border-violet-500"
              required
            />
          </div>

          {settings.isMultiplayer && (
            <div className="flex flex-col gap-2">
              <label className="text-white font-semibold text-lg drop-shadow-lg">
                Player 2 Name
              </label>
              <input
                type="text"
                placeholder="Enter second player name"
                value={settings.players?.[1]?.name || ''}
                onChange={(e) => handlePlayer2NameChange(e.target.value)}
                className="p-4 rounded-xl border-2 border-fuchsia-400/50 bg-white/90 backdrop-blur-sm text-lg font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 focus:border-fuchsia-500"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-white font-semibold text-lg drop-shadow-lg">
              Game Theme
            </label>
            <select
              value={settings.gameType}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  gameType: e.target.value as GameType,
                })
              }
              className="p-4 rounded-xl border-2 border-violet-400/50 bg-white/90 backdrop-blur-sm text-lg font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-violet-500/50 focus:border-violet-500 cursor-pointer"
            >
              <option value="pokemon">🎮 Pokemon</option>
              <option value="fortnite">🎯 Fortnite</option>
              <option value="simpsons">🍩 Simpsons</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-violet-600 to-fuchsia-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:from-violet-700 hover:to-fuchsia-700 transform hover:scale-105 transition-all duration-200 border-2 border-violet-300/50 mt-2"
          >
            Start Game
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-8 rounded-xl font-semibold text-lg shadow-xl hover:bg-white/30 transform hover:scale-105 transition-all duration-200 border-2 border-white/30"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewGameSetup;
