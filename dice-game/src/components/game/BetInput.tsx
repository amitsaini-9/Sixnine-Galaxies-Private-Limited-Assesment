interface BetInputProps {
  value: string;
  maxBet: number;
  onChange: (value: string) => void;
  onBet: () => Promise<void> | void;
  disabled: boolean;
  isAuto?: boolean;
  isAutoRunning?: boolean;
}
export default function BetInput({
  value,
  maxBet,
  onChange,
  onBet,
  disabled,
  isAuto = false,
  isAutoRunning = false,
}: BetInputProps) {
  const handleBetChange = (newValue: string) => {
    const numValue = parseFloat(newValue) || 0;
    if (numValue <= maxBet) {
      onChange(newValue);
    }
  };

  // Calculate profit on win (2x multiplier)
  const calculateProfit = () => {
    const bet = parseFloat(value) || 0;
    return (bet * 2).toFixed(2);
  };

  return (
    <div className="space-y-4">
      {/* Bet Amount Input */}
      <div>
        <label className="text-sm text-gray-400">Bet Amount</label>
        <div className="relative mt-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <span className="text-gray-400">₹</span>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => handleBetChange(e.target.value)}
            className="w-full rounded-md bg-gray-800 p-3 pl-8 text-white"
            disabled={disabled}
            placeholder="0.00"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={() =>
                handleBetChange((parseFloat(value) / 2).toFixed(2))
              }
              className="text-gray-400 hover:text-white px-2"
              disabled={disabled}
            >
              ½
            </button>
            <span className="text-gray-600">|</span>
            <button
              onClick={() =>
                handleBetChange((parseFloat(value) * 2).toFixed(2))
              }
              className="text-gray-400 hover:text-white px-2"
              disabled={disabled}
            >
              2×
            </button>
          </div>
        </div>
      </div>

      {/* Profit on Win Display */}
      <div>
        <label className="text-sm text-gray-400">Profit on Win</label>
        <div className="relative mt-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <span className="text-gray-400">₹</span>
          </div>
          <input
            type="text"
            value={calculateProfit()}
            className="w-full rounded-md bg-gray-800 p-3 pl-8 text-white"
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Bet Button */}
      <button
        onClick={onBet}
        disabled={disabled || isAutoRunning || parseFloat(value) <= 0}
        className={`w-full rounded-md py-3 font-medium transition-all
          ${
            disabled || isAutoRunning || parseFloat(value) <= 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#4ADE80] hover:bg-[#4ADE80]/90"
          }`}
      >
        {isAutoRunning ? "Auto Betting..." : isAuto ? "Start Auto Bet" : "Bet"}
      </button>
    </div>
  );
}
