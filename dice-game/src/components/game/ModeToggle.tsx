interface ModeToggleProps {
  isAuto: boolean;
  onModeChange: (mode: boolean) => void;
}

export default function ModeToggle({ isAuto, onModeChange }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-gray-800 p-1">
      <button
        className={`rounded-full px-6 py-2 transition-all ${
          !isAuto ? "bg-gray-700 text-white" : "text-gray-400"
        }`}
        onClick={() => onModeChange(false)}
      >
        Manual
      </button>
      <button
        className={`rounded-full px-6 py-2 transition-all ${
          isAuto ? "bg-gray-700 text-white" : "text-gray-400"
        }`}
        onClick={() => onModeChange(true)}
      >
        Auto
      </button>
    </div>
  );
}
