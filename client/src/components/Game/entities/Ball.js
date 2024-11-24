class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 8;
    this.baseSpeed = 300; // Reduced base speed
    this.speed = this.baseSpeed;
    this.dx = 0;
    this.dy = 0;
    this.isLaunched = false;
    this.canvasWidth = 800;
    this.canvasHeight = 600;
    this.initialX = x;
    this.initialY = y;
    this.lastCollisionTime = 0;
    this.collisionCooldown = 50; // 50ms cooldown between collisions
  }

  draw(ctx) {
    // Draw glow effect
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.fill();
    ctx.closePath();

    // Draw outer glow
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 0, 0.4)';
    ctx.fill();
    ctx.closePath();

    // Draw main ball
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );
    gradient.addColorStop(0, '#00ff00');
    gradient.addColorStop(1, '#00cc00');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Add highlight
    ctx.beginPath();
    ctx.arc(this.x - this.radius/3, this.y - this.radius/3, this.radius/4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

  update(deltaTime) {
    if (!this.isLaunched) return;

    // Calculate potential new position
    const newX = this.x + this.dx * deltaTime;
    const newY = this.y + this.dy * deltaTime;

    // Handle wall collisions with position correction
    if (newX - this.radius <= 0) {
      this.x = this.radius;
      this.dx = Math.abs(this.dx);
    } else if (newX + this.radius >= this.canvasWidth) {
      this.x = this.canvasWidth - this.radius;
      this.dx = -Math.abs(this.dx);
    } else {
      this.x = newX;
    }

    if (newY - this.radius <= 0) {
      this.y = this.radius;
      this.dy = Math.abs(this.dy);
    } else {
      this.y = newY;
    }

    // Normalize speed
    const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (Math.abs(currentSpeed - this.speed) > 0.1) {
      const speedFactor = this.speed / currentSpeed;
      this.dx *= speedFactor;
      this.dy *= speedFactor;
    }
  }

  launch() {
    if (!this.isLaunched) {
      this.isLaunched = true;
      const angle = -Math.PI / 4; // -45 degrees
      this.dx = this.speed * Math.cos(angle);
      this.dy = this.speed * Math.sin(angle);
    }
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.dx = 0;
    this.dy = 0;
    this.isLaunched = false;
    this.speed = this.baseSpeed;
    this.lastCollisionTime = 0;
  }

  stickToPaddle(paddle) {
    if (!this.isLaunched) {
      this.x = paddle.x + paddle.width / 2;
      this.y = paddle.y - this.radius;
    }
  }

  bounceOffPaddle(paddle) {
    if (!this.isLaunched) return;

    // Calculate relative position of ball hit on paddle
    const relativeIntersectX = (this.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    
    // Calculate bounce angle (-60 to 60 degrees)
    const bounceAngle = relativeIntersectX * Math.PI / 3;
    
    // Set new velocity with position correction
    this.dx = this.speed * Math.sin(bounceAngle);
    this.dy = -Math.abs(this.speed * Math.cos(bounceAngle));
    
    // Ensure ball is above paddle
    this.y = paddle.y - this.radius;
  }

  bounceOffBrick(brick) {
    // Check collision cooldown
    const now = Date.now();
    if (now - this.lastCollisionTime < this.collisionCooldown) {
      return false;
    }

    // Calculate the center points and half dimensions
    const ballCenterX = this.x;
    const ballCenterY = this.y;
    const brickCenterX = brick.x + brick.width / 2;
    const brickCenterY = brick.y + brick.height / 2;
    const brickHalfWidth = brick.width / 2;
    const brickHalfHeight = brick.height / 2;

    // Calculate the difference between centers
    const dx = ballCenterX - brickCenterX;
    const dy = ballCenterY - brickCenterY;

    // Calculate overlap on each axis
    const overlapX = brickHalfWidth + this.radius - Math.abs(dx);
    const overlapY = brickHalfHeight + this.radius - Math.abs(dy);

    // Position correction and velocity update
    if (overlapX < overlapY) {
      // Horizontal collision
      this.dx = Math.abs(this.dx) * (dx > 0 ? 1 : -1);
      this.x += dx > 0 ? overlapX : -overlapX;
    } else {
      // Vertical collision
      this.dy = Math.abs(this.dy) * (dy > 0 ? 1 : -1);
      this.y += dy > 0 ? overlapY : -overlapY;
    }

    this.lastCollisionTime = now;
    return true;
  }

  checkPaddleCollision(paddle) {
    return (
      this.isLaunched &&
      this.x + this.radius > paddle.x &&
      this.x - this.radius < paddle.x + paddle.width &&
      this.y + this.radius > paddle.y &&
      this.y - this.radius < paddle.y + paddle.height
    );
  }

  checkBrickCollision(brick) {
    if (brick.isDestroyed()) return false;

    // Calculate the closest point on the brick to the ball
    const closestX = Math.max(brick.x, Math.min(this.x, brick.x + brick.width));
    const closestY = Math.max(brick.y, Math.min(this.y, brick.y + brick.height));

    // Calculate the distance between the ball's center and this closest point
    const distanceX = this.x - closestX;
    const distanceY = this.y - closestY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // If the distance is less than the ball's radius, collision detected
    return distance <= this.radius;
  }
}

export default Ball;
