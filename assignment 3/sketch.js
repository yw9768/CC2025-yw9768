
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
let lastMinute; //record the number of minutes when the last drawing was made
let midR, midG, midB; //set a random color variable for the middle rectangular petal
let dayR = 248, dayG = 248, dayB = 232;  // set the color of the day (bright)
let nightR = 20,  nightG = 28,  nightB = 64;   // set the color of the night（dark）


// philandering (inverted triangle
let triSide = 100; // side length of this inverted triangle


let prevMillis; // stores previous millis() value
let s; // stores second() value on prev frame
let milliseconds; //stores a number that goes


function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER);//convenient rectangle at the back to rotate around themselves

   
}

function draw() {
   let hNow = hour();
//I split the day into four segments: sunrise [4,6), day [6,16), sunset [16,18), night otherwise.
  let r, g, b;
  if (hNow >= 4 && hNow < 6) {  //sunrise （dark turns into bright）
    let time = map(hNow, 4, 6, 0, 1);
    r = map(time, 0, 1, nightR, dayR);
    g = map(time, 0, 1, nightG, dayG);
    b = map(time, 0, 1, nightB, dayB);
  } else if (hNow >= 6 && hNow < 16) {  //day
    r = dayR; g = dayG; b = dayB;
  } else if (hNow >= 16 && hNow < 18) {  //sunset (bright turns into dark)
    let t = map(hNow, 16, 18, 0, 1);
    r = map(t, 0, 1, dayR, nightR);
    g = map(t, 0, 1, dayG, nightG);
    b = map(t, 0, 1, dayB, nightB);
  } else {   //night          
    r = nightR; g = nightG; b = nightB;
  }
  background(r, g, b); 



  //1.Start doing the outer loop (circular petals)--reflect second（）[the outer petal pulsating once per second]
   if(s != second()){  
		prevMillis = millis(); 
	 }
	s = second();  
	milliseconds = millis() - prevMillis;

  let t = map(milliseconds, 0, 1000, 0,1);
  let amp = 0.20;//set the pulse amplitude of the petals

  let pulseScale;
   if (t < 0.5) { //make the petals larger in the first 0.5 seconds
  pulseScale = map(t, 0, 0.5, circleDiameter, circleDiameter*(1+amp));
  } else { // make the petals smaller in the last 0.5 seconds
  pulseScale = map(t, 0.5, 1, circleDiameter*(1+amp),circleDiameter);
   }


  fill(236, 168, 196); // petal color
  // start doing the outer loop (circular petals)
   push();
     translate(width /2, height/2);
  for (let i = 0; i < outerCount; i++) { //loop 12 times (outerCount= 12 = number of petals)
    let thetaX = i * (360 / outerCount); //calculate the angle of petals    
    let circleX = cos(radians(thetaX)) * radiusX;
    let circleY = sin(radians(thetaX)) * radiusX;
    circle(circleX, circleY, pulseScale);
    }
    pop();

  


  //2，start doing the Middle circle loop (rectangular petal),
  // reflect minute（）,the middle circle’s color shifts randomly once per minute 
    if (minute() != lastMinute) {   
    lastMinute = minute();        
    midR = random(255);        
    midG = random(255);
    midB = random(255);
  }

  fill(midR, midG, midB);
  for (let j = 0; j < middleCount; j++) { // loop 18 times (middleCount= 18 = number of rectangular petals)
    let thetaM = j * (360 / middleCount); 
    let rectX = width / 2 + cos(radians(thetaM)) * radiusY;
    let rectY = height/ 2 + sin(radians(thetaM)) * radiusY;

    push();
    translate(rectX, rectY);//move the local coordinates to the center of the petal
    //  and then draw it in the coordinate system with itself as the origin
    rotate(radians(thetaM)); //Rotate according to the angle and the center of the rectangle itself
    rect(0, 0, rectWeight, rectHeight, 6);
    pop();
  }

  // 3.draw the center of a flower 
  fill(70, 145, 245); 
  let h = triSide * sqrt(3) / 2; // height of an equilateral triangle ≈ side * √3 / 2
  //Regarding sqrt(), I found it on the webpage of p5.js reference. 
  // This function is used to calculate the square root of a number.
  //  More detailed comments are in rename.

  push();
  translate(width/2, height/2); // move the origin(0,0) to the center of the canvas
  rotate(PI);//Rotate the entire regular triangle by 180 degrees to invert it
  //（regular triangle -> inverted triangle）

  //draw the regular triangle (symmetric around 0,0)
  //I provided a sketch of how to find the coordinates of this triangle in the rename file
  triangle( -triSide/2,  h/2,   // left point
            triSide/2,  h/2,   // right point
              0,       -h/2 );  // top point

  pop();

}
