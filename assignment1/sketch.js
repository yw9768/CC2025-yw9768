let stick = 2; //variable to store strokeweight size

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

  fill("rgba(199, 247, 239, 1)"); // set the color of the first triangle
  triangle(width*0.1425,height*0.4575,width*0.2625,height*0.4425,width*0.2625,height*0.5);

  fill("rgba(162, 195, 233, 1)"); // set the color of the second triangle
  triangle(width*0.26,height*0.38,width*0.38,height*0.425,width*0.2625,height*0.4425);

  fill("rgba(68, 133, 244, 1)"); // set the color of the third triangle
  triangle(width*0.26,height*0.38,width*0.38,height*0.365,width*0.38,height*0.425);

  fill("rgba(236, 222, 235, 1)"); // set the color of complex polygon
  beginShape(); // draw the second complex polygon
  vertex(width*0.2625,height*0.4425);
  vertex(width*0.38,height*0.425);
  vertex(width*0.3825,height*0.5475);
  vertex(width*0.2625,height*0.5);
  endShape(CLOSE); 

  fill("rgba(247, 240, 226, 1)"); // set the color of complex polygon
 beginShape(); // draw the third complex polygon
 vertex(width*0.2625,height*0.5);
 vertex(width*0.3825,height*0.5475);
 vertex(width*0.3825,height*0.66);
 vertex(width*0.2625,height*0.675);
 endShape(CLOSE);

 
 fill("rgba(208, 189, 242, 1)"); // set the color of the fourth triangle
 triangle(width*0.265,height*0.675,width*0.3825,height*0.66,width*0.3825,height*0.7225);

 fill("rgba(85, 118, 146, 1)"); // set the color of the fifth triangle
 triangle(width*0.15,height*0.75,width*0.3825,height*0.7225,width*0.3825,height*0.84);

 fill("rgba(180, 235, 218, 1)"); // set the color of complex polygon
 beginShape(); // draw the fourth complex polygon
 vertex(width*0.38,height*0.365);
 vertex(width*0.5075,height*0.4125);
 vertex(width*0.505,height*0.53);
 vertex(width*0.3825,height*0.5475);
 endShape(CLOSE); 

 fill("rgba(228, 235, 180, 1)"); // set the color of complex polygon
 beginShape(); // draw the fifth complex polygon
 vertex(width*0.3825,height*0.5475);
 vertex(width*0.505,height*0.53);
 vertex(width*0.5025,height*0.6475);
 vertex(width*0.3825,height*0.66);
 endShape(CLOSE); 

 fill("rgba(230, 201, 181, 1)"); // set the color of complex polygon
 beginShape(); // draw the fifth complex polygon
 vertex(width*0.3825,height*0.66);
 vertex(width*0.5025,height*0.6475);
 vertex(width*0.6225,height*0.69);
 vertex(width*0.6225,height*0.81);
 vertex(width*0.3825,height*0.84);
 endShape(CLOSE); 

 fill("rgba(229, 235, 209, 1)"); // set the color of complex polygon
 beginShape(); // draw the fifth complex polygon
 vertex(width*0.3775,height*0.2475);
 vertex(width*0.7475,height*0.38);
 vertex(width*0.5075,height*0.4125);
 vertex(width*0.38,height*0.365);
 endShape(CLOSE); 

 line(width*0.63,height*0.3425,width*0.63,height*0.395);

 fill("rgba(150, 207, 244, 1)"); // set the color of the seventh triangle
 triangle(width*0.3775,height*0.2475,width*0.63,height*0.2125,width*0.63,height*0.3425);

 fill("rgba(251, 202, 203, 1)"); // set the color of complex polygon
 beginShape(); // draw the sixth complex polygon
 vertex(width*0.5075,height*0.4125);
 vertex(width*0.63,height*0.395);
 vertex(width*0.625,height*0.5125);
 vertex(width*0.505,height*0.53);
 endShape(CLOSE); 

 fill("rgba(202, 223, 251, 1)"); // set the color of complex polygon
 beginShape(); // draw the seventh complex polygon
 vertex(width*0.505,height*0.53);
 vertex(width*0.625,height*0.5125);
 vertex(width*0.6225,height*0.69);
 vertex(width*0.5025,height*0.6475);
 endShape(CLOSE); 

 fill("rgba(144, 236, 146, 1)"); // set the color of complex polygon
 beginShape(); // draw the eighth complex polygon
 vertex(width*0.63,height*0.395);
 vertex(width*0.7475,height*0.38);
 vertex(width*0.7425,height*0.555);
 vertex(width*0.625,height*0.5125);
 endShape(CLOSE); 

 fill("rgba(236, 175, 144, 1)"); // set the color of complex polygon
 beginShape(); // draw the nighth complex polygon
 vertex(width*0.625,height*0.5125);
 vertex(width*0.7425,height*0.555);
 vertex(width*0.74,height*0.615);
 vertex(width*0.6225,height*0.69);
 endShape(CLOSE); 

 fill("rgba(202, 207, 232, 1)"); // set the color of complex polygon
 beginShape(); // draw the tenth complex polygon
 vertex(width*0.6225,height*0.63);
 vertex(width*0.74,height*0.615);
 vertex(width*0.74,height*0.6725);
 vertex(width*0.6225,height*0.69);
 endShape(CLOSE);  

 line(width*0.6225,height*0.63,width*0.74,height*0.6725);

 fill("rgba(202, 207, 232, 1)"); // set the color of complex polygon
 beginShape(); // draw the eleventh complex polygon
 vertex(width*0.63,height*0.2125);
 vertex(width*0.875,height*0.3075);
 vertex(width*0.8625,height*0.6);
 vertex(width*0.7425,height*0.555);
 vertex(width*0.7475,height*0.38);
 vertex(width*0.63,height*0.3425);
 endShape(CLOSE); 

 fill("rgba(85, 118, 146, 1)"); // set the color of the seventh triangle
 triangle(width*0.7425,height*0.555,width*0.8625,height*0.6,width*0.74,height*0.615);





  
















}
