
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface OddOneOutGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type Item = {
  emoji: string;
  isOdd: boolean;
  feature: string; // Что отличает элемент: "color", "shape", "category", etc.
};

const OddOneOutGame = ({ player, updateScore, gameOver }: OddOneOutGameProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [level, setLevel] = useState(1);
  const [tapsCount, setTapsCount] = useState(0);
  const [message, setMessage] = useState<string>("Найдите отличающийся элемент");

  // Массивы возможных элементов для создания групп
  const emojiGroups = [
    // Фрукты
    { main: ["🍎", "🍏", "🍐", "🍊", "🍋"], odd: ["🍉", "🍇", "🍓", "🍒", "🥝"], feature: "категория" },
    // Животные
    { main: ["🐶", "🐱", "🦊", "🐻", "🐨"], odd: ["🐸", "🐢", "🦎", "🐍", "🐊"], feature: "категория" },
    // Транспорт
    { main: ["🚗", "🚕", "🚙", "🚌", "🚑"], odd: ["✈️", "🚁", "🛸", "🚀", "🛰️"], feature: "категория" },
    // Спорт
    { main: ["⚽", "🏀", "🏈", "⚾", "🎾"], odd: ["🏆", "🥇", "🥈", "🥉", "🎖️"], feature: "категория" },
    // Погода
    { main: ["☀️", "🌤️", "⛅", "🌥️", "🌦️"], odd: ["❄️", "⛄", "🌨️", "🌩️", "☃️"], feature: "категория" },
    // Направления
    { main: ["⬆️", "↗️", "➡️", "↘️", "⬇️"], odd: ["🔄", "🔁", "🔃", "🔂", "🔀"], feature: "категория" },
    // Цвета (одинаковые фигуры, разные цвета)
    { main: ["🔴", "🟠", "🟡", "🟢", "🔵"], odd: ["⚫", "⚪", "🟤", "🟣", "🟥"], feature: "оттенок" },
    // Формы
    { main: ["⭐", "✨", "💫", "🌟", "⚡"], odd: ["❤️", "💙", "💚", "💛", "💜"], feature: "форма" },
  ];

  // Инициализация игры при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver) {
      generateNewRound();
    }
  }, [player.isActive, gameOver]);

  // Функция для создания нового раунда с новым набором элементов
  const generateNewRound = () => {
    // Выбираем случайную группу эмодзи
    const groupIndex = Math.floor(Math.random() * emojiGroups.length);
    const selectedGroup = emojiGroups[groupIndex];
    
    // Определяем количество элементов (зависит от уровня)
    const itemsCount = Math.min(9 + (level - 1) * 3, 25); // от 9 до 25
    
    // Создаем массив элементов
    const newItems: Item[] = [];
    
    // Определяем позицию отличающегося элемента
    const oddPosition = Math.floor(Math.random() * itemsCount);
    
    // Заполняем массив
    for (let i = 0; i < itemsCount; i++) {
      if (i === oddPosition) {
        // Добавляем отличающийся элемент
        const randomOddIndex = Math.floor(Math.random() * selectedGroup.odd.length);
        newItems.push({
          emoji: selectedGroup.odd[randomOddIndex],
          isOdd: true,
          feature: selectedGroup.feature
        });
      } else {
        // Добавляем обычный элемент
        const randomMainIndex = Math.floor(Math.random() * selectedGroup.main.length);
        newItems.push({
          emoji: selectedGroup.main[randomMainIndex],
          isOdd: false,
          feature: selectedGroup.feature
        });
      }
    }
    
    setItems(newItems);
    setMessage(`Найдите элемент, отличающийся по ${selectedGroup.feature}`);
  };

  // Обработчик нажатия на элемент
  const handleItemClick = (item: Item, index: number) => {
    if (gameOver || !player.isActive) return;
    
    setTapsCount(prev => prev + 1);
    
    if (item.isOdd) {
      // Правильный выбор
      updateScore(player.id, level);
      setLevel(prev => Math.min(prev + 1, 5));
      setMessage("Верно! Продолжайте.");
      generateNewRound();
    } else {
      // Неправильный выбор
      setMessage("Неверно. Попробуйте еще раз.");
    }
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

  // Определяем количество колонок в сетке
  const getGridColumns = () => {
    if (items.length <= 9) return 3;
    if (items.length <= 16) return 4;
    return 5;
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
        <div className="text-center mb-2">
          <span style={{ color: getPlayerColor() }}>{message}</span>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className={`grid grid-cols-${getGridColumns()} gap-2 flex-1`}>
        {items.map((item, index) => (
          <Button
            key={`${player.id}-${index}`}
            className="p-1 h-auto flex items-center justify-center text-3xl"
            variant="outline"
            style={{
              borderColor: getPlayerColor(),
              opacity: gameOver ? 0.7 : 1,
              aspectRatio: "1/1"
            }}
            disabled={gameOver}
            onClick={() => handleItemClick(item, index)}
          >
            {item.emoji}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Уровень: {level}, Нажатий: {tapsCount}
      </div>
    </div>
  );
};

export default OddOneOutGame;
