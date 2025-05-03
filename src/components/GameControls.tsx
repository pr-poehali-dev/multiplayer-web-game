
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface GameControlsProps {
  timeLeft: number;
  round: number;
  totalRounds?: number;
  gameOver: boolean;
  gameName: string;
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
  totalRounds,
  gameOver,
  gameName,
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
  const hasWinner = Boolean(winner);

  return (
    <div className="bg-white p-2 md:p-3 shadow-md">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1 md:gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onHome}
            className="text-gray-500 h-8 w-8 md:h-auto md:w-auto"
          >
            <Icon name="Home" size={20} />
          </Button>
          
          <div className="text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2">
            <span className="font-bold text-indigo-700 truncate max-w-[100px] md:max-w-none">{gameName}</span>
            <span className="text-gray-500 hidden md:inline">•</span>
            <span className="flex items-center whitespace-nowrap">
              <span className="md:inline hidden">Раунд:</span> 
              <span className="font-bold ml-1">{round}</span>
              {totalRounds && <span className="text-gray-500">/{totalRounds}</span>}
            </span>
          </div>
        </div>
        
        <div className={`text-lg md:text-xl font-bold ${getTimerColor()} transition-colors`}>
          {timeLeft} сек
        </div>
        
        <div className="flex gap-1 md:gap-2">
          {gameOver && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRestart}
                className="text-xs md:text-sm h-8 px-2 md:px-3"
              >
                Новая игра
              </Button>
              
              <Button 
                variant="default" 
                size="sm"
                onClick={onNewRound}
                className="text-xs md:text-sm h-8 px-2 md:px-3"
              >
                {totalRounds ? "Итоги раунда" : "Следующий раунд"}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {gameOver && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-center text-sm md:text-lg font-bold">
            {hasWinner ? (
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
