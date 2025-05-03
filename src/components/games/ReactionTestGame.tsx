
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ReactionTestGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type GameState = 'waiting' | 'ready' | 'go' | 'early' | 'success';

const ReactionTestGame = ({ player, updateScore, gameOver }: ReactionTestGameProps) => {
  const [state, setState] = useState<GameState>('waiting');
  const [color, setColor] = useState('#E5E7EB'); // Серый цвет для начального состояния
  const [message, setMessage] = useState('Приготовьтесь...');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [roundCount, setRoundCount] = useState(0);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);
  
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Инициализация игры при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver && state === 'waiting') {
      startNewRound();
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [player.isActive, gameOver]);
  
  // Начать новый раунд
  const startNewRound = () => {
    setState('ready');
    setColor('#FFEB3B'); // Желтый цвет для состояния готовности
    setMessage('Ждите зеленый сигнал...');
    
    // Установим случайную задержку от 1 до 5 секунд перед появлением зеленого сигнала
    const delay = Math.floor(Math.random() * 4000) + 1000;
    
    timerRef.current = window.setTimeout(() => {
      setState('go');
      setColor('#4CAF50'); // Зеленый цвет для состояния "GO"
      setMessage('НАЖМИТЕ!');
      startTimeRef.current = Date.now();
    }, delay);
  };
  
  // Обработчик нажатия на кнопку
  const handleClick = () => {
    if (gameOver || !player.isActive) return;
    
    if (state === 'ready') {
      // Слишком раннее нажатие
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      setState('early');
      setColor('#FF5252'); // Красный цвет для ошибки
      setMessage('Рано! Нажали до сигнала.');
      
      // Запускаем новый раунд через 2 секунды
      timerRef.current = window.setTimeout(() => {
        startNewRound();
      }, 2000);
      
    } else if (state === 'go') {
      // Успешное нажатие
      const endTime = Date.now();
      const time = startTimeRef.current ? endTime - startTimeRef.current : 0;
      
      setReactionTime(time);
      setState('success');
      setColor('#9C27B0'); // Фиолетовый цвет для успеха
      setMessage(`Ваше время: ${time} мс`);
      
      // Обновляем статистику
      setRoundCount(prev => prev + 1);
      
      // Обновляем лучшее время
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      
      // Обновляем среднее время
      if (averageTime === null) {
        setAverageTime(time);
      } else {
        setAverageTime((averageTime * (roundCount) + time) / (roundCount + 1));
      }
      
      // Начисляем очки (больше очков за более быстрое нажатие)
      const points = calculatePoints(time);
      updateScore(player.id, points);
      
      // Запускаем новый раунд через 2 секунды
      timerRef.current = window.setTimeout(() => {
        startNewRound();
      }, 2000);
    } else if (state === 'early' || state === 'success') {
      // Если нажали во время ожидания нового раунда, ничего не делаем
      return;
    }
  };
  
  // Расчет очков на основе времени реакции
  const calculatePoints = (time: number): number => {
    if (time < 200) return 5; // Суперскорость
    if (time < 300) return 3; // Очень быстро
    if (time < 400) return 2; // Быстро
    return 1; // Нормально
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
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      {!gameOver && (
        <div className="flex-1 flex flex-col">
          {/* Основная кнопка для теста реакции */}
          <Button
            className="flex-1 flex flex-col items-center justify-center text-xl transition-colors"
            style={{
              backgroundColor: color,
              color: state === 'go' ? '#FFFFFF' : '#000000',
              borderColor: getPlayerColor(),
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver}
            onClick={handleClick}
          >
            <span className="text-2xl font-bold mb-2">{message}</span>
            {reactionTime !== null && (
              <span className="text-sm">Последнее время: {reactionTime} мс</span>
            )}
          </Button>
          
          {/* Статистика */}
          <div className="text-sm mt-2 grid grid-cols-2 gap-2">
            <div className="text-left">
              <span>Раунды: {roundCount}</span>
            </div>
            <div className="text-right">
              {bestTime !== null && <span>Лучшее: {bestTime} мс</span>}
            </div>
            <div className="text-left col-span-2">
              {averageTime !== null && (
                <span>Среднее время: {Math.round(averageTime)} мс</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionTestGame;
