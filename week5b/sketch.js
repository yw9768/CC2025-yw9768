
let circleD = 25;
// x axis cosine variables:

let circleX;
let thetaX = 0;
let radiusX = 100;

// y axis variables:

let circleY;
let thetaY = 0;
let radiusY = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  circleX = width/2;
  circleY = height/2;
}

function draw() {
  let r = map(second(),0,60,0,width/2);

  radiusX = r;
  radiusY = r;
  background(0,30);
  strokeWeight(2);

  circleX = cos(radians(thetaX))*radiusX;
  thetaX++;; // ++ adds one to existing var
  translate(width/2,height/2);
  textSize(30);
  text(day(),0,0);
  // day() function gives us the calendar day
  text(hour(),0,30);
  // hour() function gives us 24-hour hour
  text(minute(),0,60);
  // minute() gives us clock time in minutes
  text(second(),0,90);


  noFill();
  stroke("red");
  circle(circleX,0,circleD);

  stroke("green");
  circleY = sin(radians(thetaY))*radiusY;
  circle(0,circleY,circleD);
  thetaY++;

  stroke(255);
  circle(circleX,circleY,circleD);

  for(let i = 0;i<12;i++){
    let theta = i*(360/12);
    let x = cos(radians(theta))*radiusX;
    let y = sin(radians(theta))*radiusY;
    circle(x,y,circleD);
  }

}




