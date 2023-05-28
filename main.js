import './style.css'

const X_MAX = 400
const Y_MAX = 400
const rand = (min, max) => Math.random() * (max - min) + min;

function generatePoints(amount) {
  return Array.from({length: amount}, () => ({
    x: rand(0, X_MAX),
    y: rand(0, Y_MAX)
  }))
}

function drawSvg(guess, weights) {
  const randomPoints = generatePoints(200)
  const app = document.querySelector('#app')

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', X_MAX.toString())
  svg.setAttribute('height', Y_MAX.toString())

  randomPoints.map(point => {
    const circle = document.createElementNS(ns, 'circle')
    const circleAttrs = {
      cx: point.x,
      cy: point.y,
      r: '3',
      fill: guess(weights, point) === -1 ? "blue" : 'red'
    }
    Object.entries(circleAttrs).forEach(([qualifiedName, value]) => {
      circle.setAttribute(qualifiedName, value)
    })

    const line = document.createElementNS(ns, 'line')
    const lineAttrs = {
      x1: "0",
      x2: X_MAX.toString(),
      y1: '0',
      y2: Y_MAX.toString(),
      stroke: "purple"
    }
    Object.entries(lineAttrs).forEach(([qualifiedName, value]) => {
      line.setAttribute(qualifiedName, value)
    })

    svg.appendChild(circle)
    svg.appendChild(line)
  })

  app.appendChild(svg)
}

const team = (point) => point.x > point.y ? 1 : -1

function guess(weights, point) {
  const sum = point.x * weights.x + point.y * weights.y;
  return sum >= 0 ? 1 : -1;
}

function train(weights, point, team) {
  const guessResult = guess(weights, point)
  const error = team - guessResult
  const learningRate = 0.03
  return {
    x: weights.x + point.x * error * learningRate,
    y: weights.y + point.y * error * learningRate
  }
}

function trainedWeights() {
  const examples = generatePoints(10)
      .map(point => ({
        point,
        team: team(point)
      }))
  let currentWeights = {x: rand(-1, 1), y: rand(-1, 1)}
  for (const example of examples) {
    currentWeights = train(currentWeights, example.point, example.team)
  }
  return currentWeights
}


drawSvg(guess, trainedWeights())
