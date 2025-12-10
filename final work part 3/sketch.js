
let santaX = 0;
let santaY = 0;

// ML5 人脸识别变量
let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

// 嘴巴交互变量
let mouthOpenAmount = 0; // 嘴巴张开的幅度 (0-1)
let isMouthOpen = false; // 是否张嘴

// 特效粒子数组
let particles = []; 
let modelIsLoaded = false; // 模型是否加载完成

// 情绪和强度
let currentEmotion = "neutral";//初始情绪为neutral
let currentIntensity = 0;//初始情绪强度为0

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);// 文字对齐：水平和垂直都居中
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
  updateSantaLogic();// 计算圣诞老人的位置、情绪和嘴巴状态
  drawSanta(currentEmotion, currentIntensity);//绘制圣诞老人
  updateAndDrawParticles();//嘴里吐出的粒子特效
}


function updateSantaLogic() {// 计算圣诞老人的位置、情绪和嘴巴状态
  currentEmotion = "neutral";// 默认初始情绪为中性
  currentIntensity = 0;//默认初始情绪强度为0
  
  let cx = width / 2; //中心点x
  let cy = height / 2; //中心点y

  if (faces.length > 0) {//检测人脸
    let face = faces[0];
    
    // 使用鼻尖位置控制圣诞老人移动 Use the tip of your nose to control the movement of Santa Claus
    let nose = face.keypoints[4];
    let targetX = map(nose.x, 0, video.width, 0, width);//将vide拍到的范围扩大到整个canvas
    let targetY = map(nose.y, 0, video.height, 0, height);
    santaX = lerp(santaX, targetX, 0.1);////由于摄像头抖动厉害，我用lerp去平滑了人脸的移动
    santaY = lerp(santaY, targetY, 0.1);

    //检测嘴巴张开程度 Check the degree of mouth opening
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    let mouthDist = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);//// 计算上下嘴唇之间的距离Calculate the distance between the upper and lower lips
    mouthOpenAmount = map(mouthDist, 0, 40, 0, 1, true);
    isMouthOpen = mouthOpenAmount > 0.25;// 当张开超过25%时认为是张嘴When the mouth is open by more than 25%, it is considered open

    //计算圣诞老人与画布中心的距离
    let d = dist(santaX, santaY, cx, cy);
    let centerThreshold = 100;// 定义中心区域的半径为100 

    // 根据位置判断情绪 Judge emotions based on location
    if (d < centerThreshold) {
      currentEmotion = "neutral";//人脸在中心区域时显示"neutral"表情
      currentIntensity = 0;//表情变化幅度为0
    } else {
      if (santaX < cx && santaY < cy) currentEmotion = "angry";// 左上象限:愤怒
      else if (santaX >= cx && santaY < cy) currentEmotion = "happy";// 右上象限:开心
      else if (santaX < cx && santaY >= cy) currentEmotion = "sad";// 左下象限:伤心
      else currentEmotion = "calm";// 右下象限:平静/温柔
      
      currentIntensity = map(d, centerThreshold, width/2, 0, 1, true);// 计算情绪变化的幅度（距离中心越远,强度越大）Calculate the intensity of emotional changes (the farther from the center, the greater the intensity)
    }

    // 当张嘴时生成特效粒子
    if (isMouthOpen) {
      spawnParticles(currentEmotion);//如果检测到嘴巴长开，就根据当前情绪生成粒子If the mouth is detected to be open, particles will be generated based on the current mood
    }
  }
}

// 根据不同情绪生成不同类型的粒子 Generate different types of particles based on different emotions
function spawnParticles(emotion) {
  
  // HAPPY粒子
  if (emotion == "happy") {
    if (random() < 0.2) { //20%的概率生成开心粒子
      let type;  // 先声明变量

     if (random() > 0.5) {
      type = "text";   // 生成开心的文字
      } else {
     type = "shape";  // 生成开心的粒子形状
    } 
      particles.push(new Particle(santaX, santaY + 42, "happy", type));//粒子从嘴巴下方出现
    }
  } 
  
  // SAD时的眼泪
  else if (emotion == "sad") {
    if (random() < 0.2) {//20%的概率生成眼泪
      let scale = 1.2;//跟圣诞老人的大小一致，让眼泪更好的对其两个眼睛
      particles.push(new Particle(santaX + (-25 * scale), santaY + (-15 * scale), "sad", "tear"));//左眼眼泪
      particles.push(new Particle(santaX + (25 * scale), santaY + (-15 * scale), "sad", "tear"));//右眼眼泪
    }
  } 
  
  // CALM时的呼吸圈Breathing circle
  //This inspiration comes from the cold air that comes out of our mouths in winter
  else if (emotion == "calm") {
    if (random() < 0.1) { //10%的概率生成呼吸圈
      particles.push(new Particle(santaX, santaY + 42, "calm", "breath"));//粒子从嘴巴下方出现
    }
  }
  
  // ANGRY时的脏话
  else if (emotion === "angry") {
    if (random() < 0.2) { //20%的概率生成脏话
      particles.push(new Particle(santaX, santaY + 42, "angry", "swear"));//粒子从嘴巴下方出现
    }
  }
}

// 绘制所有粒子
function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    // 检查粒子是否消散
    if (p.alpha <= 0) {//如果粒子的透明度<=0 If the transparency of the particle is less than 0
      particles.splice(i, 1);//从数组中删除这个粒子 Remove this particle from the array
    }
  }
}

//设置不同情绪的粒子属性（出来的颜色，幅度，速度之类的）
//Set the size, speed,color of different particles 
class Particle {
  constructor(x, y, emotion, type) {
    this.x = x + random(-5, 5);
    this.y = y;
    this.emotion = emotion;
    this.type = type;
    this.alpha = 255;//设置粒子的不透明度（初始为完全不透明）

    // 根据情绪设置不同的粒子属性
    //开心的粒子
    if (emotion === "happy") {
      this.vx = random(-4, 4);//粒子的x方向速度
      this.vy = random(2, 6);//粒子的y方向速度
      this.size = random(15, 25);//粒子大小
      this.color = color(random(255), random(255), random(255));// 随机彩色的粒子
      this.text = random(["HA", "HEY", "YAY", "WOW"]);//随机产生一个快乐的文字
    } 
    //伤心的眼泪
    else if (emotion === "sad") {
      this.vx = random(-0.5, 0.5);
      this.vy = random(2, 4);
      this.size = random(5, 10);
      this.color = color(100, 150, 255);//蓝色的眼泪
    } 
    //calm的呼吸圈
    else if (emotion === "calm") {
      this.x = x;//呼吸圈不随机偏移，保持居中
      this.vx = 0;//呼吸圈不左右移动
      this.vy = 0.5;//呼吸圈缓慢下沉
      this.size = 30;
      this.color = color(255, 255, 255);// 白色
      this.alpha = 150;// 初始时是半透明的呼吸圈
    }
    //angry的脏话
    else if (emotion === "angry") {
      this.vx = random(-2, 2);
      this.vy = random(-4, -2);//脏话向上飞
      this.size = random(18, 28);
      this.color = color(255, 50, 50);//红色
      this.text = random(["@#$!", "!!!", "XXXK", "WTF!", "#@%!"]);// 脏话符号
    }
  }

  //更新粒子的状态
  update() {
    //粒子的移动位置
    this.x += this.vx;//初始位置+速度
    this.y += this.vy;
    this.alpha -= 3;//粒子的透明度每次减少3The transparency of the particle decreases by 3 per frame
  }

  //绘制粒子
  display() {
    noStroke();
    if (this.type == "text" || this.type == "swear") {//开心的文字和angry时的脏话
      fill(red(this.color), green(this.color), blue(this.color), this.alpha);
      textSize(this.size);// 设置文字大小
      textStyle(BOLD);
      text(this.text, this.x, this.y);
    } 

    else if (this.type === "shape") {//方形的粒子
      fill(red(this.color), green(this.color), blue(this.color), this.alpha);
      rect(this.x, this.y, this.size, this.size);
    } 

    else if (this.type === "tear") {//泪滴
      fill(red(this.color), green(this.color), blue(this.color), this.alpha);
      ellipse(this.x, this.y, this.size, this.size * 1.5);
    } 

    else if (this.type === "breath") {//呼吸圈
      noFill();
      stroke(255, this.alpha);
      strokeWeight(3);
      circle(this.x, this.y, this.size);
    }
  }
  
  // 
}



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

// 绘制圣诞老人

function drawSanta(emotion, intensity) {
  push();
  
  // 生气时的颤抖效果
  let shakeX = 0;
  let shakeY = 0;
  if (emotion == "angry") {
    let shakeAmount = intensity * 10;//根据 intensity的强度来计算最大抖动幅度
    //让 Santa 在这个范围内随机抖动
    shakeX = random(-shakeAmount, shakeAmount);
    shakeY = random(-shakeAmount, shakeAmount);
  }

  // 将坐标系移动到 Santa 的位置，并加上抖动偏移
  translate(santaX + shakeX, santaY + shakeY); 
  scale(1.2);//放大santa到原来的1.2倍

  // 绘制帽子
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

  // 绘制脸
  fill(255, 220, 200);
  noStroke();
  ellipse(0, 0, 120, 120);

  //绘制络腮胡
  fill(245, 245, 250);
  noStroke();
  beginShape();
  curveVertex(-60, 0); curveVertex(-60, 0);  
  curveVertex(-65, 50); curveVertex(-40, 90); 
  curveVertex(0, 105); curveVertex(40, 90);  
  curveVertex(65, 50); curveVertex(60, 0);   
  curveVertex(60, 0);     
  endShape();
  //鼻侧两个小胡子
  fill(255);
  arc(-20, 20, 40, 30, PI + 0.5, 0);
  arc(20, 20, 40, 30, PI, -0.5);

  // 绘制眉毛
  noFill();
  stroke(240);
  strokeWeight(6);
  
  if (emotion == "happy") {//happy时的眉毛
    let arch = 35 + intensity * 15;
    arc(-25, -35, 30, arch, PI, 0); 
    arc(25, -35, 30, arch, PI, 0);
  } 
  else if (emotion === "angry") { //angry时的眉毛
    let slope = 12 + intensity * 15;
    line(-40, -35 - slope, -5, -25);
    line(5, -25, 40, -35 - slope);
  } 
  else if (emotion === "sad") {//sad时的眉毛
    line(-40, -30, -5, -35);
    line(5, -35, 40, -30);
  } 
  else {//calm & neutral时的眉毛
    line(-40, -35, -10, -35); 
    line(10, -35, 40, -35); 
  }

  // calm时的脸颊红晕
  if (emotion == "calm") {
    noStroke();
    fill(255, 150, 180, 100); 
    ellipse(-35, -5, 25, 15); 
    ellipse(35, -5, 25, 15);
  }

  // 绘制眼睛
  if (emotion == "happy") {//happy的眼睛
    noFill();
    stroke(0);
    strokeWeight(4);
    let curve = 12 + intensity * 10; 
    arc(-25, -15, 20, curve, PI, 0); 
    arc(25, -15, 20, curve, PI, 0);
  } 
  else if (emotion == "sad") {//sad的眼睛
    noFill();
    stroke(0);
    strokeWeight(4);
    let droop = intensity * 6;
    line(-32, -12 + droop, -18, -18 + droop);
    line(18, -18 + droop, 32, -12 + droop);
    noStroke();
    //绘制泪花
    fill(150, 200, 255);
    ellipse(-32, -12 + droop + 3, 5, 5);
    ellipse(32, -12 + droop + 3, 5, 5);
  }
  else if (emotion == "angry") {//angry的眼睛
    noStroke();
    fill(255);
    let eyeSize = 18 + intensity * 8;// 眼睛大小随强度增加
    ellipse(-25, -15, eyeSize, eyeSize);
    ellipse(25, -15, eyeSize, eyeSize);
    fill(0);
    let pupilSize = 5; // 黑色瞳孔(固定大小)
    ellipse(-25, -15, pupilSize, pupilSize);
    ellipse(25, -15, pupilSize, pupilSize);
    fill(255, 220, 200); 
    rect(-25, -25, 25, 10);
    rect(25, -25, 25, 10);
  }
  else if (emotion == "calm") {//calm时的眼睛
    noFill();
    stroke(0);
    strokeWeight(4);
    let curveHeight = intensity * 12; 
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

  // 绘制嘴巴（根据情绪改变形状）
  stroke(180, 100, 100);
  strokeWeight(3);

  if (isMouthOpen) {
    // 张嘴状态
    fill(50, 0, 0);//深红黑色的嘴巴内部
    noStroke();
    
    if (emotion === "happy") {//happy时张开的嘴巴
      arc(0, 35, 30 + intensity*10, 40, 0, PI);
    } 
    else if (emotion === "sad") {//sad时哭泣的嘴巴
      ellipse(0, 45, 20, 30 + intensity*10);
    } 
    else if (emotion === "angry") {//angry的嘴巴
      beginShape();//绘制不规则八边形 Irregular octagon ˈɑːktəɡɑːn
      for(let i = 0; i < 360; i += 45) {
        let r = 15 + random(5);
        let x = r * cos(radians(i));
        let y = 35 + r * sin(radians(i));
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    else {
      ellipse(0, 35, 20, 20);//Neutral & Calm 张嘴: 小圆形
    }
    
  } else {
    // 闭嘴状态下，显示正常嘴型
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

  // 帽子白边
  fill(255);
  noStroke();
  rect(0, -50, 130, 30, 15);

  // 鼻子
  fill(240, 160, 160);
  ellipse(0, 10, 18, 18);

  pop();
}