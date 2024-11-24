import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PauseMenu.css';

const PauseMenu = ({ onResume, onRestart }) => {
  const navigate = useNavigate();
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Animate glow effect
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame = (frame + 1) % 100;
      const intensity = Math.abs(Math.sin(frame * 0.1));
      setGlowIntensity(intensity);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pause-menu">
      <div 
        className="pause-menu-content"
        style={{
          '--glow-intensity': glowIntensity,
        }}
      >
        <div className="matrix-code-rain">
          {Array(20).fill().map((_, i) => (
            <div key={i} className="code-column" style={{ animationDelay: `${Math.random() * 2}s` }}>
              {Array(20).fill().map((_, j) => (
                <span key={j} style={{ animationDelay: `${Math.random() * 5}s` }}>
                  {String.fromCharCode(0x30A0 + Math.random() * 96)}
                </span>
              ))}
            </div>
          ))}
        </div>
        <h2 className="matrix-title">SYSTEM PAUSED</h2>
        <div className="pause-menu-buttons">
          <button onClick={onResume} className="matrix-button">
            <span className="button-text">RESUME</span>
            <div className="button-glitch"></div>
          </button>
          <button onClick={onRestart} className="matrix-button">
            <span className="button-text">RESTART LEVEL</span>
            <div className="button-glitch"></div>
          </button>
          <button onClick={() => navigate('/')} className="matrix-button">
            <span className="button-text">MAIN MENU</span>
            <div className="button-glitch"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
