
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ColorMixerGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type RGB = {
  r: number;
  g: number;
  b: number;
};

const ColorMixerGame = ({ player, updateScore, gameOver }: ColorMixerGameProps) => {
  const [targetColor, setTargetColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [currentColor, setCurrentColor] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [rounds, setRounds] = useState(0);
  const [matchAccuracy, setMatchAccuracy] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isMatching, setIsMatching] = useState(false);
  const [message, setMessage] = useState("");
  
  // Инициализация игры
  useEffect(() => {
    if (player.isActive && !gameOver) {
      startNewRound();
    }
    
    return () => {
      // Очистка при размонтировании
    };
  }, [player.isActive, gameOver]);
  
  // Таймер для раунда
  useEffect(() => {
    let timerId: number | null = null;
    
    if (player.isActive && !gameOver && timeRemaining > 0 && isMatching) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [player.isActive, gameOver, timeRemaining, isMatching]);
  
  // Начать новый раунд
  const startNewRound = () => {
    // Генерируем случайный целевой цвет
    const newTarget = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
    
    // Случайный стартовый цвет (но не слишком близкий к цели)
    let newCurrent;
    do {
      newCurrent = {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256)
      };
    } while (calculateColorDistance(newTarget, newCurrent) < 100);
    
    setTargetColor(newTarget);
    setCurrentColor(newCurrent);
    setTimeRemaining(15);
    setMatchAccuracy(0);
    setIsMatching(true);
    setMessage("Смешайте цвета, чтобы получить целевой цвет!");
  };
  
  // Завершение раунда и оценка результата
  const endRound = () => {
    setIsMatching(false);
    
    // Вычисляем точность совпадения (0-100%)
    const distance = calculateColorDistance(targetColor, currentColor);
    const accuracy = Math.max(0, Math.round(100 - (distance / 4.41))); // 441 - максимальное расстояние (255 * sqrt(3))
    
    setMatchAccuracy(accuracy);
    
    // Начисляем очки в зависимости от точности
    let points = 0;
    if (accuracy >= 95) {
      points = 5;
      setMessage("Идеальное совпадение! +5 очков");
    } else if (accuracy >= 85) {
      points = 3;
      setMessage("Отличное совпадение! +3 очка");
    } else if (accuracy >= 70) {
      points = 2;
      setMessage("Хорошее совпадение! +2 очка");
    } else if (accuracy >= 50) {
      points = 1;
      setMessage("Неплохое совпадение! +1 очко");
    } else {
      setMessage("Попробуйте еще раз!");
    }
    
    if (points > 0) {
      updateScore(player.id, points);
    }
    
    // Переходим к следующему раунду через 3 секунды
    setTimeout(() => {
      setRounds(prev => prev + 1);
      startNewRound();
    }, 3000);
  };
  
  // Пользователь сам завершает раунд
  const handleSubmit = () => {
    if (gameOver || !player.isActive || !isMatching) return;
    
    endRound();
  };
  
  // Вычисляем "расстояние" между цветами
  const calculateColorDistance = (color1: RGB, color2: RGB): number => {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
  };
  
  // Функции для изменения компонентов RGB
  const adjustRed = (amount: number) => {
    if (gameOver || !player.isActive || !isMatching) return;
    
    setCurrentColor(prev => ({
      ...prev,
      r: Math.max(0, Math.min(255, prev.r + amount))
    }));
  };
  
  const adjustGreen = (amount: number) => {
    if (gameOver || !player.isActive || !isMatching) return;
    
    setCurrentColor(prev => ({
      ...prev,
      g: Math.max(0, Math.min(255, prev.g + amount))
    }));
  };
  
  const adjustBlue = (amount: number) => {
    if (gameOver || !player.isActive || !isMatching) return;
    
    setCurrentColor(prev => ({
      ...prev,
      b: Math.max(0, Math.min(255, prev.b + amount))
    }));
  };
  
  // Преобразование RGB в строку цвета
  const getRGBString = (color: RGB): string => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
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
      
      {/* Сообщение */}
      {!gameOver && (
        <div className="text-center text-sm mb-2" style={{ color: getPlayerColor() }}>
          {message}
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      {/* Оставшееся время */}
      {isMatching && !gameOver && (
        <div className="h-2 bg-gray-200 w-full rounded mb-2">
          <div 
            className="h-2 bg-yellow-500 rounded transition-all duration-300"
            style={{ width: `${(timeRemaining / 15) * 100}%` }}
          />
        </div>
      )}
      
      {/* Образцы цветов */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 text-center">
          <div className="font-bold text-sm mb-1">Цель</div>
          <div 
            className="h-12 rounded-lg border border-gray-300 shadow-inner"
            style={{ backgroundColor: getRGBString(targetColor) }}
          />
        </div>
        <div className="flex-1 text-center">
          <div className="font-bold text-sm mb-1">Ваш цвет</div>
          <div 
            className="h-12 rounded-lg border border-gray-300 shadow-inner"
            style={{ backgroundColor: getRGBString(currentColor) }}
          />
        </div>
      </div>
      
      {/* Точность совпадения (показывается только когда раунд завершен) */}
      {!isMatching && !gameOver && (
        <div className="mb-3 text-center">
          <div className="font-bold">Точность: {matchAccuracy}%</div>
          <div className="h-2 bg-gray-200 w-full rounded mt-1">
            <div 
              className="h-2 rounded"
              style={{ 
                width: `${matchAccuracy}%`,
                backgroundColor: matchAccuracy >= 90 ? '#4CAF50' : 
                                 matchAccuracy >= 70 ? '#8BC34A' : 
                                 matchAccuracy >= 50 ? '#FFEB3B' : 
                                 matchAccuracy >= 30 ? '#FF9800' : '#F44336'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Регуляторы RGB */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {/* Красный */}
        <div className="flex flex-col">
          <div className="text-center font-bold text-red-600 mb-1">R: {currentColor.r}</div>
          <div className="flex-1 flex flex-col gap-1">
            <Button
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-900 font-bold text-lg"
              disabled={gameOver || !isMatching}
              onClick={() => adjustRed(10)}
            >
              +10
            </Button>
            <Button
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-900"
              disabled={gameOver || !isMatching}
              onClick={() => adjustRed(1)}
            >
              +1
            </Button>
            <Button
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-900"
              disabled={gameOver || !isMatching}
              onClick={() => adjustRed(-1)}
            >
              -1
            </Button>
            <Button
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-900 font-bold text-lg"
              disabled={gameOver || !isMatching}
              onClick={() => adjustRed(-10)}
            >
              -10
            </Button>
          </div>
        </div>
        
        {/* Зеленый */}
        <div className="flex flex-col">
          <div className="text-center font-bold text-green-600 mb-1">G: {currentColor.g}</div>
          <div className="flex-1 flex flex-col gap-1">
            <Button
              className="flex-1 bg-green-100 hover:bg-green-200 text-green-900 font-bold text-lg"
              disabled={gameOver || !isMatching}
              onClick={() => adjustGreen(10)}
            >
              +10
            </Button>
            <Button
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-900"
              disabled={gameOver || !isMatching}
              onClick={() => adjustGreen(1)}
            >
              +1
            </Button>
            <Button
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-900"
              disabled={gameOver || !isMatching}
              onClick={() => adjustGreen(-1)}
            >
              -1
            </Button>
            <Button
              className="flex-1 bg-green-100 hover:bg-green-200 text-green-900 font-bold text-lg"
              disabled={gameOver || !isMatching}
              onClick={() => adjustGreen(-10)}
            >
              -10
            </Button>
          </div>
        </div>
        
        {/* Синий */}
        <div className="flex flex-col">
          <div className="text-center font-bold text-blue-600 mb-1">B: {currentColor.b}</div>
          <div className="flex-1 flex flex-col gap-1">
            <Button
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-lg"
              disabled={gameOver || !isMatching}
              onClick={() => adjustBlue(10)}
            >
              +10
            </Button>
            <Button
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-900"
              disabled={gameOver || !isMatching}
              onClick={() => adjustBlue(1)}
            >
              +1
            </Button>
            <Button
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-900"
              disabled={gameOver || !isMatching}
              onClick={() => adjustBlue(-1)}
            >
              -1
            </Button>
            <Button
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-lg"
              disabled={gameOver || !isMatching}
              onClick={() => adjustBlue(-10)}
            >
              -10
            </Button>
          </div>
        </div>
      </div>
      
      {/* Кнопка готово */}
      {isMatching && !gameOver && (
        <Button
          className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleSubmit}
        >
          Готово
        </Button>
      )}
      
      {/* Статистика */}
      <div className="text-xs text-gray-500 mt-1 text-right">
        Раунд: {rounds + 1}
      </div>
    </div>
  );
};

export default ColorMixerGame;
