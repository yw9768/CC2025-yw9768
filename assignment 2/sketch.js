let cellW = 75, cellH = 45; // set the width and height of bricks
let margin = 20;            // set the blank space around the bricks


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);//set the adaptive window size
}
function setup() {
  createCanvas(windowWidth, windowHeight);//create a canvas as large as the window
  noStroke();
  rectMode(CENTER); // draw a rectangle with the center to 
  // facilitate the subsequent rotation of the bricks around the center
}

function draw() {
  background("rgba(245, 247, 223, 1)"); // yellow bg
  translate(margin, margin);// i move the margin of the coordinate origin 
  // as a whole to the lower right 
  // then all subsequent drawing should be carried out 
  // within the inner margin box

  const usableW = width  - margin * 2;
  const usableH = height - margin * 2;//i calculated the drawable area
  //  removed the margins on the left, right and top and bottom,
  // and obtained the actual internal width and height that can be used to arrange the grid


  for (let x = 0; x <= usableW - cellW; x += cellW) {       // create a variable called x
  // from left to right, move one cellW each time. continue the loop as long as one brick can still be placed intact
    for (let y = 0; y <= usableH - cellH; y += cellH) {     // create a variable called y
    // from top to bottom, move one cellH each time. continue the loop as long as one brick can still be placed intact

     
  
    let t; //set a ratio t
    if (usableH - cellH > 0) {
     t = y / (usableH - cellH);  // the distance already traveled/the total distance
      } else {
     t = 0;  // the value of t is a variable that becomes increasingly complex along the Y-axis, 
             // the rotation angle will increase synchronously as t increases
      }

     

      // set the color gradient from left to right controlled by mouseX
      // interpolate between two colors using lerp: from (64,180,170) to (120,200,255)
      const u = constrain(mouseX / width, 0, 1);//set the range of mouseX, 
                  // with the minimum value on the left being 0 
                  // and the maximum value on the right being 1
      const r = lerp(64, 120, u);
      const g = lerp(180, 200, u);
      const b = lerp(170, 255, u);

      // start designing the rotation angle
      //mouseY rotates 0 at the top and PI/3 (60 degree) at the bottom
      const maxAng = map(mouseY, 0, height, 0, PI / 3);
      const ang = t * maxAng;

      // make the actual brick size slightly smaller than
      // the original size (leave a gap for a cleaner visual effect)
      const bw = cellW * 0.9;
      const bh = cellH * 0.7;

      
      push();
      translate(x + cellW / 2, y + cellH / 2);
      //because the original coordinates x and y were in the upper left corner, 
       // they have now been moved to the center of the current brick
      rotate(ang); //rotate an ang arc around the center of the brick
      
       
      fill(r,g,b);// set the color of shapes
      //switch shapes based on whether the mouse is pressed or not
     if (mouseIsPressed) {
       ellipse(0, 0, bw, bh);     // press the mouse to turn it into an ellipse
      } else {
      rect(0, 0, bw, bh, 5);     // release--go back to rect
       }
      pop();

     
    }
  }
}

