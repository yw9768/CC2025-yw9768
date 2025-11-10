
let pMapper;
let quadLeft, quadRight; // my quad surfaces

// skull variables
let skull1X, skull1Y, skull1BaseSize;
let skull1NoiseSize, skull1Speed;
let skull2X, skull2Y, skull2BaseSize;
let skull2NoiseSize, skull2Speed;
let skull3X, skull3Y, skull3BaseSize;
let skull3NoiseSize, skull3Speed;
let skull4X, skull4Y, skull4BaseSize;
let skull4NoiseSize, skull4Speed;
let skull5X, skull5Y, skull5BaseSize;
let skull5NoiseSize, skull5Speed;
let skull6X, skull6Y, skull6BaseSize;
let skull6NoiseSize, skull6Speed;

// eye variables
let eyeCenterX, eyeCenterY;
let eyeOrbitNoiseX, eyeOrbitNoiseY;
let eyeIrisPulseT;
let eyeOrbitSpeed;
let irisColorNoiseT;
let pupilDrunkX, pupilDrunkY;
let pupilDrunkR;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // create mapper object
  pMapper = createProjectionMapper(this);
  pMapper.load("map.json");

  // create "quads" for each surface of your projection
  quadLeft = pMapper.createQuadMap(400, 400);
  quadRight = pMapper.createQuadMap(400, 400);

  // initialize skull variables
  skull1X = 100;
  skull1Y = 100;
  skull1BaseSize = 80;  
  skull1NoiseSize = 0;
  skull1Speed = 0.005;
  
  skull2X = 300;
  skull2Y = 100;
  skull2BaseSize = 75;  
  skull2NoiseSize = 200;
  skull2Speed = 0.006;
  
  skull3X = 100;
  skull3Y = 250;
  skull3BaseSize = 85;  
  skull3NoiseSize = 400;
  skull3Speed = 0.004;
  
  skull4X = 300;
  skull4Y = 250;
  skull4BaseSize = 78;  
  skull4NoiseSize = 600;
  skull4Speed = 0.007;
  
  skull5X = 200;
  skull5Y = 170;
  skull5BaseSize = 82;  
  skull5NoiseSize = 800;
  skull5Speed = 0.005;
  
  skull6X = 200;
  skull6Y = 330;
  skull6BaseSize = 76;  
  skull6NoiseSize = 1000;
  skull6Speed = 0.006;

  // initialize eye variables
  eyeCenterX = 200;
  eyeCenterY = 200;
  
  eyeOrbitNoiseX = random(1000);
  eyeOrbitNoiseY = random(1000);
  eyeOrbitSpeed = 0.008;
  
  eyeIrisPulseT = 0;
  irisColorNoiseT = random(1000);
  
  pupilDrunkX = 0;
  pupilDrunkY = 0;
  pupilDrunkR = 14;
}

function draw() {
  background(0);

  // display each of the projection surfaces in draw
  quadLeft.displaySketch(skullSketch);
  quadRight.displaySketch(eyeSketch);
  
  // update skull noise values
  skull1NoiseSize = skull1NoiseSize + skull1Speed;
  skull2NoiseSize = skull2NoiseSize + skull2Speed;
  skull3NoiseSize = skull3NoiseSize + skull3Speed;
  skull4NoiseSize = skull4NoiseSize + skull4Speed;
  skull5NoiseSize = skull5NoiseSize + skull5Speed;
  skull6NoiseSize = skull6NoiseSize + skull6Speed;
  
  // update eye values
  eyeOrbitNoiseX = eyeOrbitNoiseX + eyeOrbitSpeed;
  eyeOrbitNoiseY = eyeOrbitNoiseY + eyeOrbitSpeed;
  eyeIrisPulseT = eyeIrisPulseT + 0.03;
  irisColorNoiseT = irisColorNoiseT + 0.02;
  
  pupilDrunkX = pupilDrunkX + random(-1.5, 1.5);
  pupilDrunkY = pupilDrunkY + random(-1.5, 1.5);
  
  if (pupilDrunkX > 8) pupilDrunkX = 8;
  if (pupilDrunkX < -8) pupilDrunkX = -8;
  if (pupilDrunkY > 8) pupilDrunkY = 8;
  if (pupilDrunkY < -8) pupilDrunkY = -8;
}

function skullSketch(pg) {
  pg.clear();
  pg.push();
  
  pg.background(0);
  
  displaySkull(pg, skull1X, skull1Y, skull1BaseSize, skull1NoiseSize);
  displaySkull(pg, skull2X, skull2Y, skull2BaseSize, skull2NoiseSize);
  displaySkull(pg, skull3X, skull3Y, skull3BaseSize, skull3NoiseSize);
  displaySkull(pg, skull4X, skull4Y, skull4BaseSize, skull4NoiseSize);
  displaySkull(pg, skull5X, skull5Y, skull5BaseSize, skull5NoiseSize);
  displaySkull(pg, skull6X, skull6Y, skull6BaseSize, skull6NoiseSize);
  
  pg.pop();
}

function displaySkull(pg, skullX, skullY, baseSize, noiseSize) {
  pg.push();
  
  let skullSize = noise(noiseSize) * baseSize * 1.1 + baseSize * 0.5;
  
  pg.translate(skullX, skullY);
  
  pg.noStroke();
  pg.fill(255);
  pg.ellipse(0, -skullSize * 0.3, skullSize, skullSize * 0.7);
  pg.rect(-skullSize * 0.25, -skullSize * 0.2, skullSize * 0.5, skullSize * 0.37);
  
  pg.fill(0);
  pg.ellipse(-skullSize * 0.25, -skullSize * 0.35, skullSize * 0.17, skullSize * 0.17);
  pg.ellipse(skullSize * 0.25, -skullSize * 0.35, skullSize * 0.17, skullSize * 0.17);
  
  let toothWidth = skullSize * 0.025; 
  pg.rect(-skullSize * 0.3, skullSize * 0.05, toothWidth, skullSize * 0.15);
  pg.rect(-skullSize * 0.2, skullSize * 0.05, toothWidth, skullSize * 0.15);
  pg.rect(-skullSize * 0.1, skullSize * 0.05, toothWidth, skullSize * 0.15);
  pg.rect(0, skullSize * 0.05, toothWidth, skullSize * 0.15);
  pg.rect(skullSize * 0.1, skullSize * 0.05, toothWidth, skullSize * 0.15);
  pg.rect(skullSize * 0.2, skullSize * 0.05, toothWidth, skullSize * 0.15);
  pg.rect(skullSize * 0.3, skullSize * 0.05, toothWidth, skullSize * 0.15);
  
  pg.pop();
}

function eyeSketch(pg) {
  pg.clear();
  pg.push();
  
  pg.background(0);
  
  let eyeBallX = eyeCenterX + map(noise(eyeOrbitNoiseX), 0, 1, -100, 100);
  let eyeBallY = eyeCenterY + map(noise(eyeOrbitNoiseY), 0, 1, -100, 100);
  
  pg.noStroke();
  
  // whites of eyes
  pg.fill(240, 235, 220);
  pg.ellipse(eyeBallX, eyeBallY, 140, 140);
  
  // blood vessels
  pg.push();
  pg.translate(eyeBallX, eyeBallY);
  pg.strokeWeight(1.5);
  
  pg.stroke(200, 30, 30, 120);
  pg.line(15, -8, 45, -35);
  pg.line(45, -35, 55, -50);
  pg.line(45, -35, 58, -42);
  
  pg.line(-12, -10, -38, -40);
  pg.line(-38, -40, -50, -55);
  pg.line(-38, -40, -52, -45);
  
  pg.line(18, 12, 42, 38);
  pg.line(42, 38, 48, 52);
  pg.line(42, 38, 55, 45);
  
  pg.line(-15, 15, -40, 42);
  pg.line(-40, 42, -52, 50);
  pg.line(-40, 42, -48, 56);
  
  pg.strokeWeight(1);
  pg.stroke(180, 40, 40, 60);
  pg.line(8, -20, 25, -45);
  pg.line(-10, -18, -28, -48);
  pg.line(10, 22, 30, 50);
  pg.line(-8, 20, -25, 48);
  pg.pop();
  
  pg.noStroke();
  
  // iris
  let eyeIrisR = map(sin(eyeIrisPulseT), -1, 1, 32, 55);
  
  let irisColorCycle = noise(irisColorNoiseT); 
  let irisR = lerp(150, 220, irisColorCycle);
  let irisG = lerp(20, 50, irisColorCycle);
  let irisB = lerp(20, 30, irisColorCycle);
  
  pg.fill(irisR, irisG, irisB);
  pg.ellipse(eyeBallX, eyeBallY, eyeIrisR * 2, eyeIrisR * 2);
  
  // pupil
  pg.fill(10, 10, 10);
  pg.ellipse(eyeBallX + pupilDrunkX, eyeBallY + pupilDrunkY, pupilDrunkR * 2, pupilDrunkR * 2);
  
  // highlight
  pg.fill(255, 255, 255, 200);
  pg.ellipse(eyeBallX - 18, eyeBallY - 20, 15, 10);
  
  pg.pop();
}

function keyPressed() {
  switch (key) {
    case "c":
      pMapper.toggleCalibration();
      break;
    case "f":
      let fs = fullscreen();
      fullscreen(!fs);
      break;
    case "l":
      pMapper.load("map.json");
      break;
    case "s":
      pMapper.save("map.json");
      break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}