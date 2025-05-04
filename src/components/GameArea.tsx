
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getGameById } from '@/lib/gameTypes';

// Компоненты игр
import NumberTapGame from '@/components/games/NumberTapGame';
import ColorMatchGame from '@/components/games/ColorMatchGame';
import MemorySequenceGame from '@/components/games/MemorySequenceGame';
import ReactionTestGame from '@/components/games/ReactionTestGame';
import MathChallengeGame from '@/components/games/MathChallengeGame';
import WordScrambleGame from '@/components/games/WordScrambleGame';
import OddOneOutGame from '@/components/games/OddOneOutGame';
import MoleCatcherGame from '@/components/games/MoleCatcherGame';
import ShapeFinderGame from '@/components/games/ShapeFinderGame';
import ColorMixerGame from '@/components/games/ColorMixerGame';
import WordChainGame from '@/components/games/WordChainGame';
import RhythmTapGame from '@/components/games/RhythmTapGame';
import SpaceRaceGame from '@/components/games/SpaceRaceGame';
import MazeRunnerGame from '@/components/games/MazeRunnerGame';
import CardMemoryGame from '@/components/games/CardMemoryGame';

interface Player {
  id: number;
  score: number;
  isActive: boolean;
  isWinner?: boolean;
}

interface GameAreaProps {
  gameId: string;
  player: Player;
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
  className?: string;
}

const GameArea = ({ gameId, player, updateScore, gameOver, className }: GameAreaProps) => {
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const gameData = getGameById(gameId);
  
  // При монтировании устанавливаем атрибуты для привязки курсоров
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute('data-game-area', 'true');
      containerRef.current.setAttribute('data-player-id', String(player.id));
    }
  }, [player.id]);

  // Обработчик начала игры
  const handleStart = () => {
    setStarted(true);
  };

  // Вспомогательная функция для получения цвета игрока
  const getPlayerColor = (playerNumber: number): string => {
    const colors = {
      1: "#FF5252", // Красный
      2: "#4CAF50", // Зеленый
      3: "#2196F3", // Синий
      4: "#FF9800", // Оранжевый
    };
    return colors[playerNumber as keyof typeof colors] || "#9E9E9E";
  };

  // Рендер компонента игры
  const renderGame = () => {
    if (!started || !player.isActive || gameOver) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            {!gameOver ? (
              <>
                <div className="text-2xl mb-2" style={{color: getPlayerColor(player.id)}}>
                  Игрок {player.id}
                </div>
                <Button onClick={handleStart} disabled={!player.isActive || started || gameOver}>
                  {started ? "Игра идет" : "Начать"}
                </Button>
              </>
            ) : (
              <>
                <div className="text-2xl mb-2" style={{color: getPlayerColor(player.id)}}>
                  {player.isWinner ? "Победитель! 🏆" : "Игра окончена"}
                </div>
                <div className="text-lg font-bold">
                  Счет: {player.score}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    // Выбираем компонент игры в зависимости от gameId
    switch (gameId) {
      case 'number-tap':
        return <NumberTapGame playerId={player.id} updateScore={updateScore} />;
      case 'color-match':
        return <ColorMatchGame playerId={player.id} updateScore={updateScore} />;
      case 'memory-sequence':
        return <MemorySequenceGame playerId={player.id} updateScore={updateScore} />;
      case 'reaction-test':
        return <ReactionTestGame playerId={player.id} updateScore={updateScore} />;
      case 'math-challenge':
        return <MathChallengeGame playerId={player.id} updateScore={updateScore} />;
      case 'word-scramble':
        return <WordScrambleGame playerId={player.id} updateScore={updateScore} />;
      case 'odd-one-out':
        return <OddOneOutGame playerId={player.id} updateScore={updateScore} />;
      case 'mole-catcher':
        return <MoleCatcherGame playerId={player.id} updateScore={updateScore} />;
      case 'shape-finder':
        return <ShapeFinderGame playerId={player.id} updateScore={updateScore} />;
      case 'color-mixer':
        return <ColorMixerGame playerId={player.id} updateScore={updateScore} />;
      case 'word-chain':
        return <WordChainGame playerId={player.id} updateScore={updateScore} />;
      case 'rhythm-tap':
        return <RhythmTapGame playerId={player.id} updateScore={updateScore} />;
      case 'space-race':
        return <SpaceRaceGame playerId={player.id} updateScore={updateScore} />;
      case 'maze-runner':
        return <MazeRunnerGame playerId={player.id} updateScore={updateScore} />;
      case 'card-memory':
        return <CardMemoryGame playerId={player.id} updateScore={updateScore} />;
      default:
        return <div>Игра не найдена</div>;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-white rounded-xl shadow-md overflow-hidden border-4 transition-all duration-300",
        player.isActive ? "border-opacity-100" : "border-opacity-30 opacity-70",
        player.isWinner ? "ring-4 ring-yellow-400 ring-opacity-70" : "",
        className
      )}
      style={{ borderColor: getPlayerColor(player.id) }}
      data-game-area="true"
      data-player-id={player.id}
    >
      {renderGame()}
    </div>
  );
};

export default GameArea;
