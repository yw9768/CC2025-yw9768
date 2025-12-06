let santaX = 0;
let santaY = 0;

// ML5 变量
let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

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
}

function draw() {
  drawBackground();

  // 1. 计算逻辑
  let data = updateSantaLogic();

  // 2. 绘制圣诞老人
  drawSanta(data.emotion, data.intensity);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ==================== 核心逻辑 ====================

function updateSantaLogic() {
  let currentEmotion = "neutral";
  let intensity = 0; 
  let cx = width / 2;
  let cy = height / 2;

  if (faces.length > 0) {
    let face = faces[0];
    
    // A. 鼻尖控制
    let nose = face.keypoints[4]; 
    let targetX = map(nose.x, 0, video.width, 0, width);
    let targetY = map(nose.y, 0, video.height, 0, height);
    
    santaX = lerp(santaX, targetX, 0.1);
    santaY = lerp(santaY, targetY, 0.1);

    // 计算距离中心的距离
    let d = dist(santaX, santaY, cx, cy);

    // 定义中心区域阈值 (100像素)
    let centerThreshold = 100;

    if (d < centerThreshold) {
      currentEmotion = "neutral";
      intensity = 0;
    } else {
      // 判断象限
      if (santaX < cx && santaY < cy) currentEmotion = "anxiety"; // 左上
      else if (santaX >= cx && santaY < cy) currentEmotion = "happy"; // 右上
      else if (santaX < cx && santaY >= cy) currentEmotion = "sad";   // 左下
      else currentEmotion = "calm";  // 右下
      
      // 强度计算
      intensity = map(d, centerThreshold, width/2, 0, 1, true);
    }
  }

  return { emotion: currentEmotion, intensity: intensity };
}

// ==================== 绘制背景 ====================

function drawBackground() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;

  // 左上 (Anxiety): 紫色
  fill(220, 210, 230); rect(cx/2, cy/2, cx, cy);         
  // 右上 (Happy): 黄色
  fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy);    
  // 左下 (Sad): 蓝色
  fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy);    
  
  // 【关键修改】右下 (Calm): 温和的浅绿色 (Gentle Green)
  fill(215, 235, 215); rect(cx + cx/2, cy + cy/2, cx, cy); 

    // 绘制象限标签文字 - 放在每个象限的正中央
  fill(0, 50); // 半透明黑色
   textSize(48); // 更大的字体
   text("ANXIETY", cx / 2, cy / 2);           // 左上象限中心
   text("HAPPY", cx + cx / 2, cy / 2);        // 右上象限中心
   text("SAD", cx / 2, cy + cy / 2);          // 左下象限中心
   text("CALM", cx + cx / 2, cy + cy / 2);    // 右下象限中心

  // 分割线
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
}

// ==================== 绘制圣诞老人 ====================

function drawSanta(emotion, intensity) {
  push();
  
  // 焦虑颤抖
  let shakeX = 0;
  let shakeY = 0;
  if (emotion === "anxiety") {
    let shakeAmount = intensity * 8; 
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
  curveVertex(40, -90); curveVertex(0, -110);  
  curveVertex(-50, -90); curveVertex(-90, -40); 
  curveVertex(-90, -40); 
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
  curveVertex(-65, 50); curveVertex(-40, 90); 
  curveVertex(0, 105); curveVertex(40, 90);  
  curveVertex(65, 50); curveVertex(60, 0);   
  curveVertex(60, 0);     
  endShape();
  fill(255);
  arc(-20, 20, 40, 30, PI + 0.5, 0); 
  arc(20, 20, 40, 30, PI, -0.5);     


  // ==========================================
  //      动态五官绘制
  // ==========================================

  // --- A. 眉毛 ---
  noFill();
  stroke(240);
  strokeWeight(6);
  
  if (emotion === "happy") {
    let arch = 35 + intensity * 20; 
    arc(-25, -35, 30, arch, PI, 0); 
    arc(25, -35, 30, arch, PI, 0);
  
  } 
  else if (emotion === "anxiety") {
    let slope = 12 + intensity * 15;
    line(-40, -35 - slope, -5, -25);
    line(5, -25, 40, -35 - slope);
  } else if (emotion === "sad") {
  // 伤心:固定的下垂八字眉(外低内高)
  line(-40, -30, -5, -35); // 左眉(外低内高,向上倾斜)
  line(5, -35, 40, -30);   // 右眉(内高外低,向下倾斜)
  } 
  else {
    // Neutral 直线
    line(-40, -35, -10, -35); 
    line(10, -35, 40, -35); 
  }

  // --- B. 眼睛 & 脸颊 ---
  
  // Calm 专属红晕：随强度加深
  if (emotion === "calm") {
    noStroke();
    fill(255, 150, 180, 50 + intensity * 150); // 离越远，红晕越明显
    ellipse(-35, -5, 25, 15); 
    ellipse(35, -5, 25, 15);
  }

  if (emotion === "happy") {
    // 开心：倒U眯眯眼
    noFill();
    stroke(0);
    strokeWeight(4);
    let curve = 12 + intensity * 10; 
    arc(-25, -15, 20, curve, PI, 0); 
    arc(25, -15, 20, curve, PI, 0);
    // 高光
    noStroke();
    fill(255);
    ellipse(-30, -15, 4, 4);
    ellipse(20, -15, 4, 4);
  } 
  else if (emotion === "sad") {
    // 伤心：闭眼下垂 + 泪花
    noFill();
    stroke(0);
    strokeWeight(4);
    let droop = intensity * 6;
    line(-32, -12 + droop, -18, -18 + droop);
    line(18, -18 + droop, 32, -12 + droop);
    noStroke();
    fill(150, 200, 255);
    ellipse(-32, -12 + droop + 3, 5, 5);
    ellipse(32, -12 + droop + 3, 5, 5);
  }
  else if (emotion === "anxiety") {
    // 愤怒/焦虑：瞪眼
    noStroke();
    fill(255);
    let eyeSize = 18 + intensity * 8;
    ellipse(-25, -15, eyeSize, eyeSize);
    ellipse(25, -15, eyeSize, eyeSize);
    fill(0);
    let pupilSize = 5; 
    ellipse(-25, -15, pupilSize, pupilSize);
    ellipse(25, -15, pupilSize, pupilSize);
    fill(255, 220, 200); 
    rect(-25, -25, 25, 10);
    rect(25, -25, 25, 10);
  }
  else if (emotion === "calm") {
    // 【关键修改：Calm 眼睛】
    // 逻辑：从直逐渐弯曲成 U 型
    noFill();
    stroke(0);
    strokeWeight(4);
    
    // arc 的高度参数：intensity 为 0 时是 0 (直线)，为 1 时是 12 (弯曲)
    let curveHeight = intensity * 12; 
    
    // 画向下弯的弧线 (0 到 PI)
    arc(-25, -15, 18, curveHeight, 0, PI); 
    arc(25, -15, 18, curveHeight, 0, PI); 
  }
  else {
    // Neutral：黑豆豆眼
    noStroke();
    fill(0);
    ellipse(-25, -15, 12, 15); 
    ellipse(25, -15, 12, 15); 
    fill(255);
    ellipse(-23, -17, 4, 4);
    ellipse(27, -17, 4, 4);
  }

  // --- C. 嘴巴 ---
  stroke(180, 100, 100);
  strokeWeight(3);
  noFill();

  if (emotion === "happy") {
    let curve = 20 + intensity * 30;
    arc(0, 30, 30, curve, 0, PI);
  } else if (emotion === "sad") {
    let curve = 20 + intensity * 30;
    arc(0, 45, 30, curve, PI, 0);
  } else if (emotion === "anxiety") {
    beginShape();
    let shake = intensity * 5;
    vertex(-15, 40); 
    vertex(-5, 35 + random(-shake, shake)); 
    vertex(5, 45 + random(-shake, shake)); 
    vertex(15, 40);
    endShape();
  } else if (emotion === "calm") {
    // 【关键修改：Calm 嘴巴】
    // 逻辑：从几乎直线逐渐变成温柔的微笑
    let curve = intensity * 15; // 弯曲程度随距离增加
    arc(0, 35, 20, curve, 0, PI);
  } else {
    // Neutral：直线
    line(-15, 35, 15, 35);
  }

  // --- 7. 帽子白边 ---
  fill(255);
  noStroke();
  rect(0, -50, 130, 30, 15); 

  // --- 8. 鼻子 ---
  fill(240, 160, 160);
  ellipse(0, 10, 18, 18);

  pop();
}