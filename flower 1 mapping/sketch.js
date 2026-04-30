// ============================================================
//  液态光流 — p5.mapper 投影版
//  两个 400×400 quad，左边 ocean 蓝，右边 aurora 紫绿
// ============================================================

// ---- CONFIG ------------------------------------------------
const SPEED          = 1.0;
const PARTICLE_COUNT = 700;
// ------------------------------------------------------------

const PALETTES = {
  ocean:  [[80, 200, 240], [60, 140, 220], [130, 230, 255], [40, 160, 210], [100, 180, 255]],
  aurora: [[160, 100, 240],[200, 130, 255],[100, 220, 200],[180, 150, 255],[80, 200, 180]],
};

const W = 400, H = 400;
const COLS = 40, ROWS = 40;
const CELL = W / COLS;

// ---- mapper 相关 -------------------------------------------
let pMapper;
let quadLeft, quadRight;

// ---- 两套独立的流场状态 ------------------------------------
// 左边 quad (ocean)
let trailLeft;        // 拖尾 graphics，setup 里创建，跨帧保留
let particlesLeft = [];
let flowFieldLeft  = [];
let tLeft = 0;

// 右边 quad (aurora)
let trailRight;
let particlesRight = [];
let flowFieldRight  = [];
let tRight = 0.5;     // 时间偏移，让两边不同步

// ============================================================
//  setup
// ============================================================
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  pMapper = createProjectionMapper(this);
  pMapper.load("map.json");

  quadLeft  = pMapper.createQuadMap(400, 400);
  quadRight = pMapper.createQuadMap(400, 400);

  // 拖尾层：在 p5.mapper 外部单独创建，跨帧持续存在
  // 这是关键：不能在 pg 里面再 createGraphics，
  // 所以把拖尾层提到全局，作为独立 graphics
  trailLeft  = createGraphics(W, H);
  trailLeft.colorMode(RGB);
  trailLeft.noStroke();
  trailLeft.background(0);

  trailRight = createGraphics(W, H);
  trailRight.colorMode(RGB);
  trailRight.noStroke();
  trailRight.background(0);

  // 初始化粒子
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particlesLeft.push(makeParticle('ocean'));
    particlesRight.push(makeParticle('aurora'));
  }
}

// ============================================================
//  draw
// ============================================================
function draw() {
  background(0);

  // 时间推进（两边独立）
  tLeft  += 0.003 * SPEED;
  tRight += 0.003 * SPEED;

  // 更新两边流场
  updateFlowField(flowFieldLeft,  tLeft);
  updateFlowField(flowFieldRight, tRight);

  // 更新两边粒子到各自的拖尾层
  updateParticles(particlesLeft,  flowFieldLeft,  trailLeft,  tLeft,  'ocean');
  updateParticles(particlesRight, flowFieldRight, trailRight, tRight, 'aurora');

  // 渲染到 quad
  quadLeft.displaySketch(sketchLeft);
  quadRight.displaySketch(sketchRight);
}

// ============================================================
//  sketchLeft / sketchRight — 传给 displaySketch 的函数
//  pg 是 mapper 给的临时画布，只需把拖尾层贴进去就行
// ============================================================
function sketchLeft(pg) {
  pg.clear();
  pg.push();
  pg.background(0);
  pg.image(trailLeft, 0, 0);   // 把持久拖尾层贴进 mapper 的 pg
  pg.pop();
}

function sketchRight(pg) {
  pg.clear();
  pg.push();
  pg.background(0);
  pg.image(trailRight, 0, 0);
  pg.pop();
}

// ============================================================
//  updateFlowField — 每帧重算流场角度
// ============================================================
function updateFlowField(field, t) {
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      let nx = col * 0.08 + t * 0.3;
      let ny = row * 0.08 + t * 0.2;
      let angle = noise(nx, ny, t * 0.15) * TWO_PI * 2.5;
      let curl  = noise(nx + 100, ny + 100, t * 0.1) * TWO_PI;
      field[col + row * COLS] = angle * 0.6 + curl * 0.4;
    }
  }
}

// ============================================================
//  updateParticles — 移动粒子，画到拖尾层
// ============================================================
function updateParticles(pts, field, trail, t, colorMode) {
  let pal = PALETTES[colorMode];

  // 拖尾：每帧用低透明度黑色覆盖，形成余光
  trail.fill(0, 0, 0, 18);
  trail.rect(0, 0, W, H);

  for (let pt of pts) {
    pt.age++;

    let col   = floor(constrain(pt.x / CELL, 0, COLS - 1));
    let row   = floor(constrain(pt.y / CELL, 0, ROWS - 1));
    let angle = field[col + row * COLS];

    let spd = (0.5 + noise(pt.x * 0.005, pt.y * 0.005, t) * 1.5) * SPEED * 0.22;

    pt.vx = pt.vx * 0.82 + cos(angle) * spd;
    pt.vy = pt.vy * 0.82 + sin(angle) * spd;
    pt.x += pt.vx;
    pt.y += pt.vy;

    // 边界 & 寿命检查
    let dx = pt.x - W / 2;
    let dy = pt.y - H / 2;
    let d  = sqrt(dx * dx + dy * dy);
    if (d > 178 || pt.x < 5 || pt.x > W - 5 || pt.y < 5 || pt.y > H - 5 || pt.age > pt.maxAge) {
      resetParticle(pt, pal);
      continue;
    }

    // 淡入淡出 alpha
    let life = pt.age / pt.maxAge;
    if      (life < 0.15) pt.alpha = life / 0.15;
    else if (life > 0.75) pt.alpha = 1 - (life - 0.75) / 0.25;
    else                  pt.alpha = 1.0;

    let c = pt.color;
    trail.fill(c[0], c[1], c[2], floor(pt.alpha * 180));
    trail.ellipse(pt.x, pt.y, pt.size * (0.7 + pt.alpha * 0.8));
  }
}

// ============================================================
//  makeParticle / resetParticle
// ============================================================
function makeParticle(colorMode) {
  let pal   = PALETTES[colorMode];
  let angle = random(TWO_PI);
  let r     = random(0, 155);
  return {
    x:      W / 2 + r * cos(angle),
    y:      H / 2 + r * sin(angle),
    vx:     0,
    vy:     0,
    age:    random(0, 150),
    maxAge: random(100, 260),
    size:   random(1.5, 4.0),
    alpha:  0,
    color:  pal[floor(random(pal.length))],
  };
}

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

// ============================================================
//  键盘 & 窗口
// ============================================================
function keyPressed() {
  switch (key) {
    case "c": pMapper.toggleCalibration(); break;
    case "f": fullscreen(!fullscreen());   break;
    case "l": pMapper.load("map.json");    break;
    case "s": pMapper.save("map.json");    break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
