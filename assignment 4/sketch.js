let cookies = []; // empty array to hold on to cookie objects

function setup() {
	createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
	background(248, 248, 232);
	
	for(let i = 0; i < cookies.length; i++){
  // go through every element in cookie array and run the drawCookie method on each object
		cookies[i].drawCookie();
	}
}

function keyPressed(){//map key to a cookie "type"
	let type;
	if(key == 'c'){
		type = 'choco'; //sarshmallow chocolate cookies
	} else if (key == 's'){
		type = 'strawberry';//strawberry chip cookie
	} else if (key == 'a'){
		type = 'avocado';//avocado cookie
	}

   if (key == 'c' || key == 's' || key == 'a') {//only create cookie when key is c/s/m
let size = random(110, 160); // size is random within the range of 110 to 160
let chipCount = floor(random(14, 29)); 
//floor() rounds to the lower integer and the number of chips is random between 14 and 28

let newCookie = new Cookie(size, type, chipCount);
  cookies.push(newCookie);
}
}

class Cookie{
  constructor(size, type, chipCount) {//set up initial cookie state
    this.cookieX = random(width);//generate random x at instantiation
    this.cookieY = random(height);// generate random y at instantiation
    this.chipCount = chipCount;
    this.size = size;    
    this.type = type;
  }

  drawCookie(){
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
    ellipse(0, 0, this.size, this.size); //cookie dough circle

    // toppings by type 
    if (this.type == "strawberry") { // start drawing toppings of strawberry chip cookies
      let ringR = this.size * 0.3;  // radius of the chip ring
      let spacing = TWO_PI / this.chipCount;//determine spacing based on the chipcount
      let chipD = this.size * 0.08;  // chip's diameter
      fill(220, 80, 100);  //chip's color
      for (let i = 0; i < this.chipCount; i++){ //draw chips using for loop
        let angle = i * spacing;
        let px = cos(angle) * ringR;
        let py = sin(angle) * ringR;
        ellipse(px, py, chipD, chipD);//draw chips
      }

    } else if (this.type == "choco") { //start drawing toopings of sarshmallow chocolate cookies
      fill(255); //the color of the marshmallow in the cookie center
      let marshmallowD = this.size * 0.28;//the side length of this square marshmallow
      rectMode(CENTER);    
      rect(0, 0, marshmallowD, marshmallowD,marshmallowD*0.2);// draw the marshmallow

   } else if (this.type == "avocado") {//start drawing toopings of avocado cookie

  fill(40, 95, 55); 
  ellipse(0, 0, this.size, this.size);//draw a circle as the dark green skin of avocado

  fill(190, 230, 160);  //ligther green 
  ellipse(0, 0, this.size*0.85, this.size*0.92);//draw a smaller ellipse as avocado's flesh 

  // draw the brown pit in the center
  let pitD = this.size * 0.3; // the size of pit
  fill(120, 75, 40);  // fill brown of it
  ellipse(0, 0, pitD, pitD);
  
    }

    pop();
  }
}
