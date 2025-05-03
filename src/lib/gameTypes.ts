
import { MiniGame, GameCategory, miniGames, getGamesByPlayerCount, getRandomGameForPlayerCount, getGameById } from './gameData';

//  Переопределяем экспорты из gameData.ts
export type { MiniGame, GameCategory };
export { miniGames, getGamesByPlayerCount, getRandomGameForPlayerCount, getGameById };
