
let santaX = 0;
let santaY = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER); 
  
  santaX = width / 2;
  santaY = height / 2;
}

function draw() {
  drawBackground();
  handleInteraction();
  drawSanta();
}


function handleInteraction() {
   if (mouseIsPressed) {
    santaX = mouseX;
    santaY = mouseY;
   }
}

function drawBackground() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;

  // four grid background colors
  fill(220, 210, 230); rect(cx/2, cy/2, cx, cy);         // top left corner
  fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy);    // top right corner
  fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy);    // lower left corner
  fill(210, 240, 225); rect(cx + cx/2, cy + cy/2, cx, cy); // lower left corner

  // draw the dividing line
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
}

 
function drawSanta() {
 push();
 translate(santaX, santaY); 
 scale(1.2); 

 //draw the hat
 fill(220, 40, 40);
 noStroke();

 beginShape();
 curveVertex(60, -40); 
 curveVertex(60, -40);  // the starting point at the lower right corner
 curveVertex(40, -90);  // turn up on the right
 curveVertex(0, -110);  // The highest point of the hat
 curveVertex(-50, -90); // Bend upwards on the left
 curveVertex(-90, -40); // last point at the lower left corner
 curveVertex(-90, -40); 
 endShape();

 // The ball on the hat
 fill(255);
 ellipse(-90, -40, 28, 28);

 //draw the face
 fill(255, 220, 200);
 noStroke();
 ellipse(0, 0, 120, 120);

 //draw the full beard beneath the face
 fill(245, 245, 250);
 noStroke();

 beginShape();
 curveVertex(-60, 0);   
 curveVertex(-60, 0);  
 curveVertex(-65, 50); 
 curveVertex(-40, 90); 
 curveVertex(0, 105); 
 curveVertex(40, 90);  
 curveVertex(65, 50);   
 curveVertex(60, 0);   
 curveVertex(60, 0);     
 endShape();

 // The small whiskers on both sides of the nose
 fill(255);
 arc(-20, 20, 40, 30, PI + 0.5, 0); //left one
 arc(20, 20, 40, 30, PI, -0.5);     // right one

 // draw eyes
 fill(0);
 ellipse(-25, -15, 12, 15); // left eye
 ellipse(25, -15, 12, 15); // right eye

 // highlight inside eyes
 fill(255);
 ellipse(-23, -17, 4, 4);
 ellipse(27, -17, 4, 4);

 //draw eyebrows
 noFill();
 stroke(240);
 strokeWeight(6);
 line(-40, -35, -10, -35); 
 line(10, -35, 40, -35); 

 // draw mouth
 stroke(180, 100, 100);
 strokeWeight(3);
 line(-15, 35, 15, 35);

 //the thick white brim of the hat
 fill(255);
 noStroke();
 rect(0, -50, 130, 30, 15); 

 //draw nose
 fill(240, 160, 160);
 ellipse(0, 10, 18, 18);

 pop();
}


