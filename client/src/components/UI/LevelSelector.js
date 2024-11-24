import React from 'react';
import '../../styles/components/LevelSelector.css';

const LevelSelector = ({ onLevelSelect }) => {
  const levels = [
    { number: 1, name: "Beginner" },
    { number: 2, name: "Advanced" },
    { number: 3, name: "Expert" },
    { number: 4, name: "Master" }
  ];

  return (
    <div className="level-selector">
      <h2>Select Level</h2>
      <div className="level-grid">
        {levels.map((level) => (
          <button
            key={level.number}
            className="level-button"
            onClick={() => onLevelSelect(level.number)}
          >
            <span className="level-number">Level {level.number}</span>
            <span className="level-name">{level.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelector;
