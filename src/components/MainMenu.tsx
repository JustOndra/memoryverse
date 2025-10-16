
import React from 'react';

interface MainMenuProps {
  onStartNewGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame }) => {
  return (
    <div className="flex flex-col gap-4 w-64">
      <button
        onClick={onStartNewGame}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        NEW GAME
      </button>
      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        LEADERBOARDS
      </button>
      <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        OPTIONS
      </button>
    </div>
  );
};

export default MainMenu;
