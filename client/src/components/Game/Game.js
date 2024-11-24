import React, { useState } from 'react';
import GameCanvas from './GameCanvas';

const Game = () => {
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  return (
    <GameCanvas
      lives={lives}
      setLives={setLives}
      score={score}
      setScore={setScore}
      currentLevel={currentLevel}
      setCurrentLevel={setCurrentLevel}
      isPaused={isPaused}
      setIsPaused={setIsPaused}
      isGameOver={isGameOver}
      setIsGameOver={setIsGameOver}
      isVictory={isVictory}
      setIsVictory={setIsVictory}
    />
  );
};

export default Game;
