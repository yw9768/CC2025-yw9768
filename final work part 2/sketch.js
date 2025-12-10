let santaX = 0;
let santaY = 0;

// 新增：用全局变量存储当前情绪和强度
let currentEmotion = "neutral";
let currentIntensity = 0;

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

  //设置圣诞老人初始位置设在画布中心
  santaX = width / 2;
  santaY = height / 2;
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  drawBackground();//绘制情绪背景

  //2. 计算圣诞老人的位置和情绪状态
  updateSantaLogic();

  // 3. 根据情绪和强度绘制圣诞老人
  drawSanta(currentEmotion, currentIntensity);
}



//更新圣诞老人的状态
function updateSantaLogic() {
  // 重置为默认值
  currentEmotion = "neutral";
  currentIntensity = 0; 
  
  let cx = width / 2;
  let cy = height / 2;

  // 检查是否检测到人脸
  if (faces.length > 0) {
    let face = faces[0];//// 取第一张脸
    
    // 使用鼻尖位置控制圣诞老人移动
    let nose = face.keypoints[4]; 

    //将vide拍到的范围扩大到整个canvas
    let targetX = map(nose.x, 0, video.width, 0, width);
    let targetY = map(nose.y, 0, video.height, 0, height);
    
    //由于摄像头抖动厉害，我用lerp去平滑了人脸的移动
    santaX = lerp(santaX, targetX, 0.1);
    santaY = lerp(santaY, targetY, 0.1);

    // 此处计算圣诞老人与画布中心的距离
    let d = dist(santaX, santaY, cx, cy);

    // 定义中心区域的半径为100 
    let center = 100;

    //开始根据位置判断情绪
    if (d < center) {
      currentEmotion = "neutral";//人脸在中心区域时显示"neutral"表情
      currentIntensity = 0;//表情变化幅度为0
    } else {
      // 判断象限
      if (santaX < cx && santaY < cy) currentEmotion = "angry"; // 左上象限:焦虑/愤怒
      else if (santaX >= cx && santaY < cy) currentEmotion = "happy"; // 右上象限:开心
      else if (santaX < cx && santaY >= cy) currentEmotion = "sad";   // 左下象限:伤心
      else currentEmotion = "calm";  // 右下象限:平静/温柔
      
      // 情绪变化的幅度计算（距离越远,强度越大）
      currentIntensity = map(d, center, width/2, 0, 1, true);
    }
  }
}

// ==================== 绘制背景 ====================

function drawBackground() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;

  // 左上 (Angry): 紫色
  fill(220, 210, 230); rect(cx/2, cy/2, cx, cy);         
  // 右上 (Happy): 黄色
  fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy);    
  // 左下 (Sad): 蓝色
  fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy);    
  
  // 右下 (Calm): 
  fill(215, 235, 215); rect(cx + cx/2, cy + cy/2, cx, cy); 

    // 绘制象限标签文字 - 放在每个象限的正中央
  fill(0, 50); // 半透明黑色
   textSize(48); // 更大的字体
   text("ANGRY", cx / 2, cy / 2);           // 左上象限中心
   text("HAPPY", cx + cx / 2, cy / 2);        // 右上象限中心
   text("SAD", cx / 2, cy + cy / 2);          // 左下象限中心
   text("CALM", cx + cx / 2, cy + cy / 2);    // 右下象限中心

  // 分割线
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);
  line(0, cy, width, cy);
}

 //开始绘制圣诞老人
 function drawSanta(emotion, intensity) {
  push();
  
  //生气时颤抖的效果
  let shakeX = 0;
  let shakeY = 0;
  if (emotion == "angry") {
    let shakeAmount = intensity * 10; //根据 intensity的强度来计算最大抖动幅度
    //让 Santa 在这个范围内随机抖动
    shakeX = random(-shakeAmount, shakeAmount);
    shakeY = random(-shakeAmount, shakeAmount);
  }

  // 将坐标系移动到 Santa 的位置，并加上抖动偏移
  translate(santaX + shakeX, santaY + shakeY); 
  scale(1.2); //放大santa到原来的1.2倍

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
  arc(-20, 20, 40, 30, PI + 0.5, 0); //左边
  arc(20, 20, 40, 30, PI, -0.5); //右边   


  // 绘制眉毛（根据不同的情绪改变形状）
  noFill();
  stroke(240);//浅灰色
  strokeWeight(6);
  
  if (emotion == "happy") {//// 开心的眉毛上扬成弧形,强度越大弧度越大
    let arch = 35 + intensity * 15; //35为基础弧度
    arc(-25, -35, 30, arch, PI, 0); 
    arc(25, -35, 30, arch, PI, 0);
  
  } 
  else if (emotion === "angry") {
    let slope = 12 + intensity * 15;
    line(-40, -35 - slope, -5, -25);//-35为眉毛基础高度
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

  //绘制眼睛和脸颊
  // 绘制calm的红晕
  if (emotion == "calm") {
    noStroke();
    fill(255, 150, 180, 100); 
    ellipse(-35, -5, 25, 15); 
    ellipse(35, -5, 25, 15);
  }

  if (emotion == "happy") {
    // 绘制开心的眼睛
    noFill();
    stroke(0);
    strokeWeight(4);
    let curve = 12 + intensity * 10; 
    arc(-25, -15, 20, curve, PI, 0); 
    arc(25, -15, 20, curve, PI, 0);
   
  } 
  else if (emotion == "sad") {
    // 绘制伤心的眼睛
    noFill();
    stroke(0);
    strokeWeight(4);
    let droop = intensity * 6;
    line(-32, -12 + droop, -18, -18 + droop);
    line(18, -18 + droop, 32, -12 + droop);
    noStroke();
    fill(150, 200, 255);
    //绘制泪花
    ellipse(-32, -12 + droop + 3, 5, 5);
    ellipse(32, -12 + droop + 3, 5, 5);

  }
  else if (emotion == "angry") {
    // 愤怒的眼睛
    noStroke();
    fill(255);//白色的眼白
    let eyeSize = 18 + intensity * 8;// 眼睛大小随强度增加
    ellipse(-25, -15, eyeSize, eyeSize);//左眼
    ellipse(25, -15, eyeSize, eyeSize);//右眼
    fill(0);

    //// 黑色瞳孔(固定大小)
    let pupilSize = 5; 
    ellipse(-25, -15, pupilSize, pupilSize);// 左瞳孔
    ellipse(25, -15, pupilSize, pupilSize);//// 右瞳孔

     // 眼皮压下效果(用肤色矩形遮挡眼睛上半部)
    fill(255, 220, 200); 
    rect(-25, -25, 25, 10);//// 左眼眼皮
    rect(25, -25, 25, 10);// 右眼眼皮

  }
  else if (emotion === "calm") {
    //绘制calm时的眼睛让其从直线渐变成向下弯的U形
    noFill();
    stroke(0);
    strokeWeight(4);
    
    // 最开始是直线，后面开始变弯曲
    let curveHeight = intensity * 12; 
    
    arc(-25, -15, 18, curveHeight, 0, PI); //左眼
    arc(25, -15, 18, curveHeight, 0, PI); //右眼
  }
  else {

    // Neutral：黑豆豆眼
    noStroke();
    fill(0);
    ellipse(-25, -15, 12, 15); //左眼
    ellipse(25, -15, 12, 15); //右眼
    //绘制眼睛高光
    fill(255);
    ellipse(-23, -17, 4, 4);//左眼
    ellipse(27, -17, 4, 4);//右眼
  }

  // 绘制嘴巴（根据情绪改变形状）
  stroke(180, 100, 100);
  strokeWeight(3);
  noFill();

  if (emotion === "happy") {//开心的嘴巴，向上弯曲的弧线
    let curve = 20 + intensity * 30;//// 弯曲程度随强度增加
    arc(0, 30, 30, curve, 0, PI);
  } else if (emotion === "sad") {//// 伤心:向下弯的撇嘴
    let curve = 20 + intensity * 30;
    arc(0, 45, 30, curve, PI, 0);
  } else if (emotion === "angry") {//angry：不规则的抖动嘴巴
    beginShape();
    let shake = intensity * 5;//嘴巴抖动幅度
    vertex(-15, 40); 
    vertex(-5, 35 + random(-shake, shake)); 
    vertex(5, 45 + random(-shake, shake)); 
    vertex(15, 40);
    endShape();
  } else if (emotion === "calm") {
    // 平静:从直线渐变成温柔的微笑
    let curve = intensity * 15; // 弯曲程度随距离增加
    arc(0, 35, 20, curve, 0, PI);
  } else {
    // Neutral表情的嘴巴：直线
    line(-15, 35, 15, 35);
  }

  // 绘制帽子的白边
  fill(255);
  noStroke();
  rect(0, -50, 130, 30, 15); 

  // 绘制鼻子
  fill(240, 160, 160);
  ellipse(0, 10, 18, 18);

  pop();
}