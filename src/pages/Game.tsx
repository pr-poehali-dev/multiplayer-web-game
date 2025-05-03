
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GameControls from "@/components/GameControls";
import GameArea from "@/components/GameArea";
import { getGameById, getRandomGameForPlayerCount } from "@/lib/gameTypes";

interface PlayerState {
  id: number;
  score: number;
  isActive: boolean;
  isWinner: boolean;
}

const Game = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const playersCount = parseInt(searchParams.get("players") || "4", 10);
  const gameId = searchParams.get("gameId");
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60); // Будет изменено на основе выбранной игры
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentGame, setCurrentGame] = useState<any>(null);

  // Загрузка информации о выбранной игре
  useEffect(() => {
    let game;
    if (gameId) {
      game = getGameById(gameId);
    }
    
    if (!game) {
      // Если игра не найдена, выбираем случайную
      game = getRandomGameForPlayerCount(playersCount);
    }
    
    setCurrentGame(game);
    
    // Устанавливаем время на основе выбранной игры
    if (game && game.duration) {
      setTimeLeft(game.duration);
    } else {
      setTimeLeft(60);
    }
  }, [gameId, playersCount]);

  // Инициализация игроков
  useEffect(() => {
    const initialPlayers = Array.from({ length: playersCount }).map((_, index) => ({
      id: index + 1,
      score: 0,
      isActive: false,
      isWinner: false
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
        isWinner: player.score === maxScore && maxScore > 0
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
      prev.map(player => {
        if (player.id === playerId) {
          return { 
            ...player, 
            score: player.score + points
          };
        } 
        return player;
      })
    );
  }, []);

  // Начало игры
  const startGame = () => {
    // Активируем всех игроков
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        isActive: true
      }))
    );
    setGameStarted(true);
    setGameOver(false);
    
    // Устанавливаем время на основе выбранной игры
    if (currentGame && currentGame.duration) {
      setTimeLeft(currentGame.duration);
    } else {
      setTimeLeft(60);
    }
  };

  // Начать новый раунд
  const startNewRound = () => {
    setRound(prev => prev + 1);
    setGameOver(false);
    
    // Устанавливаем время на основе выбранной игры
    if (currentGame && currentGame.duration) {
      setTimeLeft(currentGame.duration);
    } else {
      setTimeLeft(60);
    }
    
    // Сбрасываем состояние победителей, но сохраняем очки
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        isActive: true,
        isWinner: false
      }))
    );
  };

  // Рестарт игры
  const restartGame = () => {
    setPlayers(prev => 
      prev.map(player => ({
        id: player.id,
        score: 0,
        isActive: false,
        isWinner: false
      }))
    );
    setRound(1);
    setGameStarted(false);
    setGameOver(false);
    
    // Устанавливаем время на основе выбранной игры
    if (currentGame && currentGame.duration) {
      setTimeLeft(currentGame.duration);
    } else {
      setTimeLeft(60);
    }
  };

  // Выбрать другую игру
  const selectNewGame = () => {
    navigate("/");
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
        <div className="flex flex-col items-center justify-center h-full p-4">
          {currentGame && (
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{currentGame.icon}</div>
              <h2 className="text-3xl font-bold mb-2 text-indigo-800">{currentGame.title}</h2>
              <p className="text-lg text-indigo-600 mb-4">{currentGame.description}</p>
              <p className="bg-indigo-50 p-3 rounded-lg text-indigo-700 max-w-md mx-auto">
                {currentGame.instructions}
              </p>
            </div>
          )}
          
          <div className="my-6">
            <h3 className="text-xl font-bold mb-3 text-indigo-800">{playersCount} {playersCount === 1 ? "игрок" : playersCount < 5 ? "игрока" : "игроков"}</h3>
            <div className="flex justify-center gap-3">
              {Array.from({ length: playersCount }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getPlayerColor(i + 1) }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={selectNewGame}
              className="text-indigo-600 border-indigo-300"
            >
              Выбрать другую игру
            </Button>
            
            <Button 
              onClick={startGame} 
              size="lg" 
              className="text-xl py-6 px-12 bg-indigo-600 hover:bg-indigo-700 animate-bounce-custom"
            >
              Начать игру
            </Button>
          </div>
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
          gameName={currentGame?.title || "Игра"}
          onNewRound={startNewRound}
          onRestart={restartGame}
          onHome={goToHome}
        />
        
        <div className={`flex-1 grid ${getGridTemplateByPlayers(playersCount)} gap-2 p-2`}>
          {players.map((player) => (
            <GameArea
              key={player.id}
              gameId={currentGame?.id || 'number-tap'}
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

// Вспомогательная функция для получения цвета игрока
function getPlayerColor(playerNumber: number): string {
  const colors = {
    1: "#FF5252", // Красный
    2: "#4CAF50", // Зеленый
    3: "#2196F3", // Синий
    4: "#FF9800", // Оранжевый
  };
  return colors[playerNumber as keyof typeof colors] || "#9E9E9E";
}

export default Game;
