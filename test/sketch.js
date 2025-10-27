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

	this.chips = [];
let r = this.size * 0.5; // 半径

for (let i = 0; i < this.chipCount; i++){
// 使用极坐标生成圆内的随机点
let angle = random(TWO_PI); // 随机角度
let distance = sqrt(random()) * r; // 随机距离（sqrt确保均匀分布）
let px = distance * cos(angle); // 转换成 x 坐标
let py = distance * sin(angle); // 转换成 y 坐标
let d = random(this.size * 0.04, this.size * 0.09);
this.chips.push({x: px, y: py, diameter: d});
  }
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


