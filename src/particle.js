import Vector from '../node_modules/vectory-lib/src/vector.js';

export default class Particle {
    constructor({ x, y, radius, color, velocity }, c, field, particleColor, scale, columns, rows, canvas, particles) {
      this.position = new Vector(x, y)
      //this.prevPosition = new Vector(x, y)
      this.velocity = new Vector(velocity.x, velocity.y)
      this.acceleration = new Vector(0, 0)
      this.radius = radius
      this.color = color
      this.opacity = 0
      this.c = c
      this.field = field
      this.particleColor = particleColor
      this.scale = scale
      this.columns = columns
      this.rows = rows
      this.canvas = canvas
      this.particles = particles
    }
  
    draw() {
      this.c.save()
      this.c.globalAlpha = this.opacity
      this.c.beginPath()
      //c.moveTo(this.prevPosition.x, this.prevPosition.y)
      //c.lineTo(this.position.x, this.position.y)
      this.c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
      this.c.strokeStyle = this.particleColor
      this.c.stroke()
      this.c.fillStyle = this.particleColor
      this.c.fill()
      this.c.closePath()
      this.c.restore()
      //this.prevPosition = this.position.copy()
    }
  
    update() {
      this.draw()
  
      let position = this.position.div(this.scale)
      let force
      if (
        position.x >= 0 &&
        position.x < this.columns &&
        position.y >= 0 &&
        position.y < this.rows
      ) {
        force = this.field[Math.floor(position.x)][Math.floor(position.y)]
      }
  
      this.acceleration = this.acceleration.add(force)
  
      this.velocity = this.velocity.add(this.acceleration)
      this.position = this.position.add(this.velocity)
      this.opacity +=0.001
  
      if (this.velocity.getLength() > 2) this.velocity.setLength(2)
      this.acceleration.setLength(0)
  
      // edge check
  
      if(this.position.x > this.canvas.width || this.position.x < 0 || this.position.y > this.canvas.height || this.position.y < 0) {
        this.particles.splice(this.particles.indexOf(this), 1)
    }
  }

}