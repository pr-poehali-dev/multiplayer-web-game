
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface WordChainGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

const WordChainGame = ({ player, updateScore, gameOver }: WordChainGameProps) => {
  const [currentWord, setCurrentWord] = useState<string>("");
  const [letterOptions, setLetterOptions] = useState<string[]>([]);
  const [targetWordLength, setTargetWordLength] = useState(4);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [level, setLevel] = useState(1);
  
  // Словарь русских слов разной длины
  const wordsByLength: Record<number, string[]> = {
    3: ["кот", "дом", "сад", "мир", "лес", "сон", "рот", "год", "зуб", "нос", "сыр", "суп", "чай", "рис", "лук"],
    4: ["река", "гора", "море", "снег", "звук", "игра", "друг", "враг", "брат", "тело", "небо", "крик", "свет", "тьма", "стол"],
    5: ["книга", "земля", "ветер", "огонь", "вода", "город", "птица", "рыба", "солнце", "луна", "песня", "слово", "время", "место", "тепло"],
    6: ["страна", "корабль", "здание", "дерево", "камень", "звезда", "планета", "машина", "улица", "деньги", "одежда", "музыка", "радуга", "ворона", "молоко"]
  };
  
  // Частые буквы русского алфавита для дополнения набора
  const frequentLetters = "оеаинтсрвлкмдпуяыьгзбчйхжшющэюфъ";
  
  // Инициализация игры
  useEffect(() => {
    if (player.isActive && !gameOver) {
      startNewRound();
    }
    
    return () => {
      // Очистка при размонтировании
    };
  }, [player.isActive, gameOver, level]);
  
  // Таймер для раунда
  useEffect(() => {
    let timerId: number | null = null;
    
    if (player.isActive && !gameOver && timeLeft > 0) {
      timerId = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [player.isActive, gameOver, timeLeft]);
  
  // Начать новый раунд
  const startNewRound = () => {
    // Определяем целевую длину слов в зависимости от уровня
    const wordLength = Math.min(3 + Math.floor(level / 2), 6);
    setTargetWordLength(wordLength);
    
    // Выбираем доступные слова из словаря
    const words = wordsByLength[wordLength] || wordsByLength[3];
    setAvailableWords(words);
    setCorrectWords([]);
    
    // Генерируем буквы для составления слов
    generateLetterOptions(wordLength);
    
    setCurrentWord("");
    setTimeLeft(20);
    setMessage(`Составьте слова из ${wordLength} букв`);
  };
  
  // Генерация набора букв, из которых можно составить несколько слов
  const generateLetterOptions = (wordLength: number) => {
    const words = wordsByLength[wordLength] || wordsByLength[3];
    
    // Собираем все буквы из нескольких случайных слов
    let letters = "";
    const selectedWords = [];
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words[randomIndex];
      selectedWords.push(word);
      letters += word;
    }
    
    // Добавляем немного случайных частых букв
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * frequentLetters.length);
      letters += frequentLetters[randomIndex];
    }
    
    // Удаляем дубликаты и перемешиваем
    const uniqueLetters = Array.from(new Set(letters.split('')));
    const shuffledLetters = uniqueLetters.sort(() => 0.5 - Math.random());
    
    // Ограничиваем количество букв
    setLetterOptions(shuffledLetters.slice(0, 12));
  };
  
  // Добавление буквы к текущему слову
  const addLetter = (letter: string) => {
    if (gameOver || !player.isActive || currentWord.length >= targetWordLength) return;
    
    setCurrentWord(prev => prev + letter);
  };
  
  // Удаление последней буквы
  const removeLetter = () => {
    if (gameOver || !player.isActive || currentWord.length === 0) return;
    
    setCurrentWord(prev => prev.slice(0, -1));
  };
  
  // Очистка текущего слова
  const clearWord = () => {
    if (gameOver || !player.isActive) return;
    
    setCurrentWord("");
  };
  
  // Проверка слова
  const checkWord = () => {
    if (gameOver || !player.isActive || currentWord.length !== targetWordLength) return;
    
    // Проверяем, есть ли слово в словаре
    if (availableWords.includes(currentWord.toLowerCase())) {
      // Проверяем, не было ли слово уже использовано
      if (correctWords.includes(currentWord.toLowerCase())) {
        setMessage("Это слово уже использовано!");
      } else {
        // Засчитываем слово
        handleCorrectWord();
      }
    } else {
      setMessage("Такого слова нет в словаре");
    }
    
    // Очищаем текущее слово
    setCurrentWord("");
  };
  
  // Обработка правильного слова
  const handleCorrectWord = () => {
    setCorrectWords(prev => [...prev, currentWord.toLowerCase()]);
    
    // Начисляем очки
    updateScore(player.id, targetWordLength - 2); // 3 буквы = 1 очко, 4 буквы = 2 очка и т.д.
    
    setMessage(`Отлично! +${targetWordLength - 2} ${(targetWordLength - 2) === 1 ? "очко" : "очка"}`);
    
    // Если составили 3 слова, переходим на следующий уровень
    if (correctWords.length >= 2) {
      setTimeLeft(3);
      setMessage("Отлично! Переход на следующий уровень...");
    }
  };
  
  // Завершение раунда
  const endRound = () => {
    // Если было составлено хотя бы одно слово, переходим на следующий уровень
    if (correctWords.length > 0) {
      setLevel(prev => prev + 1);
    }
    
    // Запускаем новый раунд
    startNewRound();
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
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      {/* Оставшееся время и уровень */}
      <div className="flex justify-between text-xs mb-1">
        <div>Уровень: {level}</div>
        <div>Время: {timeLeft} сек</div>
      </div>
      
      {/* Прогресс времени */}
      <div className="h-1 bg-gray-200 w-full rounded mb-2">
        <div 
          className="h-1 rounded transition-all duration-300"
          style={{ 
            width: `${(timeLeft / 20) * 100}%`,
            backgroundColor: getPlayerColor()
          }}
        />
      </div>
      
      {/* Текущее слово */}
      <div className="bg-gray-100 border border-gray-300 rounded p-2 mb-2 h-10 flex items-center justify-center">
        <div className="font-bold text-xl tracking-wider">
          {currentWord || "_ ".repeat(targetWordLength).trim()}
        </div>
      </div>
      
      {/* Найденные слова */}
      <div className="text-xs text-center mb-2 min-h-6">
        {correctWords.length > 0 && (
          <div>
            Найдено: {correctWords.join(", ")}
          </div>
        )}
      </div>
      
      {/* Кнопки букв */}
      <div className="grid grid-cols-4 gap-1 mb-2">
        {letterOptions.map((letter, index) => (
          <Button
            key={`letter-${index}`}
            className="p-1 text-lg font-bold"
            variant="outline"
            style={{
              borderColor: getPlayerColor(),
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver || currentWord.length >= targetWordLength}
            onClick={() => addLetter(letter)}
          >
            {letter.toUpperCase()}
          </Button>
        ))}
      </div>
      
      {/* Кнопки управления */}
      <div className="grid grid-cols-3 gap-1">
        <Button
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={gameOver || currentWord.length === 0}
          onClick={removeLetter}
        >
          ⌫
        </Button>
        <Button
          className="bg-red-100 hover:bg-red-200 text-red-800"
          disabled={gameOver || currentWord.length === 0}
          onClick={clearWord}
        >
          Очистить
        </Button>
        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={gameOver || currentWord.length !== targetWordLength}
          onClick={checkWord}
        >
          Проверить
        </Button>
      </div>
    </div>
  );
};

export default WordChainGame;
