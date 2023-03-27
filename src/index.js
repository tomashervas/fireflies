import { noise, noiseSeed } from '../node_modules/@chriscourses/perlin-noise/index.js'
import Vector from '../node_modules/vectory-lib/src/vector.js';
import { hexToHsl } from './helpers.js'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight


//const backColor = '#134E4A'
let bColor = '#0f172a'
let backColor;
let particleColor;
console.log(hexToHsl(bColor))

const setColors = () => {
  const {strinngHSL,h,s,l} = hexToHsl(bColor)
  backColor = strinngHSL
  particleColor = `hsl(${h},${s}%,${l+50}%)`
}

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
  //animate()
})

// Objects
class Particle {
  constructor({ x, y, radius, color, velocity }) {
    this.position = new Vector(x, y)
    //this.prevPosition = new Vector(x, y)
    this.velocity = new Vector(velocity.x, velocity.y)
    this.acceleration = new Vector(0, 0)
    this.radius = radius
    this.color = color
    this.opacity = 0
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    //c.moveTo(this.prevPosition.x, this.prevPosition.y)
    //c.lineTo(this.position.x, this.position.y)
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.strokeStyle = particleColor
    c.stroke()
    c.fillStyle = particleColor
    c.fill()
    c.closePath()
    c.restore()
    //this.prevPosition = this.position.copy()
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

    if(this.position.x > canvas.width || this.position.x < 0 || this.position.y > canvas.height || this.position.y < 0) {
      particles.splice(particles.indexOf(this), 1)
    }
    
  }
}

// Implementation
let particles
let field
//let increment = 0.01
//let time = 0
let scale = 10
let columns = Math.round(canvas.width / scale) + 1
let rows = Math.round(canvas.height / scale) + 1

function init() {
  particles = []
  field = []
  noiseSeed(Math.random()*100)

  for (let i = 0; i < (canvas.width * canvas.height) / 500; i++) {
    // init field
    for (let x = 0; x < columns; x++) {
      //if(x==0) console.log(field)
      field[x] = new Array(columns)
      for (let y = 0; y < rows; y++) {
        let angle = noise(x / 20, y / 20) * Math.PI * 2
        let length = noise(x / 20, y / 20)
        field[x][y] = new Vector(0, 0)
        field[x][y].setLength(length)
        field[x][y].setAngle(angle)
      }
    }
    
    particles.push(
      new Particle({
        x: innerWidth * Math.random(),
        y: innerHeight * Math.random(),
        radius: 1.5,
        color: 'black',
        velocity: {
          x: Math.random(),
          y: Math.random()
        }
      })
    )
  }

  c.fillStyle = backColor
  c.fillRect(0, 0, canvas.width, canvas.height)
}

function animate() {
  requestAnimationFrame(animate)
  //c.fillStyle = `rgba(19, 78, 74, 0.01)`
  //c.fillRect(0, 0, canvas.width, canvas.height)

  particles.forEach((particle) => {
    particle.update()
  })
}

setColors()
init()
animate()


const buttonList = document.getElementById("button-list");
buttonList.addEventListener("click", (event) => {
  // Verificar si el elemento clickeado es un botón
  if (event.target.nodeName === "BUTTON") {
    // Obtener el valor del botón clickeado
    const value = event.target.value;
    bColor = value;
    setColors();
    init();
    console.log(value)
    
  }
});


// Obtener la lista y los botones
const buttonListInitial = document.getElementById("button-list");
const buttons = buttonListInitial.querySelectorAll("button");

// Cambiar el color de fondo de cada botón
buttons.forEach((button) => {
  button.style.backgroundColor = button.value;
});

const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => {
  init()
})