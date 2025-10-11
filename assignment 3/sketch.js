
// reflect second(): the outer petals pulsate once per second.  
// reflect minute(): The color of the center circle switches every minute 
// replect hour(): The background slowly shifts between day and night according to the hour 


// Outer circle/ circular petals
let outerCount = 12;// The number of petals on the outer circle
let radiusX = 250; // Outer circle radius
let circleDiameter = 100; // The diameter of the outer petal 

// Middle circle (rectangular petal)
let middleCount = 18; // The number of rectangular petals in the middle circle
let radiusY = 130; // Center circle radius
let rectWeight = 24;// The width of the rectangular petal in the center circle
let rectHeight = 40;  // The height of the rectangular petal in the center circle
let lastMinute;
let midR, midG, midB; 
let dayR = 248, dayG = 248, dayB = 232;  // 白天
let nightR = 20,  nightG = 28,  nightB = 64;   // 夜晚（深蓝）


// Philandering (inverted triangle
let triSide = 100; // Side length of this inverted triangle


let prevMillis; // 
let s; // 
let milliseconds;


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);//Convenient rectangle at the back to rotate around themselves

   
}

function draw() {
   let hNow = hour();
  let r, g, b;
  if (hNow >= 4 && hNow < 6) {                // 日出
    let time = map(hNow, 4, 6, 0, 1);
    r = map(time, 0, 1, nightR, dayR);
    g = map(time, 0, 1, nightG, dayG);
    b = map(time, 0, 1, nightB, dayB);
  } else if (hNow >= 6 && hNow < 16) {        // 白天
    r = dayR; g = dayG; b = dayB;
  } else if (hNow >= 16 && hNow < 18) {       // 日落
    let t = map(hNow, 16, 18, 0, 1);
    r = map(t, 0, 1, dayR, nightR);
    g = map(t, 0, 1, dayG, nightG);
    b = map(t, 0, 1, dayB, nightB);
  } else {                                     // 夜晚
    r = nightR; g = nightG; b = nightB;
  }
  background(r, g, b); 



  //1. 画外圈花瓣
   if(s != second()){ // 
		prevMillis = millis(); //
	 }
	s = second(); // 
	milliseconds = millis() - prevMillis;

  let t = map(milliseconds, 0, 1000, 0,1);
  let amp = 0.20;//脉冲幅度

  let pulseScale;
   if (t < 0.5) {
  // 前半秒：线性上升
  pulseScale = map(t, 0, 0.5, circleDiameter, circleDiameter*(1+amp));
  } else {
  // 后半秒：线性下降
  pulseScale = map(t, 0.5, 1, circleDiameter*(1+amp),circleDiameter);
   }


  // Start doing the outer loop (circular petals)
  //It will reflect for second（） after that, with the outer petal pulsating once per second
  fill(236, 168, 196); // petal color
  for (let i = 0; i < outerCount; i++) { //loop 12 times (outerCount= 12 = number of petals)
    let thetaX = i * (360 / outerCount); //Calculate the angle of petals    
    let circleX = cos(radians(thetaX)) * radiusX;
    let circleY = sin(radians(thetaX)) * radiusX;

    push();
    translate(width /2, height/2);
    circle(circleX, circleY, pulseScale);
    pop();

  }


  //2， 做中间矩形
    if (minute() != lastMinute) {   // 分钟数变化了
    lastMinute = minute();         // 记录新分钟
    midR = random(255);            // 随机新颜色
    midG = random(255);
    midB = random(255);
  }
  fill(midR, midG, midB);
    // start doing the Middle circle loop (rectangular petal)
    //It will reflect for minute（） after that, the middle circle’s color shifts once per minute 
  for (let j = 0; j < middleCount; j++) { // loop 18 times (middleCount= 18 = number of rectangular petals)
    let thetaM = j * (360 / middleCount); 
    let rectX = width / 2 + cos(radians(thetaM)) * radiusY;
    let rectY = height/ 2 + sin(radians(thetaM)) * radiusY;

    push();
    translate(rectX, rectY);
    rotate(radians(thetaM)); //Rotate according to the angle and the center of the rectangle itself
    rect(0, 0, rectWeight, rectHeight, 6);
    pop();
  }

  // start drawing a inverted triangle
  fill(70, 145, 245); // fill the inverted triangle
  let h = triSide * sqrt(3) / 2; // height of an equilateral triangle ≈ side * √3 / 2
  //Regarding sqrt(), I found it on the webpage of p5.js reference. 
  // This function is used to calculate the square root of a number.
  //  More detailed comments are in rename.

  push();
  translate(width/2, height/2); // move the origin(0,0) to the center of the canvas
  rotate(PI);//Rotate the entire regular triangle by 180 degrees to invert it

  //draw the regular triangle (symmetric around 0,0)
  //I provided a more detailed explanation of how to draw this triangle in the rename folder（with picture）
  triangle(
    -triSide/2,  h/2,   // left point
     triSide/2,  h/2,   // right point
     0,         -h/2    // top point
  );
  pop();

}
