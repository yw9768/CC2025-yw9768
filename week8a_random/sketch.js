

function setup() {
  createCanvas(500,500);
  
}

function draw() {
  background(0);
  translate(width/2, height/2);
  stroke(255);
  strokeWeight(5);
  point(0,0);//center
  point(0,-100);
  point(85,50);
  point(-85,50);
  point(0,100);
  point(-85,-50);
  point(85,-50);

  
}
