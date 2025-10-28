// ===== Whispering Candle — Simple Eerie Version =====
// 使用 sin()、noise()、lerp() 和 random() 创建简单的诡异蜡烛动画

// 蜡烛1变量
let cbCenterX, cbBaseY;
let cbFlamePhase;
let cbFlickerNoise;

// 蜡烛2变量
let cb2CenterX, cb2BaseY;
let cb2FlamePhase;
let cb2FlickerNoise;

// 蜡烛3变量
let cb3CenterX, cb3BaseY;
let cb3FlamePhase;
let cb3FlickerNoise;

function setup() {
  createCanvas(400, 400);
  noStroke();
  
  // 蜡烛1
  cbCenterX = 120;
  cbBaseY = 280;
  cbFlamePhase = 0;
  cbFlickerNoise = random(1000);
  
  // 蜡烛2
  cb2CenterX = 200;
  cb2BaseY = 280;
  cb2FlamePhase = 0;
  cb2FlickerNoise = random(1000);
  
  // 蜡烛3
  cb3CenterX = 280;
  cb3BaseY = 280;
  cb3FlamePhase = 0;
  cb3FlickerNoise = random(1000);
}

function draw() {
  // 纯黑背景
  background(0);
  
  // ========== 蜡烛1 ==========
  // 蜡烛主体
  rectMode(CENTER);
  fill(220, 215, 205);
  rect(cbCenterX, cbBaseY, 40, 120, 8);
  
  // 烛芯
  fill(25, 25, 30);
  rect(cbCenterX, cbBaseY - 65, 4, 16, 2);
  
  // 火焰动画参数
  cbFlamePhase = cbFlamePhase + 0.02;//步长
  cbFlickerNoise = cbFlickerNoise + 0.015;
  
  // 火焰高度：sin() 呼吸 + noise() 闪烁
  let cbFlameH = map(sin(cbFlamePhase), -1, 1, 40, 80);
  // 火焰宽度
  let cbFlameW = map(sin(cbFlamePhase), -1, 1, 24, 28);
  
  // 火焰颜色：lerp() 在暗橙和诡绿之间
  let t = millis() * 0.0005;          // 调快/慢：改这个系数
  let cbColorCycle = noise(t);        // 0..1
  let cbOuterR = lerp(180, 100, cbColorCycle);
  let cbOuterG = lerp(80, 200, cbColorCycle);
  let cbOuterB = lerp(0, 120, cbColorCycle);
  
  // 绘制火焰
  push();
  translate(cbCenterX, cbBaseY - 75);
  
  // 外焰
  fill(cbOuterR, cbOuterG, cbOuterB, 200);
  ellipse(0, -cbFlameH * 0.25, cbFlameW, cbFlameH);
  
  // 内焰（更亮）
  fill(cbOuterR + 30, cbOuterG + 50, cbOuterB + 60, 220);
  ellipse(0, -cbFlameH * 0.18, cbFlameW * 0.6, cbFlameH * 0.65);
  
  pop();
  
  
  // ========== 蜡烛2 ==========
  // 蜡烛主体
  rectMode(CENTER);
  fill(220, 215, 205);
  rect(cb2CenterX, cb2BaseY, 40, 120, 8);
  
  // 烛芯
  fill(25, 25, 30);
  rect(cb2CenterX, cb2BaseY - 65, 4, 16, 2);
  
  // 火焰动画参数
  cb2FlamePhase = cb2FlamePhase + 0.02;//步长
  cb2FlickerNoise = cb2FlickerNoise + 0.015;
  
  // 火焰高度：sin() 呼吸 + noise() 闪烁
  let cb2FlameH = map(sin(cb2FlamePhase), -1, 1, 40, 80);
  // 火焰宽度
  let cb2FlameW = map(sin(cb2FlamePhase), -1, 1, 24, 28);
  
  // 火焰颜色：lerp() 在暗橙和诡绿之间
  let cb2ColorCycle = noise(t);        // 0..1
  let cb2OuterR = lerp(180, 100, cb2ColorCycle);
  let cb2OuterG = lerp(80, 200, cb2ColorCycle);
  let cb2OuterB = lerp(0, 120, cb2ColorCycle);
  
  // 绘制火焰
  push();
  translate(cb2CenterX, cb2BaseY - 75);
  
  // 外焰
  fill(cb2OuterR, cb2OuterG, cb2OuterB, 200);
  ellipse(0, -cb2FlameH * 0.25, cb2FlameW, cb2FlameH);
  
  // 内焰（更亮）
  fill(cb2OuterR + 30, cb2OuterG + 50, cb2OuterB + 60, 220);
  ellipse(0, -cb2FlameH * 0.18, cb2FlameW * 0.6, cb2FlameH * 0.65);
  
  pop();
  
  
  // ========== 蜡烛3 ==========
  // 蜡烛主体
  rectMode(CENTER);
  fill(220, 215, 205);
  rect(cb3CenterX, cb3BaseY, 40, 120, 8);
  
  // 烛芯
  fill(25, 25, 30);
  rect(cb3CenterX, cb3BaseY - 65, 4, 16, 2);
  
  // 火焰动画参数
  cb3FlamePhase = cb3FlamePhase + 0.02;//步长
  cb3FlickerNoise = cb3FlickerNoise + 0.015;
  
  // 火焰高度：sin() 呼吸 + noise() 闪烁
  let cb3FlameH = map(sin(cb3FlamePhase), -1, 1, 40, 80);
  // 火焰宽度
  let cb3FlameW = map(sin(cb3FlamePhase), -1, 1, 24, 28);
  
  // 火焰颜色：lerp() 在暗橙和诡绿之间
  let cb3ColorCycle = noise(t);        // 0..1
  let cb3OuterR = lerp(180, 100, cb3ColorCycle);
  let cb3OuterG = lerp(80, 200, cb3ColorCycle);
  let cb3OuterB = lerp(0, 120, cb3ColorCycle);
  
  // 绘制火焰
  push();
  translate(cb3CenterX, cb3BaseY - 75);
  
  // 外焰
  fill(cb3OuterR, cb3OuterG, cb3OuterB, 200);
  ellipse(0, -cb3FlameH * 0.25, cb3FlameW, cb3FlameH);
  
  // 内焰（更亮）
  fill(cb3OuterR + 30, cb3OuterG + 50, cb3OuterB + 60, 220);
  ellipse(0, -cb3FlameH * 0.18, cb3FlameW * 0.6, cb3FlameH * 0.65);
  
  pop();
}