// skull//

// variables for skull 1
let skull1X, skull1Y, skull1BaseSize;// set X position, Y position, and base size
let skull1NoiseSize, skull1Speed;// set noise, speed

// variables for skull 2
let skull2X, skull2Y, skull2BaseSize;
let skull2NoiseSize, skull2Speed;

// variables for skull 3
let skull3X, skull3Y, skull3BaseSize;
let skull3NoiseSize, skull3Speed;

// variables for skull 4
let skull4X, skull4Y, skull4BaseSize;
let skull4NoiseSize, skull4Speed;

// variables for skull 5
let skull5X, skull5Y, skull5BaseSize;
let skull5NoiseSize, skull5Speed;

// variables for skull1 6
let skull6X, skull6Y, skull6BaseSize;
let skull6NoiseSize, skull6Speed;

function setup() {
  createCanvas(400, 400);
  
  // set th poision,size,noise and speed of skull 1
  skull1X = 100;
  skull1Y = 100;
  skull1BaseSize = 80;  
  skull1NoiseSize = 0;
  skull1Speed = 0.005;
  
  // set th poision,size,noise and speed of skull 2
  skull2X = 300;
  skull2Y = 100;
  skull2BaseSize = 75;  
  skull2NoiseSize = 200;
  skull2Speed = 0.006;
  
 // set th poision,size,noise and speed of skull 3
  skull3X = 100;
  skull3Y = 250;
  skull3BaseSize = 85;  
  skull3NoiseSize = 400;
  skull3Speed = 0.004;
  
  // set th poision,size,noise and speed of skull 4
  skull4X = 300;
  skull4Y = 250;
  skull4BaseSize = 78;  
  skull4NoiseSize = 600;
  skull4Speed = 0.007;
  
  // set th poision,size,noise and speed of skull 5
  skull5X = 200;
  skull5Y = 170;
  skull5BaseSize = 82;  
  skull5NoiseSize = 800;
  skull5Speed = 0.005;
  
  // set th poision,size,noise and speed of skull 6
  skull6X = 200;
  skull6Y = 330;
  skull6BaseSize = 76;  
  skull6NoiseSize = 1000;
  skull6Speed = 0.006;
}

function draw() {
  background(0);
  
  ////display skull 1
  displaySkull(skull1X, skull1Y, skull1BaseSize, skull1NoiseSize);//draw skull 1
  skull1NoiseSize = skull1NoiseSize + skull1Speed;//set the noise offset of skull 1 (like breath)

  //display skull 2
  displaySkull(skull2X, skull2Y, skull2BaseSize, skull2NoiseSize);
  skull2NoiseSize = skull2NoiseSize + skull2Speed;

  //display skull 3
  displaySkull(skull3X, skull3Y, skull3BaseSize, skull3NoiseSize);
  skull3NoiseSize = skull3NoiseSize + skull3Speed;
  
  //display skull 4
  displaySkull(skull4X, skull4Y, skull4BaseSize, skull4NoiseSize);
  skull4NoiseSize = skull4NoiseSize + skull4Speed;

  //display skull 5
  displaySkull(skull5X, skull5Y, skull5BaseSize, skull5NoiseSize);
  skull5NoiseSize = skull5NoiseSize + skull5Speed;
  
  //display skull 6
  displaySkull(skull6X, skull6Y, skull6BaseSize, skull6NoiseSize);
  skull6NoiseSize = skull6NoiseSize + skull6Speed;
}


function displaySkull(skullX, skullY, baseSize, noiseSize) {
  push();
  
  //let the size of the skull vary between 0.5 and 1.6 （can be zoomed in and out）
  let skullSize = noise(noiseSize) * baseSize * 1.1 + baseSize * 0.5;
  
  translate(skullX, skullY);
  
  //draw the skull//
  noStroke();

  fill(255);

  // the circular part of the head（draw the head 30% above the center, using skullsize for drawing can achieve effective scaling）
  ellipse(0, -skullSize * 0.3, skullSize, skullSize * 0.7);
  
  // the rectangular part of the chin (20% above center)
  rect(-skullSize * 0.25, -skullSize * 0.2, skullSize * 0.5, skullSize * 0.37);
  
  // two eyes
  fill(0);
  ellipse(-skullSize * 0.25, -skullSize * 0.35, skullSize * 0.17, skullSize * 0.17);//(25% left of center & 35% above center)
  ellipse(skullSize * 0.25, -skullSize * 0.35, skullSize * 0.17, skullSize * 0.17);//(25% right of center & 35% above center)
  
  // teeth line 
  let toothWidth = skullSize * 0.025; 
  rect(-skullSize * 0.2, skullSize * 0.05, toothWidth, skullSize * 0.15);// the left one black tooth line
  rect(-skullSize * 0.1, skullSize * 0.05, toothWidth, skullSize * 0.15);// the left second black tooth line
  rect(0, skullSize * 0.05, toothWidth, skullSize * 0.15);// the middle one tooth line
  rect(skullSize * 0.1, skullSize * 0.05, toothWidth, skullSize * 0.15);// the forth tooth line
  rect(skullSize * 0.2, skullSize * 0.05, toothWidth, skullSize * 0.15);// the right one tooth line
  
  pop();
}