// 飘动的眼球 👁️
// 使用 noise() 控制眼球飘动路径，sin() 和 cos() 控制旋转，lerp() 控制颜色渐变

let eyeCenterX, eyeCenterY;
let eyeOrbitNoiseX, eyeOrbitNoiseY; // noise 参数控制飘动
let eyeIrisPulseT;
let eyeOrbitSpeed;
let irisColorNoiseT; // 新增：虹膜颜色的 noise 参数

// drunk walk 瞳孔变量
let pupilDrunkX, pupilDrunkY;
let pupilDrunkR;

// 血丝变量
let veinPhase1, veinPhase2, veinPhase3, veinPhase4;

function setup() {
  createCanvas(400, 400);
  
  eyeCenterX = 200;
  eyeCenterY = 200;
  
  // 用 noise 控制眼球飘动
  eyeOrbitNoiseX = random(1000);
  eyeOrbitNoiseY = random(1000);
  eyeOrbitSpeed = 0.008;
  
  eyeIrisPulseT = 0;
  irisColorNoiseT = random(1000); // 初始化虹膜颜色 noise 参数
  
  // 初始化瞳孔 drunk walk
  pupilDrunkX = 0;
  pupilDrunkY = 0;
  pupilDrunkR = 14;
  
  // 初始化血丝动画相位
  veinPhase1 = random(100);
  veinPhase2 = random(100);
  veinPhase3 = random(100);
  veinPhase4 = random(100);
}

function draw() {
  // 纯黑色背景
  background(0);
  
  // 使用 noise() 让眼球飘动（平滑的随机路径）
  eyeOrbitNoiseX = eyeOrbitNoiseX + eyeOrbitSpeed;
  eyeOrbitNoiseY = eyeOrbitNoiseY + eyeOrbitSpeed;
  
  // 计算眼球位置（用 noise 代替圆周运动）
  let eyeBallX = eyeCenterX + map(noise(eyeOrbitNoiseX), 0, 1, -100, 100);
  let eyeBallY = eyeCenterY + map(noise(eyeOrbitNoiseY), 0, 1, -100, 100);
  
  noStroke();
  
  // 眼白（带点血丝的感觉，微微泛黄）
  fill(240, 235, 220);
  ellipse(eyeBallX, eyeBallY, 140, 140);
  
  // ========== 绘制血丝 ==========
  push();
  translate(eyeBallX, eyeBallY);
  
  // 更新血丝动画相位
  veinPhase1 = veinPhase1 + 0.01;
  veinPhase2 = veinPhase2 + 0.012;
  veinPhase3 = veinPhase3 + 0.008;
  veinPhase4 = veinPhase4 + 0.015;
  
  // 血丝颜色（带透明度的红色）
  let veinAlpha1 = map(sin(veinPhase1), -1, 1, 80, 140);
  let veinAlpha2 = map(sin(veinPhase2), -1, 1, 70, 130);
  let veinAlpha3 = map(sin(veinPhase3), -1, 1, 85, 145);
  let veinAlpha4 = map(sin(veinPhase4), -1, 1, 75, 135);
  
  strokeWeight(1.5);
  
  // 血丝1（右上方向）
  stroke(200, 30, 30, veinAlpha1);
  line(15, -8, 45, -35);
  line(45, -35, 55, -50);
  line(45, -35, 58, -42);
  
  // 血丝2（左上方向）
  stroke(210, 25, 25, veinAlpha2);
  line(-12, -10, -38, -40);
  line(-38, -40, -50, -55);
  line(-38, -40, -52, -45);
  
  // 血丝3（右下方向）
  stroke(190, 35, 35, veinAlpha3);
  line(18, 12, 42, 38);
  line(42, 38, 48, 52);
  line(42, 38, 55, 45);
  
  // 血丝4（左下方向）
  stroke(205, 28, 28, veinAlpha4);
  line(-15, 15, -40, 42);
  line(-40, 42, -52, 50);
  line(-40, 42, -48, 56);
  
  // 额外的细小血丝（增加细节）
  strokeWeight(1);
  stroke(180, 40, 40, 60);
  line(8, -20, 25, -45);
  line(-10, -18, -28, -48);
  line(10, 22, 30, 50);
  line(-8, 20, -25, 48);
  
  pop();
  
  noStroke();
  
  // 虹膜（诡异的红色，大小脉动）
  eyeIrisPulseT = eyeIrisPulseT + 0.03; // 决定脉冲速度
  let eyeIrisR = map(sin(eyeIrisPulseT), -1, 1, 33, 57);// 瞳膜大小变化，33-57 大小阈值
  
  // 使用 noise() 让虹膜颜色不规则变化
  irisColorNoiseT = irisColorNoiseT + 0.01;
  let irisColorCycle = noise(irisColorNoiseT); // noise 直接返回 0-1，不需要转换！
  
  let irisR = lerp(150, 220, irisColorCycle);
  let irisG = lerp(20, 50, irisColorCycle);
  let irisB = lerp(20, 30, irisColorCycle);
  
  fill(irisR, irisG, irisB);
  ellipse(eyeBallX, eyeBallY, eyeIrisR * 2, eyeIrisR * 2);
  
  // 瞳孔 - 使用 drunk walk（简单版）
  pupilDrunkX = pupilDrunkX + random(-1.5, 1.5);
  pupilDrunkY = pupilDrunkY + random(-1.5, 1.5);
  pupilDrunkR = pupilDrunkR + random(-0.5, 0.5);
  
  // 限制 X 范围（用 if 代替 constrain）
  if (pupilDrunkX > 8) {
    pupilDrunkX = 8;
  }
  if (pupilDrunkX < -8) {
    pupilDrunkX = -8;
  }
  
  // 限制 Y 范围
  if (pupilDrunkY > 8) {
    pupilDrunkY = 8;
  }
  if (pupilDrunkY < -8) {
    pupilDrunkY = -8;
  }
  
  // 限制半径范围
  if (pupilDrunkR > 18) {
    pupilDrunkR = 18;
  }
  if (pupilDrunkR < 10) {
    pupilDrunkR = 10;
  }
  
  fill(10, 10, 10);
  ellipse(eyeBallX + pupilDrunkX, eyeBallY + pupilDrunkY, pupilDrunkR * 2, pupilDrunkR * 2);
}