import { noise, noiseSeed } from '../node_modules/@chriscourses/perlin-noise/index.js'
import Vector from '../node_modules/vectory-lib/src/vector.js';
import { hexToHsl } from './helpers.js';
import Particle from './particle.js';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

if(window.innerWidth > 1024) {
  console.log('ancho: ' + window.innerWidth, 'y alto: ' + window.innerHeight)
  canvas.width = 1024
  canvas.height = 768
} else {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}


//const backColor = '#134E4A'
let bColor = '#0f172a'
let backColor;
let particleColor;
let rangeParticleColor = 8;
let firstTime = true;
console.log(hexToHsl(bColor))

const setColors = () => {
  const {strinngHSL,h,s,l} = hexToHsl(bColor)
  console.log(hexToHsl(bColor))
  const factor = rangeColors(rangeParticleColor, l)
  console.log(factor)

  backColor = strinngHSL
  particleColor = `hsl(${h},${s}%,${l+factor}%)`
}

const rangeColors = (range, luminosity)=>{
  if(range == 5) return 10
  else if (range > 5) {
    return ((100 - luminosity) / 5) * (range - 5)
  }
  return - ((luminosity / 5) * (5 - range))
}

// addEventListener('resize', () => {
//   canvas.width = innerWidth
//   canvas.height = innerHeight

//   init()
// })

// Implementation
let particles
let field
//entre 300 y 1000
let particlesFactor = 510
//let increment = 0.01
//let time = 0
let scale = 15
let newScale = scale
scale > 20 ? newScale = 20 : newScale
let columns = Math.round(canvas.width / newScale) + 1
let rows = Math.round(canvas.height / newScale) + 1

function init() {
  particles = []
  field = []
  noiseSeed(Math.random()*100)
  console.log('numero particulas ', (canvas.width * canvas.height) / particlesFactor)

  for (let i = 0; i < (canvas.width * canvas.height) / particlesFactor; i++) {
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
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        radius: 1.5,
        color: 'black',
        velocity: {
          x: Math.random(),
          y: Math.random()
        }
      }, c, field, particleColor, scale, columns, rows, canvas, particles)
    )
  }

  c.fillStyle = backColor
  c.fillRect(0, 0, canvas.width, canvas.height)
}

function animate() {
  requestAnimationFrame(animate)
  particles.forEach((particle) => {
    particle.update()
    if(particles.length == 0 && firstTime) {
      firstTime = false
      navbar.classList.add('opacity05-1')
      setTimeout(() => {
        navbar.classList.add('opacity05')
        navbar.classList.remove('opacity05-1')
      }, 2100)
    }
  })
}

setColors()
init()
animate()

const setColorButton = (event) => {
  if (event.target.nodeName === "BUTTON") {
    // Obtener el valor del botón clickeado
    const value = event.target.value;
    bColor = value;
    setColors();
    init();
    console.log(value)
  }
}

const buttonList = document.getElementById("button-list");
buttonList.addEventListener("click", setColorButton);

// Cambiar el color de fondo de cada botón
buttonList.querySelectorAll("button").forEach((button) => {
  if(button.value == '#facc15' || button.value == '#84cc16') button.style.color = '#0f172a'
  button.style.backgroundColor = button.value;
});
const listParticleColor = document.getElementById("listParticleColor");

listParticleColor.querySelectorAll("button").forEach((button) => {
  button.style.backgroundColor = button.value;
})

listParticleColor.addEventListener("click", (event)=>{
  if (event.target.nodeName === "BUTTON") {
    particleColor = event.target.value;
    init();
    console.log(particleColor)
  }
})



const navbar = document.querySelector(".navbar");
const menu = document.querySelector(".menu");


const menuBtn = document.getElementById("menuBtn");
menuBtn.addEventListener("click", () => {
  menu.classList.toggle("visible");
  navbar.classList.toggle("opacity1");
})

canvas.addEventListener("click", (event) => {
  if(navbar.classList.contains('opacity05') && !menu.classList.contains('visible')) {
    navbar.classList.add('reopacity')
    setTimeout(() => {
      navbar.classList.remove('reopacity')
    }, 3000);
  }
  if( menu.classList.contains('visible')) {
    menu.classList.toggle("visible");
    navbar.classList.toggle("opacity1");
  }
})

const rangeLum = document.getElementById('rangeParticleSlider')
const labelLuminosity = document.getElementById('labelLuminosidad')

const rangeNum = document.getElementById('rangeNumParticles')
const labelNumero = document.getElementById('labelNumero')
labelNumero.innerHTML = Math.round((canvas.width * canvas.height) / particlesFactor)

const rangeScale = document.getElementById('rangeScale')
const labelScale = document.getElementById('labelScale')

rangeLum.addEventListener('change', () => {
  rangeParticleColor = rangeLum.value;
  labelLuminosity.innerHTML = rangeParticleColor
  setColors();
  init()
  console.log('El valor ha cambiado a:', rangeParticleColor)
})

rangeNum.addEventListener('change', () => {
  particlesFactor = rangeNum.value == 1 ? 900 : 900 - (rangeNum.value * 130);
  labelNumero.innerHTML = Math.round((canvas.width * canvas.height) / particlesFactor)
  console.log('El factor ha cambiado a:', particlesFactor)
  init()
})

rangeScale.addEventListener('change', () => {
  scale = (rangeScale.value * 5) + 5
  newScale = scale;
  columns = Math.round(canvas.width / newScale) + 1
  rows = Math.round(canvas.height / newScale) + 1
  labelScale.innerHTML = scale
  init()
  console.log('El factor de escala ha cambiado a:', scale)
})