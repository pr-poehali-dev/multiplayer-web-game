
import { ReactNode } from "react";
import NumberTapGame from "@/components/games/NumberTapGame";
import ColorMatchGame from "@/components/games/ColorMatchGame";
import MathChallengeGame from "@/components/games/MathChallengeGame";
import MemorySequenceGame from "@/components/games/MemorySequenceGame";
import ShapeFinderGame from "@/components/games/ShapeFinderGame";
import OddOneOutGame from "@/components/games/OddOneOutGame";
import ReactionTestGame from "@/components/games/ReactionTestGame";
import WordScrambleGame from "@/components/games/WordScrambleGame";
import RhythmTapGame from "@/components/games/RhythmTapGame";
import CardMemoryGame from "@/components/games/CardMemoryGame";
import SpaceRaceGame from "@/components/games/SpaceRaceGame";
import MoleCatcherGame from "@/components/games/MoleCatcherGame";
import ColorMixerGame from "@/components/games/ColorMixerGame";
import WordChainGame from "@/components/games/WordChainGame";
import MazeRunnerGame from "@/components/games/MazeRunnerGame";

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
      case 'shape-finder':
        return <ShapeFinderGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'odd-one-out':
        return <OddOneOutGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'reaction-test':
        return <ReactionTestGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'word-scramble':
        return <WordScrambleGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'rhythm-tap':
        return <RhythmTapGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'card-memory':
        return <CardMemoryGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'space-race':
        return <SpaceRaceGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'mole-catcher':
        return <MoleCatcherGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'color-mixer':
        return <ColorMixerGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'word-chain':
        return <WordChainGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      case 'maze-runner':
        return <MazeRunnerGame player={player} updateScore={updateScore} gameOver={gameOver} />;
      default:
        // Для всех остальных игр, которые еще не реализованы, каждый раз выбираем случайную уже реализованную игру
        const implementedGames = [
          <SpaceRaceGame player={player} updateScore={updateScore} gameOver={gameOver} />,
          <MoleCatcherGame player={player} updateScore={updateScore} gameOver={gameOver} />,
          <ColorMixerGame player={player} updateScore={updateScore} gameOver={gameOver} />,
          <WordChainGame player={player} updateScore={updateScore} gameOver={gameOver} />,
          <MazeRunnerGame player={player} updateScore={updateScore} gameOver={gameOver} />
        ];
        
        // Используем player.id как семя для псевдослучайности, 
        // чтобы у одного игрока была одна игра, а не каждый раз разная
        const randomIndex = (player.id + gameId.length) % implementedGames.length;
        return implementedGames[randomIndex];
    }
  };

  return (
    <>
      {renderGame()}
    </>
  );
};

export default GameArea;
