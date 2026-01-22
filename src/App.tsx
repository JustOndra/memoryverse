import React, { useEffect, useRef, useState } from 'react';
import backgroundImage from './assets/images/background.jpg';
import fortniteBg from './assets/images/fortnite-bg.jpeg';
import pokemonBg from './assets/images/pokemon-bg.jpeg';
import simpsonsBg from './assets/images/simpsons-bg.jpg';
import Leaderboards from './components/Leaderboards';
import MainMenu from './components/MainMenu';
import NewGameSetup from './components/NewGameSetup';
import Game from './pages/Game';
import { saveScore } from './services/supabase';
import { GameSettings, Player } from './types';
import { GameStep } from './types/enums';

function App() {
  const [currentStep, setCurrentStep] = useState<GameStep>(GameStep.MAIN_MENU);
  const [settings, setSettings] = useState<GameSettings>({
    playerName: '',
    gameType: 'pokemon',
    isMultiplayer: false,
    players: [],
  });
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleStartNewGame = () => {
    setCurrentStep(GameStep.NEW_GAME_SETUP);
  };

  const handleShowLeaderboards = () => {
    setCurrentStep(GameStep.LEADERBOARDS);
  };

  const handleStartPlaying = (e: React.FormEvent) => {
    e.preventDefault();

    const initialPlayers: Player[] =
      settings.isMultiplayer && settings.players
        ? settings.players
        : [
            {
              id: '1',
              name: settings.playerName,
              score: 0,
              isActive: true,
            },
          ];

    setPlayers(initialPlayers);
    setScore(0);
    setActivePlayerIndex(0);
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
    setPlayers((prev) => prev.map((p) => ({ ...p, score: 0 })));
    setActivePlayerIndex(0);
    setTimer(0);
    setFinalTime(0);
    setTimerActive(true);
    setResetTrigger((prev) => prev + 1);
    setCurrentStep(GameStep.PLAYING);
  };

  const handleGameWon = async (
    finalScore: number,
    gameTime: number,
    finalPlayers: Player[],
  ) => {
    setTimerActive(false);
    setFinalTime(gameTime);
    setCurrentStep(GameStep.GAME_WON);

    try {
      if (settings.isMultiplayer && finalPlayers.length > 1) {
        await Promise.all(
          finalPlayers.map((player) =>
            saveScore({
              player_name: player.name,
              score: player.score,
              game_type: settings.gameType,
              time_seconds: gameTime,
            }),
          ),
        );
      } else {
        await saveScore({
          player_name: settings.playerName,
          score: finalScore,
          game_type: settings.gameType,
          time_seconds: gameTime,
        });
      }
    } catch (error) {
      console.error('Failed to save score to leaderboard:', error);
    }
  };

  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
  };

  const handleBackToMainMenu = () => {
    setTimerActive(false);
    setScore(0);
    setTimer(0);
    setFinalTime(0);
    setPlayers([]);
    setActivePlayerIndex(0);
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
          case 'simpsons':
            return 'font-simpsons game-font';
          default:
            return '';
        }
      default:
        return '';
    }
  })();

  const currentBackground = (() => {
    if (currentStep === GameStep.PLAYING || currentStep === GameStep.GAME_WON) {
      switch (settings.gameType) {
        case 'pokemon':
          return pokemonBg;
        case 'fortnite':
          return fortniteBg;
        case 'simpsons':
          return simpsonsBg;
        default:
          return undefined;
      }
    }
    if (
      currentStep === GameStep.MAIN_MENU ||
      currentStep === GameStep.NEW_GAME_SETUP ||
      currentStep === GameStep.LEADERBOARDS
    ) {
      return backgroundImage;
    }
    return undefined;
  })();
  return (
    <div
      className={`bg-linear-to-b from-slate-900 via-gray-900 to-slate-800 min-h-screen flex items-center justify-center ${appFontClass}`}
      style={{
        backgroundImage: currentBackground
          ? `url(${currentBackground})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div>
        {currentStep === GameStep.MAIN_MENU && (
          <MainMenu
            onStartNewGame={handleStartNewGame}
            onShowLeaderboards={handleShowLeaderboards}
          />
        )}
        {currentStep === GameStep.LEADERBOARDS && (
          <Leaderboards onBack={handleBackToMainMenu} />
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
            players={players}
            setPlayers={setPlayers}
            activePlayerIndex={activePlayerIndex}
            setActivePlayerIndex={setActivePlayerIndex}
            timer={timer}
            onRestart={handleRestartGame}
            onReturnToMenu={handleBackToMainMenu}
            onGameWon={handleGameWon}
            resetTrigger={resetTrigger}
          />
        )}
        {currentStep === GameStep.GAME_WON && (
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-6xl font-bold text-white">Winner!</h1>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-2xl font-bold mb-4">Game Results</div>
              <div className="text-xl mb-4">
                {settings.isMultiplayer && players.length > 1 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {players
                        .slice()
                        .sort((a, b) => b.score - a.score)
                        .map((player, idx) => (
                          <div
                            key={player.id}
                            className={`flex justify-between items-center p-2 rounded ${
                              idx === 0
                                ? 'bg-yellow-100 border-2 border-yellow-400'
                                : 'bg-gray-100'
                            }`}
                          >
                            <span className="font-semibold">
                              {idx === 0 ? '🏆 ' : ''}
                              {player.name}
                            </span>
                            <span className="font-bold text-blue-600">
                              {player.score} pts
                            </span>
                          </div>
                        ))}
                    </div>
                  </>
                ) : (
                  <p>Player: {settings.playerName}</p>
                )}
                <p>Game Type: {settings.gameType}</p>
                {!settings.isMultiplayer && <p>Final Score: {score}</p>}
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
