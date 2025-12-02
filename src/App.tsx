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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartNewGame = () => {
    setCurrentStep(GameStep.NEW_GAME_SETUP);
  };

  const handleStartPlaying = (e: React.FormEvent) => {
    e.preventDefault();
    setScore(0);
    setTimer(0);
    setCurrentStep(GameStep.PLAYING);
  };

  useEffect(() => {
    if (currentStep === GameStep.PLAYING) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentStep]);

  const handleRestartGame = () => {
    setScore(0);
    setTimer(0);
    setCurrentStep(GameStep.PLAYING);
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  const handleBackToMainMenu = () => {
    setCurrentStep(GameStep.MAIN_MENU);
  };

  const appFontClass = (() => {
    switch (currentStep) {
      case GameStep.MAIN_MENU:
        return 'font-menu';
      case GameStep.NEW_GAME_SETUP:
        return 'font-setup';
      case GameStep.PLAYING:
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
          />
        )}
      </div>
    </div>
  );
}

export default App;
