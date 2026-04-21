// ============================================================
//  液态光流 — 投影专用版
//  画布: 400 x 400  黑底只投光，直接打到白色花卉上
//
//  使用方法:
//  1. 打开 https://editor.p5js.org
//  2. 把这段代码全部贴进去，替换原来的内容
//  3. 按 ▶ Run
//
//  参数调整 (在 CONFIG 区域修改):
//  - SPEED        流动速度 (推荐 0.5 ~ 2.0)
//  - PARTICLE_COUNT 粒子数量 (推荐 400 ~ 1200)
//  - COLOR_MODE   色调模式: 'ocean' / 'aurora' / 'rose' / 'ink'
// ============================================================

// ---- CONFIG ------------------------------------------------
const SPEED         = 1.0;   // 流动速度
const PARTICLE_COUNT = 700;  // 粒子数量
const COLOR_MODE    = 'ocean'; // 色调: ocean / aurora / rose / ink
// ------------------------------------------------------------

// 色板：每种颜色是 [R, G, B]
const PALETTES = {
  ocean:  [[80, 200, 240], [60, 140, 220], [130, 230, 255], [40, 160, 210], [100, 180, 255]],
  aurora: [[160, 100, 240],[200, 130, 255],[100, 220, 200],[180, 150, 255],[80, 200, 180]],
  rose:   [[255, 130, 170],[240, 100, 150],[255, 180, 200],[220, 80, 130],[255, 210, 220]],
  ink:    [[180, 180, 200],[140, 140, 160],[200, 190, 220],[160, 160, 190],[120, 120, 150]],
};

// 内部变量
let particles = [];
let flowField = [];
let pg;          // 拖尾层
let t = 0;       // 时间

const W = 400, H = 400;
const COLS = 40, ROWS = 40;
const CELL = W / COLS;

// ============================================================
//  setup — 初始化
// ============================================================
function setup() {
  createCanvas(W, H);

  // pg 是单独的拖尾图层，每帧用黑色半透明覆盖，形成余光效果
  pg = createGraphics(W, H);
  pg.colorMode(RGB);
  pg.noStroke();
  pg.background(0);

  // 初始化所有粒子
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(makeParticle());
  }
}

// ============================================================
//  draw — 每帧执行
// ============================================================
function draw() {
  // 时间推进：速度越大，流场变化越快
  t += 0.003 * SPEED;

  // ---- 1. 更新流场 ----------------------------------------
  // 每个格子用 noise() 生成一个"风向角度"
  // 两层 noise 叠加，制造旋涡感
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      let nx = col * 0.08 + t * 0.3;
      let ny = row * 0.08 + t * 0.2;

      // 主流方向
      let angle = noise(nx, ny, t * 0.15) * TWO_PI * 2.5;

      // 叠加一个旋转扰动，让流场有漩涡感
      let curl  = noise(nx + 100, ny + 100, t * 0.1) * TWO_PI;
      flowField[col + row * COLS] = angle * 0.6 + curl * 0.4;
    }
  }

  // ---- 2. 拖尾层：用极低透明度的黑色覆盖 ----------------
  // 透明度越低 = 拖尾越长；越高 = 拖尾越短
  pg.fill(0, 0, 0, 18);
  pg.rect(0, 0, W, H);

  // ---- 3. 更新并绘制每个粒子 -----------------------------
  let pal = PALETTES[COLOR_MODE];

  for (let pt of particles) {
    pt.age++;

    // 找到当前粒子所在的流场格子
    let col = floor(constrain(pt.x / CELL, 0, COLS - 1));
    let row = floor(constrain(pt.y / CELL, 0, ROWS - 1));
    let angle = flowField[col + row * COLS];

    // 速度：用 noise 给每个粒子加一点随机快慢，避免整齐划一
    let spd = (0.5 + noise(pt.x * 0.005, pt.y * 0.005, t) * 1.5) * SPEED * 0.22;

    // 加速度 → 速度（带阻尼，让运动更流畅）
    pt.vx = pt.vx * 0.82 + cos(angle) * spd;
    pt.vy = pt.vy * 0.82 + sin(angle) * spd;

    // 更新位置
    pt.x += pt.vx;
    pt.y += pt.vy;

    // ---- 边界处理：超出花形范围就重生 ----
    let dx = pt.x - W / 2;
    let dy = pt.y - H / 2;
    let dist = sqrt(dx * dx + dy * dy);
    let outOfBounds = dist > 178 || pt.x < 5 || pt.x > W - 5 || pt.y < 5 || pt.y > H - 5;
    let tooOld = pt.age > pt.maxAge;

    if (outOfBounds || tooOld) {
      resetParticle(pt, pal);
      continue;
    }

    // ---- 生命周期 Alpha（淡入 → 全亮 → 淡出）----
    let life = pt.age / pt.maxAge;
    if (life < 0.15) {
      pt.alpha = life / 0.15;        // 淡入阶段
    } else if (life > 0.75) {
      pt.alpha = 1 - (life - 0.75) / 0.25; // 淡出阶段
    } else {
      pt.alpha = 1.0;                // 全亮阶段
    }

    // ---- 绘制粒子到拖尾层 ----
    let c = pt.color;
    // 投影模式：颜色叠加在黑底上，越亮越发光
    pg.fill(c[0], c[1], c[2], floor(pt.alpha * 180));
    pg.ellipse(pt.x, pt.y, pt.size * (0.7 + pt.alpha * 0.8));
  }

  // ---- 4. 把拖尾层渲染到主画布 ---------------------------
  background(0);
  image(pg, 0, 0);

  // ---- 5. 在花心叠加一个柔和光晕（可选，增强层次感）-------
  // 用渐变圆模拟花心发光
  
}

// ============================================================
//  makeParticle — 新建一个粒子（随机位置在花形内）
// ============================================================
function makeParticle() {
  let pal = PALETTES[COLOR_MODE];
  let angle = random(TWO_PI);
  let r     = random(0, 155);
  return {
    x:      W / 2 + r * cos(angle),
    y:      H / 2 + r * sin(angle),
    vx:     0,
    vy:     0,
    age:    random(0, 150),   // 随机初始年龄，避免所有粒子同时出生
    maxAge: random(100, 260),
    size:   random(1.5, 4.0),
    alpha:  0,
    color:  pal[floor(random(pal.length))],
  };
}

// ============================================================
//  resetParticle — 重置一个粒子（死亡后复活）
// ============================================================
function resetParticle(pt, pal) {
  let angle = random(TWO_PI);
  let r     = random(10, 150);
  pt.x      = W / 2 + r * cos(angle);
  pt.y      = H / 2 + r * sin(angle);
  pt.vx     = 0;
  pt.vy     = 0;
  pt.age    = 0;
  pt.maxAge = random(100, 260);
  pt.size   = random(1.5, 4.0);
  pt.alpha  = 0;
  pt.color  = pal[floor(random(pal.length))];
}