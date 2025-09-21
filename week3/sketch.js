// variable declaration:
//"let" as a keyword that allows you to declare a variable
// in the below example, a new variable is being created
//called "circleSize" which is storng a number (125)

let circleSize = 125;// variable to store circle size

function setup() { //runs once at starup
  createCanvas(400, 400); // set a 400px by 400ox canvas
  circleSize = width*0.35; // sets circleSize variable in relation to width

}

function draw() {
  //a grayscale color is denoted as a number 0-255
  // an rgb color is denoted as 3 numbers (red green blue)
  // background (127,54,200);
  // we can use the name of a color like "black" or "olive"
  // background ("aqua");
  // we can also format rgb colors as strings:
  // background("rgb(0,0,0)");
  background("rgba(188, 236, 207, 1)");

  noStroke();
  fill("#a3e1dfff");
  rect(0,0,width/2,height/2);// a square in the top left corner
  rect(width/2,height/2,width,height);
  //stroke and fill change the color of drawn shapes
  stroke("rgba(217, 202, 240, 1)");
  fill("rgba(209, 134, 167, 1)");

  strokeWeight(5);
  //noStroke(); gets rid of the stroke completely
  //noFill(); //gets rid of the fill completely

  //circle takes 3 parameters: x, y and d;
  circle(200,200,50);
  
  // setting a new fill for my rectangle
  fill("rgba(242, 230, 166, 1)");

  //rect takes 4 parameters:
  //x coord of top left, y coord of top left, width and height
  rect(100,300,200,70);
  // ellipse takes 4 paraeters:
  // x coord of center, y coord of center, width and height
  ellipse(250,80,100,60);

  //line connects two coords: x1, y1, x2, y2
  line(250,130,350,130);

  // to draw complex polygons (more than 2 coords):
  // create a beginShape(); function and an endShape function
  // any certex(x,y) functions you place inbetween beginShape and endShape
  // will be redered as points in a complete polygon
  beginShape();
  vertex(100,100); //leftmost coordinate
  vertex(200,100); //top right coordinate
  vertex(200,150); //bottom-most coordinate
  endShape(CLOSE); //CLOSE parameter closes the polygon

  fill("#f9ab52ff");// colors can also be denoted in hex format
  circle(width/2,height*0.75,width/2.75);

  ellipse(mouseX,mouseY,mouseY,mouseX);

 
  // arcs are like ellipses, except they have two extra parameters:
  // START and END, which are provided in RADIANS format

  arc(width/2, height*0.75,100,100,-PI/2, radians(330), CHORD);


  


}
