import React from 'react';

interface MainMenuProps {
  onStartNewGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartNewGame }) => {
  return (
    <div className="flex flex-col items-center gap-6 w-96">
      <div className="mb-8">
        <h1 className="text-7xl font-bold text-center bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl tracking-wider">
          MemoryVerse
        </h1>
        <p className="text-center text-white text-lg mt-2 drop-shadow-lg font-medium">
          Match the cards across the universe
        </p>
      </div>

      <button
        onClick={onStartNewGame}
        className="w-full bg-linear-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 border-2 border-purple-400/50"
      >
        NEW GAME
      </button>
      <button className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 border-2 border-indigo-400/50">
        LEADERBOARDS
      </button>
      <button className="w-full bg-linear-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-xl shadow-2xl hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 border-2 border-blue-400/50">
        OPTIONS
      </button>
    </div>
  );
};

export default MainMenu;
