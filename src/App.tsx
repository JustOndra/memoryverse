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

  return (
    <div className="bg-gradient-to-b from-teal-400 to-blue-500 min-h-screen">
      <div className="flex items-center justify-center h-screen">
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
