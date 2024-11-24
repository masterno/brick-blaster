import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelManager from './LevelManager';

const LevelEditor = () => {
  const navigate = useNavigate();
  const [gridSize, setGridSize] = useState({ rows: 5, cols: 8 });
  const [selectedBrickType, setSelectedBrickType] = useState('S');
  const [grid, setGrid] = useState([]);
  const [levelSettings, setLevelSettings] = useState({
    speed: 1.0,
    powerUpProbability: 0.1
  });

  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  const initializeGrid = () => {
    const newGrid = Array(gridSize.rows).fill(null)
      .map(() => Array(gridSize.cols).fill('S'));
    setGrid(newGrid);
  };

  const handleCellClick = (row, col) => {
    const newGrid = [...grid];
    newGrid[row][col] = selectedBrickType;
    setGrid(newGrid);
  };

  const handleSave = () => {
    const levelData = {
      layout: grid,
      ...levelSettings
    };

    try {
      const levelManager = new LevelManager();
      const levelNumber = levelManager.saveCustomLevel(levelData);
      alert(`Level saved successfully as Level ${levelNumber}`);
      navigate('/');
    } catch (error) {
      alert('Failed to save level: ' + error.message);
    }
  };

  const handleExport = () => {
    const levelData = {
      layout: grid,
      ...levelSettings
    };

    const blob = new Blob([JSON.stringify(levelData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom_level.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getBrickColor = (type) => {
    switch (type) {
      case 'S': return '#0095DD';
      case 'D': return '#FF9900';
      case 'U': return '#666666';
      case 'E': return '#FF0000';
      default: return '#FFFFFF';
    }
  };

  return (
    <div className="level-editor">
      <h2>Level Editor</h2>
      
      <div className="editor-controls">
        <div className="brick-selector">
          <h3>Brick Types</h3>
          <button 
            className={selectedBrickType === 'S' ? 'selected' : ''}
            style={{ backgroundColor: getBrickColor('S') }}
            onClick={() => setSelectedBrickType('S')}
          >
            Standard
          </button>
          <button 
            className={selectedBrickType === 'D' ? 'selected' : ''}
            style={{ backgroundColor: getBrickColor('D') }}
            onClick={() => setSelectedBrickType('D')}
          >
            Durable
          </button>
          <button 
            className={selectedBrickType === 'U' ? 'selected' : ''}
            style={{ backgroundColor: getBrickColor('U') }}
            onClick={() => setSelectedBrickType('U')}
          >
            Unbreakable
          </button>
          <button 
            className={selectedBrickType === 'E' ? 'selected' : ''}
            style={{ backgroundColor: getBrickColor('E') }}
            onClick={() => setSelectedBrickType('E')}
          >
            Explosive
          </button>
        </div>

        <div className="level-settings">
          <h3>Level Settings</h3>
          <label>
            Ball Speed:
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="2.0"
              value={levelSettings.speed}
              onChange={(e) => setLevelSettings({
                ...levelSettings,
                speed: parseFloat(e.target.value)
              })}
            />
          </label>
          <label>
            Power-up Probability:
            <input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={levelSettings.powerUpProbability}
              onChange={(e) => setLevelSettings({
                ...levelSettings,
                powerUpProbability: parseFloat(e.target.value)
              })}
            />
          </label>
        </div>
      </div>

      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="grid-cell"
                style={{ backgroundColor: getBrickColor(cell) }}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="editor-actions">
        <button onClick={handleSave}>Save Level</button>
        <button onClick={handleExport}>Export Level</button>
        <button onClick={() => navigate('/')}>Cancel</button>
      </div>
    </div>
  );
};

export default LevelEditor;
