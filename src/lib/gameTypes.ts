
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
  | 'logic';

// Список всех доступных мини-игр
export const miniGames: MiniGame[] = [
  // === Игры для 1 игрока (14 игр) ===
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
    duration: 20
  },
  {
    id: 'color-match',
    title: 'Цветовое соответствие',
    description: 'Нажимайте на фигуру, цвет которой соответствует названию',
    icon: '🎨',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Нажимайте на фигуру, цвет которой соответствует названию цвета',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'math-challenge',
    title: 'Математическая задача',
    description: 'Решайте простые примеры на скорость',
    icon: '➗',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Выберите правильный ответ на математический пример',
    difficulty: 'medium',
    category: 'math'
  },
  {
    id: 'memory-sequence',
    title: 'Запоминание последовательности',
    description: 'Запомните и повторите последовательность',
    icon: '🧠',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Запомните последовательность и повторите её',
    difficulty: 'medium',
    category: 'memory'
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
    category: 'reaction'
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
    category: 'logic'
  },
  {
    id: 'pattern-completion',
    title: 'Завершение узора',
    description: 'Определите, каким элементом продолжается узор',
    icon: '📋',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Выберите элемент, который лучше всего продолжает узор',
    difficulty: 'medium',
    category: 'pattern'
  },
  {
    id: 'reaction-test',
    title: 'Тест на реакцию',
    description: 'Нажмите как можно быстрее, когда цвет изменится',
    icon: '⚡',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Ждите, пока цвет не изменится, затем быстро нажмите',
    difficulty: 'easy',
    category: 'reaction'
  },
  {
    id: 'simon-says',
    title: 'Саймон говорит',
    description: 'Повторяйте действия, только когда начинаются со слов "Саймон говорит"',
    icon: '🔊',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Выполняйте действие только если оно начинается со слов "Саймон говорит"',
    difficulty: 'medium',
    category: 'logic'
  },
  {
    id: 'word-scramble',
    title: 'Скрамбл слов',
    description: 'Найдите правильное слово из перемешанных букв',
    icon: '📝',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Выберите правильно составленное слово из перемешанных букв',
    difficulty: 'hard',
    category: 'puzzle'
  },
  {
    id: 'rhythm-tap',
    title: 'Ритмичное нажатие',
    description: 'Нажимайте в ритм с появляющимися символами',
    icon: '🎵',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Нажимайте, когда символ достигает целевой зоны',
    difficulty: 'medium',
    category: 'rhythm'
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
    category: 'memory'
  },
  {
    id: 'spatial-memory',
    title: 'Пространственная память',
    description: 'Запомните расположение объектов и восстановите их положение',
    icon: '🗺️',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Запомните расположение объектов, затем восстановите их положение',
    difficulty: 'hard',
    category: 'memory'
  },
  {
    id: 'sequence-tapping',
    title: 'Последовательное нажатие',
    description: 'Нажимайте на числа по порядку от 1 до 10',
    icon: '🔄',
    playersMin: 1,
    playersMax: 4,
    instructions: 'Найдите и нажмите на числа по порядку от 1 до 10',
    difficulty: 'easy',
    category: 'logic'
  },

  // === Дополнительные игры для 2-4 игроков (27 игр) ===
  {
    id: 'color-zones',
    title: 'Цветовые зоны',
    description: 'Нажимайте на объекты своего цвета быстрее соперников',
    icon: '🌈',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте только на объекты своего цвета',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'rhythm-competition',
    title: 'Музыкальное соревнование',
    description: 'Нажимайте в ритм музыки точнее соперников',
    icon: '🥁',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте в ритм с появляющимися символами',
    difficulty: 'medium',
    category: 'rhythm'
  },
  {
    id: 'moving-target',
    title: 'Движущаяся мишень',
    description: 'Попадайте по движущимся мишеням',
    icon: '🎯',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на движущиеся мишени своего цвета',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'math-race',
    title: 'Математическая гонка',
    description: 'Решайте примеры быстрее соперников',
    icon: '🏁',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Решите пример и выберите правильный ответ быстрее соперников',
    difficulty: 'medium',
    category: 'math'
  },
  {
    id: 'pattern-recognition',
    title: 'Распознавание паттернов',
    description: 'Находите закономерности в последовательностях',
    icon: '📊',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Выберите элемент, который продолжает последовательность',
    difficulty: 'hard',
    category: 'pattern'
  },
  {
    id: 'reaction-chain',
    title: 'Цепочка реакций',
    description: 'Нажимайте по цепочке появляющихся объектов',
    icon: '⛓️',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на объекты в порядке их появления',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'symbol-match',
    title: 'Соответствие символов',
    description: 'Находите одинаковые символы быстрее соперников',
    icon: '🔣',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Найдите пару одинаковых символов и нажмите на них',
    difficulty: 'medium',
    category: 'memory'
  },
  {
    id: 'territory-capture',
    title: 'Захват территории',
    description: 'Захватывайте клетки своего цвета',
    icon: '🏰',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на клетки, чтобы превратить их в свой цвет',
    difficulty: 'medium',
    category: 'logic'
  },
  {
    id: 'word-builder',
    title: 'Составление слов',
    description: 'Составляйте слова из появляющихся букв',
    icon: '📚',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на буквы, чтобы составить слово',
    difficulty: 'hard',
    category: 'puzzle'
  },
  {
    id: 'shape-sorter',
    title: 'Сортировка фигур',
    description: 'Сортируйте фигуры по форме или цвету',
    icon: '📦',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на фигуры, соответствующие заданному критерию',
    difficulty: 'medium',
    category: 'logic'
  },
  {
    id: 'memory-challenge',
    title: 'Испытание памяти',
    description: 'Запоминайте и воспроизводите последовательности',
    icon: '🧩',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Запомните последовательность и повторите её',
    difficulty: 'hard',
    category: 'memory'
  },
  {
    id: 'puzzle-race',
    title: 'Головоломная гонка',
    description: 'Решайте головоломки быстрее соперников',
    icon: '🧮',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Решите головоломку быстрее соперников',
    difficulty: 'hard',
    category: 'puzzle'
  },
  {
    id: 'quick-count',
    title: 'Быстрый счёт',
    description: 'Подсчитывайте количество объектов быстрее соперников',
    icon: '🔢',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Подсчитайте количество объектов на экране и выберите правильный ответ',
    difficulty: 'medium',
    category: 'math'
  },
  {
    id: 'color-word-stroop',
    title: 'Эффект Струпа',
    description: 'Выберите цвет слова, а не его значение',
    icon: '🔤',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажмите на кнопку, соответствующую ЦВЕТУ слова, а не его значению',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'speed-typing',
    title: 'Скоростной набор',
    description: 'Набирайте слова быстрее соперников',
    icon: '⌨️',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на буквы, чтобы составить показанное слово',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'image-search',
    title: 'Поиск изображений',
    description: 'Найдите указанный предмет на сложной картинке',
    icon: '🔍',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Найдите и нажмите на указанный предмет на картинке',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'path-finder',
    title: 'Поиск пути',
    description: 'Пройдите лабиринт быстрее соперников',
    icon: '🗺️',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Найдите путь через лабиринт, нажимая на клетки',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'balloon-pop',
    title: 'Лопни шарики',
    description: 'Лопайте шарики своего цвета быстрее соперников',
    icon: '🎈',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте только на шарики своего цвета',
    difficulty: 'easy',
    category: 'reaction'
  },
  {
    id: 'fruit-catch',
    title: 'Ловим фрукты',
    description: 'Ловите падающие фрукты своего типа',
    icon: '🍎',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Нажимайте на падающие фрукты своего типа',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'spot-difference',
    title: 'Найди отличия',
    description: 'Находите отличия между картинками быстрее соперников',
    icon: '👀',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Найдите и нажмите на отличия между двумя изображениями',
    difficulty: 'medium',
    category: 'observation'
  },
  {
    id: 'card-flip',
    title: 'Переворот карт',
    description: 'Переворачивайте карты и находите пары быстрее соперников',
    icon: '🃏',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Переворачивайте карты и находите пары одинаковых карт',
    difficulty: 'medium',
    category: 'memory'
  },
  {
    id: 'number-sequence',
    title: 'Числовая последовательность',
    description: 'Продолжите числовую последовательность',
    icon: '🔢',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Определите закономерность и выберите следующее число в последовательности',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'finger-twister',
    title: 'Пальцевый твистер',
    description: 'Держите пальцы на указанных кнопках',
    icon: '👆',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Удерживайте пальцы на указанных кнопках, не сбиваясь',
    difficulty: 'hard',
    category: 'coordination'
  },
  {
    id: 'letter-search',
    title: 'Поиск букв',
    description: 'Найдите указанную букву среди других',
    icon: '🔠',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Найдите и нажмите на указанную букву среди других букв',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'word-association',
    title: 'Ассоциации слов',
    description: 'Выберите слово, ассоциирующееся с показанным',
    icon: '🔄',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Выберите слово, которое наиболее близко ассоциируется с показанным словом',
    difficulty: 'medium',
    category: 'logic'
  },
  {
    id: 'emoji-match',
    title: 'Соответствие эмодзи',
    description: 'Сопоставьте эмодзи с их описаниями',
    icon: '😀',
    playersMin: 2,
    playersMax: 4,
    instructions: 'Выберите эмодзи, соответствующее показанному описанию',
    difficulty: 'easy',
    category: 'memory'
  },

  // === Игры для 3-4 игроков (3 игры) ===
  {
    id: 'team-coordination',
    title: 'Командная координация',
    description: 'Координируйте действия для достижения общей цели',
    icon: '👥',
    playersMin: 3,
    playersMax: 4,
    instructions: 'Нажимайте на свои объекты в определённой последовательности',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'color-combination',
    title: 'Комбинация цветов',
    description: 'Создавайте комбинации цветов по заданному образцу',
    icon: '🔄',
    playersMin: 3,
    playersMax: 4,
    instructions: 'Нажимайте на свои кнопки, чтобы создать заданную комбинацию цветов',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'multi-task',
    title: 'Многозадачность',
    description: 'Выполняйте несколько заданий одновременно',
    icon: '📋',
    playersMin: 3,
    playersMax: 4,
    instructions: 'Каждый игрок следит за своим заданием и координирует действия с командой',
    difficulty: 'hard',
    category: 'logic'
  },

  // === Игры только для 4 игроков (30 игр) ===
  {
    id: 'corner-challenge',
    title: 'Вызов углам',
    description: 'Каждый игрок защищает свой угол и атакует других',
    icon: '🔄',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Защищайте свой угол и атакуйте соперников',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'diamond-defense',
    title: 'Алмазная защита',
    description: 'Защищайте свою зону и собирайте алмазы',
    icon: '💎',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Защищайте свою зону и собирайте алмазы',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'quad-race',
    title: 'Четверная гонка',
    description: 'Соревнование между четырьмя игроками на разных треках',
    icon: '🏎️',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте, чтобы ускорить движение по своему треку',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'four-corners',
    title: 'Четыре угла',
    description: 'Каждый игрок контролирует свой угол и пытается набрать очки',
    icon: '🎮',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на объекты своего цвета в своём углу',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'quadrant-war',
    title: 'Война квадрантов',
    description: 'Сражайтесь за контроль над своим квадрантом',
    icon: '🎯',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на объекты в своем квадранте быстрее соперников',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'fortress-defense',
    title: 'Защита крепости',
    description: 'Защищайте свою крепость от атак соперников',
    icon: '🏰',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Отбивайте атаки соперников и укрепляйте свою крепость',
    difficulty: 'hard',
    category: 'strategy'
  },
  {
    id: 'jewel-collector',
    title: 'Сборщик драгоценностей',
    description: 'Соревнуйтесь в сборе драгоценных камней',
    icon: '💍',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Собирайте драгоценные камни своего цвета, избегая ловушек',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'color-tag',
    title: 'Цветные метки',
    description: 'Отмечайте свои территории цветом',
    icon: '🎨',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на клетки, чтобы окрасить их в свой цвет',
    difficulty: 'medium',
    category: 'strategy'
  },
  {
    id: 'rhythm-quartet',
    title: 'Ритмичный квартет',
    description: 'Играйте в ритм музыки вчетвером',
    icon: '🎵',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на кнопки в ритм музыки',
    difficulty: 'hard',
    category: 'rhythm'
  },
  {
    id: 'resource-race',
    title: 'Гонка за ресурсами',
    description: 'Соревнуйтесь в сборе различных ресурсов',
    icon: '🧱',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Собирайте ресурсы своего типа, чтобы построить структуру',
    difficulty: 'medium',
    category: 'strategy'
  },
  {
    id: 'team-match',
    title: 'Командное соревнование',
    description: 'Играйте двое на двое в различных мини-играх',
    icon: '👨‍👩‍👧‍👦',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Координируйте действия с партнером для достижения общей цели',
    difficulty: 'hard',
    category: 'teamwork'
  },
  {
    id: 'balloon-pop-tournament',
    title: 'Турнир лопающихся шариков',
    description: 'Лопайте шарики своего цвета и блокируйте соперников',
    icon: '🎈',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Лопайте шарики своего цвета и мешайте соперникам',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'color-rush',
    title: 'Цветовой рывок',
    description: 'Захватывайте как можно больше цветных областей',
    icon: '🌈',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на нейтральные области, чтобы захватить их',
    difficulty: 'medium',
    category: 'strategy'
  },
  {
    id: 'reaction-rumble',
    title: 'Битва реакций',
    description: 'Реагируйте быстрее всех на появляющиеся стимулы',
    icon: '⚡',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на стимулы своего типа быстрее соперников',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'code-breaker',
    title: 'Взломщик кодов',
    description: 'Взламывайте коды быстрее соперников',
    icon: '🔐',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Разгадывайте комбинации, нажимая на правильные элементы',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'pattern-pirates',
    title: 'Пираты узоров',
    description: 'Найдите и скопируйте узоры быстрее соперников',
    icon: '🏴‍☠️',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Найдите узор и повторите его в своей области',
    difficulty: 'medium',
    category: 'memory'
  },
  {
    id: 'symbol-scramble',
    title: 'Символьная путаница',
    description: 'Расшифруйте символы и найдите соответствия',
    icon: '🔣',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Найдите символы, соответствующие показанным ключам',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'tower-defense',
    title: 'Защита башни',
    description: 'Защищайте свою башню и атакуйте башни соперников',
    icon: '🗼',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Размещайте защитные сооружения и запускайте атаки',
    difficulty: 'hard',
    category: 'strategy'
  },
  {
    id: 'memory-maze',
    title: 'Лабиринт памяти',
    description: 'Запомните путь через лабиринт быстрее соперников',
    icon: '🧠',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Запомните путь через лабиринт и повторите его',
    difficulty: 'hard',
    category: 'memory'
  },
  {
    id: 'color-conqueror',
    title: 'Покоритель цветов',
    description: 'Завоюйте наибольшую территорию своим цветом',
    icon: '🎨',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Нажимайте на клетки, чтобы захватить территорию',
    difficulty: 'medium',
    category: 'strategy'
  },
  {
    id: 'reaction-royale',
    title: 'Королевская битва реакций',
    description: 'Соревнуйтесь в различных испытаниях на реакцию',
    icon: '👑',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Реагируйте на различные стимулы быстрее соперников',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'gem-collector',
    title: 'Сборщик самоцветов',
    description: 'Соревнуйтесь в сборе драгоценных камней',
    icon: '💎',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Собирайте самоцветы своего цвета, избегая ловушек',
    difficulty: 'medium',
    category: 'reaction'
  },
  {
    id: 'shape-shifter',
    title: 'Меняющий формы',
    description: 'Меняйте формы и цвета объектов быстрее соперников',
    icon: '🔄',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Превращайте объекты в указанную форму и цвет',
    difficulty: 'hard',
    category: 'logic'
  },
  {
    id: 'word-race',
    title: 'Словесная гонка',
    description: 'Составляйте слова из букв быстрее соперников',
    icon: '📝',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Составляйте слова из данных букв',
    difficulty: 'hard',
    category: 'vocabulary'
  },
  {
    id: 'number-ninja',
    title: 'Числовой ниндзя',
    description: 'Решайте числовые головоломки быстрее соперников',
    icon: '🔢',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Выполняйте математические операции в правильном порядке',
    difficulty: 'hard',
    category: 'math'
  },
  {
    id: 'reflex-arena',
    title: 'Арена рефлексов',
    description: 'Тренируйте рефлексы в различных испытаниях',
    icon: '⚔️',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Реагируйте на различные стимулы максимально быстро',
    difficulty: 'hard',
    category: 'reaction'
  },
  {
    id: 'line-pusher',
    title: 'Толкатель линий',
    description: 'Толкайте линии, чтобы образовать ряды',
    icon: '➖',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Толкайте линии, чтобы образовать ряды своего цвета',
    difficulty: 'medium',
    category: 'strategy'
  },
  {
    id: 'color-battle',
    title: 'Цветовая битва',
    description: 'Сражайтесь за господство в цветовой битве',
    icon: '🎭',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Заполняйте поле своим цветом, блокируя соперников',
    difficulty: 'medium',
    category: 'strategy'
  },
  {
    id: 'action-swap',
    title: 'Обмен действиями',
    description: 'Элементы управления регулярно меняются между игроками',
    icon: '🔀',
    playersMin: 4,
    playersMax: 4,
    instructions: 'Адаптируйтесь к изменяющимся элементам управления',
    difficulty: 'hard',
    category: 'coordination'
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
