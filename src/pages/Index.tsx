
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredPlayers, setHoveredPlayers] = useState<number | null>(null);

  const handleStartGame = (players: number) => {
    navigate(`/game?players=${players}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-indigo-900">Четыре игрока</h1>
        <p className="text-xl text-indigo-700 mb-8">Весёлая игра для всей компании на одном экране!</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12 max-w-md w-full">
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
            onClick={() => handleStartGame(num)}
          >
            {num} {num === 1 ? "игрок" : num < 5 ? "игрока" : "игроков"}
          </Button>
        ))}
      </div>

      <div className="text-center max-w-md">
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

export default Index;
