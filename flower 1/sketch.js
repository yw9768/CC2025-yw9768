// 液态光流 //

// 配置变量
let speed;
let particleCount;
let colorMode;
let cols, rows;

// 色板
let palettes;

// 光流设置
let flowX, flowY, flowSize, flowAngleOffset;

// 状态变量
let pg;
let particles;
let flowField;
let t;

function setup() {
  createCanvas(400, 400);

  // 配置初始化
  speed = 1.0;
  particleCount = 700;
  colorMode = 'ocean';
  cols = 40;
  rows = 40;

  // 色板
  palettes = {
    ocean:  [[80,200,240],[60,140,220],[130,230,255],[40,160,210],[100,180,255]],
    aurora: [[160,100,240],[200,130,255],[100,220,200],[180,150,255],[80,200,180]],
    rose:   [[255,130,170],[240,100,150],[255,180,200],[220,80,130],[255,210,220]],
    ink:    [[180,180,200],[140,140,160],[200,190,220],[160,160,190],[120,120,150]],
  };

  // 光流设置
  flowX = 200;
  flowY = 200;
  flowSize = 400;
  flowAngleOffset = 0.0;

  // 时间
  t = 0.0;

  // 初始化拖尾层
  pg = makeTrailLayer(flowSize);

  // 初始化粒子
  particles = initParticles(flowSize);

  // 初始化流场
  flowField = new Array(cols * rows);
}

function draw() {
  background(0);

  // 推进时间
  t += 0.003 * speed;

  // 更新光流
  updateFlow(particles, flowField, pg, t, flowAngleOffset, flowSize);

  // 贴到画布
  image(pg, flowX - flowSize/2, flowY - flowSize/2);
}

function updateFlow(particles, flowField, pg, t, angleOffset, size) {
  let pal = palettes[colorMode];
  let cell = size / cols;

  // 更新流场
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let nx = col * 0.08 + t * 0.3;
      let ny = row * 0.08 + t * 0.2;
      let angle = noise(nx, ny, t * 0.15) * TWO_PI * 2.5;
      let curl  = noise(nx + 100, ny + 100, t * 0.1) * TWO_PI;
      flowField[col + row * cols] = angle * 0.6 + curl * 0.4 + angleOffset;
    }
  }

  // 拖尾覆盖
  pg.fill(0, 0, 0, 18);
  pg.rect(0, 0, size, size);

  // 更新粒子
  for (let pt of particles) {
    pt.age++;

    let col = floor(constrain(pt.x / cell, 0, cols - 1));
    let row = floor(constrain(pt.y / cell, 0, rows - 1));
    let angle = flowField[col + row * cols];
    let spd = (0.5 + noise(pt.x * 0.005, pt.y * 0.005, t) * 1.5) * speed * 0.22;

    pt.vx = pt.vx * 0.82 + cos(angle) * spd;
    pt.vy = pt.vy * 0.82 + sin(angle) * spd;
    pt.x += pt.vx;
    pt.y += pt.vy;

    let dx = pt.x - size / 2;
    let dy = pt.y - size / 2;
    let dist = sqrt(dx * dx + dy * dy);
    let radius = size / 2 - 20;

    if (dist > radius || pt.x < 5 || pt.x > size-5 || pt.y < 5 || pt.y > size-5 || pt.age > pt.maxAge) {
      resetParticle(pt, pal, size);
      continue;
    }

    let life = pt.age / pt.maxAge;
    if      (life < 0.15) pt.alpha = life / 0.15;
    else if (life > 0.75) pt.alpha = 1 - (life - 0.75) / 0.25;
    else                  pt.alpha = 1.0;

    let c = pt.color;
    pg.fill(c[0], c[1], c[2], floor(pt.alpha * 180));
    pg.ellipse(pt.x, pt.y, pt.size * (0.7 + pt.alpha * 0.8));
  }
}

function makeTrailLayer(size) {
  let g = createGraphics(size, size);
  g.colorMode(RGB);
  g.noStroke();
  g.background(0);
  return g;
}

function initParticles(size) {
  let pts = [];
  let pal = palettes[colorMode];
  for (let i = 0; i < particleCount; i++) {
    pts.push(makeParticle(pal, size));
  }
  return pts;
}

function makeParticle(pal, size) {
  let angle = random(TWO_PI);
  let r = random(0, size/2 - 30);
  return {
    x:      size/2 + r * cos(angle),
    y:      size/2 + r * sin(angle),
    vx: 0, vy: 0,
    age:    random(0, 150),
    maxAge: random(100, 260),
    size:   random(1.5, 4.0),
    alpha:  0,
    color:  pal[floor(random(pal.length))],
  };
}

function resetParticle(pt, pal, size) {
  let angle = random(TWO_PI);
  let r = random(10, size/2 - 30);
  pt.x      = size/2 + r * cos(angle);
  pt.y      = size/2 + r * sin(angle);
  pt.vx = 0; pt.vy = 0;
  pt.age    = 0;
  pt.maxAge = random(100, 260);
  pt.size   = random(1.5, 4.0);
  pt.alpha  = 0;
  pt.color  = pal[floor(random(pal.length))];
}
