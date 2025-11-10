// candle//

// set varibles of candle 1
let candle1X, candle1Y;
let candle1FlamePhase; //set how much the flame flickers

// set varibles of candle 2
let candle2X, candle2Y;
let candle2FlamePhase;

// set varibles of candle 3
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
  candle1FlamePhase = candle1FlamePhase + 0.03;//fastest flame flicker 
  
  // display and update candle 2
  displayCandle(candle2X, candle2Y, candle2FlamePhase);
  candle2FlamePhase = candle2FlamePhase + 0.025;//medium flame flicker 
  
  // display and update candle 3
  displayCandle(candle3X, candle3Y, candle3FlamePhase);
  candle3FlamePhase = candle3FlamePhase + 0.02;//slowest flame flicker 
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
  // color change: orange - green
  let t = millis() * 0.0005;
  let colorCycle = noise(t);
  let outerR = lerp(180, 100, colorCycle);
  let outerG = lerp(80, 200, colorCycle);
  let outerB = lerp(0, 120, colorCycle);
  
  // draw flame
  translate(candleX, candleY - 80);
  
  // outer flame
  fill(outerR, outerG, outerB, 200);
  ellipse(0, -flameH * 0.25, flameW, flameH);
  //I move the flame center upwards by 25% of the flame height,
  // so 75% of the flame will be on top,
  // and the remaining 25% of the flame overlapping with the wick at the bottom

  
  // inner flame (brighter)
  fill(outerR + 30, outerG + 30, outerB + 30, 220);
  ellipse(0, -flameH * 0.2, flameW * 0.6, flameH * 0.7);
  
  pop();
}