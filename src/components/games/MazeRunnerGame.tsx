
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MazeRunnerGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type Cell = {
  x: number;
  y: number;
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
  hasCoin: boolean;
  isStart: boolean;
  isEnd: boolean;
};

type Position = {
  x: number;
  y: number;
};

const MazeRunnerGame = ({ player, updateScore, gameOver }: MazeRunnerGameProps) => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 0, y: 0 });
  const [level, setLevel] = useState(1);
  const [collectedCoins, setCollectedCoins] = useState(0);
  const [steps, setSteps] = useState(0);
  const [mazeSize, setMazeSize] = useState(7); // нечетное число для алгоритма генерации
  const [message, setMessage] = useState("");
  
  // Инициализация игры
  useEffect(() => {
    if (player.isActive && !gameOver) {
      // Определяем размер лабиринта в зависимости от уровня
      const size = Math.min(7 + (level - 1) * 2, 11);
      setMazeSize(size);
      
      generateMaze(size);
    }
  }, [player.isActive, gameOver, level]);
  
  // Генерация лабиринта
  const generateMaze = (size: number) => {
    // Создаем сетку, где все клетки - стены
    const grid: Cell[][] = [];
    for (let y = 0; y < size; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < size; x++) {
        row.push({
          x,
          y,
          isWall: true,
          isPath: false,
          isVisited: false,
          hasCoin: false,
          isStart: false,
          isEnd: false
        });
      }
      grid.push(row);
    }
    
    // Начальная и конечная точки
    const startPos = { x: 1, y: 1 };
    const endPos = { x: size - 2, y: size - 2 };
    
    // Прокладываем путь от начала до конца
    carvePath(grid, startPos.x, startPos.y);
    
    // Отмечаем начальную и конечную точки
    grid[startPos.y][startPos.x].isStart = true;
    grid[startPos.y][startPos.x].isWall = false;
    grid[startPos.y][startPos.x].isPath = true;
    
    grid[endPos.y][endPos.x].isEnd = true;
    grid[endPos.y][endPos.x].isWall = false;
    grid[endPos.y][endPos.x].isPath = true;
    
    // Добавляем монеты на путь
    addCoins(grid, level);
    
    setMaze(grid);
    setPlayerPosition(startPos);
    setCollectedCoins(0);
    setSteps(0);
    setMessage("Найдите выход из лабиринта!");
  };
  
  // Рекурсивный алгоритм прокладки пути
  const carvePath = (grid: Cell[][], x: number, y: number) => {
    // Отмечаем текущую клетку как путь
    grid[y][x].isWall = false;
    grid[y][x].isPath = true;
    grid[y][x].isVisited = true;
    
    // Направления для движения (в случайном порядке)
    const directions = [
      { dx: 0, dy: -2 }, // Вверх
      { dx: 2, dy: 0 },  // Вправо
      { dx: 0, dy: 2 },  // Вниз
      { dx: -2, dy: 0 }  // Влево
    ].sort(() => Math.random() - 0.5);
    
    // Пробуем каждое направление
    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      
      // Проверяем, что новая позиция в пределах лабиринта и не посещена
      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length && !grid[ny][nx].isVisited) {
        // Убираем стену между текущей и новой клеткой
        grid[y + dir.dy/2][x + dir.dx/2].isWall = false;
        grid[y + dir.dy/2][x + dir.dx/2].isPath = true;
        
        // Продолжаем прокладку пути из новой клетки
        carvePath(grid, nx, ny);
      }
    }
  };
  
  // Добавление монет в лабиринт
  const addCoins = (grid: Cell[][], level: number) => {
    // Количество монет зависит от уровня
    const coinsCount = Math.min(3 + level, 10);
    
    // Находим все клетки пути
    const pathCells: Position[] = [];
    
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x].isPath && !grid[y][x].isStart && !grid[y][x].isEnd) {
          pathCells.push({ x, y });
        }
      }
    }
    
    // Перемешиваем и выбираем первые N клеток для монет
    pathCells.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(coinsCount, pathCells.length); i++) {
      const { x, y } = pathCells[i];
      grid[y][x].hasCoin = true;
    }
  };
  
  // Обработка движения игрока
  const movePlayer = (dx: number, dy: number) => {
    if (gameOver || !player.isActive) return;
    
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    
    // Проверяем, что новая позиция в пределах лабиринта и не стена
    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length && !maze[newY][newX].isWall) {
      setPlayerPosition({ x: newX, y: newY });
      setSteps(prev => prev + 1);
      
      // Проверяем, есть ли в новой клетке монета
      if (maze[newY][newX].hasCoin) {
        collectCoin(newX, newY);
      }
      
      // Проверяем, достиг ли игрок выхода
      if (maze[newY][newX].isEnd) {
        completeLevel();
      }
    }
  };
  
  // Сбор монеты
  const collectCoin = (x: number, y: number) => {
    setMaze(prev => {
      const newMaze = [...prev];
      newMaze[y] = [...newMaze[y]];
      newMaze[y][x] = { ...newMaze[y][x], hasCoin: false };
      return newMaze;
    });
    
    setCollectedCoins(prev => prev + 1);
    
    // Начисляем очки за монету
    updateScore(player.id, 1);
    
    setMessage("Монета собрана! +1 очко");
  };
  
  // Завершение уровня
  const completeLevel = () => {
    // Бонус за завершение уровня
    const levelBonus = level * 2;
    updateScore(player.id, levelBonus);
    
    setMessage(`Уровень пройден! +${levelBonus} очков`);
    
    // Переходим на следующий уровень
    setTimeout(() => {
      setLevel(prev => prev + 1);
    }, 1500);
  };
  
  // Получаем цвет для игрока
  const getPlayerColor = () => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800"];
    return colors[player.id - 1] || colors[0];
  };
  
  // Стили для области игрока
  const playerAreaStyle = {
    backgroundColor: player.isWinner ? "#FFF9C4" : "#F0F4F8",
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
      <div className="flex justify-between items-center mb-1">
        <div className="text-lg font-bold" style={{ color: getPlayerColor() }}>
          Игрок {player.id}
        </div>
        <div className="text-lg font-bold">
          {player.score} {player.score === 1 ? "очко" : player.score < 5 ? "очка" : "очков"}
        </div>
      </div>
      
      {/* Сообщение */}
      <div className="text-center text-sm mb-1" style={{ color: getPlayerColor() }}>
        {message}
      </div>
      
      {/* Информация об уровне */}
      <div className="flex justify-between text-xs mb-1">
        <div>Уровень: {level}</div>
        <div>Монеты: {collectedCoins}</div>
        <div>Шаги: {steps}</div>
      </div>
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      {/* Лабиринт */}
      <div className="flex-1 grid grid-cols-7 gap-[2px] mb-2" 
        style={{ 
          gridTemplateColumns: `repeat(${mazeSize}, 1fr)`,
          aspectRatio: '1/1'
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`cell-${y}-${x}`}
              className={`relative flex items-center justify-center 
                ${cell.isWall ? 'bg-gray-800' : 'bg-white'}
                ${cell.isStart ? 'bg-green-200' : ''}
                ${cell.isEnd ? 'bg-red-200' : ''}`}
              style={{
                width: '100%',
                height: '100%',
                fontSize: `${100 / mazeSize}%`
              }}
            >
              {/* Игрок */}
              {playerPosition.x === x && playerPosition.y === y && (
                <div 
                  className="absolute w-[80%] h-[80%] rounded-full"
                  style={{ backgroundColor: getPlayerColor() }}
                />
              )}
              
              {/* Монета */}
              {cell.hasCoin && (
                <div className="absolute text-yellow-500" style={{ fontSize: `${150 / mazeSize}%` }}>
                  💰
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Кнопки управления */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <div></div>
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={gameOver}
          onClick={() => movePlayer(0, -1)}
        >
          ↑
        </Button>
        <div></div>
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={gameOver}
          onClick={() => movePlayer(-1, 0)}
        >
          ←
        </Button>
        <div className="flex items-center justify-center text-xs text-gray-500">
          {playerPosition.x},{playerPosition.y}
        </div>
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={gameOver}
          onClick={() => movePlayer(1, 0)}
        >
          →
        </Button>
        <div></div>
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={gameOver}
          onClick={() => movePlayer(0, 1)}
        >
          ↓
        </Button>
        <div></div>
      </div>
    </div>
  );
};

export default MazeRunnerGame;
