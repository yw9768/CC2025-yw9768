let cellW = 75, cellH = 45; // set the width and height of bricks
let margin = 20;            // set the blank space around the bricks

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  rectMode(CENTER); // 以中心画矩形，便于绕中心旋转
}

function draw() {
  background("rgba(218, 222, 221, 1)"); // gray bg
  translate(margin, margin);

  const usableW = width  - margin * 2;
  const usableH = height - margin * 2;

  for (let x = 0; x <= usableW - cellW; x += cellW) {       // 列
    for (let y = 0; y <= usableH - cellH; y += cellH) {     // 行
      // 0（上）→ 1（下），用于随Y轴增强旋转/尺寸等
     
    let t; //行数
    if (usableH - cellH > 0) {
     t = y / (usableH - cellH);  // 顶部 ~0，底部 ~1
      } else {
     t = 0;                      // 防止除 0
      }



      // 颜色：mouseX 控制（左→右渐变）
      // 用 lerp 在两种颜色之间插值：从(93,107,158)到(220,120,80)
      const u = constrain(mouseX / width, 0, 1);//左边最小值是0，右边最大值是1
      const r = lerp(93,  220, u);
      const g = lerp(107, 120, u);
      const b = lerp(158,  80, u);//分别代表rgb颜色三个值的变化

      // 旋转角：越往下越大，并受 mouseY 调整
      // mouseY 在顶部=0旋转，底部≈PI/3；整体再乘以 t（行数）
      const maxAng = map(mouseY, 0, height, 0, PI / 3);//到最下面旋转60度
      const ang = t * maxAng;

      // 砖实际尺寸（留缝）
      const bw = cellW * 0.9;
      const bh = cellH * 0.7;

      push();
      // 把原先“左上角”的定位改为“格子中心”，便于旋转
      translate(x + cellW / 2, y + cellH / 2);//因为现在用的是corner， 旋转对准的是格子中心
      //但是xy在左上角，所以要移到砖块中间
      rotate(ang);

      fill(r, g, b);
      rect(0, 0, bw, bh, 5);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
