//I have drawn three types of cookies,: marshmallow chocolate chip cookies,strawberry chip cookies, and avocado cookies.
//These cookies respond via keypressed 
// ("c" for marshmallow chocolate chip cookies, "s" for strawberry chip cookies, "a" for avocado cookie.) 
//When the mouse clicks on any cookie, the cookie will disappear.
//The inspiration for the avocado cookie is explained in rename folder
let cookies = []; // empty array to hold on to cookie objects

let padSize, padX, padY, padR;//set the variable of pad

function setup() {
	createCanvas(windowWidth, windowHeight);
  noStroke();

  //// set the size of the pad will draw later
  padSize = width * 0.8;
  padX = width / 2;
  padY = height / 2;
  padR = padSize / 2;
}

//draw the background and the pad laying on the table
function draw() {
	drawCookieBox();
	for(let i = 0; i < cookies.length; i++){
  // go through every element in cookie array and run the drawCookie method on each object
		cookies[i].drawCookie();
	}
}

//start drawing the pad
function drawCookieBox() {
  background(235, 230, 220);
 
  // first,draw the shadow of the pad to make it look more three-dimensional
  fill(0, 0, 0, 25);
  noStroke();
  ellipse(padX + 6, padY + 6, padSize, padSize);
  
  // draw the pad
  stroke(190, 210, 220);
  strokeWeight(2);
  fill(220, 235, 240);
  ellipse(padX, padY, padSize, padSize);

  //visual thickness: draw an inner rim ring 
  //(slightly smaller circle with thicker stroke)
  noFill();
  stroke(180, 200, 210);
  strokeWeight(3);
  ellipse(padX, padY, padSize * 0.95, padSize * 0.95);
  
  // draw the measurement circle on the pad
  noFill();
  stroke(200, 215, 225);
  strokeWeight(1.5);
  for(let i = 1; i <= 5; i++) {
    ellipse(padX, padY, padSize * (i / 6), padSize * (i / 6));
    //i give diameters at fractions 1/6, 2/6, 3/6, 4/6, 5/6 of padSize
    //each ring is spaced evenly, each step adds padSize/6
  }
  
  noStroke(); //close the stroke to prevent it from 
  //affecting the drawing style of the cookies that follow.
}

function keyPressed(){//map key to a cookie "type"
	let type;
	if(key == 'c'){
		type = 'choco'; //marshmallow chocolate chip cookies
	} else if (key == 's'){
		type = 'strawberry';//strawberry chip cookie
	} else if (key == 'a'){
		type = 'avocado';//avocado cookie
	}

   if (key == 'c' || key == 's' || key == 'a') {//only create cookie when key is c/s/a
let size = random(110, 160); // size is random within the range of 110 to 160
let chipCount = floor(random(14, 29)); 
//floor() rounds to the lower integer and the number of chips is random between 14 and 28

let newCookie = new Cookie(size, type, chipCount);
  cookies.push(newCookie);
   }
   }

  // Click to delete a hovered cookie (delete first match and stop)
  function mousePressed() {
  for(let i = 0; i < cookies.length; i++){
    if(cookies[i].hovering == true){
      cookies.splice(i, 1);
      break; //stop once one is deleted
    }
  }
}

class Cookie{
  constructor(size, type, chipCount) {//set up initial cookie state
    this.chipCount = chipCount;
    this.size = size;    
    this.type = type;
    this.hovering = false;
  
  let cookieR = this.size / 2; //cookie radius
  
  //make sure the cookies are completely inside the pad
  let maxDistance = padR - cookieR;
  
  let angle = random(TWO_PI);
  let distance = random(maxDistance);

  //randomly generate the position where cookies appear in the pad
  this.cookieX = padX + distance * cos(angle);//x-coordinate of cookie
  this.cookieY = padY + distance * sin(angle);//y-coordinate of cookie

  //start pre-generate the location of the chips
	this.chips = [];
  for (let i = 0; i < this.chipCount; i++){
  let angle = random(TWO_PI);
  let distance = random(cookieR);
  let px = distance * cos(angle);//x-coordinate of chip
  let py = distance * sin(angle);//y-coordinate of chip
  let d = random(this.size * 0.04, this.size * 0.09);//diameter of chip
  this.chips.push({x: px, y: py, diameter: d});//store the information of this chip (position and size) in chips array
  //object contains: x position, y position, and diameter
  }
  }

  
  drawCookie(){
    // respond to mousepressed; 
    // check if the mouse is hovering over the cookie
    if(dist(mouseX, mouseY, this.cookieX, this.cookieY) < this.size / 2){
      //the mouse hovers over the cookie
      this.hovering = true;
    } else {
      //the mouse did not hover over the cookie
      this.hovering = false;
    }

    push(); // isolate the transformation for each cookie
    translate(this.cookieX, this.cookieY);

    // set the base color of cookie dough
    if (this.type == "choco") {          
      fill(190, 140, 90);//chocolate base
    } else if (this.type == "avocado") {   
      fill(40, 95, 55);// the dark green skin of an avocado
    } else {      
      fill(240, 170, 170);//strawberry base
    }
   

  // STRAWBERRY COOKIE
    if (this.type == "strawberry") { 
    // 1. Draw cookie shadow (for 3D effect)
  fill(200, 130, 130);// Darker pink shadow
  ellipse(3, 3, this.size, this.size); // Offset slightly down-right
  
  // 2. Draw cookie base
  fill(240, 170, 170);// Light pink of cookie base
  ellipse(0, 0, this.size, this.size);

  // 3. Draw all strawberry chips
  for (let i = 0; i < this.chips.length; i++){
  // Draw chip shadow first
	fill(180, 50, 70); // Dark red shadow
  ellipse(this.chips[i].x, this.chips[i].y,this.chips[i].diameter * 1.2, this.chips[i].diameter * 1.2);
  // Draw strawberry chip on top
  fill(220, 80, 100);  // Bright strawberry red 
  ellipse(this.chips[i].x, this.chips[i].y, this.chips[i].diameter, this.chips[i].diameter);
      
  }

  //CHOCOLATE MARSHMALLOW COOKIE
    } else if (this.type == "choco") {
  // 1. Draw cookie shadow
  fill(160, 110, 70);  // Dark brown shadow
  ellipse(4, 4, this.size, this.size);// Offset down-right
  
  // 2. Draw cookie base
  fill(190, 140, 90); // Light chocolate brown
  ellipse(0, 0, this.size, this.size);// choco chip
  
  // 3. Draw chocolate chips on top of cookie
  for (let i = 0; i < this.chips.length; i++){
    // Draw chip shadow 
    fill(40, 25, 20); // Very dark brown
    ellipse(this.chips[i].x, this.chips[i].y, 
            this.chips[i].diameter * 1.3, this.chips[i].diameter * 1.3);
    
   // Draw chocolate chip 
    fill(60, 40, 30); 
    ellipse(this.chips[i].x, this.chips[i].y, 
            this.chips[i].diameter * 1.1, this.chips[i].diameter * 1.1);
  }
  
   // 4. Draw marshmallow on top 
  let marshmallowD = this.size * 0.28;// Marshmallow size
  rectMode(CENTER);// Draw rectangle from center point
  
  // Draw marshmallow shadow
  fill(200, 200, 200);// Light gray
  rect(2, 2, marshmallowD, marshmallowD, marshmallowD * 0.2);
  
  // Draw marshmallow body
  fill(255, 250, 245);// Off-white color
  rect(0, 0, marshmallowD, marshmallowD, marshmallowD * 0.2);


   // AVOCADO COOKIE
   } else if (this.type == "avocado") {
  // 1. Draw avocado shadow
  fill(140, 130, 90); // Dark brown-gray
  ellipse(4, 4, this.size, this.size);

  // 2. Draw avocado dark green skin (outer layer)
  fill(110, 120, 70); // Dark green
  ellipse(0, 0, this.size, this.size);

  // 3. Draw avocado flesh (lighter green, slightly smaller)
  fill(190, 230, 160);  // Light yellow-green
  ellipse(0, 0, this.size*0.85, this.size*0.92);
  
   // 4. Draw avocado pit (seed) in center
  let pitD = this.size * 0.32;// set pit diameter 
  
  // Draw pit shadow
  fill(90, 60, 35);// Very dark brown
  ellipse(1.5, 1.5, pitD, pitD);// Slightly offset
  
  // Draw pit body
  fill(130, 85, 50); // Medium brown
  ellipse(0, 0, pitD, pitD);// Centered
  
  //Draw pit highlight at the top // Dark brown
  fill(105, 70, 40);
  ellipse(2.5, 2.5, pitD * 0.88, pitD * 0.88);
  
    }

    pop();
  }
}
