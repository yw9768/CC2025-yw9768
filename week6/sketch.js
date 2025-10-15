let drunks = [];// square brackets indicate i'm making
let drunkAmount = 1000;
//an array

// an array is a variable that contains multiple variables
// each individual variable can be accessed using an 
// index number that is fed into the square brackets
// like so: drunks[5] would give me the 6th drunk in the list


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100,180,130);
  x = width/2;
  y = height/2;
  colorMode(HSB);

  for(let i = 0;i<drunkAmount;i++){
    let drunkD = random(10,50); // diamters from 10 to 100
    let drunkSpeed = random(1,7); // speeds from 1 to 7
    let drunkHue = random(0,60); // hues from 0 to 60
    drunks[i] = new Drunk(width/2,height/2,drunkD,drunkSpeed,drunkHue);
  }
}

function draw() {
  for(let i = 0;i<drunks.length;i++){
    drunks[i].move();
    drunks[i].display();
  }
}

class Drunk { // class declares a new type of object
  constructor(x,y,diameter,speed,hue){
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.speed = speed;
    this.hue = hue;
    this.opacity = random(0,1); // you can also initialize variables here
  }

  move(){ // you can declare functions or "methods" like this
    this.x = this.x+random(-this.speed,this.speed);
    this.y = this.y+random(-this.speed,this.speed);
  }

  display(){
    fill(this.hue,70,100,this.opacity);
    circle(this.x,this.y,this.diameter);
  }
}