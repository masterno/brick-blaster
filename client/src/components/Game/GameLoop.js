import { useState } from 'react';

export const useGameLoop = (initialLevel = 1) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLevel, setCurrentLevel] = useState(initialLevel);

  const stop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const resetGame = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsGameOver(false);
    setIsVictory(false);
    setCurrentLevel(initialLevel);
    setScore(0);
    setLives(3);
  };

  return {
    isRunning,
    isPaused,
    isGameOver,
    isVictory,
    currentLevel,
    score,
    lives,
    setIsRunning,
    setIsPaused,
    setIsGameOver,
    setIsVictory,
    setCurrentLevel,
    setScore,
    setLives,
    start,
    stop,
    pause,
    resume,
    resetGame
  };
};

export default useGameLoop;
