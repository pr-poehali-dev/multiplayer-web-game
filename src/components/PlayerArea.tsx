
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface PlayerProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
    targetNumber: number | null;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

const PlayerArea = ({ player, updateScore, gameOver }: PlayerProps) => {
  const [buttonsGrid, setButtonsGrid] = useState<number[]>([]);
  const [tapsCount, setTapsCount] = useState(0);

  // Создаем сетку кнопок с числами при изменении цели
  useEffect(() => {
    if (player.targetNumber !== null) {
      regenerateGrid();
    }
  }, [player.targetNumber]);

  // Функция для создания сетки кнопок
  const regenerateGrid = () => {
    // Создаем массив чисел от 1 до 4 и перемешиваем их
    const numbers = [1, 2, 3, 4];
    const grid: number[] = [];
    
    // Создаем сетку 3x4 (12 кнопок)
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      grid.push(numbers[randomIndex]);
    }
    
    setButtonsGrid(grid);
  };

  // Обработчик нажатия на кнопку
  const handleButtonClick = (value: number) => {
    if (gameOver || !player.isActive) return;
    
    setTapsCount(prev => prev + 1);
    
    // Если игрок нажал на правильное число
    if (value === player.targetNumber) {
      // Добавляем очки и задаем новую цель
      updateScore(player.id, 1);
      regenerateGrid();
    }
  };

  // Получаем цвет для игрока
  const getPlayerColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[player.id - 1] || colors[0];
  };

  // Стили для области игрока
  const playerAreaStyle = {
    backgroundColor: player.isWinner ? "#FFF9C4" : "white",
    borderColor: getPlayerColor(),
    boxShadow: player.isWinner ? `0 0 20px ${getPlayerColor()}` : "none",
  };

  return (
    <div 
      className={`rounded-lg border-4 flex flex-col p-2 transition-all duration-300 ${
        gameOver && player.isWinner ? "animate-bounce-custom" : ""
      }`}
      style={playerAreaStyle}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-bold" style={{ color: getPlayerColor() }}>
          Игрок {player.id}
        </div>
        <div className="text-lg font-bold">
          {player.score} {player.score === 1 ? "очко" : player.score < 5 ? "очка" : "очков"}
        </div>
      </div>
      
      {player.targetNumber && !gameOver && (
        <div className="text-center mb-2">
          Нажимайте на <span className="font-bold text-xl" style={{ color: getPlayerColor() }}>{player.targetNumber}</span>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 flex-1">
        {buttonsGrid.map((value, index) => (
          <Button
            key={`${player.id}-${index}`}
            className="h-full w-full text-2xl font-bold"
            variant={value === player.targetNumber ? "default" : "outline"}
            style={{
              backgroundColor: value === player.targetNumber ? getPlayerColor() : "white",
              borderColor: getPlayerColor(),
              color: value === player.targetNumber ? "white" : "black",
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver}
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Нажатий: {tapsCount}
      </div>
    </div>
  );
};

export default PlayerArea;
