import React from 'react';

const HUD = ({ score, lives, level, powerUps = [] }) => {
  return (
    <div className="game-hud">
      <div className="hud-item">
        <span className="hud-label">Score:</span>
        <span className="hud-value">{score}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Lives:</span>
        <span className="hud-value">{lives}</span>
      </div>
      <div className="hud-item">
        <span className="hud-label">Level:</span>
        <span className="hud-value">{level}</span>
      </div>
      {powerUps.length > 0 && (
        <div className="hud-powerups">
          {powerUps.map((powerUp, index) => (
            <div key={index} className="powerup-indicator">
              <span className="powerup-name">{powerUp.name}</span>
              <span className="powerup-timer">{Math.ceil(powerUp.duration)}s</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HUD;
