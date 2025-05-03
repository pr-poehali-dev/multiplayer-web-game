
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ShapeFinderGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type Shape = {
  type: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
  color: string;
  size: 'small' | 'medium' | 'large';
};

const ShapeFinderGame = ({ player, updateScore, gameOver }: ShapeFinderGameProps) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [targetShape, setTargetShape] = useState<Shape | null>(null);
  const [tapsCount, setTapsCount] = useState(0);

  // Генерация случайного цвета из списка
  const getRandomColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#607D8B"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Генерация случайного типа фигуры
  const getRandomShape = (): 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond' => {
    const shapes = ['circle', 'square', 'triangle', 'star', 'heart', 'diamond'];
    return shapes[Math.floor(Math.random() * shapes.length)] as any;
  };

  // Генерация случайного размера
  const getRandomSize = (): 'small' | 'medium' | 'large' => {
    const sizes = ['small', 'medium', 'large'];
    return sizes[Math.floor(Math.random() * sizes.length)] as any;
  };

  // Инициализация и обновление игрового поля при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver) {
      generateNewRound();
    }
  }, [player.isActive, gameOver]);

  // Генерация нового раунда с новым набором фигур
  const generateNewRound = () => {
    // Создаем 12 случайных фигур
    const newShapes: Shape[] = [];
    for (let i = 0; i < 12; i++) {
      newShapes.push({
        type: getRandomShape(),
        color: getRandomColor(),
        size: getRandomSize()
      });
    }
    
    // Выбираем случайную фигуру в качестве цели
    const target = newShapes[Math.floor(Math.random() * newShapes.length)];
    
    // Гарантируем, что на поле есть минимум 2 одинаковые фигуры для цели
    const targetIndex = Math.floor(Math.random() * 12);
    newShapes[targetIndex] = { ...target };
    
    setShapes(newShapes);
    setTargetShape(target);
  };

  // Отрисовка фигуры
  const renderShape = (shape: Shape, index: number) => {
    const sizeClass = {
      'small': 'w-8 h-8',
      'medium': 'w-12 h-12',
      'large': 'w-16 h-16',
    }[shape.size];

    const isTarget = targetShape && 
                    shape.type === targetShape.type && 
                    shape.color === targetShape.color && 
                    shape.size === targetShape.size;

    switch (shape.type) {
      case 'circle':
        return (
          <div 
            className={`${sizeClass} rounded-full mx-auto`} 
            style={{ backgroundColor: shape.color }}
          ></div>
        );
      case 'square':
        return (
          <div 
            className={`${sizeClass} mx-auto`} 
            style={{ backgroundColor: shape.color }}
          ></div>
        );
      case 'triangle':
        return (
          <div className={`${sizeClass} mx-auto`} style={{ position: 'relative' }}>
            <div 
              style={{
                width: '0',
                height: '0',
                borderLeft: `${shape.size === 'small' ? '25px' : shape.size === 'medium' ? '35px' : '45px'} solid transparent`,
                borderRight: `${shape.size === 'small' ? '25px' : shape.size === 'medium' ? '35px' : '45px'} solid transparent`,
                borderBottom: `${shape.size === 'small' ? '40px' : shape.size === 'medium' ? '60px' : '80px'} solid ${shape.color}`,
                margin: '0 auto'
              }}
            ></div>
          </div>
        );
      case 'star':
        return (
          <div className={`${sizeClass} mx-auto flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" fill={shape.color} className="w-full h-full">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      case 'heart':
        return (
          <div className={`${sizeClass} mx-auto flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" fill={shape.color} className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        );
      case 'diamond':
        return (
          <div className={`${sizeClass} mx-auto`}>
            <div 
              style={{
                width: shape.size === 'small' ? '32px' : shape.size === 'medium' ? '48px' : '64px',
                height: shape.size === 'small' ? '32px' : shape.size === 'medium' ? '48px' : '64px',
                backgroundColor: shape.color,
                transformOrigin: 'center',
                transform: 'rotate(45deg)',
                margin: '0 auto'
              }}
            ></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Обработчик нажатия на фигуру
  const handleShapeClick = (shape: Shape, index: number) => {
    if (gameOver || !player.isActive || !targetShape) return;
    
    setTapsCount(prev => prev + 1);
    
    // Проверяем, совпадает ли выбранная фигура с целевой
    if (
      shape.type === targetShape.type && 
      shape.color === targetShape.color && 
      shape.size === targetShape.size
    ) {
      // Добавляем очки и генерируем новый раунд
      updateScore(player.id, 1);
      generateNewRound();
    }
  };

  // Получаем цвет для игрока
  const getPlayerColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[player.id - 1] || colors[0];
  };

  // Получаем название фигуры на русском
  const getShapeName = (shape: string): string => {
    const shapeNames = {
      'circle': 'круг',
      'square': 'квадрат',
      'triangle': 'треугольник',
      'star': 'звезда',
      'heart': 'сердце',
      'diamond': 'ромб'
    };
    return shapeNames[shape as keyof typeof shapeNames] || shape;
  };

  // Получаем название размера на русском
  const getSizeName = (size: string): string => {
    const sizeNames = {
      'small': 'маленький',
      'medium': 'средний',
      'large': 'большой'
    };
    return sizeNames[size as keyof typeof sizeNames] || size;
  };

  // Получаем название цвета на русском
  const getColorName = (color: string): string => {
    const colorMap: Record<string, string> = {
      "#FF5252": "красный",
      "#4CAF50": "зеленый",
      "#2196F3": "синий",
      "#FF9800": "оранжевый",
      "#9C27B0": "фиолетовый",
      "#607D8B": "серый"
    };
    return colorMap[color] || "цветной";
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
      
      {targetShape && !gameOver && (
        <div className="text-center mb-2">
          <span className="text-sm">Найдите:</span>
          <span className="font-bold block" style={{ color: getPlayerColor() }}>
            {getSizeName(targetShape.size)} {getColorName(targetShape.color)} {getShapeName(targetShape.type)}
          </span>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 flex-1">
        {shapes.map((shape, index) => (
          <Button
            key={`${player.id}-${index}`}
            className="p-1 h-auto flex items-center justify-center"
            variant="outline"
            style={{
              borderColor: getPlayerColor(),
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver}
            onClick={() => handleShapeClick(shape, index)}
          >
            {renderShape(shape, index)}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Нажатий: {tapsCount}
      </div>
    </div>
  );
};

export default ShapeFinderGame;
