// === 全局变量 ===
let santaX = 0;
let santaY = 0;

// ML5 变量
let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

// 嘴巴交互变量
let mouthOpenAmount = 0;
let isMouthOpen = false;

// 特效粒子系统
let particles = []; 
let modelIsLoaded = false;

function preload() {
faceMesh = ml5.faceMesh(options);
}

function setup() {
createCanvas(windowWidth, windowHeight);
rectMode(CENTER);
textAlign(CENTER, CENTER);
noStroke();

video = createCapture(VIDEO);
video.size(640, 480);
video.hide();

faceMesh.detectStart(video, gotFaces);

santaX = width / 2;
santaY = height / 2;
}

function gotFaces(results) {
faces = results;
if (!modelIsLoaded && faces.length > 0) {
modelIsLoaded = true;
console.log("模型已启动!");
}
}

function draw() {
drawBackground();

// 1. 核心逻辑 (计算位置、情绪)
let interactData = updateInteraction();

// 2. 【关键修改】先画圣诞老人！
// 这样后面画的粒子才会出现在他“上面”，而不是背后
drawSanta(interactData.emotion, interactData.intensity);

// 3. 【关键修改】再画特效
// 这样特效会盖住脸，看起来是从嘴/眼睛里出来的
if (interactData.emotion === "anxiety" && isMouthOpen) {
drawGlitchEffect(); 
} else {
updateAndDrawParticles(); 
}
}

function windowResized() {
resizeCanvas(windowWidth, windowHeight);
}

// ==================== 逻辑处理核心 ====================

function updateInteraction() {
let currentEmotion = "neutral";
let intensity = 0; 
let cx = width / 2;
let cy = height / 2;

if (faces.length > 0) {
let face = faces[0];
// A. 更新位置
let nose = face.keypoints[4]; 
let targetX = map(nose.x, 0, video.width, 0, width);
let targetY = map(nose.y, 0, video.height, 0, height);
santaX = lerp(santaX, targetX, 0.1);
santaY = lerp(santaY, targetY, 0.1);

// B. 计算嘴巴
let upperLip = face.keypoints[13];
let lowerLip = face.keypoints[14];
let mouthDist = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
mouthOpenAmount = map(mouthDist, 0, 40, 0, 1, true);
isMouthOpen = mouthOpenAmount > 0.25; 

// C. 判断区域
if (santaX < cx && santaY < cy) currentEmotion = "anxiety"; 
else if (santaX >= cx && santaY < cy) currentEmotion = "happy"; 
else if (santaX < cx && santaY >= cy) currentEmotion = "sad"; 
else currentEmotion = "calm"; 

// D. 计算强度
let d = dist(santaX, santaY, cx, cy);
intensity = map(d, 0, width/2, 0, 1, true);
}

// E. 生成特效粒子
if (isMouthOpen) {
spawnParticles(currentEmotion);
}

return { emotion: currentEmotion, intensity: intensity };
}

// ==================== 特效系统 (修改了坐标逻辑) ====================

function spawnParticles(emotion) {
// 控制生成速度
if (frameCount % 5 !== 0 && emotion !== "anxiety") return;

// 1. HAPPY (嘴巴吐出)
if (emotion === "happy") {
let type = random() > 0.5 ? "text" : "shape";
// 嘴巴坐标大概在 santaY + 35
particles.push(new Particle(santaX, santaY + 35, "happy", type));
} 
// 2. SAD (【关键修改】眼睛流出)
else if (emotion === "sad") {
// 只有 SAD 的时候，我们一次生成两个粒子，分别对应左右眼
// 左眼 (-25, -15), 右眼 (25, -15)
particles.push(new Particle(santaX - 25, santaY - 15, "sad", "tear")); // 左眼
particles.push(new Particle(santaX + 25, santaY - 15, "sad", "tear")); // 右眼
} 
// 3. CALM (【关键修改】禅意呼吸圈)
else if (emotion === "calm") {
// 生成慢一点，要有节奏感
if (frameCount % 10 === 0) {
particles.push(new Particle(santaX, santaY + 35, "calm", "breath"));
}
}
}

function updateAndDrawParticles() {
for (let i = particles.length - 1; i >= 0; i--) {
let p = particles[i];
p.update();
p.display();
if (p.isDead()) {
particles.splice(i, 1);
}
}
}

class Particle {
constructor(x, y, emotion, type) {
this.x = x + random(-5, 5); // 稍微有点随机偏移
this.y = y;
this.emotion = emotion;
this.type = type; 
this.alpha = 255;
// Happy: 还是四散飞溅
if (emotion === "happy") {
this.vx = random(-4, 4);
this.vy = random(2, 6); // 向下喷
this.size = random(15, 25);
this.color = color(random(255), random(255), random(255));
this.text = "HA";
}
// Sad: 向上飞的眼泪 (反重力)
else if (emotion === "sad") {
this.vx = random(-0.5, 0.5); // 横向偏移小一点
this.vy = random(-3, -6); // 快速向上飞
this.size = random(5, 10);
this.color = color(100, 150, 255);
}
// Calm: 呼吸圈 (白色，扩散)
else if (emotion === "calm") {
this.x = x; // 修正回正中心，不要随机偏移
this.vx = 0;
this.vy = 0.5; // 缓慢下沉一点点
this.size = 10; 
this.growth = 1.5; // 缓慢变大
this.color = color(255, 255, 255);
this.alpha = 150; // 初始半透明
}
}

update() {
this.x += this.vx;
this.y += this.vy;
this.alpha -= 3; 

if (this.emotion === "calm") {
this.size += this.growth; 
this.alpha -= 1.5; // 消失得慢一点
}
}

display() {
noStroke();
if (this.type === "text") {
fill(red(this.color), green(this.color), blue(this.color), this.alpha);
textSize(this.size);
textStyle(BOLD);
text(this.text, this.x, this.y);
} 
else if (this.type === "shape") {
fill(red(this.color), green(this.color), blue(this.color), this.alpha);
rect(this.x, this.y, this.size, this.size);
} 
else if (this.type === "tear") {
fill(red(this.color), green(this.color), blue(this.color), this.alpha);
ellipse(this.x, this.y, this.size, this.size * 1.5); 
} 
else if (this.type === "breath") {
// 禅意呼吸圈：空心圆
noFill();
stroke(255, this.alpha);
strokeWeight(3);
circle(this.x, this.y, this.size);
}
}

isDead() {
return this.alpha <= 0;
}
}

function drawGlitchEffect() {
// 焦虑：故障特效覆盖全屏
for (let i = 0; i < 15; i++) {
let h = random(5, 50);
let y = random(height);
let offset = random(-20, 20);
fill(random(255), random(255), random(255), 150);
noStroke();
rect(width/2 + offset, y, width, h);
// 模拟信号线
fill(0, 80);
rect(width/2, random(height), width, 2); 
}
}

// ==================== 绘制背景 ====================

function drawBackground() {
let cx = width / 2;
let cy = height / 2;
noStroke();
fill(220, 210, 230); rect(cx/2, cy/2, cx, cy); 
fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy); 
fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy); 
fill(210, 240, 225); rect(cx + cx/2, cy + cy/2, cx, cy); 

fill(0, 50);
noStroke();
textSize(20);
text("ANXIETY", 60, 30);
text("HAPPY", width - 60, 30);
text("SAD", 60, height - 30);
text("CALM", width - 60, height - 30);

stroke(255, 150);
strokeWeight(4);
line(cx, 0, cx, height);
line(0, cy, width, cy);
}

// ==================== 绘制圣诞老人 ====================

function drawSanta(emotion, intensity) {
push();
let shakeX = 0;
let shakeY = 0;
if (emotion === "anxiety") {
let shakeAmount = intensity * 10; 
shakeX = random(-shakeAmount, shakeAmount);
shakeY = random(-shakeAmount, shakeAmount);
}

translate(santaX + shakeX, santaY + shakeY); 
scale(1.2); 

// --- 1. 帽子 ---
fill(220, 40, 40);
noStroke();
beginShape();
curveVertex(60, -40); curveVertex(60, -40);
curveVertex(40, -90);
curveVertex(0, -110);
curveVertex(-50, -90);
curveVertex(-90, -40); curveVertex(-90, -40);
endShape();
fill(255);
ellipse(-90, -40, 28, 28);

// --- 2. 脸 ---
fill(255, 220, 200);
noStroke();
ellipse(0, 0, 120, 120);

// --- 3. 胡子 ---
fill(245, 245, 250);
noStroke();
beginShape();
curveVertex(-60, 0); curveVertex(-60, 0);
curveVertex(-60, 60);
curveVertex(-35, 105);
curveVertex(0, 110);
curveVertex(35, 105);
curveVertex(60, 60);
curveVertex(60, 0); curveVertex(60, 0);
endShape(CLOSE);
fill(255);
arc(-20, 20, 40, 30, PI + 0.5, 0);
arc(20, 20, 40, 30, PI, -0.5);

// --- 4. 眼睛 ---
fill(0);
ellipse(-25, -15, 12, 15); 
ellipse(25, -15, 12, 15);
fill(255);
ellipse(-23, -17, 4, 4);
ellipse(27, -17, 4, 4);

// --- 5. 动态五官 ---
drawDynamicFeatures(emotion, intensity);

// --- 6. 帽子白边 ---
fill(255);
noStroke();
rect(0, -50, 130, 30, 15);

// --- 7. 鼻子 ---
fill(240, 160, 160);
ellipse(0, 10, 18, 18);

pop();
}

function drawDynamicFeatures(emotion, intensity) {
noFill();
// A. 眉毛
stroke(240);
strokeWeight(6);
if (emotion === "happy") {
let arch = 20 + intensity * 20; 
arc(-25, -35, 30, arch, PI, 0); 
arc(25, -35, 30, arch, PI, 0);
} 
else if (emotion === "sad") {
let slope = 10 + intensity * 15;
line(-40, -40, -10, -40 - slope);
line(10, -40 - slope, 40, -40);
} 
else if (emotion === "anxiety") {
line(-40, -50, -10, -30);
line(10, -30, 40, -50);
} 
else {
line(-40, -35, -10, -35); 
line(10, -35, 40, -35); 
}

// B. 嘴巴
stroke(180, 100, 100);
strokeWeight(3);

if (isMouthOpen) {
// 张嘴
fill(50, 0, 0); 
noStroke();
if (emotion === "happy") arc(0, 35, 30 + intensity*10, 40, 0, PI); 
else if (emotion === "sad") ellipse(0, 45, 20, 30 + intensity*10); 
else if (emotion === "anxiety") { 
beginShape();
for(let i=0; i<360; i+=45) {
let r = 15 + random(5);
let x = r * cos(radians(i));
let y = 35 + r * sin(radians(i));
vertex(x, y);
}
endShape(CLOSE);
}
else ellipse(0, 35, 20, 20); 

} else {
// 闭嘴
noFill();
if (emotion === "happy") {
let curve = 20 + intensity * 20;
arc(0, 30, 30, curve, 0, PI);
} 
else if (emotion === "sad") {
let curve = 20 + intensity * 20;
arc(0, 45, 30, curve, PI, 0);
} 
else if (emotion === "anxiety") {
beginShape();
vertex(-15, 40); vertex(-5, 35); vertex(5, 45); vertex(15, 40);
endShape();
} 
else {
line(-15, 35, 15, 35);
}
}
}
