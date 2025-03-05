"use client";

import { useState, useEffect, useRef } from "react";
import ModeToggle from "@/components/game/ModeToggle";
import BetInput from "@/components/game/BetInput";
import DiceSlider from "@/components/game/DiceSlider";
import GameStats from "@/components/game/GameStats";
import api from "@/services/api";
import toast from "react-hot-toast";
import AutoSettings from "@/components/game/AutoSettings";
import { AutoSettingsType, BetResult } from "@/lib/types/game";

export default function Home() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState("0.00");
  const [isAuto, setIsAuto] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState(50);
  const [previousRolls, setPreviousRolls] = useState<number[]>([]);
  const [autoSettings, setAutoSettings] = useState<AutoSettingsType>({
    numberOfBets: 0,
    stopOnProfit: 0,
    stopOnLoss: 0,
    onWin: "reset",
    onLoss: "reset",
    winMultiplier: 2,
    lossMultiplier: 2,
  });
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [betsCompleted, setBetsCompleted] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // Initialize player on first load
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        // Check localStorage first
        const storedPlayerId = localStorage.getItem("playerId");

        if (storedPlayerId) {
          setPlayerId(storedPlayerId);
          const balance = await api.getBalance(storedPlayerId);
          setBalance(balance);
          toast.success("Welcome back!");
        } else {
          const player = await api.createPlayer();
          setPlayerId(player.id);
          setBalance(player.balance);
          localStorage.setItem("playerId", player.id);
          toast.success("New player created!");
        }
      } catch (error) {
        console.error("Failed to initialize player:", error);
        toast.error("Failed to initialize player. Please refresh the page.");
      }
    };

    initializePlayer();
  }, []);
  const handleBet = async (): Promise<BetResult> => {
    if (isRolling || !playerId || parseFloat(betAmount) <= 0) {
      throw new Error("Invalid bet conditions");
    }

    const betToast = toast.loading("Rolling dice...");

    try {
      setIsRolling(true);

      const result = await api.rollDice(playerId, parseFloat(betAmount));

      setCurrentRoll(result.roll);
      setPreviousRolls((prev) => [result.roll, ...prev].slice(0, 3));
      setBalance(result.newBalance);

      if (result.isWin) {
        toast.success(
          `Won $${result.profit.toFixed(2)}! Roll: ${result.roll.toFixed(2)}`,
          { id: betToast }
        );
      } else {
        toast.error(
          `Lost $${Math.abs(result.profit).toFixed(
            2
          )}. Roll: ${result.roll.toFixed(2)}`,
          { id: betToast }
        );
      }

      return result;
    } catch (error) {
      console.error("Bet failed:", error);
      toast.error("Bet failed. Please try again.", { id: betToast });
      throw error;
    } finally {
      setIsRolling(false);
    }
  };

  // Handle bet amount validation
  const handleBetChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue > balance) {
      toast.error("Insufficient balance!");
      return;
    }
    setBetAmount(value);
  };
  const stopAutoBetting = () => {
    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }
    setIsAutoRunning(false);
    toast.success("Auto-betting stopped");
  };

  const startAutoBetting = () => {
    if (!playerId || isAutoRunning || autoSettings.numberOfBets <= 0) {
      toast.error("Please set number of bets greater than 0");
      return;
    }

    setIsAutoRunning(true);
    setBetsCompleted(0);
    setTotalProfit(0);

    const runAutoBet = async () => {
      // Check if we've reached the number of bets
      if (betsCompleted >= autoSettings.numberOfBets) {
        stopAutoBetting();
        toast.success(`Completed ${autoSettings.numberOfBets} bets`);
        return;
      }

      try {
        const result = await handleBet();

        // Update completed bets count
        setBetsCompleted((prev) => {
          const newCount = prev + 1;
          // Stop if we've reached the target
          if (newCount >= autoSettings.numberOfBets) {
            stopAutoBetting();
            toast.success(`Completed ${autoSettings.numberOfBets} bets`);
          }
          return newCount;
        });

        // Update total profit
        setTotalProfit((prev) => {
          const newProfit = prev + result.profit;
          // Check profit/loss limits
          if (newProfit >= autoSettings.stopOnProfit) {
            stopAutoBetting();
            toast.success(`Reached profit target: $${newProfit.toFixed(2)}`);
          } else if (-newProfit >= autoSettings.stopOnLoss) {
            stopAutoBetting();
            toast.error(`Reached loss limit: $${(-newProfit).toFixed(2)}`);
          }
          return newProfit;
        });

        // Update bet amount based on result
        if (result.isWin) {
          if (autoSettings.onWin === "increase") {
            setBetAmount((prev) =>
              (parseFloat(prev) * autoSettings.winMultiplier).toFixed(2)
            );
          } else if (autoSettings.onWin === "decrease") {
            setBetAmount((prev) =>
              (parseFloat(prev) / autoSettings.winMultiplier).toFixed(2)
            );
          }
        } else {
          if (autoSettings.onLoss === "increase") {
            setBetAmount((prev) =>
              (parseFloat(prev) * autoSettings.lossMultiplier).toFixed(2)
            );
          } else if (autoSettings.onLoss === "decrease") {
            setBetAmount((prev) =>
              (parseFloat(prev) / autoSettings.lossMultiplier).toFixed(2)
            );
          }
        }
      } catch (error) {
        console.error("Auto-bet failed:", error);
        stopAutoBetting();
        toast.error("Auto-betting stopped due to an error");
      }
    };

    // Run first bet immediately
    runAutoBet();
    // Then set interval for subsequent bets
    autoIntervalRef.current = setInterval(runAutoBet, 2000);
  };

  // Clean up interval on unmount or when auto betting is stopped
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, []);

  // Additional cleanup when auto mode is disabled
  useEffect(() => {
    if (!isAuto && isAutoRunning) {
      stopAutoBetting();
    }
  }, [isAuto]);
  const handleManualBet = async () => {
    try {
      await handleBet();
    } catch (error) {
      console.error("Manual bet failed:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#1a1b23] p-4">
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <ModeToggle
            isAuto={isAuto}
            onModeChange={(auto) => {
              setIsAuto(auto);
              if (!auto && isAutoRunning) {
                stopAutoBetting();
              }
              toast.success(auto ? "Auto mode enabled" : "Manual mode enabled");
            }}
          />
          <div className="text-white">Balance: ${balance.toFixed(2)}</div>
        </div>

        <div className="space-y-8">
          <BetInput
            value={betAmount}
            maxBet={balance}
            onChange={handleBetChange}
            onBet={isAuto ? startAutoBetting : handleManualBet}
            disabled={isRolling || !playerId}
            isAuto={isAuto}
            isAutoRunning={isAutoRunning}
          />

          {isAuto && (
            <AutoSettings
              settings={autoSettings}
              onChange={setAutoSettings}
              isRunning={isAutoRunning}
              onStop={stopAutoBetting}
              betsCompleted={betsCompleted}
              totalProfit={totalProfit}
            />
          )}

          <DiceSlider
            currentRoll={currentRoll}
            isRolling={isRolling}
            previousRolls={previousRolls}
          />

          <GameStats multiplier={2.0} rollOver={50.5} winChance={49.5} />
        </div>
      </div>
    </main>
  );
}
