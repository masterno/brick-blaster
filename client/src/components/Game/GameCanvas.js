import React, { useRef, useEffect, useCallback } from 'react';
import Ball from './entities/Ball';
import Paddle from './entities/Paddle';
import LevelManager from './LevelManager';
import PauseMenu from '../UI/PauseMenu';
import GameOver from '../UI/GameOver';
import SoundManager from '../../utils/SoundManager';
import '../../styles/components/GameCanvas.css';

const GameCanvas = ({ 
  lives, setLives, 
  score, setScore, 
  currentLevel, setCurrentLevel,
  isPaused, setIsPaused,
  isGameOver, setIsGameOver,
  isVictory, setIsVictory 
}) => {
  const canvasRef = useRef(null);
  const gameObjectsRef = useRef(null);
  const requestIdRef = useRef({ id: null, lastTime: 0 });
  const levelManagerRef = useRef(null);
  const soundManagerRef = useRef(null);

  const resetBallAndPaddle = useCallback(() => {
    console.log('resetBallAndPaddle called');
    if (!gameObjectsRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const objects = gameObjectsRef.current;
    
    // Reset paddle position and state
    objects.paddle.x = canvas.width / 2 - objects.paddle.width / 2;
    objects.paddle.y = canvas.height - 40;
    objects.paddle.leftPressed = false;
    objects.paddle.rightPressed = false;
    
    // Reset ball position and state
    objects.ball.x = canvas.width / 2;
    objects.ball.y = canvas.height - 60;
    objects.ball.dx = 0;
    objects.ball.dy = 0;
    objects.ball.isLaunched = false;
    console.log('Ball and paddle reset complete');
  }, []);

  const handleRestart = useCallback(() => {
    if (!levelManagerRef.current) return;

    setIsPaused(false);
    setIsGameOver(false);
    setIsVictory(false);
    setScore(0);
    setLives(3);
    setCurrentLevel(1);
    
    // Reset level manager to ensure fresh state
    levelManagerRef.current = new LevelManager();
    resetBallAndPaddle();
  }, [resetBallAndPaddle, setCurrentLevel, setIsGameOver, setIsVictory, setIsPaused, setLives, setScore]);

  const handleKeyDown = useCallback((e) => {
    const objects = gameObjectsRef.current;
    if (!objects) return;

    // Handle pause with Escape
    if (e.code === 'Escape') {
      if (!isGameOver) {
        setIsPaused(!isPaused);
      }
      return;
    }

    // Handle restart or ball launch with Space
    if (e.code === 'Space') {
      if (isGameOver) {
        handleRestart();
      } else if (!objects.ball.isLaunched && !isPaused) {
        objects.ball.launch();
        if (soundManagerRef.current) {
          soundManagerRef.current.playBallLaunch();
        }
      }
      return;
    }

    if (isPaused || isGameOver) return;

    switch (e.code) {
      case 'ArrowLeft':
        objects.paddle.moveLeft();
        break;
      case 'ArrowRight':
        objects.paddle.moveRight();
        break;
      default:
        break;
    }
  }, [handleRestart, isGameOver, isPaused, setIsPaused]);

  const handleKeyUp = useCallback((e) => {
    const objects = gameObjectsRef.current;
    if (!objects) return;

    switch (e.code) {
      case 'ArrowLeft':
        objects.paddle.stopLeft();
        break;
      case 'ArrowRight':
        objects.paddle.stopRight();
        break;
      default:
        break;
    }
  }, []);

  const handleBallOut = useCallback(() => {
    const newLives = lives - 1;
    setLives(newLives);
    
    if (newLives <= 0) {
      setIsGameOver(true);
      setIsVictory(false);
      setIsPaused(false);
    } else {
      resetBallAndPaddle();
    }
  }, [lives, setLives, setIsGameOver, setIsVictory, setIsPaused, resetBallAndPaddle]);

  const drawHUD = useCallback((ctx) => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.save();
    
    // Matrix-style green color
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.font = '20px "Courier New", monospace';
    
    // Draw score with digital effect
    ctx.fillText(`SCORE: ${score.toString().padStart(6, '0')}`, 20, 30);
    
    // Draw lives with Matrix symbols
    const livesText = `LIVES: ${'\u25CF'.repeat(lives)}`;
    ctx.fillText(livesText, canvasRef.current.width - 150, 30);
    
    // Draw level with cyberpunk style
    ctx.font = 'bold 20px "Courier New", monospace';
    const levelText = `LEVEL ${currentLevel}`;
    const levelWidth = ctx.measureText(levelText).width;
    ctx.fillText(levelText, (canvasRef.current.width - levelWidth) / 2, 30);
    
    // Add subtle grid effect in background of HUD
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < canvasRef.current.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 40);
      ctx.strokeStyle = '#00ff00';
      ctx.stroke();
    }
    
    ctx.restore();
  }, [score, lives, currentLevel]);

  const drawGameObjects = useCallback((ctx) => {
    const objects = gameObjectsRef.current;
    if (!objects) return;

    // Draw paddle
    objects.paddle.draw(ctx);
    
    // Draw ball
    objects.ball.draw(ctx);
    
    // Draw bricks
    objects.bricks.forEach(brick => brick.draw(ctx));
  }, []);

  const animate = useCallback((timestamp) => {
    if (isPaused || isGameOver) return;

    const deltaTime = timestamp - (requestIdRef.current.lastTime || timestamp);
    requestIdRef.current.lastTime = timestamp;

    const ctx = canvasRef.current?.getContext('2d', { alpha: false });
    const objects = gameObjectsRef.current;

    if (!ctx || !objects) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Update game objects
    if (objects.ball.y + objects.ball.radius > canvasRef.current.height) {
      handleBallOut();
    } else {
      objects.paddle.update(deltaTime / 1000);
      objects.ball.update(deltaTime / 1000);

      // Handle paddle collision
      if (objects.ball.checkPaddleCollision(objects.paddle)) {
        objects.ball.bounceOffPaddle(objects.paddle);
        if (soundManagerRef.current) {
          soundManagerRef.current.playPaddleHit();
        }
      }

      // Only stick to paddle if not launched
      if (!objects.ball.isLaunched) {
        objects.ball.stickToPaddle(objects.paddle);
      }

      // Check brick collisions
      let remainingBricks = 0;
      let brickHit = false;

      // Sort bricks by distance to ball for more accurate collision detection
      const sortedBricks = objects.bricks
        .filter(brick => !brick.isDestroyed())
        .sort((a, b) => {
          const distA = Math.hypot(
            objects.ball.x - (a.x + a.width / 2),
            objects.ball.y - (a.y + a.height / 2)
          );
          const distB = Math.hypot(
            objects.ball.x - (b.x + b.width / 2),
            objects.ball.y - (b.y + b.height / 2)
          );
          return distA - distB;
        });

      for (const brick of sortedBricks) {
        remainingBricks++;
        if (!brickHit && objects.ball.checkBrickCollision(brick)) {
          if (objects.ball.bounceOffBrick(brick)) {
            brickHit = true;
            if (brick.hit()) {
              // Use requestAnimationFrame for score update
              const newScore = score + 100;
              requestAnimationFrame(() => setScore(newScore));
              if (soundManagerRef.current) {
                soundManagerRef.current.playBrickHit();
              }
            }
          }
        }
      }

      // Check if level is complete
      if (objects.bricks.length > 0 && remainingBricks === 0) {
        const nextLevel = currentLevel + 1;
        if (nextLevel <= levelManagerRef.current.getMaxLevel()) {
          // Use requestAnimationFrame to batch state updates
          requestAnimationFrame(() => {
            setCurrentLevel(nextLevel);
          });
        } else {
          requestAnimationFrame(() => {
            setIsGameOver(true);
            setIsVictory(true);
          });
        }
      }
    }

    // Draw game objects
    drawGameObjects(ctx);
    drawHUD(ctx);

    // Request next frame
    requestIdRef.current.id = requestAnimationFrame(animate);
  }, [
    isPaused,
    isGameOver,
    handleBallOut,
    drawGameObjects,
    drawHUD,
    score,
    currentLevel
  ]);

  // Initialize managers and game state
  useEffect(() => {
    try {
      // First initialize managers
      levelManagerRef.current = new LevelManager();
      soundManagerRef.current = new SoundManager();

      // Initialize canvas
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }

      canvas.width = 800;
      canvas.height = 600;

      // Initialize game objects
      gameObjectsRef.current = {
        paddle: new Paddle(canvas.width / 2 - 50, canvas.height - 40),
        ball: new Ball(canvas.width / 2, canvas.height - 60),
        bricks: []
      };

      // Load initial level (with error handling)
      const levelData = levelManagerRef.current.loadLevel(1);
      if (!levelData) {
        console.error('Failed to load initial level');
        return;
      }

      gameObjectsRef.current.bricks = levelData.bricks || [];

    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, []); // Empty dependency array since this should only run once

  // Handle keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Handle animation
  useEffect(() => {
    if (isPaused || isGameOver) return;

    // Start animation
    requestIdRef.current.id = requestAnimationFrame(animate);

    return () => {
      if (requestIdRef.current.id) {
        cancelAnimationFrame(requestIdRef.current.id);
      }
    };
  }, [animate, isPaused, isGameOver]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (soundManagerRef.current) {
        soundManagerRef.current.cleanup();
      }
    };
  }, []);

  // Handle level changes
  useEffect(() => {
    try {
      if (!gameObjectsRef.current || !levelManagerRef.current) {
        console.warn('Game objects or level manager not initialized');
        return;
      }
      
      const levelData = levelManagerRef.current.loadLevel(currentLevel);
      if (!levelData) {
        console.error('Failed to load level:', currentLevel);
        return;
      }

      // Reset ball and paddle for new level
      resetBallAndPaddle();
      
      // Update bricks for new level
      gameObjectsRef.current.bricks = levelData.bricks;
      
    } catch (error) {
      console.error('Error loading level:', error);
    }
  }, [currentLevel]); // Only depend on currentLevel changes

  return (
    <div className="game-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
      {isPaused && !isGameOver && <PauseMenu onResume={() => setIsPaused(false)} />}
      {isGameOver && <GameOver score={score} victory={isVictory} onRestart={handleRestart} />}
    </div>
  );
};

export default GameCanvas;
