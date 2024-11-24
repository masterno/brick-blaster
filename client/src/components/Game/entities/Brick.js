class Brick {
  constructor(x, y, width = 80, height = 20, type = 'standard') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.hitPoints = this.getInitialHitPoints();
    this.destroyed = false;
    this.color = this.getColor();
  }

  draw(ctx) {
    if (this.destroyed) return;
    
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  getInitialHitPoints() {
    switch (this.type) {
      case 'durable':
        return 2;
      case 'unbreakable':
        return Infinity;
      case 'explosive':
        return 1;
      case 'standard':
      default:
        return 1;
    }
  }

  getColor() {
    switch (this.type) {
      case 'durable':
        return this.hitPoints === 2 ? '#FFD700' : '#FFA500'; // Gold -> Orange
      case 'unbreakable':
        return '#4a4a4a'; // Darker gray
      case 'explosive':
        return '#FF3B30'; // Bright red
      case 'standard':
      default:
        return '#4CD964'; // Bright green
    }
  }

  hit() {
    if (this.type === 'unbreakable') return false;
    
    this.hitPoints--;
    this.color = this.getColor();
    
    if (this.hitPoints <= 0) {
      this.destroyed = true;
      return true;
    }
    
    return false;
  }

  isDestroyed() {
    return this.destroyed;
  }

  isExplosive() {
    return this.type === 'explosive';
  }
}

export default Brick;
