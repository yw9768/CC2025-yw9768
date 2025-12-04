// 情绪类型变量 (使用字符串即可)
const EMOTION_ANXIETY = 'anxiety';
const EMOTION_HAPPY = 'happy';
const EMOTION_SAD = 'sad';
const EMOTION_CALM = 'calm';
const EMOTION_NEUTRAL = 'neutral'; // 新增中性

// 全局变量
let currentEmotion = EMOTION_CALM;
let quote = "拖动圣诞老人的脸到不同区域，体验不同的情绪！";

let facePos = { x: 0, y: 0 };
let isDragging = false;

// 目标参数 (我们希望达到的数值)
let targetParams = {
  eyeOpenness: 1,
  mouthCurve: 0,
  eyebrowAngle: 0,
  tremble: 0,
  pupilSize: 1
};

// 当前参数 (目前动画进行到的数值)
let currentParams = {
  eyeOpenness: 1,
  mouthCurve: 0,
  eyebrowAngle: 0,
  tremble: 0,
  pupilSize: 1
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  
  // 初始化脸部位置在中心
  facePos.x = width / 2;
  facePos.y = height / 2;
  
  // 一开始就判断一次情绪
  determineEmotion(facePos.x, facePos.y);
}

function draw() {
  // 1. 计算插值 (使用你学过的 lerp 让表情变化变平滑)
  updateFaceParams();
  
  // 2. 绘制背景
  drawBackground();
  
  // 3. 处理交互
  handleInteraction();
  
  // 4. 绘制 UI 文字
  drawUI();
  
  // 5. 绘制圣诞老人
  drawSanta();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ==================== 逻辑函数 ====================

function determineEmotion(x, y) {
  let centerX = width / 2;
  let centerY = height / 2;
  
  // 使用 dist() 计算当前脸的位置距离中心有多远
  let d = dist(x, y, centerX, centerY);
  
  let newEmotion = EMOTION_CALM;

  // 核心逻辑：如果距离中心小于 80 像素，就是中性 (Neutral)
  if (d < 80) {
    newEmotion = EMOTION_NEUTRAL;
    // 设置中性表情参数：平嘴、正常眼睛、无眉毛角度
    setParams(0.9, 0, 0, 0, 1.0); 
  } 
  // 否则，判断四个象限
  else if (x < centerX && y < centerY) {
    newEmotion = EMOTION_ANXIETY; // 左上
    setParams(1.2, -0.2, -0.5, 1, 0.5);
  } 
  else if (x >= centerX && y < centerY) {
    newEmotion = EMOTION_HAPPY;   // 右上
    setParams(0.9, 1, 0.2, 0, 1.2);
  } 
  else if (x < centerX && y >= centerY) {
    newEmotion = EMOTION_SAD;     // 左下
    setParams(0.6, -1, 0.8, 0, 1);
  } 
  else {
    newEmotion = EMOTION_CALM;    // 右下
    setParams(0.4, 0.1, 0, 0, 1);
  }

  // 如果情绪改变了，更新语录
  if (newEmotion !== currentEmotion) {
    currentEmotion = newEmotion;
    updateQuote(newEmotion);
  }
}

// 简单的辅助函数，用来设置目标参数
function setParams(eye, mouth, brow, tremble, pupil) {
  targetParams.eyeOpenness = eye;
  targetParams.mouthCurve = mouth;
  targetParams.eyebrowAngle = brow;
  targetParams.tremble = tremble;
  targetParams.pupilSize = pupil;
}

function updateFaceParams() {
  // 使用 lerp() 让数值慢慢接近目标，产生动画效果
  let amt = 0.1;
  currentParams.eyeOpenness = lerp(currentParams.eyeOpenness, targetParams.eyeOpenness, amt);
  currentParams.mouthCurve = lerp(currentParams.mouthCurve, targetParams.mouthCurve, amt);
  currentParams.eyebrowAngle = lerp(currentParams.eyebrowAngle, targetParams.eyebrowAngle, amt);
  currentParams.tremble = lerp(currentParams.tremble, targetParams.tremble, amt);
  currentParams.pupilSize = lerp(currentParams.pupilSize, targetParams.pupilSize, amt);
}

function handleInteraction() {
  if (mouseIsPressed) {
    // 检查鼠标是否在脸附近
    let d = dist(mouseX, mouseY, facePos.x, facePos.y);
    if (d < 120 || isDragging) {
      isDragging = true;
      // 使用 lerp 让脸跟随鼠标，有一点延迟感
      facePos.x = lerp(facePos.x, mouseX, 0.25);
      facePos.y = lerp(facePos.y, mouseY, 0.25);
      
      // 限制脸不出屏幕
      facePos.x = constrain(facePos.x, 60, width - 60);
      facePos.y = constrain(facePos.y, 60, height - 60);

      determineEmotion(facePos.x, facePos.y);
    }
  } else {
    isDragging = false;
  }
}

function updateQuote(emotion) {
  if (emotion === EMOTION_ANXIETY) quote = "深呼吸，一切都会好起来的。焦虑是暂时的。";
  if (emotion === EMOTION_HAPPY) quote = "快乐是最好的礼物！让笑容继续绽放吧！";
  if (emotion === EMOTION_SAD) quote = "悲伤也是情绪的一部分，允许自己感受它。";
  if (emotion === EMOTION_CALM) quote = "平静的心灵是最珍贵的宝藏。享受这一刻的宁静。";
  if (emotion === EMOTION_NEUTRAL) quote = "保持中立与平衡，感受当下的存在。"; // 新语录
}

// ==================== 绘制函数 ====================

function drawBackground() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;

  // 定义颜色
  let cAnxiety = color(220, 210, 230);
  let cHappy = color(255, 245, 200);
  let cSad = color(200, 220, 240);
  let cCalm = color(210, 240, 225);

  // 绘制四个背景矩形
  fill(cAnxiety); rect(cx/2, cy/2, cx, cy);
  fill(cHappy);   rect(cx + cx/2, cy/2, cx, cy);
  fill(cSad);     rect(cx/2, cy + cy/2, cx, cy);
  fill(cCalm);    rect(cx + cx/2, cy + cy/2, cx, cy);

  // 绘制当前选中区域的高亮圆圈
  let activeColor = color(255, 100); // 默认白色半透明
  if (currentEmotion === EMOTION_ANXIETY) activeColor = color(180, 160, 200, 150);
  if (currentEmotion === EMOTION_HAPPY) activeColor = color(255, 220, 100, 150);
  if (currentEmotion === EMOTION_SAD) activeColor = color(150, 180, 220, 150);
  if (currentEmotion === EMOTION_CALM) activeColor = color(160, 220, 180, 150);
  if (currentEmotion === EMOTION_NEUTRAL) activeColor = color(255, 255, 255, 180); // 中性时更亮

  fill(activeColor);
  circle(facePos.x, facePos.y, 300);
  
  // 画中间的虚线提示圈 (既然不能用 drawingContext，我们用点代替虚线)
  // 这是为了提示用户这里有个“中性区”
  noFill();
  stroke(255, 150);
  strokeWeight(2);
  circle(width/2, height/2, 160); // 80半径 * 2 = 160直径

  // 分割线
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
  
  // 绘制象限文字
  noStroke();
  fill(0, 50);
  textSize(24);
  textStyle(BOLD);
  text("ANXIETY", width * 0.25, 40);
  text("HAPPY", width * 0.75, 40);
  text("SAD", width * 0.25, height / 2 + 40);
  text("CALM", width * 0.75, height / 2 + 40);
}

function drawUI() {
  // 标题
  textSize(48);
  fill(0, 150);
  textStyle(BOLD);
  // toUpperCase() 把文字变大写
  text(currentEmotion.toUpperCase(), width / 2, height / 2);

  // 底部文字框
  let boxW = min(width * 0.9, 600);
  let boxH = 120;
  let boxX = width / 2;
  let boxY = height - 80;

  rectMode(CENTER);
  fill(255, 240);
  stroke(255);
  strokeWeight(2);
  rect(boxX, boxY, boxW, boxH, 20);

  noStroke();
  fill(50);
  textSize(18);
  textStyle(NORMAL);
  text(quote, boxX, boxY, boxW - 40, boxH - 20); // 这里的rectMode是CENTER，text会自动换行
}

function drawSanta() {
  push(); // 保存当前坐标系
  
  // 颤抖效果 (使用 random)
  let shakeX = 0;
  let shakeY = 0;
  if (currentParams.tremble > 0.1) {
    shakeX = random(-2, 2) * currentParams.tremble;
    shakeY = random(-2, 2) * currentParams.tremble;
  }

  translate(facePos.x + shakeX, facePos.y + shakeY);
  scale(1.2);

  // --- 保持你原来的好看画法 ---
  
  // 帽子
  fill(220, 40, 40);
  noStroke();
  beginShape();
  vertex(-60, -40);
  vertex(60, -40);
  bezierVertex(50, -100, -20, -130, -70, -60); // 保持贝塞尔曲线让帽子圆润
  endShape(CLOSE);
  
  // 帽子球
  fill(255);
  ellipse(-70, -60, 25, 25);

  // 脸
  fill(255, 220, 200);
  noStroke();
  ellipse(0, 0, 120, 120);

  // 胡子
  fill(245, 245, 250);
  beginShape();
  vertex(-60, 0);
  bezierVertex(-70, 80, -30, 110, 0, 110);
  bezierVertex(30, 110, 70, 80, 60, 0);
  endShape(CLOSE);
  
  // 胡须
  fill(255);
  arc(-20, 20, 40, 30, PI + 0.5, 0);
  arc(20, 20, 40, 30, PI, -0.5);

  // 眼睛
  let eyeY = -15;
  let eyeX = 25;
  let open = currentParams.eyeOpenness * 15;
  
  fill(0);
  ellipse(-eyeX, eyeY, 12, open);
  ellipse(eyeX, eyeY, 12, open);

  // 眼睛高光
  if (currentParams.pupilSize > 1.1) {
    fill(255);
    ellipse(-eyeX + 2, eyeY - 2, 4, 4);
    ellipse(eyeX + 2, eyeY - 2, 4, 4);
  }

  // 眉毛 (使用 push/pop 和 rotate)
  noFill();
  stroke(240);
  strokeWeight(6);
  let browAngle = currentParams.eyebrowAngle;
  
  push();
  translate(-eyeX, eyeY - 20);
  rotate(-browAngle);
  line(-15, 0, 15, 0);
  pop();

  push();
  translate(eyeX, eyeY - 20);
  rotate(browAngle);
  line(-15, 0, 15, 0);
  pop();

  // 嘴巴
  stroke(180, 100, 100);
  strokeWeight(3);
  noFill();
  
  let curve = currentParams.mouthCurve;
  let mouthY = 35;
  
  // === 这里的逻辑修改了 ===
  // 如果 curve 很小（中性表情），使用 line() 画直线
  // abs() 是取绝对值
  if (abs(curve) < 0.05) {
    line(-15, mouthY, 15, mouthY); 
  } 
  else if (curve > 0) {
    // 快乐：开口向上
    arc(0, mouthY - 5, 30, 20 * curve, 0, PI);
  } 
  else {
    // 悲伤/焦虑：开口向下
    // abs(curve) 确保高度是正数
    arc(0, mouthY + 5, 30, 20 * abs(curve), PI, 0);
  }
  
  // 颤抖时的锯齿嘴 (Anxiety 状态)
  if (currentParams.tremble > 0.5) {
    // 先画个肤色方块盖住原来的嘴
    fill(255, 220, 200); 
    noStroke();
    rect(0, mouthY, 40, 20); 
    
    // 画锯齿线
    noFill();
    stroke(180, 100, 100);
    strokeWeight(3);
    beginShape();
    vertex(-10, mouthY);
    vertex(-5, mouthY + 2);
    vertex(0, mouthY - 2);
    vertex(5, mouthY + 2);
    vertex(10, mouthY);
    endShape();
  }

  // 帽子边缘
  fill(255);
  noStroke();
  rect(0, -50, 130, 30, 15); // 使用带圆角的 rect

  // 鼻子
  fill(240, 160, 160);
  ellipse(0, 10, 18, 18);

  pop(); // 恢复坐标系
}