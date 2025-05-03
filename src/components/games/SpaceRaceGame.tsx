
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import PlayerArea from "@/components/PlayerArea";

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

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  type: 'star' | 'fuel' | 'bonus';
  value: number;
}

const SpaceRaceGame = ({ player, updateScore, gameOver }: SpaceRaceGameProps) => {
  const [shipPosition, setShipPosition] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [distance, setDistance] = useState(0);
  const [lastObstacleTime, setLastObstacleTime] = useState(0);
  const [lastCollectibleTime, setLastCollectibleTime] = useState(0);
  
  const shipRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  // Обработка столкновений с препятствиями и сбор предметов
  const checkCollisions = useCallback(() => {
    if (!shipRef.current || !isPlaying) return;
    
    const shipRect = shipRef.current.getBoundingClientRect();
    
    // Проверка столкновений с препятствиями
    const collision = obstacles.some(obstacle => {
      const obstacleElement = document.getElementById(`obstacle-${player.id}-${obstacle.id}`);
      if (!obstacleElement) return false;
      
      const obstacleRect = obstacleElement.getBoundingClientRect();
      
      return !(
        shipRect.right < obstacleRect.left || 
        shipRect.left > obstacleRect.right || 
        shipRect.bottom < obstacleRect.top || 
        shipRect.top > obstacleRect.bottom
      );
    });
    
    if (collision) {
      updateScore(player.id, -1);
      // Не останавливаем игру, просто снимаем очки
    }
    
    // Сбор предметов
    const collected = collectibles.filter(collectible => {
      const collectibleElement = document.getElementById(`collectible-${player.id}-${collectible.id}`);
      if (!collectibleElement) return false;
      
      const collectibleRect = collectibleElement.getBoundingClientRect();
      
      return !(
        shipRect.right < collectibleRect.left || 
        shipRect.left > collectibleRect.right || 
        shipRect.bottom < collectibleRect.top || 
        shipRect.top > collectibleRect.bottom
      );
    });
    
    if (collected.length > 0) {
      collected.forEach(item => {
        updateScore(player.id, item.value);
      });
      
      // Удаляем собранные предметы
      setCollectibles(prev => prev.filter(item => !collected.includes(item)));
    }
  }, [obstacles, collectibles, player.id, updateScore, isPlaying]);

  // Основной игровой цикл
  const gameLoop = useCallback((timestamp: number) => {
    if (!isPlaying) return;
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Увеличиваем пройденное расстояние
    setDistance(prev => {
      const newDistance = prev + deltaTime * 0.01 * gameSpeed;
      // Увеличиваем скорость игры со временем
      if (Math.floor(newDistance / 100) > Math.floor(prev / 100)) {
        setGameSpeed(prev => Math.min(prev + 0.1, 3));
      }
      return newDistance;
    });
    
    // Перемещаем препятствия
    setObstacles(prev => {
      // Удаляем препятствия, которые вышли за пределы экрана
      const filtered = prev.filter(obstacle => obstacle.y < 100);
      
      // Перемещаем оставшиеся препятствия
      return filtered.map(obstacle => ({
        ...obstacle,
        y: obstacle.y + deltaTime * 0.05 * gameSpeed
      }));
    });
    
    // Перемещаем собираемые предметы
    setCollectibles(prev => {
      // Удаляем предметы, которые вышли за пределы экрана
      const filtered = prev.filter(item => item.y < 100);
      
      // Перемещаем оставшиеся предметы
      return filtered.map(item => ({
        ...item,
        y: item.y + deltaTime * 0.04 * gameSpeed
      }));
    });
    
    // Создаем новые препятствия
    if (timestamp - lastObstacleTime > 1500 / gameSpeed) {
      setLastObstacleTime(timestamp);
      
      const newObstacle: Obstacle = {
        id: Date.now(),
        x: Math.random() * 70 + 10, // Позиция по X (от 10% до 80%)
        y: -10, // Начальная позиция выше экрана
        width: Math.random() * 20 + 10, // Ширина от 10% до 30%
        height: Math.random() * 5 + 3 // Высота от 3% до 8%
      };
      
      setObstacles(prev => [...prev, newObstacle]);
    }
    
    // Создаем новые собираемые предметы
    if (timestamp - lastCollectibleTime > 2000 / gameSpeed) {
      setLastCollectibleTime(timestamp);
      
      const types: Array<'star' | 'fuel' | 'bonus'> = ['star', 'fuel', 'bonus'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const values = {
        star: 1,
        fuel: 2,
        bonus: 5
      };
      
      const newCollectible: Collectible = {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Позиция по X (от 10% до 90%)
        y: -5, // Начальная позиция выше экрана
        type,
        value: values[type]
      };
      
      setCollectibles(prev => [...prev, newCollectible]);
    }
    
    // Проверяем столкновения
    checkCollisions();
    
    // Продолжаем цикл
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, gameSpeed, lastObstacleTime, lastCollectibleTime, checkCollisions]);

  // Начало/остановка игры
  useEffect(() => {
    if (player.isActive && !gameOver) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [player.isActive, gameOver]);

  // Управление игровым циклом
  useEffect(() => {
    if (isPlaying && !animationRef.current) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (!isPlaying && animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, gameLoop]);

  // Управление кораблем
  const moveShip = (direction: 'left' | 'right') => {
    if (!isPlaying) return;
    
    setShipPosition(prev => {
      if (direction === 'left') {
        return Math.max(prev - 5, 0);
      } else {
        return Math.min(prev + 5, 100);
      }
    });
  };

  return (
    <PlayerArea player={player} title="Космическая гонка" score={distance.toFixed(0)}>
      <div className="relative w-full h-full bg-indigo-900 overflow-hidden">
        {/* Звезды на фоне (случайные точки) */}
        {Array.from({ length: 50 }).map((_, index) => (
          <div 
            key={index}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        
        {/* Корабль игрока */}
        <div 
          ref={shipRef}
          className="absolute bottom-5 w-8 h-10"
          style={{ left: `calc(${shipPosition}% - 16px)` }}
        >
          <div className="w-full h-full relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-indigo-400 rounded-t-full" />
            <div className="absolute bottom-0 left-0 w-8 h-3 bg-indigo-300 rounded-sm" />
            {isPlaying && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-orange-500 animate-pulse" />
            )}
          </div>
        </div>
        
        {/* Препятствия */}
        {obstacles.map(obstacle => (
          <div 
            id={`obstacle-${player.id}-${obstacle.id}`}
            key={obstacle.id}
            className="absolute bg-red-600 rounded-sm"
            style={{
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              width: `${obstacle.width}%`,
              height: `${obstacle.height}%`
            }}
          />
        ))}
        
        {/* Собираемые предметы */}
        {collectibles.map(item => (
          <div 
            id={`collectible-${player.id}-${item.id}`}
            key={item.id}
            className="absolute w-6 h-6 flex items-center justify-center"
            style={{
              left: `calc(${item.x}% - 12px)`,
              top: `${item.y}%`
            }}
          >
            {item.type === 'star' && (
              <div className="text-2xl animate-pulse">⭐</div>
            )}
            {item.type === 'fuel' && (
              <div className="text-2xl animate-pulse">🔋</div>
            )}
            {item.type === 'bonus' && (
              <div className="text-2xl animate-pulse">💎</div>
            )}
          </div>
        ))}
        
        {/* Счетчик расстояния */}
        <div className="absolute top-2 left-2 text-white text-sm md:text-base bg-black bg-opacity-50 p-1 rounded">
          {distance.toFixed(0)} ly
        </div>
        
        {/* Кнопки управления */}
        {isPlaying && (
          <div className="absolute bottom-0 w-full flex justify-between px-2 pb-2">
            <Button 
              className="h-12 w-12 rounded-full bg-indigo-500 bg-opacity-70 hover:bg-opacity-100"
              onMouseDown={() => moveShip('left')}
              onTouchStart={() => moveShip('left')}
            >
              ◀
            </Button>
            <Button 
              className="h-12 w-12 rounded-full bg-indigo-500 bg-opacity-70 hover:bg-opacity-100"
              onMouseDown={() => moveShip('right')}
              onTouchStart={() => moveShip('right')}
            >
              ▶
            </Button>
          </div>
        )}
        
        {/* Отображение при остановке игры */}
        {!isPlaying && player.isActive && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-70 p-3 rounded text-white text-center">
              <div className="text-xl mb-2">Космическая гонка</div>
              <Button 
                onClick={() => setIsPlaying(true)}
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Поехали!
              </Button>
            </div>
          </div>
        )}
        
        {/* Отображение при конце игры */}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-xl">
              <div>Расстояние: {distance.toFixed(0)} ly</div>
              {player.isWinner && (
                <div className="text-yellow-400 text-2xl mt-2 font-bold">Победа!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </PlayerArea>
  );
};

export default SpaceRaceGame;
