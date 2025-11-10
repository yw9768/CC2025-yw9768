// eye ball//

let eyeCenterX, eyeCenterY;
let eyeOrbitNoiseX, eyeOrbitNoiseY; // In response to noise, the entire eye moves
let eyeIrisPulseT;//Iris pulse (the red one)
let eyeOrbitSpeed;//The speed of whole eye movement
let irisColorNoiseT; // Iris color change (dark red - light red)

// set the variables of drunk walk of pupil
let pupilDrunkX, pupilDrunkY;
let pupilDrunkR;

function setup() {
  createCanvas(400, 400);
  
  //Set the center of the eyeball to the center of the canvas
  eyeCenterX = 200;
  eyeCenterY = 200;
  
  //Use noise to create eye movements
  eyeOrbitNoiseX = random();
  eyeOrbitNoiseY = random();
  eyeOrbitSpeed = 0.008;//The speed of eye movement
  
  eyeIrisPulseT = 0
  irisColorNoiseT = random(); 
  
 // Initialize pupil drunk walk position (relative to iris center)
  pupilDrunkX = 0;
  pupilDrunkY = 0;
  pupilDrunkR = 14;//Pupil radius
  
}

function draw() {
  
  background(0);
  
  // Increase the noise to keep eye constantly moving
  eyeOrbitNoiseX = eyeOrbitNoiseX + eyeOrbitSpeed;
  eyeOrbitNoiseY = eyeOrbitNoiseY + eyeOrbitSpeed;
  
  // Calculate the position of the eyeball 
  let eyeBallX = eyeCenterX + map(noise(eyeOrbitNoiseX), 0, 1, -100, 100);
  let eyeBallY = eyeCenterY + map(noise(eyeOrbitNoiseY), 0, 1, -100, 100);
  
  noStroke();
  
  // 1. start drawinng the whites of the eyes//
  fill(240, 235, 220);
  ellipse(eyeBallX, eyeBallY, 140, 140);
  
  // 2.start drawinng blood vessels//
  push();
  translate(eyeBallX, eyeBallY);
  strokeWeight(1.5);
  
  //vessel 1 （right top ）
  stroke(200, 30, 30, 120);
  line(15, -8, 45, -35);
  line(45, -35, 55, -50);
  line(45, -35, 58, -42);
  
  // vessel 2（left top）
  line(-12, -10, -38, -40);
  line(-38, -40, -50, -55);
  line(-38, -40, -52, -45);
  
  // vessel 3（right botton）
  line(18, 12, 42, 38);
  line(42, 38, 48, 52);
  line(42, 38, 55, 45);
  
  // vessel 4（left botton）
  line(-15, 15, -40, 42);
  line(-40, 42, -52, 50);
  line(-40, 42, -48, 56);
  
  // 4 extra blood vessels
  strokeWeight(1);
  stroke(180, 40, 40, 60);
  line(8, -20, 25, -45);//（right top ）
  line(-10, -18, -28, -48);//（left top）
  line(10, 22, 30, 50);//（right botton）
  line(-8, 20, -25, 48);//（left botton）

  pop();
  
  noStroke();
  
  //3. start drawinng iris//
  eyeIrisPulseT = eyeIrisPulseT + 0.03; // Iris pulse speed
  let eyeIrisR = map(sin(eyeIrisPulseT), -1, 1, 32, 55);// Let the iris size vary between 32 and 55
  
  
  irisColorNoiseT = irisColorNoiseT + 0.02;//Set the speed of color change
  let irisColorCycle = noise(irisColorNoiseT); 
  let irisR = lerp(150, 220, irisColorCycle);//set the change of two reds color
  let irisG = lerp(20, 50, irisColorCycle);
  let irisB = lerp(20, 30, irisColorCycle);
  
  fill(irisR, irisG, irisB);
  ellipse(eyeBallX, eyeBallY, eyeIrisR * 2, eyeIrisR * 2);
  
  //4. start drawinng pupil//
  pupilDrunkX = pupilDrunkX + random(-1.5, 1.5);//Set the pupil to perform the drunk walk
  pupilDrunkY = pupilDrunkY + random(-1.5, 1.5);
  
  // Set a very small value so that 
  // the pupil moves within the range of -8 to 8 
  // and not exceeding the iris
  
  //set the range of pupilX
  if (pupilDrunkX > 8) {
    pupilDrunkX = 8;
  }
  if (pupilDrunkX < -8) {
    pupilDrunkX = -8;
  }
  
  //set the range of pupilY
  if (pupilDrunkY > 8) {
    pupilDrunkY = 8;
  }
  if (pupilDrunkY < -8) {
    pupilDrunkY = -8;
  }
  
  fill(10, 10, 10);
  ellipse(eyeBallX + pupilDrunkX, eyeBallY + pupilDrunkY, pupilDrunkR * 2, pupilDrunkR * 2);//draw the pupil

   //5. start drawinng the hightlight point on the eyeball//
  fill(255, 255, 255, 200);
  ellipse(eyeBallX - 18, eyeBallY - 20, 15, 10);
}