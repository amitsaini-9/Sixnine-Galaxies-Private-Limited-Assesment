interface GameStatsProps {
  multiplier: number;
  rollOver: number;
  winChance: number;
}

export default function GameStats({
  multiplier,
  rollOver,
  winChance,
}: GameStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-md bg-gray-800 p-3">
        <div className="text-gray-400 text-sm">Multiplier</div>
        <div className="font-medium">{multiplier.toFixed(4)} X</div>
      </div>
      <div className="rounded-md bg-gray-800 p-3">
        <div className="text-gray-400 text-sm">Roll Over</div>
        <div className="font-medium">{rollOver.toFixed(2)}</div>
      </div>
      <div className="rounded-md bg-gray-800 p-3">
        <div className="text-gray-400 text-sm">Win Chance</div>
        <div className="font-medium">{winChance.toFixed(4)} %</div>
      </div>
    </div>
  );
}
