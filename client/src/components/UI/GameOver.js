import React from 'react';
import { useNavigate } from 'react-router-dom';

const GameOver = ({ score, level, onRestart, isVictory = false }) => {
  const navigate = useNavigate();

  const handleRestart = () => {
    onRestart();
  };

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h2>{isVictory ? 'Congratulations!' : 'Game Over'}</h2>
        <div className="game-stats">
          <p>Final Score: {score}</p>
          <p>Level Reached: {level}</p>
          {isVictory && <p>You've completed all levels!</p>}
        </div>
        <div className="game-over-buttons">
          <button onClick={handleRestart}>Play Again</button>
          <button onClick={() => navigate('/')}>Main Menu</button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
