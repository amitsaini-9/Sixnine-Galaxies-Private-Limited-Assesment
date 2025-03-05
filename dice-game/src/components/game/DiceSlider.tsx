interface DiceSliderProps {
  currentRoll: number;
  isRolling: boolean;
  previousRolls: number[];
}

export default function DiceSlider({
  currentRoll,
  isRolling,
  previousRolls,
}: DiceSliderProps) {
  return (
    <div className="space-y-8">
      {/* Previous Rolls */}
      <div className="flex justify-end gap-2">
        {previousRolls.map((roll, i) => (
          <div
            key={i}
            className="rounded-full bg-[#4ADE80] px-4 py-2 font-medium"
          >
            {roll.toFixed(2)}
          </div>
        ))}
      </div>

      {/* Slider */}
      <div className="relative pt-8 pb-16">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        <div className="h-2 w-full rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-red-500"
            style={{ width: "50%" }}
          />
          <div
            className="absolute h-full bg-[#4ADE80]"
            style={{ left: "50%", right: 0 }}
          />
        </div>

        <div
          className="absolute -translate-x-1/2 transition-all duration-300"
          style={{ left: `${currentRoll}%`, top: "50%" }}
        >
          <div
            className={`bg-white rounded-lg p-2 shadow-lg transform -translate-y-1/2
            ${isRolling ? "animate-pulse" : ""} text-black`}
          >
            {isRolling ? "..." : currentRoll.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
