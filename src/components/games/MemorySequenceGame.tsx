
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MemorySequenceGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

const MemorySequenceGame = ({ player, updateScore, gameOver }: MemorySequenceGameProps) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [level, setLevel] = useState(3); // Начальная длина последовательности
  const [tapsCount, setTapsCount] = useState(0);
  const [message, setMessage] = useState<string>("");

  // Инициализация игры при первом рендере или при смене уровня
  useEffect(() => {
    if (player.isActive && !gameOver && !isShowingSequence && sequence.length === 0) {
      generateNewSequence();
    }
  }, [player.isActive, gameOver, level]);

  // Функция для генерации новой последовательности
  const generateNewSequence = () => {
    const newSequence = [];
    for (let i = 0; i < level; i++) {
      newSequence.push(Math.floor(Math.random() * 4) + 1);
    }
    setSequence(newSequence);
    setPlayerSequence([]);
    setIsShowingSequence(true);
    setCurrentIndex(0);
    setMessage("Запоминайте последовательность...");
    
    // Показываем последовательность
    showSequence(newSequence);
  };
  
  // Функция для демонстрации последовательности игроку
  const showSequence = (seq: number[]) => {
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < seq.length) {
        setCurrentIndex(seq[currentIdx]);
        
        // Скрываем подсветку через 500 мс
        setTimeout(() => {
          setCurrentIndex(0);
        }, 500);
        
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsShowingSequence(false);
        setMessage("Повторите последовательность!");
      }
    }, 1000);
  };

  // Обработчик нажатия на кнопку
  const handleButtonClick = (value: number) => {
    if (gameOver || !player.isActive || isShowingSequence) return;
    
    setTapsCount(prev => prev + 1);
    
    // Добавляем выбранное число к последовательности игрока
    const newPlayerSequence = [...playerSequence, value];
    setPlayerSequence(newPlayerSequence);
    
    // Проверяем, правильно ли выбрано текущее число в последовательности
    const index = playerSequence.length;
    if (value !== sequence[index]) {
      // Ошибка - сбрасываем и генерируем новую последовательность
      setMessage("Ошибка! Попробуйте снова.");
      setTimeout(() => {
        generateNewSequence();
      }, 1000);
      return;
    }
    
    // Если игрок полностью повторил последовательность
    if (newPlayerSequence.length === sequence.length) {
      setMessage("Правильно! Следующий уровень...");
      updateScore(player.id, level); // Добавляем очки равные длине последовательности
      
      // Увеличиваем длину последовательности
      setLevel(prev => Math.min(prev + 1, 8));
      
      // Генерируем новую последовательность через короткую паузу
      setTimeout(() => {
        generateNewSequence();
      }, 1000);
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
      
      {!gameOver && (
        <div className="text-center mb-2">
          <span style={{ color: getPlayerColor() }}>{message}</span>
          {playerSequence.length > 0 && !isShowingSequence && (
            <div className="text-xs mt-1">
              {playerSequence.length} / {sequence.length}
            </div>
          )}
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 flex-1">
        {[1, 2, 3, 4].map((value) => (
          <Button
            key={`${player.id}-${value}`}
            className="h-full w-full text-2xl font-bold transition-all duration-150"
            variant="outline"
            style={{
              backgroundColor: currentIndex === value ? getPlayerColor() : "white",
              borderColor: getPlayerColor(),
              color: currentIndex === value ? "white" : "black",
              opacity: gameOver || (isShowingSequence && currentIndex !== value) ? 0.7 : 1,
              transform: currentIndex === value ? "scale(1.05)" : "scale(1)",
            }}
            disabled={gameOver || isShowingSequence}
            onClick={() => handleButtonClick(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Уровень: {level - 2}, Нажатий: {tapsCount}
      </div>
    </div>
  );
};

export default MemorySequenceGame;
