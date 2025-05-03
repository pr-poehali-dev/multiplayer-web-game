
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MathChallengeGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type MathProblem = {
  expression: string;
  answer: number;
  options: number[];
};

const MathChallengeGame = ({ player, updateScore, gameOver }: MathChallengeGameProps) => {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [tapsCount, setTapsCount] = useState(0);

  // Инициализация и обновление задачи при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver) {
      generateNewProblem();
    }
  }, [player.isActive, gameOver]);

  // Генерация новой математической задачи
  const generateNewProblem = () => {
    // Определяем операнды и операцию
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let expression: string;
    let answer: number;
    
    // Вычисляем выражение и ответ
    switch (operation) {
      case '+':
        expression = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case '-':
        if (num1 < num2) {
          // Меняем местами, чтобы избежать отрицательных чисел
          expression = `${num2} - ${num1}`;
          answer = num2 - num1;
        } else {
          expression = `${num1} - ${num2}`;
          answer = num1 - num2;
        }
        break;
      case '*':
        expression = `${num1} × ${num2}`;
        answer = num1 * num2;
        break;
      default:
        expression = `${num1} + ${num2}`;
        answer = num1 + num2;
    }
    
    // Генерируем варианты ответов (включая правильный)
    const options = [answer];
    
    while (options.length < 6) {
      // Генерируем случайные варианты ответов в пределах ±10 от правильного
      let randomOption;
      if (answer <= 10) {
        randomOption = Math.floor(Math.random() * 20) + 1;
      } else {
        randomOption = answer + Math.floor(Math.random() * 21) - 10;
        if (randomOption <= 0) randomOption = Math.floor(Math.random() * 10) + 1;
      }
      
      // Добавляем вариант, если его еще нет в списке
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
    // Перемешиваем варианты ответов
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    setProblem({ expression, answer, options });
  };

  // Обработчик нажатия на вариант ответа
  const handleOptionClick = (selectedAnswer: number) => {
    if (gameOver || !player.isActive || !problem) return;
    
    setTapsCount(prev => prev + 1);
    
    // Проверяем, правильный ли ответ выбран
    if (selectedAnswer === problem.answer) {
      // Добавляем очки и задаем новую задачу
      updateScore(player.id, 1);
      generateNewProblem();
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
      
      {problem && !gameOver && (
        <>
          <div className="text-center mb-2">
            <span className="font-bold text-2xl" style={{ color: getPlayerColor() }}>{problem.expression} = ?</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 flex-1">
            {problem.options.map((option, index) => (
              <Button
                key={`${player.id}-${index}`}
                className="h-full w-full text-xl font-bold"
                variant="outline"
                style={{
                  borderColor: getPlayerColor(),
                  opacity: gameOver ? 0.7 : 1,
                }}
                disabled={gameOver}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 mt-4 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Нажатий: {tapsCount}
      </div>
    </div>
  );
};

export default MathChallengeGame;
