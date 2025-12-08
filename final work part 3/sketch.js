// ==================== 全局变量定义 ====================
let santaX = 0;
let santaY = 0;

// ML5 变量
let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

// 【新增】嘴巴交互变量
let mouthOpenAmount = 0; // 嘴巴张开的幅度 (0-1)
let isMouthOpen = false; // 是否张嘴

// 【新增】特效粒子系统
let particles = []; 
let modelIsLoaded = false; // 模型是否加载完成

// 【新增】情绪和强度（改用全局变量，不用 return）
let currentEmotion = "neutral";
let currentIntensity = 0;

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

  // 1. 计算圣诞老人的位置、情绪和嘴巴状态
  // 【改动】不需要接收返回值了，直接更新全局变量
  updateSantaLogic();

  // 2. 先画圣诞老人
  // 【改动】直接使用全局变量
  drawSanta(currentEmotion, currentIntensity);

  // 3. 再画特效
  updateAndDrawParticles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ==================== 核心逻辑 ====================

// 【改动】不用 return，直接修改全局变量
function updateSantaLogic() {
  // 重置为默认值
  currentEmotion = "neutral";
  currentIntensity = 0;
  
  let cx = width / 2;
  let cy = height / 2;

  if (faces.length > 0) {
    let face = faces[0];
    
    // A. 使用鼻尖位置控制圣诞老人移动
    let nose = face.keypoints[4];
    let targetX = map(nose.x, 0, video.width, 0, width);
    let targetY = map(nose.y, 0, video.height, 0, height);
    santaX = lerp(santaX, targetX, 0.1);
    santaY = lerp(santaY, targetY, 0.1);

    // B. 检测嘴巴张开程度
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    let mouthDist = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
    mouthOpenAmount = map(mouthDist, 0, 40, 0, 1, true);
    isMouthOpen = mouthOpenAmount > 0.25;

    // C. 计算距离中心的距离
    let d = dist(santaX, santaY, cx, cy);
    let centerThreshold = 100;

    // D. 根据位置判断情绪
    // 【改动】直接修改全局变量，不用 return
    if (d < centerThreshold) {
      currentEmotion = "neutral";
      currentIntensity = 0;
    } else {
      if (santaX < cx && santaY < cy) currentEmotion = "angry";
      else if (santaX >= cx && santaY < cy) currentEmotion = "happy";
      else if (santaX < cx && santaY >= cy) currentEmotion = "sad";
      else currentEmotion = "calm";
      
      currentIntensity = map(d, centerThreshold, width/2, 0, 1, true);
    }

    // E. 当张嘴时生成特效粒子
    if (isMouthOpen) {
      spawnParticles(currentEmotion);
    }
  }
  
  // 【改动】不需要 return 了！
}

// ==================== 特效系统 ====================

// 生成粒子
function spawnParticles(emotion) {
  
  // 1. HAPPY: 20% 的概率生成粒子
  if (emotion === "happy") {
    if (random() < 0.2) {
      let type;  // 先声明变量
     if (random() > 0.5) {
      type = "text";   // 大于 0.5 用文字
      } else {
     type = "shape";  // 小于等于 0.5 用形状
    } 
      particles.push(new Particle(santaX, santaY + 42, "happy", type));
    }
  } 
  
  // 2. SAD: 20% 的概率生成眼泪
  else if (emotion === "sad") {
    if (random() < 0.2) {
      let scale = 1.2;
      particles.push(new Particle(santaX + (-25 * scale), santaY + (-15 * scale), "sad", "tear"));
      particles.push(new Particle(santaX + (25 * scale), santaY + (-15 * scale), "sad", "tear"));
    }
  } 
  
  // 3. CALM: 10% 的概率生成呼吸圈
  else if (emotion === "calm") {
    if (random() < 0.1) {
      particles.push(new Particle(santaX, santaY + 42, "calm", "breath"));
    }
  }
  
  // 4. ANGRY: 20% 的概率生成脏话
  else if (emotion === "angry") {
    if (random() < 0.2) {
      particles.push(new Particle(santaX, santaY + 42, "angry", "swear"));
    }
  }
}

// 更新和绘制所有粒子
function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    // 【改动】直接检查 alpha，不用 isDead() 方法
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// 粒子类
class Particle {
  constructor(x, y, emotion, type) {
    this.x = x + random(-5, 5);
    this.y = y;
    this.emotion = emotion;
    this.type = type;
    this.alpha = 255;

    // 根据情绪设置不同的粒子属性
    if (emotion === "happy") {
      this.vx = random(-4, 4);
      this.vy = random(2, 6);
      this.size = random(15, 25);
      this.color = color(random(255), random(255), random(255));
      this.text = random(["HA", "HO", "YAY", "WOW"]);
    } 
    else if (emotion === "sad") {
      this.vx = random(-0.5, 0.5);
      this.vy = random(2, 4);
      this.size = random(5, 10);
      this.color = color(100, 150, 255);
    } 
    else if (emotion === "calm") {
      this.x = x;
      this.vx = 0;
      this.vy = 0.5;
      this.size = 10;
      this.growth = 1.5;
      this.color = color(255, 255, 255);
      this.alpha = 150;
    }
    else if (emotion === "angry") {
      this.vx = random(-2, 2);
      this.vy = random(-4, -2);
      this.size = random(18, 28);
      this.color = color(255, 50, 50);
      this.text = random(["@#$!", "!!!", "GRRR", "ARG!", "#@%!"]);
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 3;

    if (this.emotion === "calm") {
      this.size += this.growth;
    }
  }

  display() {
    noStroke();
    
    if (this.type === "text" || this.type === "swear") {
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
      noFill();
      stroke(255, this.alpha);
      strokeWeight(3);
      circle(this.x, this.y, this.size);
    }
  }
  
  // 【改动】删除了 isDead() 方法，不需要了！
}

// ==================== 绘制背景 ====================

function drawBackground() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;

  // 四个象限背景色
  fill(220, 210, 230); rect(cx/2, cy/2, cx, cy);         
  fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy);    
  fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy);    
  fill(215, 235, 215); rect(cx + cx/2, cy + cy/2, cx, cy); 

  // 象限标签
  fill(0, 50);
  textSize(48);
  text("ANGRY", cx / 2, cy / 2);
  text("HAPPY", cx + cx / 2, cy / 2);
  text("SAD", cx / 2, cy + cy / 2);
  text("CALM", cx + cx / 2, cy + cy / 2);

  // 分割线
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
}

// ==================== 绘制圣诞老人 ====================

function drawSanta(emotion, intensity) {
  push();
  
  // 生气时的颤抖效果
  let shakeX = 0;
  let shakeY = 0;
  if (emotion == "angry") {
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

  // --- 4. 眉毛 ---
  noFill();
  stroke(240);
  strokeWeight(6);
  
  if (emotion == "happy") {
    let arch = 35 + intensity * 15;
    arc(-25, -35, 30, arch, PI, 0); 
    arc(25, -35, 30, arch, PI, 0);
  } 
  else if (emotion === "angry") {
    let slope = 12 + intensity * 15;
    line(-40, -35 - slope, -5, -25);
    line(5, -25, 40, -35 - slope);
  } 
  else if (emotion === "sad") {
    line(-40, -30, -5, -35);
    line(5, -35, 40, -30);
  } 
  else {
    line(-40, -35, -10, -35); 
    line(10, -35, 40, -35); 
  }

  // --- 5. 脸颊红晕 (Calm 专属) ---
  if (emotion == "calm") {
    noStroke();
    fill(255, 150, 180, 100); 
    ellipse(-35, -5, 25, 15); 
    ellipse(35, -5, 25, 15);
  }

  // --- 6. 眼睛 ---
  if (emotion == "happy") {
    noFill();
    stroke(0);
    strokeWeight(4);
    let curve = 12 + intensity * 10; 
    arc(-25, -15, 20, curve, PI, 0); 
    arc(25, -15, 20, curve, PI, 0);
  } 
  else if (emotion == "sad") {
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
  else if (emotion == "angry") {
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
    noFill();
    stroke(0);
    strokeWeight(4);
    let curveHeight = intensity * 12; 
    arc(-25, -15, 18, curveHeight, 0, PI);
    arc(25, -15, 18, curveHeight, 0, PI);
  }
  else {
    noStroke();
    fill(0);
    ellipse(-25, -15, 12, 15);
    ellipse(25, -15, 12, 15);
    fill(255);
    ellipse(-23, -17, 4, 4);
    ellipse(27, -17, 4, 4);
  }

  // --- 7. 嘴巴 (根据是否张嘴显示不同效果) ---
  stroke(180, 100, 100);
  strokeWeight(3);

  if (isMouthOpen) {
    // 【张嘴状态】显示嘴巴内部
    fill(50, 0, 0);
    noStroke();
    
    if (emotion === "happy") {
      arc(0, 35, 30 + intensity*10, 40, 0, PI);
    } 
    else if (emotion === "sad") {
      ellipse(0, 45, 20, 30 + intensity*10);
    } 
    else if (emotion === "angry") {
      beginShape();
      for(let i = 0; i < 360; i += 45) {
        let r = 15 + random(5);
        let x = r * cos(radians(i));
        let y = 35 + r * sin(radians(i));
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    else {
      ellipse(0, 35, 20, 20);
    }
    
  } else {
    // 【闭嘴状态】显示正常嘴型
    noFill();
    
    if (emotion === "happy") {
      let curve = 20 + intensity * 30;
      arc(0, 30, 30, curve, 0, PI);
    } 
    else if (emotion === "sad") {
      let curve = 20 + intensity * 30;
      arc(0, 45, 30, curve, PI, 0);
    } 
    else if (emotion === "angry") {
      beginShape();
      let shake = intensity * 5;
      vertex(-15, 40); 
      vertex(-5, 35 + random(-shake, shake)); 
      vertex(5, 45 + random(-shake, shake)); 
      vertex(15, 40);
      endShape();
    } 
    else if (emotion === "calm") {
      let curve = intensity * 15;
      arc(0, 35, 20, curve, 0, PI);
    } 
    else {
      line(-15, 35, 15, 35);
    }
  }

  // --- 8. 帽子白边 ---
  fill(255);
  noStroke();
  rect(0, -50, 130, 30, 15);

  // --- 9. 鼻子 ---
  fill(240, 160, 160);
  ellipse(0, 10, 18, 18);

  pop();
}