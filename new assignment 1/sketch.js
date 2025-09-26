let stick = 2; //variable to store strokeweight size
let 
function setup() {
  createCanvas(windowWidth,windowHeight);// set a 400px by 400ox canvas
}

function draw() {
  background("rgba(152, 190, 177, 1)")// set background color

  fill("rgba(203, 237, 200, 1)"); // set the color of complex polygon
  stroke("rgba(131, 169, 185, 1)"); // set the stroke color of this complex polygons
  strokeWeight(stick) // set the strokeweight size
  

  beginShape(); // draw the first complex polygon
  vertex(width*0.1425,height*0.4575);
  vertex(width*0.2625,height*0.5);
  vertex(width*0.2625,height*0.675);
  vertex(width*0.3825,height*0.7225);
  vertex(width*0.15,height*0.75);
  endShape(CLOSE); 
}