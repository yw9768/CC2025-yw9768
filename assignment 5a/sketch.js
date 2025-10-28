// Sketch 3: Noise 漂浮骷髅 💀
// 使用 noise() 控制平滑移动（参考老师的眼球代码）
// 使用 lerp() 渐变背景
// 不使用 class

// 骷髅1的变量
let skull1X, skull1Y, skull1BaseSize;
let skull1NoiseSize, skull1Speed;

// 骷髅2的变量
let skull2X, skull2Y, skull2BaseSize;
let skull2NoiseSize, skull2Speed;

// 骷髅3的变量
let skull3X, skull3Y, skull3BaseSize;
let skull3NoiseSize, skull3Speed;

// 骷髅4的变量
let skull4X, skull4Y, skull4BaseSize;
let skull4NoiseSize, skull4Speed;

// 骷髅5的变量
let skull5X, skull5Y, skull5BaseSize;
let skull5NoiseSize, skull5Speed;

// 骷髅6的变量
let skull6X, skull6Y, skull6BaseSize;
let skull6NoiseSize, skull6Speed;

function setup() {
  createCanvas(400, 400);
  
  // 初始化骷髅1（固定位置，更大的基础尺寸）
  skull1X = 100;
  skull1Y = 100;
  skull1BaseSize = 80;  // 从50增加到80
  skull1NoiseSize = 0;
  skull1Speed = 0.005;
  
  // 初始化骷髅2（固定位置，更大的基础尺寸）
  skull2X = 300;
  skull2Y = 100;
  skull2BaseSize = 75;  // 从45增加到75
  skull2NoiseSize = 200;
  skull2Speed = 0.006;
  
  // 初始化骷髅3（固定位置，更大的基础尺寸）
  skull3X = 100;
  skull3Y = 250;
  skull3BaseSize = 85;  // 从55增加到85
  skull3NoiseSize = 400;
  skull3Speed = 0.004;
  
  // 初始化骷髅4（固定位置，更大的基础尺寸）
  skull4X = 300;
  skull4Y = 250;
  skull4BaseSize = 78;  // 从48增加到78
  skull4NoiseSize = 600;
  skull4Speed = 0.007;
  
  // 初始化骷髅5（固定位置，更大的基础尺寸）
  skull5X = 200;
  skull5Y = 170;
  skull5BaseSize = 82;  // 从52增加到82
  skull5NoiseSize = 800;
  skull5Speed = 0.005;
  
  // 初始化骷髅6（固定位置，更大的基础尺寸）
  skull6X = 200;
  skull6Y = 330;
  skull6BaseSize = 76;  // 从46增加到76
  skull6NoiseSize = 1000;
  skull6Speed = 0.006;
}

function draw() {
  // 使用 lerp() 绘制渐变背景（上黑下紫）
  background(0);
  
  // 显示和更新骷髅1（大小变化）
  displaySkull(skull1X, skull1Y, skull1BaseSize, skull1NoiseSize);
  skull1NoiseSize = skull1NoiseSize + skull1Speed;
  
  // 显示和更新骷髅2（大小变化）
  displaySkull(skull2X, skull2Y, skull2BaseSize, skull2NoiseSize);
  skull2NoiseSize = skull2NoiseSize + skull2Speed;
  
  // 显示和更新骷髅3（大小变化）
  displaySkull(skull3X, skull3Y, skull3BaseSize, skull3NoiseSize);
  skull3NoiseSize = skull3NoiseSize + skull3Speed;
  
  // 显示和更新骷髅4（大小变化）
  displaySkull(skull4X, skull4Y, skull4BaseSize, skull4NoiseSize);
  skull4NoiseSize = skull4NoiseSize + skull4Speed;
  
  // 显示和更新骷髅5（大小变化）
  displaySkull(skull5X, skull5Y, skull5BaseSize, skull5NoiseSize);
  skull5NoiseSize = skull5NoiseSize + skull5Speed;
  
  // 显示和更新骷髅6（大小变化）
  displaySkull(skull6X, skull6Y, skull6BaseSize, skull6NoiseSize);
  skull6NoiseSize = skull6NoiseSize + skull6Speed;
}

function drawGradientBackground() {
  // 纯黑色背景
  background(0);
}

function displaySkull(skullX, skullY, baseSize, noiseSize) {
  push();
  
  // 使用 noise() 计算骷髅的当前大小
  // 更剧烈的变化：大小在 baseSize*0.5 到 baseSize*1.5 之间变化
  let skullSize = noise(noiseSize) * baseSize * 1.1 + baseSize * 0.5;
  
  // 移动到固定位置
  translate(skullX, skullY);
  
  noStroke();
  
  // 骷髅头部（白色）
  fill(255);
  
  // 头部圆形部分
  ellipse(0, -skullSize * 0.3, skullSize, skullSize * 0.7);
  
  // 下巴矩形部分
  rect(-skullSize * 0.25, -skullSize * 0.2, skullSize * 0.5, skullSize * 0.37);
  
  // 眼睛（黑色）
  fill(0);
  ellipse(-skullSize * 0.25, -skullSize * 0.35, skullSize * 0.17, skullSize * 0.17);
  ellipse(skullSize * 0.25, -skullSize * 0.35, skullSize * 0.17, skullSize * 0.17);
  
  let toothWidth = skullSize * 0.025;  // 牙齿线更细
  
  rect(-skullSize * 0.3, skullSize * 0.05, toothWidth, skullSize * 0.15);
  rect(-skullSize * 0.2, skullSize * 0.05, toothWidth, skullSize * 0.15);
  rect(-skullSize * 0.1, skullSize * 0.05, toothWidth, skullSize * 0.15);
  rect(0, skullSize * 0.05, toothWidth, skullSize * 0.15);
  rect(skullSize * 0.1, skullSize * 0.05, toothWidth, skullSize * 0.15);
  rect(skullSize * 0.2, skullSize * 0.05, toothWidth, skullSize * 0.15);
  rect(skullSize * 0.3, skullSize * 0.05, toothWidth, skullSize * 0.15);
  
  pop();
}