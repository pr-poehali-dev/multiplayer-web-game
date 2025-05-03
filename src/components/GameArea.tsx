
import { ReactNode } from "react";
import NumberTapGame from "@/components/games/NumberTapGame";
import ColorMatchGame from "@/components/games/ColorMatchGame";
import MathChallengeGame from "@/components/games/MathChallengeGame";
import MemorySequenceGame from "@/components/games/MemorySequenceGame";

interface GameAreaProps {
  gameId: string;
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

const GameArea = ({ gameId, player, updateScore, gameOver }: GameAreaProps) => {
  // Выбираем компонент игры в зависимости от ID
  const renderGame = (): ReactNode => {
    switch (gameId) {
      case 'number-tap':
        return <NumberTapGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'color-match':
        return <ColorMatchGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'math-challenge':
        return <MathChallengeGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'memory-sequence':
        return <MemorySequenceGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      default:
        // По умолчанию используем игру с нажатием на числа
        return <NumberTapGame player={player} updateScore={updateScore} gameOver={gameOver} />;
    }
  };

  return (
    <>
      {renderGame()}
    </>
  );
};

export default GameArea;
