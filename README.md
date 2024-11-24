# Brick Blaster

A Matrix-themed brick breaking game built with React and Canvas.

## Features

- Matrix-inspired visual design with glowing effects and digital rain
- Smooth gameplay mechanics with precise collision detection
- Dynamic sound effects and background music
- Multiple levels with increasing difficulty
- Responsive controls and intuitive user interface
- Score tracking and game state management
- Pause menu with Matrix-style animations

## Technologies Used

- React
- JavaScript (ES6+)
- HTML5 Canvas
- CSS3 with animations
- Web Audio API

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Navigate to the project directory:
```bash
cd brick_blaster2
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm start
```

## Game Controls

- **Left/Right Arrow Keys**: Move paddle
- **Space**: Launch ball / Start game
- **Escape**: Pause game
- **Space** (during game over): Restart game

## Development

The game is structured with the following main components:

- `GameCanvas`: Main game loop and rendering
- `Ball`, `Paddle`, `Brick`: Game entity classes
- `LevelManager`: Level loading and management
- `SoundManager`: Audio handling
- UI Components: Pause Menu, Game Over, Leaderboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
