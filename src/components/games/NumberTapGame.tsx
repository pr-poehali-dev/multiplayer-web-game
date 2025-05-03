
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface NumberTapGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

const NumberTapGame = ({ player, updateScore, gameOver }: NumberTapGameProps) => {
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [buttonsGrid, setButtonsGrid] = useState<number[]>([]);
  const [tapsCount, setTapsCount] = useState(0);

  // Инициализация и обновление целевого числа при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver && targetNumber === null) {
      generateNewTarget();
    }
  }, [player.isActive, gameOver]);

  // Генерация нового целевого числа
  const generateNewTarget = () => {
    const newTarget = Math.floor(Math.random() * 4) + 1;
    setTargetNumber(newTarget);
    regenerateGrid(newTarget);
  };

  // Функция для создания сетки кнопок, гарантирующая наличие целевого числа
  const regenerateGrid = (newTarget: number) => {
    // Создаем массив чисел от 1 до 4
    const numbers = [1, 2, 3, 4];
    const grid: number[] = [];
    
    // Создаем сетку 3x4 (12 кнопок)
    for (let i = 0; i < 12; i++) {
      // Для первых 3 кнопок гарантируем, что целевое число будет на поле
      if (i < 3) {
        grid.push(newTarget);
      } else {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        grid.push(numbers[randomIndex]);
      }
    }
    
    // Перемешиваем сетку
    for (let i = grid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [grid[i], grid[j]] = [grid[j], grid[i]];
    }
    
    setButtonsGrid(grid);
  };

  // Обработчик нажатия на кнопку
  const handleButtonClick = (value: number) => {
    if (gameOver || !player.isActive || targetNumber === null) return;
    
    setTapsCount(prev => prev + 1);
    
    // Если игрок нажал на правильное число
    if (value === targetNumber) {
      // Добавляем очки и задаем новую цель
      updateScore(player.id, 1);
      generateNewTarget();
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
      
      {targetNumber && !gameOver && (
        <div className="text-center mb-2">
          Нажимайте на <span className="font-bold text-xl" style={{ color: getPlayerColor() }}>{targetNumber}</span>
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
            variant={value === targetNumber ? "default" : "outline"}
            style={{
              backgroundColor: value === targetNumber ? getPlayerColor() : "white",
              borderColor: getPlayerColor(),
              color: value === targetNumber ? "white" : "black",
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

export default NumberTapGame;
