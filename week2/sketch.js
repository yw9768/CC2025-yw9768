

function setup() {// runs once at the start
  createCanvas(windowWidth, windowHeight);
  // createCanvas is a function
  // that creates a canvas for our p5.js sketch
  // to drwa into. it takes two parametersm
  // width and height, windowWidth and windowHeight
  // are used to set the size to the full size
  // of our browser window
}

function draw() {// runs in a loop fter setup
  circle(100,200,25);
  // circle takes these parameters;
  // x position, y position, diameter
  ellipse(120, 120, 120, 80);
  rect(180, 140, 150, 60);
  triangle(200, 200, 250, 300, 150, 300)


}
