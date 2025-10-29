import { useState } from 'react';
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

  const handleStartNewGame = () => {
    setCurrentStep(GameStep.NEW_GAME_SETUP);
  };

  const handleStartPlaying = (e: React.FormEvent) => {
    e.preventDefault();
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
        {currentStep === GameStep.PLAYING && <Game settings={settings} />}
      </div>
    </div>
  );
}

export default App;
