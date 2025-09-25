

function setup() {
  createCanvas(windowWidth, windowHeight);
  

  // interation operators;
  //i++ : adds 1 to i
  // i+=10: adds 10 to i
  // i--: subtracts 1 from i

  for(let i = 0; i<10; i++){
    console.log(i);
  }




}

function draw() {
  background("#e9d293ff")
 noLoop(); // prevents draw from 

  for(let y=50; y<height-50; y+=120){ 
    for(let x=50;x<width-50;x+=100){
 

    push();
  translate(x,y);
  //everything within this push/pop block
  //will be centered, with 0,0 as the center point

  let randomRotation;
  let randonAmount =0.075;
  let randomXDisp;
  let randomYDisp;

  randomXDisp = random(-y);
  translate(randomXDisp,0);



  strokeWeight(3);
  fill("yellow");

  circle(0,0,100);
  circle(-15,-10,10);
  circle(15,-10,10);
  let happiness;
  happiness= map(x,0,width,-25,25);
  arc(0,0,60,60,radians(0-happiness),radians(180+happiness));

  pop();
  }
  }
}
