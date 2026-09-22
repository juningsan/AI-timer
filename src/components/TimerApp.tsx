"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import TimerDisplay from "@/components/ui/TimerDisplay";
import Controls from "@/components/ui/Controls";
import { useState, useEffect } from "react";
import { useReward } from "react-rewards";
import { playNotificationSound } from "@/utils/sound";
import MetaDataUpdater from "@/components/MetaDataUpdater";
import { Switch } from "@/components/ui/switch";
import { generateRefreshSuggestions } from "@/utils/gemini";
import RefreshSuggestion from "@/components/ui/RefreshSuggestion";
import { error } from "console";


type Mode = "work" | "break";

export default function TimerApp() {
  const { reward: confetti } = useReward(
    "confettiReward",
    "confetti",
    {
      elementCount: 100,
      spread: 70,
      decay: 0.9,
      lifetime: 150,
    },
  );
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState({
    minutes: workDuration,
    seconds: 0,
  });
  const [mode, setMode] = useState<Mode>("work");
  const [autoStart, setAutoStart] = useState(false);
  const [refreshSuggestion, setRefreshSuggestion] = useState<string | null>(null);

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft({
      minutes: mode === "work" ? workDuration : breakDuration,
      seconds: 0,
    });
  };

  const toggleMode = () => {
    setTimeLeft(
      mode === "work"
        ? { minutes: breakDuration, seconds: 0 }
        : { minutes: workDuration, seconds: 0 },
    );
    setMode(mode === "work" ? "break" : "work");

    if (mode === "break") {
      generateRefreshSuggestions().then((suggestion) => 
          setRefreshSuggestion(suggestion)
        ).catch(console.error);
    }
    setIsRunning(autoStart);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              setIsRunning(false);
              // toggleMode();
              if (mode === "work") {
                void confetti();
              }

              void playNotificationSound();

              setTimeout(() => {
                toggleMode();
              }, 100);

              return prev;
            }
            return { minutes: prev.minutes - 1, seconds: 59 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background p-4">
      <span
        id="confettiReward"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "work" ? "作業時間" : "休憩時間"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <TimerDisplay
            minutes={timeLeft.minutes}
            seconds={timeLeft.seconds}
            mode={mode}
          />
          <Controls
            onStart={handleStart}
            onReset={handleReset}
            isRunning={isRunning}
            onToggleMode={toggleMode}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-4 w-full max-w-[200px] mx-auto bg-transparent border-none">
          <div className="flex w-full items-center justify-between gap-2">
            <label className="text-sm font-medium">作業時間</label>
            <select
              value={workDuration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setWorkDuration(newDuration);
                if (mode === "work" && !isRunning) {
                  setTimeLeft({ minutes: newDuration, seconds: 0 });
                }
              }}
              className="p-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 15, 25, 30, 60].map((value) => (
                <option key={value} value={value}>
                  {value} 分
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full items-center justify-between gap-2">
            <label className="text-sm font-medium">休憩時間</label>
            <select
              value={breakDuration}
              onChange={(e) => {
                const newDuration = parseInt(e.target.value);
                setBreakDuration(newDuration);
                if (mode === "break" && !isRunning) {
                  setTimeLeft({ minutes: newDuration, seconds: 0 });
                }
              }}
              className="p-2 border rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 15].map((value) => (
                <option key={value} value={value}>
                  {value} 分
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <label className="text-sm font-medium">自動開始</label>
            <Switch checked={autoStart} className="cursor-pointer" onCheckedChange={() => setAutoStart(!autoStart)} />
          </div>
        </CardFooter>
      </Card>
      <MetaDataUpdater
        minutes={timeLeft.minutes}
        seconds={timeLeft.seconds}
        mode={mode}
      />
      <RefreshSuggestion
        suggestion={refreshSuggestion}
        onClose={() => setRefreshSuggestion(null)}
      />
    </div>
  );
}
