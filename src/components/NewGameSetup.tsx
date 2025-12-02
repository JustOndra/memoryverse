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
  return (
    <div className="flex flex-col items-center gap-6 w-96">
      <div className="mb-4">
        <h2 className="text-5xl font-bold text-center bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
          New Game
        </h2>
        <p className="text-center text-white text-base mt-2 drop-shadow-lg">
          Configure your adventure
        </p>
      </div>

      <form onSubmit={onStartPlaying} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold text-lg drop-shadow-lg">
            Player Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={settings.playerName}
            onChange={(e) =>
              onSettingsChange({ ...settings, playerName: e.target.value })
            }
            className="p-4 rounded-xl border-2 border-purple-400/50 bg-white/90 backdrop-blur-sm text-lg font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500"
            required
          />
        </div>

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
            className="p-4 rounded-xl border-2 border-purple-400/50 bg-white/90 backdrop-blur-sm text-lg font-medium shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 cursor-pointer"
          >
            <option value="pokemon">🎮 Pokemon</option>
            <option value="fortnite">🎯 Fortnite</option>
            <option value="starwars">⭐ Star Wars</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 border-2 border-purple-400/50 mt-2"
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
  );
};

export default NewGameSetup;
