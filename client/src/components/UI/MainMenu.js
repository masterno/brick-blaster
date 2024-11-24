import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelSelector from './LevelSelector';
import '../../styles/components/MainMenu.css';

const MainMenu = () => {
  const navigate = useNavigate();
  const [showLevelSelector, setShowLevelSelector] = useState(false);

  const handleStartGame = () => {
    navigate('/play', { state: { selectedLevel: 1 } });
  };

  const handleLevelSelect = (level) => {
    navigate('/play', { state: { selectedLevel: level } });
  };

  return (
    <div className="game-container">
      <div className="main-menu">
        <h1>BrickBlaster</h1>
        <div className="menu-buttons">
          {!showLevelSelector ? (
            <>
              <button onClick={handleStartGame}>Start Game</button>
              <button onClick={() => setShowLevelSelector(true)}>Select Level</button>
            </>
          ) : (
            <>
              <LevelSelector onLevelSelect={handleLevelSelect} />
              <button onClick={() => setShowLevelSelector(false)} className="back-button">
                Back to Menu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
