class SoundManager {
  constructor() {
    this.sounds = {};
    this.initialized = false;
    this.loadSounds();
  }

  async loadSounds() {
    try {
      // Create Audio objects
      this.brickHitSound = new Audio();
      this.paddleHitSound = new Audio();
      this.ballLaunchSound = new Audio();

      // Set sources
      this.brickHitSound.src = '/sounds/brick_hit.wav';
      this.paddleHitSound.src = '/sounds/paddle_hit.wav';
      this.ballLaunchSound.src = '/sounds/paddle_hit.wav'; // Reusing paddle hit sound for now

      // Add error handlers
      this.brickHitSound.onerror = () => console.warn('Failed to load brick hit sound');
      this.paddleHitSound.onerror = () => console.warn('Failed to load paddle hit sound');
      this.ballLaunchSound.onerror = () => console.warn('Failed to load ball launch sound');

      // Preload sounds
      await Promise.all([
        this.brickHitSound.load(),
        this.paddleHitSound.load(),
        this.ballLaunchSound.load()
      ]);

      this.initialized = true;
    } catch (error) {
      console.warn('Error initializing sounds:', error);
      // Set default values in case of failure
      this.brickHitSound = { play: () => {} };
      this.paddleHitSound = { play: () => {} };
      this.ballLaunchSound = { play: () => {} };
    }
  }

  playSound(sound, volume = 0.5) {
    if (!sound) return;
    
    try {
      const clone = sound.cloneNode();
      clone.volume = volume;
      clone.play().catch(error => {
        console.warn('Error playing sound:', error);
      });
    } catch (error) {
      console.warn('Error cloning sound:', error);
    }
  }

  playBrickHit() {
    this.playSound(this.brickHitSound, 0.5);
  }

  playPaddleHit() {
    this.playSound(this.paddleHitSound, 0.5);
  }

  playBallLaunch() {
    this.playSound(this.ballLaunchSound, 0.3);
  }

  cleanup() {
    try {
      // Clean up audio resources
      if (this.brickHitSound) {
        this.brickHitSound.src = '';
        this.brickHitSound = null;
      }
      if (this.paddleHitSound) {
        this.paddleHitSound.src = '';
        this.paddleHitSound = null;
      }
      if (this.ballLaunchSound) {
        this.ballLaunchSound.src = '';
        this.ballLaunchSound = null;
      }
      this.initialized = false;
    } catch (error) {
      console.warn('Error cleaning up sounds:', error);
    }
  }
}

export default SoundManager;
