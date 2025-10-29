// candle 1
let candle1X, candle1Y;
let candle1FlamePhase;

// candle 2
let candle2X, candle2Y;
let candle2FlamePhase;

// candle 3
let candle3X, candle3Y;
let candle3FlamePhase;

function setup() {
  createCanvas(400, 400);
  noStroke();
  
  // set the position and flame phase of candle 1 (left one)
  candle1X = 120;
  candle1Y = 300;
  candle1FlamePhase = 0;
  
  // set the position and flame phase of candle 2 (right one)
  candle2X = 280;
  candle2Y = 300;
  candle2FlamePhase = 0;
  
  // set the position and flame phase of candle 3 (middle top)
  candle3X = 200;
  candle3Y = 220;
  candle3FlamePhase = 0;
}

function draw() {
  background(0);
  
  // display and update candle 1
  displayCandle(candle1X, candle1Y, candle1FlamePhase);
  candle1FlamePhase = candle1FlamePhase + 0.03;
  
  // display and update candle 2
  displayCandle(candle2X, candle2Y, candle2FlamePhase);
  candle2FlamePhase = candle2FlamePhase + 0.025;
  
  // display and update candle 3
  displayCandle(candle3X, candle3Y, candle3FlamePhase);
  candle3FlamePhase = candle3FlamePhase + 0.02;
}

function displayCandle(candleX, candleY, flamePhase) {
  push();
  
  // draw candle body
  rectMode(CENTER);
  fill(220, 215, 205);
  rect(candleX, candleY, 40, 120, 8);
  
  // draw wick
  fill(25, 25, 30);
  rect(candleX, candleY - 65, 4, 16, 2);
  
  // calculate flame size（for breathing effect）
  let flameH = map(sin(flamePhase), -1, 1, 40, 80);
  let flameW = map(sin(flamePhase), -1, 1, 24, 28);
  
  // calculate flame color using noise() and lerp()
  let t = millis() * 0.0005;
  let colorCycle = noise(t);
  let outerR = lerp(180, 100, colorCycle);
  let outerG = lerp(80, 200, colorCycle);
  let outerB = lerp(0, 120, colorCycle);
  
  // draw flame
  translate(candleX, candleY - 75);
  
  // outer flame
  fill(outerR, outerG, outerB, 200);
  ellipse(0, -flameH * 0.25, flameW, flameH);
  
  // inner flame (brighter)
  fill(outerR + 30, outerG + 50, outerB + 60, 220);
  ellipse(0, -flameH * 0.18, flameW * 0.6, flameH * 0.65);
  
  pop();
}