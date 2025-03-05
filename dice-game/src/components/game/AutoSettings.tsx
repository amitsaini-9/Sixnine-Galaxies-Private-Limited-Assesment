import { AutoSettingsType } from "@/lib/types/game";

interface AutoSettingsProps {
  settings: AutoSettingsType;
  onChange: (settings: AutoSettingsType) => void;
  isRunning: boolean;
  onStop: () => void;
  betsCompleted: number;
  totalProfit: number;
}

export default function AutoSettings({
  settings,
  onChange,
  isRunning,
  onStop,
  betsCompleted,
  totalProfit,
}: AutoSettingsProps) {
  const handleNumberChange = (field: keyof AutoSettingsType, value: string) => {
    const numValue = parseFloat(value) || 0;
    onChange({ ...settings, [field]: numValue });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Number of Bets</label>
          <input
            type="number"
            min="1"
            step="1"
            value={settings.numberOfBets}
            onChange={(e) => handleNumberChange("numberOfBets", e.target.value)}
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Stop on Profit</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={settings.stopOnProfit}
            onChange={(e) => handleNumberChange("stopOnProfit", e.target.value)}
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Stop on Loss</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={settings.stopOnLoss}
            onChange={(e) => handleNumberChange("stopOnLoss", e.target.value)}
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">On Win</label>
          <select
            value={settings.onWin}
            onChange={(e) =>
              onChange({ ...settings, onWin: e.target.value as any })
            }
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          >
            <option value="reset">Reset</option>
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">On Loss</label>
          <select
            value={settings.onLoss}
            onChange={(e) =>
              onChange({ ...settings, onLoss: e.target.value as any })
            }
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          >
            <option value="reset">Reset</option>
            <option value="increase">Increase</option>
            <option value="decrease">Decrease</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-400">Win Multiplier</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={settings.winMultiplier}
            onChange={(e) =>
              handleNumberChange("winMultiplier", e.target.value)
            }
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="text-sm text-gray-400">Loss Multiplier</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={settings.lossMultiplier}
            onChange={(e) =>
              handleNumberChange("lossMultiplier", e.target.value)
            }
            className="w-full bg-gray-700 rounded p-2 mt-1 text-white"
            disabled={isRunning}
          />
        </div>
      </div>

      {isRunning && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-white">
            <span>Progress:</span>
            <span>
              {betsCompleted} / {settings.numberOfBets}
            </span>
          </div>
          <div className="flex justify-between text-white">
            <span>Total Profit:</span>
            <span
              className={totalProfit >= 0 ? "text-green-500" : "text-red-500"}
            >
              ${totalProfit.toFixed(2)}
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4ADE80] transition-all duration-300"
              style={{
                width: `${(betsCompleted / settings.numberOfBets) * 100}%`,
              }}
            />
          </div>
          <button
            onClick={onStop}
            className="w-full bg-red-500 hover:bg-red-600 rounded-md py-2 mt-2 text-white"
          >
            Stop Auto Betting
          </button>
        </div>
      )}
    </div>
  );
}
