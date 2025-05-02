
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getGamesByPlayerCount, getRandomGameForPlayerCount } from "@/lib/gameTypes";
import Icon from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredPlayers, setHoveredPlayers] = useState<number | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<number | null>(null);
  const [gamesCount, setGamesCount] = useState<Record<number, number>>({});
  const [availableGames, setAvailableGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  // Подсчитываем количество игр для каждого режима
  useEffect(() => {
    const counts: Record<number, number> = {};
    [1, 2, 3, 4].forEach(playerCount => {
      counts[playerCount] = getGamesByPlayerCount(playerCount).length;
    });
    setGamesCount(counts);
  }, []);

  // Загружаем список игр при выборе количества игроков
  useEffect(() => {
    if (selectedPlayers) {
      setAvailableGames(getGamesByPlayerCount(selectedPlayers));
    }
  }, [selectedPlayers]);

  const handleSelectPlayers = (players: number) => {
    setSelectedPlayers(players);
    setSelectedGame(null);
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
  };

  const handleRandomGame = () => {
    if (selectedPlayers) {
      const randomGame = getRandomGameForPlayerCount(selectedPlayers);
      setSelectedGame(randomGame);
    }
  };

  const handleStartGame = () => {
    if (selectedPlayers && selectedGame) {
      navigate(`/game?players=${selectedPlayers}&gameId=${selectedGame.id}`);
    } else if (selectedPlayers) {
      const randomGame = getRandomGameForPlayerCount(selectedPlayers);
      navigate(`/game?players=${selectedPlayers}&gameId=${randomGame.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 text-indigo-900">Четыре игрока</h1>
        <p className="text-xl text-indigo-700">Весёлая игра для всей компании на одном экране!</p>
      </div>

      {!selectedPlayers ? (
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4 text-indigo-800 text-center">Выберите количество игроков:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((num) => (
              <Button
                key={num}
                variant="outline"
                className={`h-24 text-2xl font-bold border-2 transition-all duration-300 ${
                  hoveredPlayers === num ? "scale-105" : ""
                }`}
                style={{
                  backgroundColor: hoveredPlayers === num ? `var(--player${num}-color, ${getPlayerColor(num)})` : "white",
                  borderColor: getPlayerColor(num),
                  color: hoveredPlayers === num ? "white" : getPlayerColor(num),
                  "--player1-color": "#FF5252",
                  "--player2-color": "#4CAF50",
                  "--player3-color": "#2196F3", 
                  "--player4-color": "#FF9800",
                } as React.CSSProperties}
                onMouseEnter={() => setHoveredPlayers(num)}
                onMouseLeave={() => setHoveredPlayers(null)}
                onClick={() => handleSelectPlayers(num)}
              >
                <div className="flex flex-col">
                  <span>{num} {num === 1 ? "игрок" : num < 5 ? "игрока" : "игроков"}</span>
                  <span className="text-xs font-normal">
                    {gamesCount[num] || 0} {getDeclension(gamesCount[num] || 0, ['игра', 'игры', 'игр'])}
                  </span>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-3 text-indigo-800">Как играть:</h2>
            <ul className="text-left space-y-2 text-indigo-700">
              <li className="flex items-start gap-2">
                <span className="inline-block mt-1">👆</span> Каждый игрок использует свою область экрана
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block mt-1">🏆</span> Выполняйте задания и зарабатывайте очки
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block mt-1">🥇</span> Побеждает тот, кто наберёт больше очков
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              className="text-indigo-700"
              onClick={() => setSelectedPlayers(null)}
            >
              <Icon name="ArrowLeft" className="mr-2" /> Назад
            </Button>
            <h2 className="text-2xl font-bold text-indigo-800">
              {selectedPlayers} {selectedPlayers === 1 ? "игрок" : selectedPlayers < 5 ? "игрока" : "игроков"} - 
              Выберите игру
            </h2>
            <Button 
              variant="outline"
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700"
              onClick={handleRandomGame}
            >
              <Icon name="Shuffle" className="mr-2" /> Случайная
            </Button>
          </div>

          <div className="mb-4">
            <Tabs defaultValue="all">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="reaction">Реакция</TabsTrigger>
                <TabsTrigger value="logic">Логика</TabsTrigger>
                <TabsTrigger value="memory">Память</TabsTrigger>
                <TabsTrigger value="math">Математика</TabsTrigger>
              </TabsList>
              
              {['all', 'reaction', 'logic', 'memory', 'math'].map(category => (
                <TabsContent key={category} value={category}>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableGames
                        .filter(game => category === 'all' || game.category === category)
                        .map(game => (
                          <Card 
                            key={game.id} 
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedGame?.id === game.id ? 'border-4 border-indigo-500' : ''
                            }`}
                            onClick={() => handleSelectGame(game)}
                          >
                            <CardHeader className="p-3">
                              <CardTitle className="flex items-center text-lg">
                                <span className="text-2xl mr-2">{game.icon}</span> {game.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <p className="text-sm text-gray-600">{game.description}</p>
                            </CardContent>
                            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                              <Badge variant={
                                game.difficulty === 'easy' ? 'outline' : 
                                game.difficulty === 'medium' ? 'secondary' : 
                                'default'
                              }>
                                {game.difficulty === 'easy' ? 'Легко' : 
                                 game.difficulty === 'medium' ? 'Средне' : 
                                 'Сложно'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {game.playersMin === game.playersMax ? 
                                 `${game.playersMin} игр.` : 
                                 `${game.playersMin}-${game.playersMax} игр.`}
                              </span>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="flex justify-center">
            <Button 
              disabled={!selectedPlayers} 
              onClick={handleStartGame}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-xl"
            >
              {selectedGame ? 
                `Играть в "${selectedGame.title}"` : 
                'Играть со случайной игрой'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Вспомогательная функция для получения цвета игрока
function getPlayerColor(playerNumber: number): string {
  const colors = {
    1: "#FF5252", // Красный
    2: "#4CAF50", // Зеленый
    3: "#2196F3", // Синий
    4: "#FF9800", // Оранжевый
  };
  return colors[playerNumber as keyof typeof colors] || "#9E9E9E";
}

// Функция для склонения слов
function getDeclension(number: number, titles: [string, string, string]): string {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20 
      ? 2 
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
}

export default Index;
