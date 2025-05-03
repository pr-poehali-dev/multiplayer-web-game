
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MoleCatcherGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type Hole = {
  id: number;
  hasMole: boolean;
  hasBomb: boolean;
  moleDuration: number;
  showingTime: number;
  isWhacked: boolean;
};

const MoleCatcherGame = ({ player, updateScore, gameOver }: MoleCatcherGameProps) => {
  const [holes, setHoles] = useState<Hole[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [lastWhack, setLastWhack] = useState<number | null>(null);
  
  // Инициализация игры
  useEffect(() => {
    if (player.isActive && !gameOver) {
      initializeGame();
    }
    
    return () => {
      // Очистка времянок при размонтировании
    };
  }, [player.isActive, gameOver]);
  
  // Инициализация нор
  const initializeGame = () => {
    const initialHoles = Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      hasMole: false,
      hasBomb: false,
      moleDuration: 0,
      showingTime: 0,
      isWhacked: false
    }));
    
    setHoles(initialHoles);
    setStrikes(0);
    setCombo(0);
    setDifficulty(1);
    setLastWhack(null);
    
    // Запускаем игровой цикл
    startGameLoop();
  };
  
  // Игровой цикл
  const startGameLoop = () => {
    const gameInterval = setInterval(() => {
      if (gameOver) {
        clearInterval(gameInterval);
        return;
      }
      
      updateHoles();
    }, 200);
    
    // Очистка интервала
    return () => {
      clearInterval(gameInterval);
    };
  };
  
  // Обновление состояния нор
  const updateHoles = () => {
    setHoles(prevHoles => {
      const newHoles = [...prevHoles];
      
      // Обновляем время показа для существующих кротов
      newHoles.forEach(hole => {
        if (hole.hasMole || hole.hasBomb) {
          hole.showingTime += 200;
          
          // Если крот был на поверхности слишком долго, убираем его и добавляем штраф
          if (hole.showingTime >= hole.moleDuration && !hole.isWhacked) {
            if (hole.hasMole) {
              handleMissedMole();
            }
            
            hole.hasMole = false;
            hole.hasBomb = false;
            hole.showingTime = 0;
            hole.isWhacked = false;
          }
        }
      });
      
      // С определенной вероятностью появляется новый крот или бомба
      const activeMolesCount = newHoles.filter(h => h.hasMole || h.hasBomb).length;
      
      // Ограничиваем количество одновременных кротов
      const maxActiveMoles = Math.min(3 + Math.floor(difficulty / 2), 5);
      
      if (activeMolesCount < maxActiveMoles && Math.random() < 0.3) {
        // Выбираем случайную пустую нору
        const emptyHoles = newHoles.filter(h => !h.hasMole && !h.hasBomb);
        
        if (emptyHoles.length > 0) {
          const randomIndex = Math.floor(Math.random() * emptyHoles.length);
          const selectedHoleId = emptyHoles[randomIndex].id;
          
          // Определяем, будет ли это крот или бомба
          const isBomb = Math.random() < 0.15 * difficulty; // Вероятность появления бомбы увеличивается с уровнем сложности
          
          newHoles[selectedHoleId] = {
            ...newHoles[selectedHoleId],
            hasMole: !isBomb,
            hasBomb: isBomb,
            moleDuration: isBomb 
              ? 3000 - difficulty * 200 // Бомбы остаются дольше
              : Math.max(3000 - difficulty * 300, 1200), // Кроты уходят быстрее с ростом сложности
            showingTime: 0,
            isWhacked: false
          };
        }
      }
      
      return newHoles;
    });
  };
  
  // Обработка удара по норе
  const handleWhack = (holeId: number) => {
    if (gameOver || !player.isActive) return;
    
    setHoles(prevHoles => {
      const newHoles = [...prevHoles];
      const hole = newHoles[holeId];
      
      if (hole.hasMole && !hole.isWhacked) {
        // Попали по кроту
        handleMoleWhacked();
        
        newHoles[holeId] = {
          ...hole,
          hasMole: false,
          isWhacked: true
        };
      } else if (hole.hasBomb && !hole.isWhacked) {
        // Попали по бомбе
        handleBombWhacked();
        
        newHoles[holeId] = {
          ...hole,
          hasBomb: false,
          isWhacked: true
        };
      } else {
        // Промах
        handleMiss();
      }
      
      return newHoles;
    });
  };
  
  // Обработка успешного удара по кроту
  const handleMoleWhacked = () => {
    // Увеличиваем комбо
    setCombo(prev => prev + 1);
    
    // Начисляем очки с учетом комбо
    const comboBonus = Math.min(Math.floor(combo / 3), 3);
    updateScore(player.id, 1 + comboBonus);
    
    // Записываем время последнего удара
    setLastWhack(Date.now());
    
    // Увеличиваем сложность каждые 5 кротов
    if ((player.score + 1) % 5 === 0) {
      setDifficulty(prev => Math.min(prev + 1, 10));
    }
  };
  
  // Обработка удара по бомбе
  const handleBombWhacked = () => {
    // Сбрасываем комбо и добавляем штраф
    setCombo(0);
    setStrikes(prev => prev + 1);
    
    // Штраф очков
    updateScore(player.id, -2);
  };
  
  // Обработка промаха по пустой норе
  const handleMiss = () => {
    // Небольшой штраф за промах
    setStrikes(prev => prev + 1);
    
    // Сбрасываем комбо если оно было большим
    if (combo > 3) {
      setCombo(prev => Math.floor(prev / 2));
    }
  };
  
  // Обработка пропущенного крота
  const handleMissedMole = () => {
    setCombo(0); // Сбрасываем комбо
  };
  
  // Получаем цвет для игрока
  const getPlayerColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[player.id - 1] || colors[0];
  };
  
  // Стили для области игрока
  const playerAreaStyle = {
    backgroundColor: player.isWinner ? "#FFF9C4" : "#8B5A2B",
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
      
      {/* Полоса комбо */}
      <div className="h-2 bg-gray-700 mb-2 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${Math.min(combo * 10, 100)}%`,
            backgroundColor: getPlayerColor()
          }}
        />
      </div>
      
      {/* Игровое поле */}
      <div className="flex-1 grid grid-cols-3 gap-2">
        {holes.map((hole, index) => (
          <Button
            key={`hole-${index}`}
            className="relative p-0 h-auto aspect-square overflow-hidden"
            variant="outline"
            style={{
              backgroundColor: '#5D4037',
              borderColor: '#3E2723',
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver}
            onClick={() => handleWhack(index)}
          >
            {/* Отверстие норы */}
            <div className="absolute inset-2 rounded-full bg-black opacity-70" />
            
            {/* Молоток при нажатии */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-3xl"
              style={{ 
                opacity: hole.isWhacked ? 1 : 0,
                transform: hole.isWhacked ? 'translateY(0)' : 'translateY(-50px)',
                transition: 'all 0.1s ease-out' 
              }}
            >
              🔨
            </div>
            
            {/* Крот */}
            {hole.hasMole && (
              <div 
                className="absolute w-full bottom-0 flex items-center justify-center"
                style={{ 
                  height: `${Math.min((hole.showingTime / hole.moleDuration) * 100, 100)}%`,
                  transition: 'height 0.2s ease-out'
                }}
              >
                <div className="text-3xl">🦫</div>
              </div>
            )}
            
            {/* Бомба */}
            {hole.hasBomb && (
              <div 
                className="absolute w-full bottom-0 flex items-center justify-center"
                style={{ 
                  height: `${Math.min((hole.showingTime / hole.moleDuration) * 100, 100)}%`,
                  transition: 'height 0.2s ease-out'
                }}
              >
                <div className="text-3xl">💣</div>
              </div>
            )}
          </Button>
        ))}
      </div>
      
      {/* Статистика */}
      <div className="text-xs text-white mt-1 flex justify-between">
        <div>Промахи: {strikes}</div>
        <div>Комбо: {combo}</div>
        <div>Уровень: {difficulty}</div>
      </div>
    </div>
  );
};

export default MoleCatcherGame;
