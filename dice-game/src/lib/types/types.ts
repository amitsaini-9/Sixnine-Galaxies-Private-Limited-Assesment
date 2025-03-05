export interface GameState {
  balance: number;
  betAmount: number;
  isRolling: boolean;
  lastRoll: number | null;
  multiplier: number;
  winChance: number;
}

export interface BetInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}