

function setup() {
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  // any translation 
  background("#90b1e2ff");


  circle(100,100,100);
  //circle(100+200,100+100,100);
  circle(85,90,5);
  circle(115, 90,5);
  arc(100,100,60,60,0,PI);

  push();
  stroke("white");
  strokeWeight(5);
  line(0,0,100,0);
  pop();


  // translate is a transformation function
  // it moves the coordinate matrix according to 
  // a new set of coordinates, which become
  // the "new" 0,0

  //push and pop isolate a transformation
  // anything enclosed within push and pop only applies
  //within that enclosure
  push();// push indicates the beginning of an isolated

  if(mouseX>width/2 || mouseY>height/2){//of the text inside the ()is met..
    fill("pink");
    //run this code
  } else if (mouseX,width/2 && mouseY<height/2){
    fill ("orange");
  }else if (mouseIsPressed == true){
    fill ("blue");
  } 
  else {// otherwise...
    fill("yellow");
    //run this other code
  }

  // mouseIsPressed is a system variable that switches
  // from false to true when the mouse is down


  translate(width/2,height/2);
  let angle;
  //map is a function that scales numbers proportionately
  // parameters;
  // 1: inpute cariable to scale
  // 2: low end of input range
  // 3: high end of input range
  // 4: low end of the output range
  // 5: high end of the output range
  angle = map(mouseX,0,width,0,360);

  rotate(radians(angle));

  let scaleFactor;// making a variable to hold scale amount
  scaleFactor = map(mouseX,0,height,0.1,3);

  //scale makes the coordinate system larger or smaller 
  // it takes a "factor" as a parameter
  // if you supply two parameters, it scales differently
  // on c and y axes
  scale(scaleFactor);

  circle(0,0,100);
  circle(-15,-10,5);
  circle(15, -10,5);
  arc(0,0,60,60,0,PI);
  pop();// pop indicates the end of an isolated block

  //text function: text, x, y of top left corner
  text(mouseX +"," +mouseY,5,15);



  
}
