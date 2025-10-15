// drunk walk

let drunkX = 250; // initial x position of circle
let drunkY = 250; // initial y position of circle
let drunkRange = 5;

function setup() {
	createCanvas(500, 500);
	background(100);
}

function draw() {
	drawDrunk(25,map(mouseX,0,width,0,10));
	//drawDrunk(25,map(mouseX,0,width,0,10)); // try this
}

function drawDrunk(diameter,range){
	drunkX = drunkX+random(-range,range);
	drunkY = drunkY+random(-range,range);
	circle(drunkX, drunkY, diameter);
}