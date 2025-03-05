export type BetStrategy = 'reset' | 'increase' | 'decrease';

export interface AutoSettingsType {
  numberOfBets: number;
  stopOnProfit: number;
  stopOnLoss: number;
  onWin: BetStrategy;
  onLoss: BetStrategy;
  winMultiplier: number;
  lossMultiplier: number;
}

export interface BetResult {
  roll: number;
  isWin: boolean;
  profit: number;
  newBalance: number;
}