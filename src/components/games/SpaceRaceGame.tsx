
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SpaceRaceGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type SpaceShip = {
  position: number; // от 0 до 100 (вертикальная позиция)
  lane: number; // полоса движения
  isBoosting: boolean;
};

type Obstacle = {
  id: number;
  position: number; // от -20 до 100 (вертикальная позиция)
  lane: number; // полоса движения
  size: number; // размер препятствия 
  passed: boolean;
};

type Star = {
  id: number;
  position: number;
  lane: number;
  collected: boolean;
};

const SpaceRaceGame = ({ player, updateScore, gameOver }: SpaceRaceGameProps) => {
  const [ship, setShip] = useState<SpaceShip>({ position: 80, lane: 1, isBoosting: false });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [starsCollected, setStarsCollected] = useState(0);
  const [speed, setSpeed] = useState(1.5);
  
  const gameLoopRef = useRef<number | null>(null);
  const obstacleIdRef = useRef(0);
  const starIdRef = useRef(0);
  const lastObstacleTimeRef = useRef(0);
  const lastStarTimeRef = useRef(0);
  
  // Инициализация игры
  useEffect(() => {
    if (player.isActive && !gameOver) {
      startGame();
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [player.isActive, gameOver]);
  
  // Запуск игры
  const startGame = () => {
    setShip({ position: 80, lane: 1, isBoosting: false });
    setObstacles([]);
    setStars([]);
    setDistanceTraveled(0);
    setCollisions(0);
    setStarsCollected(0);
    setSpeed(1.5);
    
    gameLoop(performance.now());
  };
  
  // Игровой цикл
  const gameLoop = (timestamp: number) => {
    // Движение корабля
    setShip(prevShip => ({
      ...prevShip,
      position: Math.max(0, prevShip.position - (prevShip.isBoosting ? 0.3 : 0.1)),
    }));
    
    // Создаем новые препятствия
    if (timestamp - lastObstacleTimeRef.current > 1500) { // Каждые 1.5 секунды
      const lane = Math.floor(Math.random() * 3);
      
      setObstacles(prev => [
        ...prev,
        {
          id: obstacleIdRef.current++,
          position: -20,
          lane,
          size: Math.floor(Math.random() * 3) + 1, // Размер 1-3
          passed: false
        }
      ]);
      
      lastObstacleTimeRef.current = timestamp;
    }
    
    // Создаем звезды (бонусы)
    if (timestamp - lastStarTimeRef.current > 3000) { // Каждые 3 секунды
      const lane = Math.floor(Math.random() * 3);
      
      setStars(prev => [
        ...prev,
        {
          id: starIdRef.current++,
          position: -10,
          lane,
          collected: false
        }
      ]);
      
      lastStarTimeRef.current = timestamp;
    }
    
    // Движение препятствий и проверка столкновений
    setObstacles(prev => {
      const newObstacles = prev.map(obstacle => {
        // Движение препятствия
        const newPosition = obstacle.position + speed;
        
        // Проверка столкновений
        if (!obstacle.passed && 
            obstacle.lane === ship.lane && 
            newPosition >= ship.position - 10 && 
            newPosition <= ship.position + 10) {
          handleCollision();
          return { ...obstacle, passed: true };
        }
        
        // Подсчет пройденных препятствий
        if (!obstacle.passed && newPosition > ship.position + 15) {
          handleObstaclePassed();
          return { ...obstacle, passed: true };
        }
        
        return { ...obstacle, position: newPosition };
      }).filter(obstacle => obstacle.position < 120); // Удаляем препятствия, вышедшие за экран
      
      return newObstacles;
    });
    
    // Движение звезд и проверка сбора
    setStars(prev => {
      const newStars = prev.map(star => {
        // Движение звезды
        const newPosition = star.position + speed;
        
        // Проверка сбора звезды
        if (!star.collected && 
            star.lane === ship.lane && 
            newPosition >= ship.position - 10 && 
            newPosition <= ship.position + 10) {
          handleStarCollected();
          return { ...star, collected: true };
        }
        
        return { ...star, position: newPosition };
      }).filter(star => !star.collected && star.position < 120); // Удаляем собранные и вышедшие за экран звезды
      
      return newStars;
    });
    
    // Увеличиваем пройденное расстояние
    setDistanceTraveled(prev => prev + speed / 10);
    
    // Увеличиваем скорость со временем
    if (distanceTraveled % 10 < speed / 10) {
      setSpeed(prev => Math.min(prev + 0.1, 5));
    }
    
    // Продолжаем цикл
    if (!gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Обработка столкновения с препятствием
  const handleCollision = () => {
    setCollisions(prev => prev + 1);
  };
  
  // Обработка успешного прохождения препятствия
  const handleObstaclePassed = () => {
    updateScore(player.id, 1);
  };
  
  // Обработка сбора звезды
  const handleStarCollected = () => {
    setStarsCollected(prev => prev + 1);
    updateScore(player.id, 3);
  };
  
  // Перемещение корабля влево
  const moveLeft = () => {
    if (gameOver || !player.isActive) return;
    
    setShip(prev => ({
      ...prev,
      lane: Math.max(0, prev.lane - 1)
    }));
  };
  
  // Перемещение корабля вправо
  const moveRight = () => {
    if (gameOver || !player.isActive) return;
    
    setShip(prev => ({
      ...prev,
      lane: Math.min(2, prev.lane + 1)
    }));
  };
  
  // Ускорение корабля
  const startBoost = () => {
    if (gameOver || !player.isActive) return;
    
    setShip(prev => ({
      ...prev,
      isBoosting: true
    }));
  };
  
  // Прекращение ускорения
  const endBoost = () => {
    if (gameOver || !player.isActive) return;
    
    setShip(prev => ({
      ...prev,
      isBoosting: false
    }));
  };
  
  // Получаем цвет для игрока
  const getPlayerColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[player.id - 1] || colors[0];
  };
  
  // Стили для области игрока
  const playerAreaStyle = {
    backgroundColor: player.isWinner ? "#FFF9C4" : "#000022",
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
        <div className="text-lg font-bold text-white">
          {player.score} {player.score === 1 ? "очко" : player.score < 5 ? "очка" : "очков"}
        </div>
      </div>
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="flex-1 relative bg-black" style={{ overflow: 'hidden' }}>
        {/* Звезды в фоне */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={`bg-star-${i}`} 
            className="absolute w-1 h-1 bg-white rounded-full" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        
        {/* Полосы движения */}
        <div className="absolute inset-0 flex">
          {[0, 1, 2].map(lane => (
            <div 
              key={`lane-${lane}`} 
              className="flex-1 border-x border-gray-800 relative"
            >
              {/* Маркеры дистанции */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={`marker-${lane}-${i}`} 
                  className="absolute w-full h-1 bg-gray-800"
                  style={{ top: `${i * 25}%` }}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Корабль игрока */}
        <div 
          className="absolute w-10 h-10 transition-all duration-150"
          style={{ 
            left: `calc(${(ship.lane * 33.33) + 16.665}% - 20px)`, 
            top: `${ship.position}%`,
            transform: ship.isBoosting ? 'scale(0.8)' : 'scale(1)'
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="w-0 h-0 relative"
              style={{
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: `20px solid ${getPlayerColor()}`,
              }}
            >
              {/* Пламя двигателя */}
              <div
                className="absolute w-0 h-0"
                style={{
                  top: '100%',
                  left: '-5px',
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: `${ship.isBoosting ? '15' : '8'}px solid orange`,
                  opacity: ship.isBoosting ? '1' : '0.7',
                  transition: 'all 0.1s ease-out'
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Препятствия */}
        {obstacles.map(obstacle => (
          <div
            key={`obstacle-${obstacle.id}`}
            className="absolute rounded-full bg-red-500"
            style={{ 
              width: `${obstacle.size * 10}px`,
              height: `${obstacle.size * 10}px`,
              left: `calc(${(obstacle.lane * 33.33) + 16.665}% - ${obstacle.size * 5}px)`, 
              top: `${obstacle.position}%`,
              opacity: obstacle.passed ? 0.3 : 1,
              transition: 'opacity 0.3s ease-out'
            }}
          />
        ))}
        
        {/* Звезды (бонусы) */}
        {stars.map(star => (
          <div
            key={`star-${star.id}`}
            className="absolute text-yellow-400 text-2xl"
            style={{ 
              left: `calc(${(star.lane * 33.33) + 16.665}% - 10px)`, 
              top: `${star.position}%`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>
      
      {/* Кнопки управления */}
      <div className="grid grid-cols-3 gap-1 mt-2">
        <Button
          variant="outline"
          className="h-12"
          style={{ borderColor: getPlayerColor() }}
          disabled={gameOver}
          onClick={moveLeft}
        >
          ⬅️
        </Button>
        <Button
          variant="outline"
          className="h-12"
          style={{ borderColor: getPlayerColor() }}
          disabled={gameOver}
          onMouseDown={startBoost}
          onMouseUp={endBoost}
          onMouseLeave={endBoost}
          onTouchStart={startBoost}
          onTouchEnd={endBoost}
        >
          🚀
        </Button>
        <Button
          variant="outline"
          className="h-12"
          style={{ borderColor: getPlayerColor() }}
          disabled={gameOver}
          onClick={moveRight}
        >
          ➡️
        </Button>
      </div>
      
      {/* Статистика */}
      <div className="text-xs text-gray-400 mt-1 flex justify-between">
        <div>Звезды: {starsCollected}</div>
        <div>Дист: {Math.floor(distanceTraveled)} ly</div>
        <div>Столкн: {collisions}</div>
      </div>
    </div>
  );
};

export default SpaceRaceGame;
