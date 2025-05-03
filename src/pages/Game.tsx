
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
  const initialGameId = searchParams.get("gameId");
  const totalRounds = parseInt(searchParams.get("rounds") || "1", 10);
  const gamesParam = searchParams.get("games") || "";
  const roundGames = gamesParam ? gamesParam.split(',') : [];
  
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentGame, setCurrentGame] = useState<any>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(initialGameId);
  const [isMultiRound, setIsMultiRound] = useState(totalRounds > 1);
  const [showRoundSummary, setShowRoundSummary] = useState(false);

  // Загрузка информации о выбранной игре
  useEffect(() => {
    let gameId = currentGameId;
    
    // Если у нас режим раундов, выбираем игру для текущего раунда
    if (isMultiRound && roundGames.length > 0) {
      const roundIndex = currentRound - 1;
      if (roundIndex < roundGames.length) {
        gameId = roundGames[roundIndex];
      }
    }
    
    let game;
    if (gameId) {
      game = getGameById(gameId);
    }
    
    if (!game) {
      // Если игра не найдена, выбираем случайную
      game = getRandomGameForPlayerCount(playersCount);
    }
    
    setCurrentGame(game);
    setCurrentGameId(game.id);
    
    // Устанавливаем время на основе выбранной игры
    if (game && game.duration) {
      setTimeLeft(game.duration);
    } else {
      setTimeLeft(60);
    }
  }, [currentGameId, playersCount, currentRound, isMultiRound, roundGames]);

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
    
    // Находим победителя раунда
    const maxScore = Math.max(...players.map(p => p.score));
    
    setPlayers(prev => 
      prev.map(player => ({
        ...player,
        isWinner: player.score === maxScore && maxScore > 0
      }))
    );
    
    // Если это многораундовый режим, показываем итоги раунда
    if (isMultiRound) {
      setShowRoundSummary(true);
    }
  }, [players, isMultiRound]);

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
            score: Math.max(0, player.score + points) // Счет не может быть отрицательным
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
    // Если это был последний раунд, то уже не начинаем новый
    if (isMultiRound && currentRound >= totalRounds) {
      return;
    }
    
    // Увеличиваем номер раунда
    setCurrentRound(prev => prev + 1);
    setGameOver(false);
    setShowRoundSummary(false);
    
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
    setCurrentRound(1);
    setGameStarted(false);
    setGameOver(false);
    setShowRoundSummary(false);
    
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

  // Представление игры в зависимости от состояния
  const renderGame = () => {
    // До начала игры показываем кнопку старта
    if (!gameStarted) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          {currentGame && (
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{currentGame.icon}</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-800">{currentGame.title}</h2>
              <p className="text-md md:text-lg text-indigo-600 mb-4">{currentGame.description}</p>
              <p className="bg-indigo-50 p-3 rounded-lg text-indigo-700 max-w-md mx-auto">
                {currentGame.instructions}
              </p>
            </div>
          )}
          
          {isMultiRound && (
            <div className="mb-4 text-center">
              <div className="text-indigo-800 font-bold">
                Раунд {currentRound} из {totalRounds}
              </div>
            </div>
          )}
          
          <div className="my-4 sm:my-6">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-indigo-800">
              {playersCount} {playersCount === 1 ? "игрок" : playersCount < 5 ? "игрока" : "игроков"}
            </h3>
            <div className="flex justify-center gap-3">
              {Array.from({ length: playersCount }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getPlayerColor(i + 1) }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
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
              className="text-lg md:text-xl py-4 md:py-6 px-8 md:px-12 bg-indigo-600 hover:bg-indigo-700 animate-bounce-custom"
            >
              Начать игру
            </Button>
          </div>
        </div>
      );
    }

    // Показываем итоги раунда
    if (showRoundSummary) {
      const isLastRound = currentRound >= totalRounds;
      
      // Находим победителя раунда
      const roundWinner = players.find(p => p.isWinner);
      
      // Если это последний раунд, находим общего победителя
      let finalWinner = null;
      if (isLastRound) {
        const maxScore = Math.max(...players.map(p => p.score));
        finalWinner = players.find(p => p.score === maxScore);
      }
      
      return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          {isLastRound ? (
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-800">Игра завершена!</h2>
              <div className="text-6xl mb-4">🏆</div>
              <div className="text-xl md:text-2xl font-bold mb-2" style={{ color: getPlayerColor(finalWinner?.id || 1) }}>
                Победил Игрок {finalWinner?.id}
              </div>
              <div className="text-lg md:text-xl">
                с результатом {finalWinner?.score} {finalWinner?.score === 1 ? "очко" : finalWinner?.score && finalWinner?.score < 5 ? "очка" : "очков"}
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-800">Раунд {currentRound} завершен!</h2>
              {roundWinner && (
                <div className="text-xl font-bold mb-2" style={{ color: getPlayerColor(roundWinner.id) }}>
                  Победил Игрок {roundWinner.id} в этом раунде
                </div>
              )}
            </div>
          )}
          
          <div className="mb-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-3 text-indigo-800">Текущий счет:</h3>
            <div className="grid gap-2">
              {players.map(player => (
                <div 
                  key={player.id} 
                  className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center"
                  style={{ borderLeft: `4px solid ${getPlayerColor(player.id)}` }}
                >
                  <div className="font-bold">Игрок {player.id}</div>
                  <div className="text-xl font-bold">
                    {player.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              onClick={restartGame}
              className="text-indigo-600 border-indigo-300"
            >
              Начать заново
            </Button>
            
            {isLastRound ? (
              <Button 
                onClick={goToHome}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                На главную
              </Button>
            ) : (
              <Button 
                onClick={startNewRound}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Следующий раунд
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Показываем игровой процесс
    return (
      <div className="h-full flex flex-col">
        <GameControls 
          timeLeft={timeLeft} 
          round={currentRound}
          totalRounds={isMultiRound ? totalRounds : undefined}
          gameOver={gameOver}
          players={players}
          gameName={currentGame?.title || "Игра"}
          onNewRound={isMultiRound ? () => setShowRoundSummary(true) : startNewRound}
          onRestart={restartGame}
          onHome={goToHome}
        />
        
        <div className={`flex-1 grid ${getGridTemplateByPlayers(playersCount)} gap-2 p-2`}>
          {players.map((player) => (
            <GameArea
              key={player.id}
              gameId={currentGameId || 'number-tap'}
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

// Определяем разметку сетки в зависимости от числа игроков и размера экрана
function getGridTemplateByPlayers(count: number): string {
  // Используем медиа-запросы для мобильных устройств
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    switch (count) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-1 grid-rows-2";
      case 3: return "grid-cols-1 grid-rows-3";
      case 4: return "grid-cols-1 grid-rows-4";
      default: return "grid-cols-1 grid-rows-4";
    }
  } else {
    // Для десктопов
    switch (count) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-2 grid-rows-2";
      default: return "grid-cols-2 grid-rows-2";
    }
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
