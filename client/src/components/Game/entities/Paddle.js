class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 15; // Slightly reduced height
    this.speed = 1200;
    this.initialX = x;
    this.initialY = y;
    this.leftPressed = false;
    this.rightPressed = false;
    this.canvasWidth = 800;
    this.glowIntensity = 0;
    this.glowDirection = 1;
    this.maxGlow = 0.4;
    this.minGlow = 0.2;
    this.glowSpeed = 0.02;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.leftPressed = false;
    this.rightPressed = false;
  }

  moveLeft() {
    this.leftPressed = true;
  }

  moveRight() {
    this.rightPressed = true;
  }

  stopLeft() {
    this.leftPressed = false;
  }

  stopRight() {
    this.rightPressed = false;
  }

  update(deltaTime) {
    if (this.leftPressed) {
      this.x = Math.max(0, this.x - this.speed * deltaTime);
    }
    if (this.rightPressed) {
      this.x = Math.min(this.canvasWidth - this.width, this.x + this.speed * deltaTime);
    }

    // Update glow effect
    this.glowIntensity += this.glowDirection * this.glowSpeed;
    if (this.glowIntensity >= this.maxGlow) {
      this.glowIntensity = this.maxGlow;
      this.glowDirection = -1;
    } else if (this.glowIntensity <= this.minGlow) {
      this.glowIntensity = this.minGlow;
      this.glowDirection = 1;
    }
  }

  draw(ctx) {
    ctx.save();

    // Draw outer glow
    const gradient = ctx.createLinearGradient(
      this.x, this.y - 10,
      this.x, this.y + this.height + 10
    );
    gradient.addColorStop(0, `rgba(0, 255, 0, ${this.glowIntensity})`);
    gradient.addColorStop(0.5, `rgba(0, 255, 0, ${this.glowIntensity * 0.5})`);
    gradient.addColorStop(1, `rgba(0, 255, 0, ${this.glowIntensity})`);

    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 15;
    ctx.fillStyle = gradient;
    ctx.fillRect(
      Math.round(this.x - 5),
      Math.round(this.y - 5),
      this.width + 10,
      this.height + 10
    );

    // Draw main paddle
    const mainGradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height
    );
    mainGradient.addColorStop(0, '#00ff00');
    mainGradient.addColorStop(0.5, '#00dd00');
    mainGradient.addColorStop(1, '#00ff00');

    ctx.shadowBlur = 0;
    ctx.fillStyle = mainGradient;
    ctx.fillRect(
      Math.round(this.x),
      Math.round(this.y),
      this.width,
      this.height
    );

    // Add digital effect lines
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < this.width; i += 4) {
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(
        Math.round(this.x + i),
        Math.round(this.y),
        1,
        this.height
      );
    }

    // Add highlight
    ctx.globalAlpha = 0.2;
    const highlightGradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x, this.y + this.height / 3
    );
    highlightGradient.addColorStop(0, '#ffffff');
    highlightGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = highlightGradient;
    ctx.fillRect(
      Math.round(this.x),
      Math.round(this.y),
      this.width,
      this.height / 3
    );

    ctx.restore();
  }
}

export default Paddle;
