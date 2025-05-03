
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ColorMatchGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type ColorInfo = {
  name: string;
  value: string;
  displayName: string;
};

const ColorMatchGame = ({ player, updateScore, gameOver }: ColorMatchGameProps) => {
  const [buttonsGrid, setButtonsGrid] = useState<{color: ColorInfo, textColor: ColorInfo}[]>([]);
  const [targetColorName, setTargetColorName] = useState<string | null>(null);
  const [tapsCount, setTapsCount] = useState(0);

  // Доступные цвета
  const colors: ColorInfo[] = [
    { name: "red", value: "#FF0000", displayName: "КРАСНЫЙ" },
    { name: "green", value: "#00BB00", displayName: "ЗЕЛЁНЫЙ" },
    { name: "blue", value: "#0000FF", displayName: "СИНИЙ" },
    { name: "yellow", value: "#FFBB00", displayName: "ЖЁЛТЫЙ" },
    { name: "purple", value: "#9900FF", displayName: "ФИОЛЕТОВЫЙ" },
    { name: "orange", value: "#FF9900", displayName: "ОРАНЖЕВЫЙ" }
  ];

  // Инициализация и обновление целевого цвета при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver) {
      generateNewTarget();
    }
  }, [player.isActive, gameOver]);

  // Генерация нового целевого цвета
  const generateNewTarget = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    const targetColor = colors[randomIndex];
    setTargetColorName(targetColor.name);
    regenerateGrid(targetColor);
  };

  // Функция для создания сетки кнопок с цветами
  const regenerateGrid = (targetColor: ColorInfo) => {
    const grid = [];
    
    // Создаем сетку 3x3 (9 кнопок)
    for (let i = 0; i < 9; i++) {
      const randomColorIndex = Math.floor(Math.random() * colors.length);
      const randomTextColorIndex = Math.floor(Math.random() * colors.length);
      
      grid.push({
        color: colors[randomColorIndex],
        textColor: colors[randomTextColorIndex]
      });
    }
    
    // Гарантируем, что на поле есть хотя бы одно совпадение
    // (цвет текста соответствует названию целевого цвета)
    const matchPosition = Math.floor(Math.random() * 9);
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    grid[matchPosition] = {
      color: colors[randomColorIndex],
      textColor: targetColor
    };
    
    // Перемешиваем сетку
    for (let i = grid.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [grid[i], grid[j]] = [grid[j], grid[i]];
    }
    
    setButtonsGrid(grid);
  };

  // Обработчик нажатия на кнопку
  const handleButtonClick = (textColorName: string) => {
    if (gameOver || !player.isActive || targetColorName === null) return;
    
    setTapsCount(prev => prev + 1);
    
    // Если игрок нажал на кнопку с текстом целевого цвета
    if (textColorName === targetColorName) {
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
      
      {targetColorName && !gameOver && (
        <div className="text-center mb-2">
          Нажмите на слово <span className="font-bold text-xl" style={{ color: getPlayerColor() }}>
            {colors.find(c => c.name === targetColorName)?.displayName || ''}
          </span>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 flex-1">
        {buttonsGrid.map((item, index) => (
          <Button
            key={`${player.id}-${index}`}
            className="h-full w-full font-bold"
            variant="outline"
            style={{
              backgroundColor: item.color.value,
              borderColor: getPlayerColor(),
              color: item.textColor.value,
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver}
            onClick={() => handleButtonClick(item.textColor.name)}
          >
            {item.textColor.displayName}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Нажатий: {tapsCount}
      </div>
    </div>
  );
};

export default ColorMatchGame;
