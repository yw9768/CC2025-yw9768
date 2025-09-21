let stick = 2; //variable to store strokeweight size

function setup() {
  createCanvas(400, 400);// set a 400px by 400ox canvas
}

function draw() {
  background("rgba(129, 196, 174, 1)")// set background color

  fill("rgba(191, 242, 185, 1)"); // set the color of complex polygon
  stroke("rgba(134, 172, 188, 1)"); // set the stroke color of this complex polygons
  strokeWeight(stick) // set the strokeweight size
  

  beginShape(); // draw the first complex polygon
  vertex(57,183);
  vertex(105,200);
  vertex(105,270);
  vertex(153,289);
  vertex(60,301);
  endShape(CLOSE); 

  fill("rgba(185, 225, 218, 1)"); // set the color of the first triangle
  triangle(60,182,105,177,105,200);

  fill("rgba(68, 85, 105, 1)"); // set the color of the second triangle
  triangle(104,152,105,177,152,170);

  fill("rgba(68, 133, 244, 1)"); // set the color of the third triangle
  triangle(105,151,153,170,152,146);

  fill("rgba(236, 222, 235, 1)"); // set the color of complex polygon
  beginShape(); // draw the second complex polygon
  vertex(105,177);
  vertex(153,170);
  vertex(153,219);
  vertex(105,200);
  endShape(CLOSE); 

  fill("rgba(235, 217, 180, 1)"); // set the color of complex polygon
  beginShape(); // draw the third complex polygon
  vertex(105,200);
  vertex(153,219);
  vertex(153,264);
  vertex(105,270);
  endShape(CLOSE); 

  fill("rgba(208, 189, 242, 1)"); // set the color of the fourth triangle
  triangle(107,270,153,264,153,289);

  fill("rgba(208, 189, 242, 1)"); // set the color of the fifth triangle
  triangle(107,270,153,264,153,289);

  fill("rgba(85, 118, 146, 1)"); // set the color of the sixth triangle
  triangle(60,301,153,289,153,336);

  fill("rgba(180, 235, 218, 1)"); // set the color of complex polygon
  beginShape(); // draw the fourth complex polygon
  vertex(152,146);
  vertex(203,165);
  vertex(202,212);
  vertex(153,219);
  endShape(CLOSE); 

  fill("rgba(228, 235, 180, 1)"); // set the color of complex polygon
  beginShape(); // draw the fifth complex polygon
  vertex(153,219);
  vertex(202,212);
  vertex(201,259);
  vertex(153,264);
  endShape(CLOSE); 

  fill("rgba(230, 201, 181, 1)"); // set the color of complex polygon
  beginShape(); // draw the fifth complex polygon
  vertex(153,264);
  vertex(201,259);
  vertex(249,276);
  vertex(249,324);
  vertex(153,336);
  endShape(CLOSE); 

  fill("rgba(230, 201, 181, 1)"); // set the color of complex polygon
  beginShape(); // draw the fifth complex polygon
  vertex(153,264);
  vertex(201,259);
  vertex(249,276);
  vertex(249,324);
  vertex(153,336);
  endShape(CLOSE); 

  fill("rgba(214, 168, 247, 1)"); // set the color of complex polygon
  beginShape(); // draw the fifth complex polygon
  vertex(151,99);
  vertex(299,152);
  vertex(203,165);
  vertex(152,146);
  endShape(CLOSE); 

  line(252,137,252,158);

  fill("rgba(150, 207, 244, 1)"); // set the color of the seventh triangle
  triangle(151,99,252,85,252,137);

  fill("rgba(251, 202, 203, 1)"); // set the color of complex polygon
  beginShape(); // draw the sixth complex polygon
  vertex(203,165);
  vertex(252,158);
  vertex(250,205);
  vertex(202,212);
  endShape(CLOSE); 

  fill("rgba(202, 223, 251, 1)"); // set the color of complex polygon
  beginShape(); // draw the seventh complex polygon
  vertex(202,212);
  vertex(250,205);
  vertex(249,276);
  vertex(201,259);
  endShape(CLOSE); 

  fill("rgba(144, 236, 146, 1)"); // set the color of complex polygon
  beginShape(); // draw the eighth complex polygon
  vertex(252,158);
  vertex(299,152);
  vertex(297,222);
  vertex(250,205);
  endShape(CLOSE); 

  fill("rgba(236, 175, 144, 1)"); // set the color of complex polygon
  beginShape(); // draw the nighth complex polygon
  vertex(250,205);
  vertex(297,222);
  vertex(296,246);
  vertex(249,252);
  endShape(CLOSE); 

  fill("rgba(202, 207, 232, 1)"); // set the color of complex polygon
  beginShape(); // draw the tenth complex polygon
  vertex(249,252);
  vertex(296,246);
  vertex(296,269);
  vertex(249,276);
  endShape(CLOSE); 

  line(249,252,296,269);

  fill("rgba(202, 207, 232, 1)"); // set the color of complex polygon
  beginShape(); // draw the eleventh complex polygon
  vertex(252,85);
  vertex(350,123);
  vertex(345,240);
  vertex(297,222);
  vertex(299,152);
  vertex(252,137);
  endShape(CLOSE); 

  fill("rgba(85, 118, 146, 1)"); // set the color of the seventh triangle
  triangle(297,222,345,240,296,246);
  




  
















}
