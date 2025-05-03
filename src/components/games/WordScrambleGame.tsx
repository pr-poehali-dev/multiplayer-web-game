
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface WordScrambleGameProps {
  player: {
    id: number;
    score: number;
    isActive: boolean;
    isWinner: boolean;
  };
  updateScore: (playerId: number, points: number) => void;
  gameOver: boolean;
}

const WordScrambleGame = ({ player, updateScore, gameOver }: WordScrambleGameProps) => {
  const [originalWord, setOriginalWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [roundCount, setRoundCount] = useState(0);
  const [message, setMessage] = useState<string>("Выберите правильное слово");
  
  // Словарь простых слов
  const wordsList = [
    "кот", "дом", "сад", "мир", "год", "лес", "мяч", "сон", "рот", "зуб",
    "нос", "лёд", "мёд", "шар", "сыр", "суп", "чай", "рис", "мак", "лук",
    "кит", "мел", "пол", "стол", "стул", "сок", "бег", "пар", "шум", "дым",
    "мост", "лист", "волк", "заяц", "снег", "град", "роза", "небо", "море", "река",
    "сила", "вода", "рыба", "гора", "звук", "игра", "друг", "враг", "брат", "крик"
  ];
  
  // Сложные слова для более высоких уровней
  const advancedWords = [
    "машина", "космос", "планета", "солнце", "музыка", "радуга", "ворона", "молоко", "капуста", "тарелка",
    "картина", "человек", "минута", "история", "деревня", "природа", "здоровье", "красота", "работа", "погода"
  ];
  
  // Инициализация игры при первом рендере
  useEffect(() => {
    if (player.isActive && !gameOver) {
      generateNewRound();
    }
  }, [player.isActive, gameOver]);
  
  // Функция для перемешивания букв в слове
  const scrambleWord = (word: string): string => {
    const chars = word.split('');
    
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    
    const scrambled = chars.join('');
    
    // Если случайно получилось исходное слово, пробуем еще раз
    if (scrambled === word) {
      return scrambleWord(word);
    }
    
    return scrambled;
  };
  
  // Функция для генерации похожих слов-обманок
  const generateSimilarWord = (word: string): string => {
    const chars = word.split('');
    
    // Создаем мутацию слова, заменяя, удаляя или добавляя 1-2 буквы
    const mutation = Math.floor(Math.random() * 3);
    
    if (mutation === 0 && word.length > 3) {
      // Удаляем случайную букву
      const posToRemove = Math.floor(Math.random() * chars.length);
      chars.splice(posToRemove, 1);
    } else if (mutation === 1) {
      // Заменяем случайную букву
      const posToReplace = Math.floor(Math.random() * chars.length);
      const russianLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      chars[posToReplace] = russianLetters.charAt(Math.floor(Math.random() * russianLetters.length));
    } else {
      // Добавляем случайную букву
      const posToAdd = Math.floor(Math.random() * (chars.length + 1));
      const russianLetters = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
      chars.splice(posToAdd, 0, russianLetters.charAt(Math.floor(Math.random() * russianLetters.length)));
    }
    
    return chars.join('');
  };
  
  // Начать новый раунд
  const generateNewRound = () => {
    // Выбираем слова в зависимости от количества раундов
    const wordsToUse = roundCount > 3 ? [...wordsList, ...advancedWords] : wordsList;
    
    // Выбираем случайное слово
    const randomIndex = Math.floor(Math.random() * wordsToUse.length);
    const word = wordsToUse[randomIndex];
    
    // Перемешиваем буквы
    const scrambled = scrambleWord(word);
    
    // Генерируем варианты ответов
    const wrongOptions = [];
    while (wrongOptions.length < 3) {
      // Создаем похожее слово-обманку
      const similarWord = generateSimilarWord(word);
      
      // Добавляем, если еще нет такого варианта и это не исходное слово
      if (!wrongOptions.includes(similarWord) && similarWord !== word) {
        wrongOptions.push(similarWord);
      }
    }
    
    // Все варианты ответов
    const allOptions = [word, ...wrongOptions];
    
    // Перемешиваем варианты
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }
    
    setOriginalWord(word);
    setScrambledWord(scrambled);
    setOptions(allOptions);
    setMessage("Выберите правильное слово");
  };
  
  // Обработчик выбора варианта
  const handleOptionClick = (option: string) => {
    if (gameOver || !player.isActive) return;
    
    if (option === originalWord) {
      // Правильный ответ
      const points = originalWord.length > 4 ? 2 : 1;
      updateScore(player.id, points);
      setRoundCount(prev => prev + 1);
      setMessage("Верно! Продолжаем.");
      
      // Запускаем новый раунд
      setTimeout(() => {
        generateNewRound();
      }, 1000);
    } else {
      // Неправильный ответ
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
      
      {scrambledWord && !gameOver && (
        <div className="text-center mb-4">
          <span className="text-2xl font-bold tracking-widest">{scrambledWord.toUpperCase()}</span>
        </div>
      )}
      
      {gameOver && player.isWinner && (
        <div className="text-center mb-2 text-xl font-bold text-yellow-600">
          ПОБЕДИТЕЛЬ! 🏆
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-2 flex-1">
        {options.map((option, index) => (
          <Button
            key={`${player.id}-${index}`}
            className="py-2 text-lg font-medium"
            variant="outline"
            style={{
              borderColor: getPlayerColor(),
              opacity: gameOver ? 0.7 : 1,
            }}
            disabled={gameOver}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-gray-500 mt-1 text-right">
        Раунд: {roundCount + 1}
      </div>
    </div>
  );
};

export default WordScrambleGame;
