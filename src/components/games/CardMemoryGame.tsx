
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CardMemoryGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const CardMemoryGame = ({ player, updateScore, gameOver }: CardMemoryGameProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);
  const [canFlip, setCanFlip] = useState(true);
  const [moves, setMoves] = useState(0);
  const [pairs, setPairs] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Набор эмодзи для карт
  const emojis = [
    "🐱", "🐶", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", // Животные
    "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", // Фрукты
    "🚗", "🚕", "🚙", "🚌", "🚑", "🚓", "🚒", "🏎️", // Транспорт
    "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", // Спорт
    "💻", "📱", "⌚", "📷", "📺", "🎮", "🕹️", "📲", // Техника
  ];
  
  // Инициализация игры при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver) {
      generateNewGame();
    }
  }, [player.isActive, gameOver]);
  
  // Генерация новой игры в зависимости от уровня
  const generateNewGame = () => {
    // Определяем количество пар карт в зависимости от уровня
    let pairsCount;
    switch (level) {
      case 1: pairsCount = 6; break;  // 12 карт (6 пар)
      case 2: pairsCount = 8; break;  // 16 карт (8 пар)
      default: pairsCount = 10; break; // 20 карт (10 пар)
    }
    
    // Выбираем случайные эмодзи для пар
    const shuffledEmojis = [...emojis].sort(() => 0.5 - Math.random()).slice(0, pairsCount);
    
    // Создаем пары карт
    const newCards: Card[] = [];
    
    shuffledEmojis.forEach((emoji, index) => {
      // Добавляем две одинаковые карты (пару)
      newCards.push({
        id: index * 2,
        emoji,
        isFlipped: false,
        isMatched: false
      });
      
      newCards.push({
        id: index * 2 + 1,
        emoji,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Перемешиваем карты
    const shuffledCards = [...newCards].sort(() => 0.5 - Math.random());
    
    setCards(shuffledCards);
    setFirstCard(null);
    setSecondCard(null);
    setCanFlip(true);
    setMoves(0);
    setPairs(0);
  };
  
  // Обработчик клика по карте
  const handleCardClick = (index: number) => {
    if (gameOver || !player.isActive || !canFlip) return;
    
    // Нельзя выбрать уже открытую карту
    if (cards[index].isFlipped || cards[index].isMatched) return;
    
    // Обновляем состояние карт
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    
    if (firstCard === null) {
      // Первая карта в паре
      setFirstCard(index);
    } else if (secondCard === null) {
      // Вторая карта в паре
      setSecondCard(index);
      setCanFlip(false);
      setMoves(prevMoves => prevMoves + 1);
      
      // Проверяем, совпадают ли карты
      if (cards[firstCard].emoji === cards[index].emoji) {
        handleMatch(firstCard, index);
      } else {
        // Карты не совпадают, переворачиваем обратно через задержку
        setTimeout(() => {
          handleMismatch(firstCard, index);
        }, 1000);
      }
    }
  };
  
  // Обработка совпадения карт
  const handleMatch = (first: number, second: number) => {
    // Отмечаем карты как совпавшие
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === first || i === second ? { ...card, isMatched: true } : card
      )
    );
    
    // Увеличиваем счетчик пар
    const newPairs = pairs + 1;
    setPairs(newPairs);
    
    // Начисляем очки
    updateScore(player.id, 2);
    
    // Сбрасываем выбор
    setFirstCard(null);
    setSecondCard(null);
    setCanFlip(true);
    
    // Проверяем, закончилась ли игра
    if (newPairs === cards.length / 2) {
      // Все пары найдены, бонус за окончание уровня
      updateScore(player.id, 5);
      
      // Переход на следующий уровень
      setTimeout(() => {
        setLevel(prevLevel => Math.min(prevLevel + 1, 3));
        generateNewGame();
      }, 1500);
    }
  };
  
  // Обработка несовпадения карт
  const handleMismatch = (first: number, second: number) => {
    // Переворачиваем карты обратно
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === first || i === second ? { ...card, isFlipped: false } : card
      )
    );
    
    // Сбрасываем выбор
    setFirstCard(null);
    setSecondCard(null);
    setCanFlip(true);
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
  
  // Определяем количество колонок в сетке карт
  const getGridColumns = () => {
    if (cards.length <= 12) return 3;
    if (cards.length <= 16) return 4;
    return 4;
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
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm">
            Уровень: <span className="font-bold">{level}</span>
          </div>
          <div className="text-sm">
            Пары: <span className="font-bold">{pairs}/{cards.length/2}</span>
          </div>
          <div className="text-sm">
            Ходы: <span className="font-bold">{moves}</span>
          </div>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div 
        className={`grid grid-cols-${getGridColumns()} gap-1 flex-1`}
        style={{ gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)` }}
      >
        {cards.map((card, index) => (
          <Button
            key={`card-${card.id}`}
            className={`p-0 aspect-square transition-all duration-200 ${
              card.isFlipped ? 'rotate-y-180' : ''
            } ${card.isMatched ? 'opacity-60' : ''}`}
            variant="outline"
            style={{
              backgroundColor: card.isFlipped ? 'white' : getPlayerColor(),
              borderColor: getPlayerColor(),
              transform: card.isFlipped ? 'rotateY(180deg)' : '',
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver || card.isFlipped || card.isMatched || !canFlip}
            onClick={() => handleCardClick(index)}
          >
            {card.isFlipped && (
              <div className="text-2xl">
                {card.emoji}
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CardMemoryGame;
