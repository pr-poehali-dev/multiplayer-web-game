
// Определение типов мини-игр
export interface MiniGame {
  id: string;
  title: string;
  description: string;
  icon: string; // Эмодзи для иконки игры
  playersMin: number; // Минимальное число игроков
  playersMax: number; // Максимальное число игроков
  instructions: string; // Инструкции для игроков
  difficulty: 'easy' | 'medium' | 'hard';
  category: GameCategory;
  duration?: number; // Длительность игры в секундах (по умолчанию 60)
}

export type GameCategory = 
  | 'reaction' 
  | 'memory' 
  | 'math' 
  | 'pattern'
  | 'puzzle'
  | 'rhythm'
  | 'logic'
  | 'words'
  | 'maze'
  | 'color'
  | 'arcade';

// Список всех доступных мини-игр
export const miniGames: MiniGame[] = [
  // === Игры на реакцию ===
  {
    id: 'number-tap',
    title: 'Быстрое нажатие',
    description: 'Нажимайте на указанное число как можно быстрее',
    icon: '🔢',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Нажимайте на указанное число среди других чисел',
    difficulty: 'easy',
    category: 'reaction',
    duration: 30
  },
  {
    id: 'color-match',
    title: 'Цветовое соответствие',
    description: 'Нажимайте на слово, написанное целевым цветом',
    icon: '🎨',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Нажимайте на слово, которое написано целевым цветом',
    difficulty: 'medium',
    category: 'reaction',
    duration: 40
  },
  {
    id: 'reaction-test',
    title: 'Тест на реакцию',
    description: 'Нажмите как можно быстрее, когда цвет изменится',
    icon: '⚡',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Ждите, пока цвет не изменится на зеленый, затем быстро нажмите',
    difficulty: 'easy',
    category: 'reaction',
    duration: 30
  },
  {
    id: 'shape-finder',
    title: 'Найди фигуру',
    description: 'Найдите указанную фигуру среди других',
    icon: '⚪',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Найдите и нажмите на указанную фигуру среди других фигур',
    difficulty: 'easy',
    category: 'reaction',
    duration: 30
  },
  {
    id: 'odd-one-out',
    title: 'Лишний элемент',
    description: 'Найдите элемент, отличающийся от остальных',
    icon: '👁️',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Найдите и нажмите на элемент, который отличается от остальных',
    difficulty: 'medium',
    category: 'logic',
    duration: 40
  },

  // === Игры на математику ===
  {
    id: 'math-challenge',
    title: 'Математическая задача',
    description: 'Решайте простые примеры на скорость',
    icon: '➗',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Выберите правильный ответ на математический пример',
    difficulty: 'medium',
    category: 'math',
    duration: 40
  },

  // === Игры на память ===
  {
    id: 'memory-sequence',
    title: 'Запоминание последовательности',
    description: 'Запомните и повторите последовательность',
    icon: '🧠',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Запомните последовательность и повторите её',
    difficulty: 'medium',
    category: 'memory',
    duration: 40
  },
  {
    id: 'card-memory',
    title: 'Карточная память',
    description: 'Запомните расположение карт и найдите пары',
    icon: '🃏',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Переворачивайте карты и находите пары одинаковых карт',
    difficulty: 'medium',
    category: 'memory',
    duration: 60
  },

  // === Словесные игры ===
  {
    id: 'word-scramble',
    title: 'Скрамбл слов',
    description: 'Найдите правильное слово из перемешанных букв',
    icon: '📝',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Выберите правильно составленное слово из перемешанных букв',
    difficulty: 'hard',
    category: 'words',
    duration: 45
  },
  {
    id: 'word-chain',
    title: 'Составление слов',
    description: 'Составляйте слова из предложенных букв',
    icon: '📚',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Составляйте слова из предложенных букв и отправляйте их на проверку',
    difficulty: 'medium',
    category: 'words',
    duration: 60
  },
  
  // === Ритмические игры ===
  {
    id: 'rhythm-tap',
    title: 'Ритмичное нажатие',
    description: 'Нажимайте в ритм с появляющимися символами',
    icon: '🎵',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Нажимайте, когда символ достигает целевой зоны',
    difficulty: 'medium',
    category: 'rhythm',
    duration: 60
  },
  
  // === Уникальные игры ===
  {
    id: 'space-race',
    title: 'Космическая гонка',
    description: 'Управляйте космическим кораблем, избегая астероидов',
    icon: '🚀',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Двигайтесь влево и вправо, чтобы избежать столкновений. Собирайте звезды для дополнительных очков.',
    difficulty: 'medium',
    category: 'arcade',
    duration: 45
  },
  {
    id: 'mole-catcher',
    title: 'Ловец кротов',
    description: 'Нажимайте на кротов, когда они выглядывают из нор',
    icon: '🦫',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Нажимайте на кротов, но избегайте бомб! Чем дольше комбо, тем больше очков.',
    difficulty: 'easy',
    category: 'arcade',
    duration: 40
  },
  {
    id: 'color-mixer',
    title: 'Смешиватель цветов',
    description: 'Смешивайте цвета, чтобы получить заданный оттенок',
    icon: '🎨',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Регулируйте уровни RGB, чтобы смешать цвет, максимально близкий к целевому',
    difficulty: 'medium',
    category: 'color',
    duration: 90
  },
  {
    id: 'maze-runner',
    title: 'Лабиринтоходец',
    description: 'Пройдите через лабиринт, собирая монеты',
    icon: '🗺️',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Найдите путь через лабиринт к выходу, собирая монеты для дополнительных очков',
    difficulty: 'medium',
    category: 'maze',
    duration: 90
  }
];

// Функция для получения списка игр для определенного количества игроков
export function getGamesByPlayerCount(playerCount: number): MiniGame[] {
  return miniGames.filter(game => 
    game.playersMin <= playerCount && game.playersMax >= playerCount
  );
}

// Функция для получения случайной игры из списка доступных для данного количества игроков
export function getRandomGameForPlayerCount(playerCount: number): MiniGame {
  const availableGames = getGamesByPlayerCount(playerCount);
  const randomIndex = Math.floor(Math.random() * availableGames.length);
  return availableGames[randomIndex];
}

// Функция для поиска игры по ID
export function getGameById(gameId: string): MiniGame | undefined {
  return miniGames.find(game => game.id === gameId);
}
