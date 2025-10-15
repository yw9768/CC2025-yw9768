let cookies = []; // empty array to hold on to pizza objects

function setup() {
	createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
	background(248, 248, 232);
	
	for(let i = 0; i < cookies.length; i++){
		cookies[i].drawCookie();
	}
}

function keyPressed(){
	let type;
	if(key == 'c'){
		type = 'choco';
	} else if (key == 's'){
		type = 'strawberry';
	} else if (key == 'm'){
		type = 'matcha';
	}

let size = random(110, 160); // 直径随机
let chipCount = random(14, 28); 


let newCookie = new Cookie(size, type, chipCount);
  cookies.push(newCookie);
}

class Cookie{
	constructor(size, type, chipCount) {
  this.cookieX = random(width);
  this.cookieY = random(height);
  this.chipCount = chipCount;
  this.size = size;    
  this.type = type;  
  if (this.type == "choco") { // 巧克力
  fill(190, 140, 90);
  } else if (this.type == "matcha") { // 抹茶
fill(180, 210, 150);
  } else { // 草莓
  fill(240, 170, 170);
  }
  this.cookieType = type;
  }



drawCookie(){
translate(this.cookieX, this.cookieY);
ellipse(0, 0, this.size, this.size);//曲奇主体
let r = this.size * 0.5; // 半径
for (let i = 0; i < this.chipCount; i++){//在圆外面画一个正方形，来判断点是不是都落在圆上而不是圆外了
let px = random(-r, r);//在正方形内随机取点来验证
let py = random(-r, r);
if (dist(0, 0, px, py) <= r){
if (this.type === "choco"){
fill(60, 40, 30);//巧克力豆的颜色
}else if (this.type === "matcha"){
fill(70, 100, 60);//抹茶豆颜色
}else{
fill(220, 80, 100);//草莓豆颜色
}
let d = random(this.size * 0.04, this.size * 0.09);
ellipse(px, py, d, d);
}
pop();
}



}
}

