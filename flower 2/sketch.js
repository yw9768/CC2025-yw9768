// ============================================================
//  柔光色流 — 投影专用版
//  画布: 400 x 400  黑底只投光，直接打到白色花卉上
//
//  使用方法:
//  1. 打开 https://editor.p5js.org
//  2. 把这段代码全部贴进去，替换原来的内容
//  3. 按 ▶ Run
//
//  控制方式（演示用）:
//  - 鼠标左右拖动 → 模拟花的开合（右=花开，左=花合）
//
//  ⚡ 接马达时，找到下面 CONFIG 里的说明，
//     把 targetOpen 替换成你的串口信号值即可
//
//  参数调整 (在 CONFIG 区域修改):
//  - FLOW_SPEED     颜色流动速度  (推荐 0.5慢 ~ 2.0快)
//  - HUE_RANGE      色相跨度      (推荐 100窄 ~ 260宽)
//  - SATURATION     饱和度        (推荐 60柔和 ~ 95鲜艳)
// ============================================================

// ---- CONFIG ------------------------------------------------
const FLOW_SPEED  = 1.0;   // 颜色流动速度
const HUE_RANGE   = 200;   // 色相跨度（越大颜色越丰富）
const SATURATION  = 82;    // 饱和度
// ------------------------------------------------------------

const W = 400, H = 400;
const CX = W / 2, CY = H / 2;
const R = 178; // 花卉投影半径

// ============================================================
//  flowerOpen — 核心控制变量  0.0(合) ~ 1.0(开)
//
//  ⚡ 接马达时替换这里：
//  例如 Arduino 通过 Serial 传入 0~255：
//    targetOpen = map(serialValue, 0, 255, 0, 1);
// ============================================================
let flowerOpen  = 0.0;
let targetOpen  = 0.0;

let t = 0;

// 鼠标拖动状态
let isDragging   = false;
let dragStartX   = 0;
let dragStartOpen = 0;

// 离屏渲染缓冲（低分辨率再放大，保持性能）
// RES 越高越细腻，但越慢；80~100 是投影的最佳平衡
const RES = 95;
let pg;

// ============================================================
//  setup
// ============================================================
function setup() {
  createCanvas(W, H);

  // 创建离屏 graphics，用于逐像素颜色计算
  pg = createGraphics(RES, RES);
  pg.pixelDensity(1);
  pg.noSmooth();
}

// ============================================================
//  鼠标控制：拖动模拟花的开合（演示用）
// ============================================================
function mousePressed() {
  isDragging    = true;
  dragStartX    = mouseX;
  dragStartOpen = targetOpen;
}
function mouseReleased() {
  isDragging = false;
}
function mouseDragged() {
  if (!isDragging) return;
  let delta  = (mouseX - dragStartX) / (W * 0.65);
  targetOpen = constrain(dragStartOpen + delta, 0, 1);
}

// ============================================================
//  draw — 每帧
// ============================================================
function draw() {
  // 时间推进
  t += 0.020 * FLOW_SPEED;

  // flowerOpen 平滑跟随 targetOpen（缓入缓出）
  flowerOpen = lerp(flowerOpen, targetOpen, 0.045);

  background(0);

  // ---- 逐像素渲染颜色场 -----------------------------------
  pg.loadPixels();

  const cx = RES / 2, cy = RES / 2, r = RES / 2 - 1;

  for (let py = 0; py < RES; py++) {
    for (let px = 0; px < RES; px++) {
      const dx   = px - cx;
      const dy   = py - cy;
      const dist = sqrt(dx * dx + dy * dy);

      // 圆形外：完全透明
      if (dist > r) {
        setPixel(pg, px, py, 0, 0, 0, 0);
        continue;
      }

      // 归一化坐标 -1 ~ 1
      const nx = dx / r;
      const ny = dy / r;

      // ---- 两层大尺度 noise，去掉细节 = 无纹理 ------------
      // 层1：极低频，整体色块缓慢漂移
      const s1 = smoothNoise(nx * 0.9 + t * 0.12, ny * 0.9 - t * 0.10, t * 0.08);

      // 层2：低频，色块内部柔和变化
      const s2 = smoothNoise(nx * 1.6 - t * 0.15, ny * 1.5 + t * 0.13, t * 0.10 + 4.0);

      // 合成：大色块主导
      const n = s1 * 0.65 + s2 * 0.35;

      // ---- 色相计算 ----------------------------------------
      // n 在 -1~1 之间，映射到色相范围
      // 加上 t*14 让整体色相随时间缓慢旋转
      const hue = ((n * (HUE_RANGE / 2) + t * 14) % 360 + 360) % 360;

      // 饱和度：花开时全饱和，花合时降为0（变灰消失）
      const sat = SATURATION * flowerOpen;

      // 亮度：固定值，不随 noise 变化 = 无明暗纹理
      const lig = 52;

      // 边缘柔化：靠近圆边缘渐渐透明
      const edgeFade = min(1.0, (r - dist) / (r * 0.07));

      // 整体透明度：花开时显现，花合时完全消失
      const alpha = edgeFade * flowerOpen;

      // HSL → RGB
      const [rr, gg, bb] = hslToRgb(hue, sat, lig);
      setPixel(pg, px, py, rr, gg, bb, alpha * 255);
    }
  }

  pg.updatePixels();

  // 把低分辨率缓冲放大到主画布（平滑插值让色块边界柔和）
  imageMode(CENTER);
  image(pg, CX, CY, R * 2, R * 2);
  imageMode(CORNER);

  // ---- 花心高光（花开时出现，增加层次感）-----------------
  

  // ---- 演示 UI（投影时删掉这段）--------------------------
  drawUI();
}

// ============================================================
//  smoothNoise — 纯大尺度低频 noise
//  只保留极低频层，去掉中高频 = 颜色柔和无纹理
// ============================================================
function smoothNoise(x, y, z) {
  let v = 0;
  // 层1：极低频，大色块整体漂移
  v += sin(x * 0.8 + z * 0.5) * cos(y * 0.9 + z * 0.4) * 0.60;
  // 层2：低频，内部柔和变化
  v += sin(x * 1.6 - z * 0.7 + y * 0.5) * cos(y * 1.5 + z * 0.6) * 0.30;
  // 层3：极低频漂移基底
  v += sin(x * 0.3 + y * 0.25 - z * 0.3) * 0.10;
  return v; // -1 ~ 1
}

// ============================================================
//  hslToRgb — HSL 转 RGB
//  h: 0~360  s: 0~100  l: 0~100
//  返回 [r, g, b]，每个值 0~255
// ============================================================
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;

  if (s === 0) {
    let v = l * 255;
    return [v, v, v];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  function hf(t) {
    t = ((t % 1) + 1) % 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

  return [
    hf(h + 1/3) * 255 | 0,
    hf(h)       * 255 | 0,
    hf(h - 1/3) * 255 | 0,
  ];
}

// ============================================================
//  setPixel — 直接写入 pg 的像素数组
// ============================================================
function setPixel(g, x, y, r, gr, b, a) {
  const idx = (y * RES + x) * 4;
  g.pixels[idx]     = r;
  g.pixels[idx + 1] = gr;
  g.pixels[idx + 2] = b;
  g.pixels[idx + 3] = a;
}

// ============================================================
//  drawUI — 演示界面提示（投影时可整段删除）
// ============================================================
function drawUI() {
  // 进度条背景
  let barW = 160, barH = 4;
  let barX = CX - barW / 2, barY = H - 24;

  noStroke();
  fill(35, 35, 35);
  rect(barX, barY, barW, barH, 2);

  // 进度
  fill(lerpColor(color(100, 140, 255), color(255, 180, 100), flowerOpen));
  rect(barX, barY, flowerOpen * barW, barH, 2);

  // 文字提示
  fill(110, 110, 110);
  textSize(11);
  textAlign(CENTER);
  let label = flowerOpen < 0.08 ? '花合拢' :
              flowerOpen > 0.92 ? '花全开' :
              '← 拖动控制开合 →';
  text(label, CX, H - 10);
}