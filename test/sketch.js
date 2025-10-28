let eye1;
let eye2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB);
 
  // to make the eyes look in the same direction
  // set r and t values to the same numbers
  // to have them look in different directions
  // set r and t to different values

  eye1 = new EyeBall(200,200,100,150,0,100);
  eye2 = new EyeBall(100,200,100,150,0,100);
}

function draw() {
  background(0);
  eye1.display();
  eye2.display();
}

class EyeBall {
  constructor(x, y, w, h, r, t) {
    this.x = x;
    this.y = y;

    this.w = w; // width
    this.h = h; // height

    this.speed = 0.005;
    this.noiseR = r;
    this.noiseT = t;
  }

  display() {
    push();
    translate(this.x, this.y);

    fill(255); // set the fill to white
    ellipse(0, 0, this.w, this.h);

    let eyeTheta = noise(this.noiseT) * 360;
    let eyeXRadius = (noise(this.noiseR) * this.w) / 2;
    let eyeYRadius = (noise(this.noiseR) * this.h) / 2;

    let eyeX = cos(eyeTheta) * eyeXRadius;
    let eyeY = sin(eyeTheta) * eyeYRadius;

    fill(0); //set fill to black
    ellipse(eyeX, eyeY, this.w / 2, this.h / 2);

    this.noiseR = this.noiseR + this.speed;
    this.noiseT = this.noiseT + this.speed;
    pop();
  }
}