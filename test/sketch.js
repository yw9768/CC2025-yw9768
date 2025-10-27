let cookies = []; // empty array to hold on to cookie objects

let padSize, padX, padY, padRadius;
function setup() {
	createCanvas(windowWidth, windowHeight);
  noStroke();

  //// set the size of the pad will draw later
  padSize = width * 0.8;
  padX = width / 2;
  padY = height / 2;
  padR = padSize / 2;
}

////draw the background and the pad laying on the table
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

  // draw the thicker outer edge of the pad
  //(draw a smaller pad with a stroke of 3 inside the pad)
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

  function mousePressed() { // runs ONCE when the mouse is clicked
  let amIHovering = false;
  for(let i = 0; i < cookies.length; i++){
    if(cookies[i].hovering == true){
      // Array.splice is a method for removing elements from an array
      // parameter one is the element to remove
      // parameter two is how many elements to remove
      cookies.splice(i, 1); // erase element i from our array. erase only one element.
      amIHovering = true; // flip the am I hovering variable to true, since the mouse click intersected with a cookie
    }
  }
  
  if(amIHovering == false){ // if no hovering was detected in previous for loop...

  

}
}

class Cookie{
  constructor(size, type, chipCount) {//set up initial cookie state
    this.cookieX = random(width);//generate random x at instantiation
    this.cookieY = random(height);// generate random y at instantiation
    this.chipCount = chipCount;
    this.size = size;    
    this.type = type;
    this.hovering = false;

  
  // 饼干半径
  let cookieR = this.size / 2;
  
  // 确保饼干完全在硅胶垫内（硅胶垫半径 - 饼干半径）
  let maxDistance = padR - cookieR;
  
  // 使用极坐标在圆内随机生成位置
  let angle = random(TWO_PI);
  let distance = random(maxDistance);
  
  this.cookieX = padX + distance * cos(angle);
  this.cookieY = padY + distance * sin(angle);


	this.chips = [];

for (let i = 0; i < this.chipCount; i++){
  let angle = random(TWO_PI);
  let distance = random(cookieR);  // ← 直接用 random
  let px = distance * cos(angle);
  let py = distance * sin(angle);
  let d = random(this.size * 0.04, this.size * 0.09);
  this.chips.push({x: px, y: py, diameter: d});
}
  }

  
  drawCookie(){
    // 新增：检测鼠标是否悬停在饼干上（和 bug 的 display 方法类似）
    if(dist(mouseX, mouseY, this.cookieX, this.cookieY) < this.size / 2){
      // 鼠标悬停在饼干上
      this.hovering = true;
    } else {
      // 鼠标没有悬停在饼干上
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
   

    // toppings by type 
    if (this.type == "strawberry") { // start drawing toppings of strawberry chip cookies
  fill(200, 130, 130);
  ellipse(3, 3, this.size, this.size); // 稍微偏移制造阴影
  
  // 主体
  fill(240, 170, 170);
  ellipse(0, 0, this.size, this.size);

for (let i = 0; i < this.chips.length; i++){
	 fill(180, 50, 70);
    ellipse(this.chips[i].x, this.chips[i].y, 
            this.chips[i].diameter * 1.2, this.chips[i].diameter * 1.2);//草莓豆底色
 fill(220, 80, 100); // 草莓豆颜色
        ellipse(this.chips[i].x, this.chips[i].y, this.chips[i].diameter, this.chips[i].diameter);
      
      }

    } else if (this.type == "choco") {
  // 1. 先画阴影（最底层）
  fill(160, 110, 70);
  ellipse(4, 4, this.size, this.size);
  
  // 2. 再画饼干主体
  fill(190, 140, 90);
  ellipse(0, 0, this.size, this.size);
  
  // 3. 然后画巧克力 chips（在饼干上面）
  for (let i = 0; i < this.chips.length; i++){
    fill(40, 25, 20); // 深色底
    ellipse(this.chips[i].x, this.chips[i].y, 
            this.chips[i].diameter * 1.3, this.chips[i].diameter * 1.3);
    
    fill(60, 40, 30); // 巧克力色
    ellipse(this.chips[i].x, this.chips[i].y, 
            this.chips[i].diameter * 1.1, this.chips[i].diameter * 1.1);
  }
  
  // 4. 最后画棉花糖（最上层，盖住部分 chips）
  let marshmallowD = this.size * 0.28;
  rectMode(CENTER);
  
  // 棉花糖阴影
  fill(200, 200, 200);
  rect(2, 2, marshmallowD, marshmallowD, marshmallowD * 0.2);
  
  // 棉花糖主体
  fill(255, 250, 245);
  rect(0, 0, marshmallowD, marshmallowD, marshmallowD * 0.2);



   } else if (this.type == "avocado") {//start drawing toopings of avocado cookie

  fill(140, 130, 90);//牛油果的底部阴影
  ellipse(4, 4, this.size, this.size);

  
  fill(110, 120, 70); //牛油果绿色外皮
  ellipse(0, 0, this.size, this.size);//draw a circle as the dark green skin of avocado

  fill(190, 230, 160);  //ligther green 
  ellipse(0, 0, this.size*0.85, this.size*0.92);//draw a smaller ellipse as avocado's flesh 

  //start drawing pit
  let pitD = this.size * 0.32;//设置果核直径大小
  
  // draw the shadow of the whole avocado pit
  fill(90, 60, 35);
  ellipse(1.5, 1.5, pitD, pitD);
  
  //draw the brown pit in the center
  fill(130, 85, 50);
  ellipse(0, 0, pitD, pitD);
  
  // 再绘制一层果核暗部（增加立体感）
  fill(105, 70, 40);
  ellipse(2.5, 2.5, pitD * 0.88, pitD * 0.88);
  
    }

    pop();
  }
}


