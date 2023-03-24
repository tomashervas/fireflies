import { noise } from 'https://cdn.skypack.dev/@chriscourses/perlin-noise@1.0.5'
import Vector from "https://cdn.skypack.dev/vectory-lib@0.0.5";


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth-5
canvas.height = window.innerHeight-5

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66', '#5EEAD4']

// const mouse = {
//   x: innerWidth / 2,
//   y: innerHeight / 2
// }


// Event Listeners
//addEventListener('mousemove', (event) => {
 // mouse.x = event.clientX
  //mouse.y = event.clientY
//})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Particle {
  constructor({ x, y, radius, color, velocity }) {
    this.position = new Vector(x, y)
    this.prevPosition = new Vector(x, y)
    this.velocity = new Vector(velocity.x, velocity.y)
    this.acceleration = new Vector(0, 0)
    this.radius = radius
    this.color = color
    this.opacity = 0
  }

  draw() {
     //c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, 8, 8)

    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.moveTo(this.prevPosition.x, this.prevPosition.y)
    c.lineTo(this.position.x, this.position.y)
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.strokeStyle = colors[4]
    c.stroke()
    c.fillStyle = colors[4]
    c.fill()
    c.closePath()
    c.restore()
    this.prevPosition = this.position.copy()
  }

  update() {
    this.draw()

    let position = this.position.div(scale)
    let force
    if (
      position.x >= 0 &&
      position.x < columns &&
      position.y >= 0 &&
      position.y < rows
    ) {
      force = field[Math.floor(position.x)][Math.floor(position.y)]
    }

    this.acceleration = this.acceleration.add(force)

    this.velocity = this.velocity.add(this.acceleration)
    this.position = this.position.add(this.velocity)
    this.opacity +=0.001

    if (this.velocity.getLength() > 2) this.velocity.setLength(2)
    this.acceleration.setLength(0)

    // edge check
    if (this.position.x > canvas.width) {
      this.position.x = 0
      this.prevPosition.x = this.position.x
      this.prevPosition.y = this.position.y
    }
    if (this.position.x < 0) {
      this.position.x = canvas.width
      this.prevPosition.x = this.position.x
      this.prevPosition.y = this.position.y
    }
    if (this.position.y > canvas.height) {
      this.position.y = 0
      this.prevPosition.x = this.position.x
      this.prevPosition.y = this.position.y
    }
    if (this.position.y < 0) {
      this.position.y = canvas.height
      this.prevPosition.x = this.position.x
      this.prevPosition.y = this.position.y
    }
  }
}

// Implementation
let particles
//let increment = 0.01
//let time = 0
let scale = 30
let columns = Math.round(canvas.width / scale) + 1
let rows = Math.round(canvas.height / scale) + 1
let field = new Array(columns)

function init() {
  particles = []

  for (let i = 0; i < (canvas.width * canvas.height) / 1000; i++) {
    particles.push(
      new Particle({
        x: innerWidth * Math.random(),
        y: innerHeight * Math.random(),
        radius: 0.5,
        color: 'black',
        velocity: {
          x: Math.random(),
          y: Math.random()
        }
      })
    )
  }

  // init field
  for (let x = 0; x < columns; x++) {
    field[x] = new Array(columns)
    for (let y = 0; y < rows; y++) {
      let angle = noise(x / 20, y / 20) * Math.PI * 2
      let length = noise(x / 20, y / 20)
      field[x][y] = new Vector(0, 0)
      field[x][y].setLength(length)
      field[x][y].setAngle(angle)
    }
  }
  c.fillStyle = '#134E4A'
  c.fillRect(0, 0, canvas.width, canvas.height)
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = `rgba(19, 78, 74, 0.01)`
  c.fillRect(0, 0, canvas.width, canvas.height)

  particles.forEach((particle) => {
    particle.update()
  })

  //time += 2
}

init()
animate()
