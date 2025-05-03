
import { ReactNode } from "react";

interface PlayerAreaProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  children: ReactNode;
  title?: string;
  score?: string;
}

const PlayerArea = ({ player, children, title, score }: PlayerAreaProps) => {
  // Получаем цвет игрока на основе ID
  const getPlayerColor = (playerId: number): string => {
    const colors = {
      1: "#FF5252", // Красный
      2: "#4CAF50", // Зеленый
      3: "#2196F3", // Синий
      4: "#FF9800", // Оранжевый
    };
    return colors[playerId as keyof typeof colors] || "#9E9E9E";
  };

  const playerColor = getPlayerColor(player.id);
  
  return (
    <div 
      className={`relative h-full overflow-hidden flex flex-col border-2 rounded-lg ${player.isWinner ? 'animate-pulse-winner' : ''}`}
      style={{ 
        borderColor: playerColor,
        backgroundColor: `${playerColor}10`,
      }}
    >
      {/* Верхняя панель с номером игрока и счетом */}
      <div 
        className="flex justify-between items-center p-1 text-white"
        style={{ backgroundColor: playerColor }}
      >
        <div className="flex items-center gap-1">
          <div className="font-bold">{player.id}</div>
          {title && <div className="text-xs truncate max-w-[90px] md:max-w-[150px]">{title}</div>}
        </div>
        <div className="text-sm font-bold">
          {score !== undefined ? score : player.score}
        </div>
      </div>
      
      {/* Основное содержимое игровой области */}
      <div className="flex-1 w-full overflow-hidden">
        {children}
      </div>

      {/* Оверлей для победителя */}
      {player.isWinner && player.isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 opacity-20 pointer-events-none" />
      )}
    </div>
  );
};

export default PlayerArea;
