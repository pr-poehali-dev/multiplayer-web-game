
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { getGamesByPlayerCount, getRandomGameForPlayerCount, MiniGame } from "@/lib/gameTypes";

const RoundSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const playersCount = parseInt(searchParams.get("players") || "4", 10);
  
  const [roundsCount, setRoundsCount] = useState(3);
  const [rounds, setRounds] = useState<Array<{ gameId: string | null }>>([]);
  const [availableGames, setAvailableGames] = useState<MiniGame[]>([]);
  const [useRandomGames, setUseRandomGames] = useState(true);

  // Загружаем доступные игры при монтировании
  useEffect(() => {
    setAvailableGames(getGamesByPlayerCount(playersCount));
  }, [playersCount]);

  // Обновляем раунды при изменении их количества
  useEffect(() => {
    setRounds(Array.from({ length: roundsCount }).map(() => ({
      gameId: useRandomGames ? null : null
    })));
  }, [roundsCount, useRandomGames]);

  // Выбор игры для конкретного раунда
  const selectGameForRound = (roundIndex: number, gameId: string) => {
    if (useRandomGames) return;
    
    setRounds(prev => 
      prev.map((round, idx) => 
        idx === roundIndex ? { ...round, gameId } : round
      )
    );
  };

  // Выбор случайной игры для конкретного раунда
  const selectRandomGameForRound = (roundIndex: number) => {
    const randomGame = getRandomGameForPlayerCount(playersCount);
    
    setRounds(prev => 
      prev.map((round, idx) => 
        idx === roundIndex ? { ...round, gameId: randomGame.id } : round
      )
    );
  };

  // Начать игру
  const startGame = () => {
    // Создаем строку с ID игр для каждого раунда
    const roundGames = rounds.map(round => 
      round.gameId || getRandomGameForPlayerCount(playersCount).id
    ).join(',');
    
    navigate(`/game?players=${playersCount}&rounds=${roundsCount}&games=${roundGames}`);
  };

  // Вернуться назад
  const goBack = () => {
    navigate("/");
  };

  // Получение цвета для кнопки раунда
  const getRoundButtonColor = (roundIndex: number) => {
    const colors = ["#FF5252", "#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#FF5722", "#607D8B", "#795548", "#673AB7", "#3F51B5"];
    return colors[roundIndex % colors.length];
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" className="text-indigo-700" onClick={goBack}>
            <Icon name="ArrowLeft" className="mr-2" /> Назад
          </Button>
          <h2 className="text-2xl font-bold text-indigo-800">
            Настройка раундов - {playersCount} {playersCount === 1 ? "игрок" : playersCount < 5 ? "игрока" : "игроков"}
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="text-xl font-bold mb-4 text-indigo-800">Выберите количество раундов:</h3>
          
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <Button
                key={num}
                variant={roundsCount === num ? "default" : "outline"}
                className="h-12 text-lg"
                onClick={() => setRoundsCount(num)}
              >
                {num}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {[6, 7, 8, 9, 10].map((num) => (
              <Button
                key={num}
                variant={roundsCount === num ? "default" : "outline"}
                className="h-12 text-lg"
                onClick={() => setRoundsCount(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-indigo-800">Выбор игр для раундов</h3>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="random-games" 
                checked={useRandomGames} 
                onCheckedChange={setUseRandomGames}
              />
              <Label htmlFor="random-games">Случайные игры</Label>
            </div>
          </div>
          
          {useRandomGames ? (
            <div className="bg-indigo-50 p-4 rounded-lg text-indigo-800 mb-4">
              <div className="flex items-start">
                <Icon name="Shuffle" className="mr-2 mt-1 flex-shrink-0" />
                <p>
                  В каждом раунде будет случайная игра, подходящая для {playersCount} {playersCount === 1 ? "игрока" : "игроков"}. 
                  Игры не будут повторяться, пока не будут использованы все доступные.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {rounds.map((round, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="p-3 flex flex-row items-center justify-between" 
                    style={{ backgroundColor: `${getRoundButtonColor(index)}20` }}>
                    <CardTitle className="text-md">
                      Раунд {index + 1}
                    </CardTitle>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => selectRandomGameForRound(index)}
                      className="h-8 text-xs"
                    >
                      <Icon name="Shuffle" className="mr-1" size={14} />
                      Случайная
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3">
                    {round.gameId ? (
                      <div className="flex items-center justify-between">
                        <div>
                          {(() => {
                            const game = availableGames.find(g => g.id === round.gameId);
                            return game ? (
                              <div className="flex items-center">
                                <span className="text-2xl mr-2">{game.icon}</span>
                                <div>
                                  <div className="font-medium">{game.title}</div>
                                  <div className="text-xs text-gray-500">{game.description}</div>
                                </div>
                              </div>
                            ) : <span>Игра не выбрана</span>;
                          })()}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => selectGameForRound(index, "")}
                          className="h-8 text-xs"
                        >
                          Изменить
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-40 rounded-md">
                        <div className="grid grid-cols-1 gap-2">
                          {availableGames.map(game => (
                            <div
                              key={game.id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                              onClick={() => selectGameForRound(index, game.id)}
                            >
                              <div className="flex items-center">
                                <span className="text-2xl mr-2">{game.icon}</span>
                                <div>
                                  <div className="font-medium">{game.title}</div>
                                  <div className="text-xs text-gray-500">{game.description}</div>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  game.difficulty === 'easy' ? 'outline' : 
                                  game.difficulty === 'medium' ? 'secondary' : 
                                  'default'
                                }
                              >
                                {game.difficulty === 'easy' ? 'Легко' : 
                                 game.difficulty === 'medium' ? 'Средне' : 
                                 'Сложно'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={startGame} 
            size="lg" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-xl"
          >
            Начать игру с {roundsCount} {roundsCount === 1 ? "раундом" : roundsCount < 5 ? "раундами" : "раундами"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoundSetup;
