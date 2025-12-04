// === 全局变量 ===
let santaX = 0;
let santaY = 0;

// ML5 变量
let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: true };

// 嘴巴交互变量
let mouthOpenAmount = 0; // 0 到 1 之间的数值
let isMouthOpen = false;

// 特效粒子系统
let particles = []; // 存放所有吐出来的东西

// 字体 (如果没有加载外部字体，会使用默认sans-serif)
let font;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();

  // 1. 初始化摄像头
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // 2. 初始化 FaceMesh
  faceMesh = ml5.faceMesh(video, options, modelReady);
  faceMesh.on('face', results => {
    faces = results;
  });

  santaX = width / 2;
  santaY = height / 2;
}

function modelReady() {
  console.log('FaceMesh 模型加载完毕!');
}

function draw() {
  // 1. 绘制背景
  drawBackground();

  // 2. 核心逻辑：更新位置、计算强度、处理嘴巴
  let interactData = updateInteraction();

  // 3. 绘制嘴巴产生的特效 (粒子)
  // 注意：Glitch 特效因为要覆盖全屏，所以单独处理
  if (interactData.emotion === "anxiety" && isMouthOpen) {
    drawGlitchEffect(); // 焦虑区全屏故障
  } else {
    updateAndDrawParticles(); // 其他区域的粒子
  }

  // 4. 绘制圣诞老人 (传入 情绪 和 强度)
  drawSanta(interactData.emotion, interactData.intensity);
}

// ==================== 逻辑处理核心 ====================

function updateInteraction() {
  let currentEmotion = "neutral";
  let intensity = 0; // 0 (中心) -> 1 (边缘)

  // 屏幕中心
  let cx = width / 2;
  let cy = height / 2;

  if (faces.length > 0) {
    let face = faces[0];
    
    // --- A. 更新位置 (鼻尖) ---
    let nose = face.scaledMesh[4];
    let targetX = map(nose[0], 0, 640, 0, width);
    let targetY = map(nose[1], 0, 480, 0, height);
    // 平滑移动
    santaX = lerp(santaX, targetX, 0.1);
    santaY = lerp(santaY, targetY, 0.1);

    // --- B. 计算嘴巴张开程度 ---
    let upperLip = face.scaledMesh[13];
    let lowerLip = face.scaledMesh[14];
    let mouthDist = dist(upperLip[0], upperLip[1], lowerLip[0], lowerLip[1]);
    // 阈值设为 10，除以 40 归一化
    mouthOpenAmount = map(mouthDist, 0, 40, 0, 1, true);
    isMouthOpen = mouthOpenAmount > 0.25; // 超过 0.25 算张嘴

    // --- C. 判断区域 (Happy/Sad/Anxiety/Calm) ---
    if (santaX < cx && santaY < cy) currentEmotion = "anxiety"; // 左上
    else if (santaX >= cx && santaY < cy) currentEmotion = "happy"; // 右上
    else if (santaX < cx && santaY >= cy) currentEmotion = "sad";   // 左下
    else currentEmotion = "calm";  // 右下 (Calm)

    // --- D. 计算强度 (距离中心的距离) ---
    // 计算当前位置到中心的距离
    let d = dist(santaX, santaY, cx, cy);
    // 映射：0 到 半个屏幕宽 -> 强度 0 到 1
    intensity = map(d, 0, width/2, 0, 1, true);
  }

  // --- E. 生成特效粒子 ---
  if (isMouthOpen) {
    spawnParticles(currentEmotion);
  }

  return { emotion: currentEmotion, intensity: intensity };
}

// ==================== 特效系统 ====================

function spawnParticles(emotion) {
  // 每隔几帧生成一次，防止太多卡顿
  if (frameCount % 5 !== 0 && emotion !== "anxiety") return;

  // 根据情绪生成不同的东西
  if (emotion === "happy") {
    // 喷出 "HA HA" 或 彩色形状
    let type = random() > 0.5 ? "text" : "shape";
    particles.push(new Particle(santaX, santaY + 40, "happy", type));
  } 
  else if (emotion === "sad") {
    // 喷出向上流的眼泪
    particles.push(new Particle(santaX, santaY + 40, "sad", "tear"));
  } 
  else if (emotion === "calm") {
    // 喷出呼吸涟漪 (生成慢一点)
    if (frameCount % 15 === 0) {
      particles.push(new Particle(santaX, santaY + 40, "calm", "ripple"));
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

// 粒子类 (用来管理所有飞出来的东西)
class Particle {
  constructor(x, y, emotion, type) {
    this.x = x + random(-10, 10);
    this.y = y;
    this.emotion = emotion;
    this.type = type; // "text", "shape", "tear", "ripple"
    this.alpha = 255;
    
    // 快乐：四散飞溅
    if (emotion === "happy") {
      this.vx = random(-3, 3);
      this.vy = random(-2, 5); // 往下掉
      this.size = random(10, 20);
      this.color = color(random(255), random(255), random(255));
      this.text = "HA";
    }
    // 悲伤：反重力向上
    else if (emotion === "sad") {
      this.vx = random(-1, 1);
      this.vy = random(-2, -5); // 往上飞！
      this.size = random(5, 10);
      this.color = color(100, 150, 255);
    }
    // 平静：原地缓慢扩散
    else if (emotion === "calm") {
      this.vx = random(-0.5, 0.5);
      this.vy = random(-0.5, 0.5);
      this.size = 10; // 初始大小
      this.growth = 2; // 变大速度
      this.color = color(255);
      this.alpha = 150;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 3; // 慢慢消失

    if (this.emotion === "calm") {
      this.size += this.growth; // 涟漪变大
      this.alpha -= 1; // 消失得更慢
    }
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);

    if (this.type === "text") {
      textSize(this.size);
      textStyle(BOLD);
      text(this.text, this.x, this.y);
    } else if (this.type === "shape") {
      rect(this.x, this.y, this.size, this.size);
    } else if (this.type === "tear") {
      ellipse(this.x, this.y, this.size, this.size * 1.5); // 水滴状
    } else if (this.type === "ripple") {
      noFill();
      stroke(255, this.alpha);
      strokeWeight(2);
      circle(this.x, this.y, this.size);
    }
  }

  isDead() {
    return this.alpha <= 0;
  }
}

function drawGlitchEffect() {
  // 焦虑区的全屏故障：画随机的横条遮挡屏幕
  for (let i = 0; i < 10; i++) {
    let h = random(5, 50);
    let y = random(height);
    let offset = random(-20, 20);
    
    // 抓取屏幕的一部分并错位显示 (模拟信号干扰)
    // 简单的做法是直接画带颜色的条
    fill(random(255), random(255), random(255), 100);
    rect(width/2 + offset, y, width, h);
    
    fill(0, 50);
    rect(width/2, random(height), width, 2); // 扫描线
  }
}

// ==================== 绘制背景 ====================

function drawBackground() {
  let cx = width / 2;
  let cy = height / 2;

  // 四个区域颜色
  fill(220, 210, 230); rect(cx/2, cy/2, cx, cy);         // 左上 Anxiety
  fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy);    // 右上 Happy
  fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy);    // 左下 Sad
  fill(210, 240, 225); rect(cx + cx/2, cy + cy/2, cx, cy); // 右下 Calm

  // 区域文字标签 (可选，方便演示)
  fill(0, 50);
  textSize(20);
  text("ANXIETY", 60, 30);
  text("HAPPY", width - 60, 30);
  text("SAD", 60, height - 30);
  text("CALM", width - 60, height - 30);

  // 分割线
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
}

// ==================== 绘制圣诞老人 ====================

function drawSanta(emotion, intensity) {
  push();
  
  // 焦虑特效：如果是在Anxiety区域，全身会根据强度颤抖
  let shakeX = 0;
  let shakeY = 0;
  if (emotion === "anxiety") {
    let shakeAmount = intensity * 10; // 离中心越远抖得越厉害
    shakeX = random(-shakeAmount, shakeAmount);
    shakeY = random(-shakeAmount, shakeAmount);
  }

  translate(santaX + shakeX, santaY + shakeY); 
  scale(1.2); 

  // --- 1. 帽子 (CurveVertex) ---
  fill(220, 40, 40);
  noStroke();
  beginShape();
  curveVertex(60, -40); curveVertex(60, -40);
  curveVertex(40, -90);
  curveVertex(0, -110);
  curveVertex(-50, -90);
  curveVertex(-90, -40); curveVertex(-90, -40);
  endShape();
  // 帽子球
  fill(255);
  ellipse(-90, -40, 28, 28);

  // --- 2. 脸 ---
  fill(255, 220, 200);
  noStroke();
  ellipse(0, 0, 120, 120);

  // --- 3. 胡子 (CurveVertex 胖胖版) ---
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
  
  // 脸颊小卷毛
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

  // --- 5. 动态五官 (眉毛 & 嘴巴) ---
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

// 辅助函数：根据情绪和强度画眉毛嘴巴
function drawDynamicFeatures(emotion, intensity) {
  noFill();
  
  // --- A. 眉毛 ---
  stroke(240);
  strokeWeight(6);
  
  if (emotion === "happy") {
    // 快乐：眉毛上扬，幅度随强度增加
    let arch = 20 + intensity * 20; 
    arc(-25, -35, 30, arch, PI, 0); 
    arc(25, -35, 30, arch, PI, 0);
  } 
  else if (emotion === "sad") {
    // 悲伤：八字眉，角度随强度增加
    let slope = 10 + intensity * 15;
    line(-40, -40, -10, -40 - slope);
    line(10, -40 - slope, 40, -40);
  } 
  else if (emotion === "anxiety") {
    // 焦虑：高低不平
    line(-40, -50, -10, -30);
    line(10, -30, 40, -50);
  } 
  else {
    // 平静：平眉
    line(-40, -35, -10, -35); 
    line(10, -35, 40, -35); 
  }

  // --- B. 嘴巴 ---
  stroke(180, 100, 100);
  strokeWeight(3);

  // 基础张嘴动作：如果真人的嘴张开了，圣诞老人的嘴也要变成圆形
  // 但我们还要叠加情绪形状
  
  if (isMouthOpen) {
    // 嘴巴张开状态：画个空心圆或者大洞
    fill(50, 0, 0); // 深红色口腔
    noStroke();
    
    if (emotion === "happy") arc(0, 35, 30 + intensity*10, 40, 0, PI); // 大笑嘴
    else if (emotion === "sad") ellipse(0, 45, 20, 30 + intensity*10); // 悲伤长嘴
    else if (emotion === "anxiety") { // 颤抖的张嘴
       beginShape();
       for(let i=0; i<360; i+=45) {
         let r = 15 + random(5);
         let x = r * cos(radians(i));
         let y = 35 + r * sin(radians(i));
         vertex(x, y);
       }
       endShape(CLOSE);
    }
    else ellipse(0, 35, 20, 20); // 平静的圆嘴 ("O"形)

  } else {
    // 闭嘴状态：画线条
    noFill();
    if (emotion === "happy") {
      // 笑脸幅度随强度增加
      let curve = 20 + intensity * 20;
      arc(0, 30, 30, curve, 0, PI);
    } 
    else if (emotion === "sad") {
      // 哭脸幅度随强度增加
      let curve = 20 + intensity * 20;
      arc(0, 45, 30, curve, PI, 0);
    } 
    else if (emotion === "anxiety") {
      // 焦虑波浪线
      beginShape();
      vertex(-15, 40); vertex(-5, 35); vertex(5, 45); vertex(15, 40);
      endShape();
    } 
    else {
      // 平静直线
      line(-15, 35, 15, 35);
    }
  }
}