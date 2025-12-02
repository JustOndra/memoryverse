import { useEffect, useRef, useState } from 'react';
import MainMenu from './components/MainMenu';
import NewGameSetup from './components/NewGameSetup';
import Game from './pages/Game';
import { GameSettings } from './types';
import { GameStep } from './types/enums';

function App() {
  const [currentStep, setCurrentStep] = useState<GameStep>(GameStep.MAIN_MENU);
  const [settings, setSettings] = useState<GameSettings>({
    playerName: '',
    gameType: 'pokemon',
  });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0); // seconds
  const [finalTime, setFinalTime] = useState(0); // store the time when game was won
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  const handleStartNewGame = () => {
    setCurrentStep(GameStep.NEW_GAME_SETUP);
  };

  const handleStartPlaying = (e: React.FormEvent) => {
    e.preventDefault();
    setScore(0);
    setTimer(0);
    setFinalTime(0);
    setTimerActive(true);
    setCurrentStep(GameStep.PLAYING);
  };

  useEffect(() => {
    if (timerActive && currentStep === GameStep.PLAYING) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, currentStep]);

  const handleRestartGame = () => {
    setScore(0);
    setTimer(0);
    setFinalTime(0);
    setTimerActive(true);
    setCurrentStep(GameStep.PLAYING);
  };

  const handleGameWon = (finalScore: number, gameTime: number) => {
    setTimerActive(false);
    setFinalTime(gameTime);
    setCurrentStep(GameStep.GAME_WON);
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  const handleBackToMainMenu = () => {
    setTimerActive(false);
    setCurrentStep(GameStep.MAIN_MENU);
  };

  const appFontClass = (() => {
    switch (currentStep) {
      case GameStep.MAIN_MENU:
        return 'font-menu';
      case GameStep.NEW_GAME_SETUP:
        return 'font-setup';
      case GameStep.PLAYING:
      case GameStep.GAME_WON:
        switch (settings.gameType) {
          case 'pokemon':
            return 'font-pokemon game-font';
          case 'fortnite':
            return 'font-fortnite game-font';
          case 'starwars':
            return 'font-starwars game-font';
          default:
            return '';
        }
      default:
        return '';
    }
  })();
  return (
    <div
      className={`bg-linear-to-b from-teal-400 to-blue-500 min-h-screen flex items-center justify-center ${appFontClass}`}
    >
      <div>
        {currentStep === GameStep.MAIN_MENU && (
          <MainMenu onStartNewGame={handleStartNewGame} />
        )}
        {currentStep === GameStep.NEW_GAME_SETUP && (
          <NewGameSetup
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onStartPlaying={handleStartPlaying}
            onBack={handleBackToMainMenu}
          />
        )}
        {currentStep === GameStep.PLAYING && (
          <Game
            settings={settings}
            score={score}
            setScore={setScore}
            timer={timer}
            onRestart={handleRestartGame}
            onReturnToMenu={handleBackToMainMenu}
            onGameWon={handleGameWon}
          />
        )}
        {currentStep === GameStep.GAME_WON && (
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-6xl font-bold text-white">Winner!</h1>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-2xl font-bold mb-4">Game Results</div>
              <div className="text-xl mb-4">
                <p>Player: {settings.playerName}</p>
                <p>Game Type: {settings.gameType}</p>
                <p>Final Score: {score}</p>
                <p>
                  Time: {Math.floor(finalTime / 60)}:
                  {(finalTime % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
                  onClick={handleStartNewGame}
                >
                  Play Again
                </button>
                <button
                  className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
                  onClick={handleBackToMainMenu}
                >
                  Main Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
