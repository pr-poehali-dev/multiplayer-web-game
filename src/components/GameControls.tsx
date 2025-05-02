
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface GameControlsProps {
  timeLeft: number;
  round: number;
  gameOver: boolean;
  players: Array<{
    id: number;
    score: number;
    isWinner: boolean;
  }>;
  onNewRound: () => void;
  onRestart: () => void;
  onHome: () => void;
}

const GameControls = ({
  timeLeft,
  round,
  gameOver,
  players,
  onNewRound,
  onRestart,
  onHome
}: GameControlsProps) => {
  // Определяем цвет таймера
  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-600";
    if (timeLeft > 10) return "text-orange-500";
    return "text-red-600";
  };

  // Находим победителя
  const winner = gameOver ? players.find(p => p.isWinner) : null;

  return (
    <div className="bg-white p-3 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onHome}
            className="text-gray-500"
          >
            <Icon name="Home" size={20} />
          </Button>
          
          <div className="text-sm font-medium">
            Раунд: <span className="font-bold">{round}</span>
          </div>
        </div>
        
        <div className={`text-xl font-bold ${getTimerColor()} transition-colors`}>
          {timeLeft} сек
        </div>
        
        <div className="flex gap-2">
          {gameOver && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRestart}
                className="text-xs"
              >
                Новая игра
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={onNewRound}
                className="text-xs"
              >
                Следующий раунд
              </Button>
            </>
          )}
        </div>
      </div>
      
      {gameOver && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-center text-lg font-bold">
            {winner ? (
              <span>
                Победил Игрок {winner.id} с результатом {winner.score} {winner.score === 1 ? "очко" : winner.score < 5 ? "очка" : "очков"}!
              </span>
            ) : (
              <span>Ничья!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;
