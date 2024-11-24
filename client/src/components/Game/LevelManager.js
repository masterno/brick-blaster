import Brick from './entities/Brick';

class LevelManager {
  constructor() {
    this.currentLevel = 0;
    this.initializeLevels();
  }

  initializeLevels() {
    this.levels = [
      {
        name: 'Basic Training',
        speed: 1,
        backgroundColor: '#1a1a1a'
      },
      {
        name: 'Advanced Challenge',
        speed: 1.2,
        backgroundColor: '#1a1a2a'
      },
      {
        name: 'Expert Mode',
        speed: 1.5,
        backgroundColor: '#1a2a2a'
      },
      {
        name: 'Master Challenge',
        speed: 1.8,
        backgroundColor: '#2a1a2a'
      }
    ];
  }

  createBasicLevel() {
    const bricks = [];
    const brickWidth = 80;
    const brickHeight = 20;
    const offsetTop = 60;
    const offsetLeft = (800 - (brickWidth * 10)) / 2; // Center 10 bricks horizontally

    // Create a simple pattern for beginners
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        const x = (col * brickWidth) + offsetLeft;
        const y = (row * brickHeight) + offsetTop;
        bricks.push(new Brick(x, y, brickWidth, brickHeight, 'standard'));
      }
    }

    return bricks;
  }

  createAdvancedLevel() {
    const bricks = [];
    const brickWidth = 80;
    const brickHeight = 20;
    const offsetTop = 60;
    const offsetLeft = (800 - (brickWidth * 10)) / 2;

    // Create a V-shaped pattern with mixed brick types
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 10; col++) {
        // Skip bricks to create V shape
        if (row < 4 && (col < row || col > 9 - row)) continue;

        const x = (col * brickWidth) + offsetLeft;
        const y = (row * brickHeight) + offsetTop;
        
        let type = 'standard';
        if (row === 0) {
          type = 'durable'; // Top row is durable
        } else if (row === 5) {
          type = 'explosive'; // Bottom row is explosive
        }
        
        bricks.push(new Brick(x, y, brickWidth, brickHeight, type));
      }
    }

    return bricks;
  }

  createExpertLevel() {
    const bricks = [];
    const brickWidth = 80;
    const brickHeight = 20;
    const offsetTop = 60;
    const offsetLeft = (800 - (brickWidth * 10)) / 2;

    // Create a complex pattern with all brick types
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        // Create a checkerboard pattern with gaps
        if ((row + col) % 2 === 0) {
          const x = (col * brickWidth) + offsetLeft;
          const y = (row * brickHeight) + offsetTop;
          
          let type = 'standard';
          if (row < 2) {
            type = 'durable';
          } else if (row === 7) {
            type = 'explosive';
          } else if (col === 0 || col === 9) {
            type = 'unbreakable';
          }
          
          bricks.push(new Brick(x, y, brickWidth, brickHeight, type));
        }
      }
    }

    return bricks;
  }

  createMasterLevel() {
    const bricks = [];
    const brickWidth = 80;
    const brickHeight = 20;
    const offsetTop = 60;
    const offsetLeft = (800 - (brickWidth * 10)) / 2;

    // Create an intricate pattern with all brick types
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const x = (col * brickWidth) + offsetLeft;
        const y = (row * brickHeight) + offsetTop;
        
        let type = 'standard';
        
        // Create a fortress-like pattern
        if (row === 0 || row === 9 || col === 0 || col === 9) {
          type = 'unbreakable';
        } else if (row === 1 || row === 8) {
          type = 'durable';
        } else if ((row === 4 || row === 5) && (col === 4 || col === 5)) {
          type = 'explosive';
        }
        
        bricks.push(new Brick(x, y, brickWidth, brickHeight, type));
      }
    }

    return bricks;
  }

  loadLevel(levelNumber) {
    try {
      // Ensure levelNumber is valid (1-based)
      const index = Math.max(0, Math.min(levelNumber - 1, this.levels.length - 1));
      this.currentLevel = index;

      // Create a new level data object
      const levelData = {
        name: this.levels[index].name,
        speed: this.levels[index].speed,
        backgroundColor: this.levels[index].backgroundColor,
        bricks: []
      };

      // Generate fresh bricks for this level
      switch(index) {
        case 0:
          levelData.bricks = this.createBasicLevel();
          break;
        case 1:
          levelData.bricks = this.createAdvancedLevel();
          break;
        case 2:
          levelData.bricks = this.createExpertLevel();
          break;
        case 3:
          levelData.bricks = this.createMasterLevel();
          break;
        default:
          levelData.bricks = this.createBasicLevel();
      }

      return levelData;
    } catch (error) {
      console.error('Error loading level:', error);
      // Return a basic level as fallback
      return {
        name: 'Basic Training',
        speed: 1,
        backgroundColor: '#1a1a1a',
        bricks: this.createBasicLevel()
      };
    }
  }

  getMaxLevel() {
    return this.levels.length;
  }
}

export default LevelManager;
