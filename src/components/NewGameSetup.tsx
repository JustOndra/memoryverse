
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
    <form onSubmit={onStartPlaying} className="flex flex-col gap-4 w-64">
      <input
        type="text"
        placeholder="Enter your name"
        value={settings.playerName}
        onChange={(e) =>
          onSettingsChange({ ...settings, playerName: e.target.value })
        }
        className="p-2 rounded border"
        required
      />
      <select
        value={settings.gameType}
        onChange={(e) =>
          onSettingsChange({
            ...settings,
            gameType: e.target.value as GameType,
          })
        }
        className="p-2 rounded border"
      >
        <option value="pokemon">Pokemon</option>
        <option value="fortnite">Fortnite</option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Start Game
      </button>
      <button
        type="button"
        onClick={onBack}
        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Back
      </button>
    </form>
  );
};

export default NewGameSetup;
