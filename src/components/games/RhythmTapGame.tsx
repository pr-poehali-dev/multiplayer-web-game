
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface RhythmTapGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type Note = {
  id: number;
  lane: number;
  position: number; // от 0 до 100
  hit: boolean;
  missed: boolean;
};

const RhythmTapGame = ({ player, updateScore, gameOver }: RhythmTapGameProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [lastFeedback, setLastFeedback] = useState("");
  const [speed, setSpeed] = useState(1.5); // Скорость движения нот
  
  const gameLoopRef = useRef<number | null>(null);
  const lastNoteTimeRef = useRef<number>(0);
  const noteCounter = useRef(0);
  
  // Инициализация игры при первом рендере
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
    // Сбрасываем состояние
    setNotes([]);
    setCombo(0);
    setMaxCombo(0);
    setHitCount(0);
    setMissCount(0);
    setLastFeedback("");
    
    // Запускаем игровой цикл
    gameLoop(performance.now());
  };
  
  // Игровой цикл
  const gameLoop = (timestamp: number) => {
    // Двигаем существующие ноты
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.map(note => {
        // Двигаем ноту вниз
        const newPosition = note.position + speed;
        
        // Помечаем ноты, которые пропустили
        let missed = note.missed;
        if (newPosition > 110 && !note.hit && !note.missed) {
          missed = true;
          handleMiss();
        }
        
        return {
          ...note,
          position: newPosition,
          missed
        };
      });
      
      // Фильтруем ноты, которые вышли за пределы экрана
      return updatedNotes.filter(note => note.position < 120);
    });
    
    // Добавляем новые ноты с определенной вероятностью
    const shouldAddNote = Math.random() < 0.03; // 3% шанс каждый фрейм
    
    if (shouldAddNote && timestamp - lastNoteTimeRef.current > 500) { // Минимум 500мс между нотами
      const lane = Math.floor(Math.random() * 4); // Случайная дорожка (0-3)
      
      setNotes(prevNotes => [
        ...prevNotes,
        {
          id: noteCounter.current++,
          lane,
          position: 0, // Начинаем сверху
          hit: false,
          missed: false
        }
      ]);
      
      lastNoteTimeRef.current = timestamp;
    }
    
    // Продолжаем цикл, если игра не завершена
    if (!gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  };
  
  // Обработка нажатия на дорожку
  const handleLaneClick = (lane: number) => {
    if (gameOver || !player.isActive) return;
    
    // Находим ближайшую ноту в этой дорожке, которая находится в зоне попадания
    const hitZone = [90, 110]; // Зона попадания (от 90% до 110% высоты)
    
    const noteIndex = notes.findIndex(note => 
      note.lane === lane && 
      !note.hit && 
      !note.missed && 
      note.position >= hitZone[0] && 
      note.position <= hitZone[1]
    );
    
    if (noteIndex !== -1) {
      // Нашли ноту для попадания
      handleHit(noteIndex);
    } else {
      // Промах - нет ноты в зоне попадания
      handleMiss();
    }
  };
  
  // Обработка попадания
  const handleHit = (noteIndex: number) => {
    // Обновляем ноту
    setNotes(prevNotes => 
      prevNotes.map((note, index) => 
        index === noteIndex ? { ...note, hit: true } : note
      )
    );
    
    // Увеличиваем счетчик попаданий
    setHitCount(prev => prev + 1);
    
    // Увеличиваем комбо
    const newCombo = combo + 1;
    setCombo(newCombo);
    
    // Обновляем максимальное комбо
    if (newCombo > maxCombo) {
      setMaxCombo(newCombo);
    }
    
    // Начисляем очки (больше за длинное комбо)
    const points = Math.min(1 + Math.floor(newCombo / 5), 3);
    updateScore(player.id, points);
    
    // Показываем обратную связь
    if (newCombo >= 10) {
      setLastFeedback("СУПЕР!");
    } else if (newCombo >= 5) {
      setLastFeedback("ОТЛИЧНО!");
    } else {
      setLastFeedback("ПОПАДАНИЕ!");
    }
    
    // Увеличиваем скорость после определенного количества попаданий
    if (hitCount % 10 === 0) {
      setSpeed(prev => Math.min(prev + 0.1, 3));
    }
  };
  
  // Обработка промаха
  const handleMiss = () => {
    // Увеличиваем счетчик промахов
    setMissCount(prev => prev + 1);
    
    // Сбрасываем комбо
    setCombo(0);
    
    // Показываем обратную связь
    setLastFeedback("ПРОМАХ!");
  };
  
  // Получаем цвет для игрока
  const getPlayerColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[player.id - 1] || colors[0];
  };
  
  // Получаем цвет для дорожки
  const getLaneColor = (laneIndex: number) => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[laneIndex] || colors[0];
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
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">
            Комбо: <span className="font-bold">{combo}</span>
          </div>
          <div className="text-md font-bold" style={{ color: getPlayerColor() }}>
            {lastFeedback}
          </div>
          <div className="text-sm">
            Макс: <span className="font-bold">{maxCombo}</span>
          </div>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="flex-1 grid grid-cols-4 gap-1">
        {[0, 1, 2, 3].map(lane => (
          <div 
            key={`lane-${lane}`} 
            className="relative flex flex-col"
            style={{ height: '100%' }}
          >
            {/* Ноты в этой дорожке */}
            {notes
              .filter(note => note.lane === lane && !note.hit)
              .map(note => (
                <div
                  key={`note-${note.id}`}
                  className="absolute w-full flex justify-center items-center"
                  style={{
                    top: `${note.position}%`,
                    opacity: note.missed ? 0.3 : 1
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: getLaneColor(lane),
                      transform: 'scale(0.7)'
                    }}
                  >
                    <span className="text-white text-2xl">
                      {lane + 1}
                    </span>
                  </div>
                </div>
              ))}
            
            {/* Зона попадания */}
            <div 
              className="absolute bottom-0 w-full border-2 border-gray-400 h-8 rounded"
              style={{ borderStyle: 'dashed' }}
            />
            
            {/* Кнопка для нажатия */}
            <Button
              className="mt-auto h-14 flex items-center justify-center"
              style={{
                backgroundColor: getLaneColor(lane),
                opacity: gameOver ? 0.7 : 1,
              }}
              disabled={gameOver}
              onClick={() => handleLaneClick(lane)}
            >
              <span className="text-white text-2xl">
                {lane + 1}
              </span>
            </Button>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 flex justify-between">
        <div>Попаданий: {hitCount}</div>
        <div>Промахов: {missCount}</div>
      </div>
    </div>
  );
};

export default RhythmTapGame;
