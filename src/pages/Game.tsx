
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PlayerArea from "@/components/PlayerArea";
import GameControls from "@/components/GameControls";

interface PlayerState {
  id: number;
  score: number;
  isActive: boolean;
  isWinner: boolean;
  targetNumber: number | null;
}

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const playersCount = parseInt(searchParams.get("players") || "4", 10);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [players, setPlayers] = useState<PlayerState[]>([]);

  // Инициализация игроков
  useEffect(() => {
    const initialPlayers = Array.from({ length: playersCount }).map((_, index) => ({
      id: index + 1,
      score: 0,
      isActive: false,
      isWinner: false,
      targetNumber: null
    }));
    setPlayers(initialPlayers);
  }, [playersCount]);

  // Обработка завершения раунда
  const endRound = useCallback(() => {
    setGameOver(true);
    
    // Найти победителя
    const maxScore = Math.max(...players.map(p => p.score));
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        isWinner: player.score === maxScore
      }))
    );
  }, [players]);

  // Логика таймера
  useEffect(() => {
    let timer: number | null = null;
    
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameOver, timeLeft, endRound]);

  // Обновление счета игрока
  const updatePlayerScore = useCallback((playerId: number, points: number) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, score: player.score + points, targetNumber: Math.floor(Math.random() * 4) + 1 } 
          : player
      )
    );
  }, []);

  // Начало игры
  const startGame = () => {
    // Задаем случайные числа для каждого игрока
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        isActive: true,
        targetNumber: Math.floor(Math.random() * 4) + 1
      }))
    );
    setGameStarted(true);
    setGameOver(false);
    setTimeLeft(60);
  };

  // Начать новый раунд
  const startNewRound = () => {
    setRound(prev => prev + 1);
    setGameOver(false);
    setTimeLeft(60);
    
    // Сбрасываем состояние победителей, но сохраняем очки
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        isActive: true,
        isWinner: false,
        targetNumber: Math.floor(Math.random() * 4) + 1
      }))
    );
  };

  // Рестарт игры
  const restartGame = () => {
    setPlayers(prev => 
      prev.map(() => ({
        id: Math.floor(Math.random() * 1000),
        score: 0,
        isActive: false,
        isWinner: false,
        targetNumber: null
      }))
    );
    setRound(1);
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(60);
  };

  // Вернуться на главную
  const goToHome = () => {
    navigate("/");
  };

  // Представление игры в зависимости от количества игроков
  const renderGame = () => {
    // До начала игры показываем кнопку старта
    if (!gameStarted) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold mb-8 text-indigo-800">{playersCount} {playersCount === 1 ? "игрок" : playersCount < 5 ? "игрока" : "игроков"}</h2>
          <Button 
            onClick={startGame} 
            size="lg" 
            className="text-xl py-8 px-12 bg-indigo-600 hover:bg-indigo-700 animate-bounce-custom"
          >
            Начать игру
          </Button>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <GameControls 
          timeLeft={timeLeft} 
          round={round} 
          gameOver={gameOver} 
          players={players}
          onNewRound={startNewRound}
          onRestart={restartGame}
          onHome={goToHome}
        />
        
        <div className={`flex-1 grid ${getGridTemplateByPlayers(playersCount)} gap-2 p-2`}>
          {players.map((player) => (
            <PlayerArea
              key={player.id}
              player={player}
              updateScore={updatePlayerScore}
              gameOver={gameOver}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {renderGame()}
    </div>
  );
};

// Определяем разметку сетки в зависимости от числа игроков
function getGridTemplateByPlayers(count: number): string {
  switch (count) {
    case 1: return "grid-cols-1";
    case 2: return "grid-cols-2";
    case 3: return "grid-cols-3";
    case 4: return "grid-cols-2 grid-rows-2";
    default: return "grid-cols-2 grid-rows-2";
  }
}

export default Game;
