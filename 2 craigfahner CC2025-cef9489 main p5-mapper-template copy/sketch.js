/*
 * p5.mapper
 * https://github.com/jdeboi/p5.mapper
 */

// ---- CONFIG ------------------------------------------------
const SPEED          = 1.0;
const PARTICLE_COUNT = 700;
const COLOR_MODE     = 'ocean';

const PALETTES = {
  ocean:  [[80,200,240],[60,140,220],[130,230,255],[40,160,210],[100,180,255]],
  aurora: [[160,100,240],[200,130,255],[100,220,200],[180,150,255],[80,200,180]],
  rose:   [[255,130,170],[240,100,150],[255,180,200],[220,80,130],[255,210,220]],
  ink:    [[180,180,200],[140,140,160],[200,190,220],[160,160,190],[120,120,150]],
};

let W = 400, H = 400;
const COLS = 40, ROWS = 40;
const CELL = W / COLS;

let particles = [];
let flowField = [];
let pg;
let t = 0;

// ---- p5.mapper globals ------------------------------------
let pMapper;
let quadLeft, quadRight;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // init p5.mapper
  pMapper = createProjectionMapper(this);
  pMapper.load("map.json");
  quadLeft  = pMapper.createQuadMap(400, 400);
  quadRight = pMapper.createQuadMap(400, 400);

  // init flow sketch buffer
  pg = createGraphics(W, H);
  pg.colorMode(RGB);
  pg.noStroke();
  pg.background(0);

  let pal = PALETTES[COLOR_MODE];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(makeParticle(pal));
  }
}

function draw() {
  background(0);
  quadLeft.displaySketch(mySketch);
  quadRight.displaySketch(myOtherSketch);
}

// ---- 第一个面：flow sketch --------------------------------
function mySketch(pg_) {
  t += 0.003 * SPEED;

  // 更新流场
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      let nx = col * 0.08 + t * 0.3;
      let ny = row * 0.08 + t * 0.2;
      let angle = noise(nx, ny, t * 0.15) * TWO_PI * 2.5;
      let curl  = noise(nx + 100, ny + 100, t * 0.1) * TWO_PI;
      flowField[col + row * COLS] = angle * 0.6 + curl * 0.4;
    }
  }

  // 拖尾层
  pg.fill(0, 0, 0, 18);
  pg.rect(0, 0, W, H);

  // 更新粒子
  let pal = PALETTES[COLOR_MODE];
  for (let pt of particles) {
    pt.age++;

    let col = floor(constrain(pt.x / CELL, 0, COLS - 1));
    let row = floor(constrain(pt.y / CELL, 0, ROWS - 1));
    let angle = flowField[col + row * COLS];
    let spd = (0.5 + noise(pt.x * 0.005, pt.y * 0.005, t) * 1.5) * SPEED * 0.22;

    pt.vx = pt.vx * 0.82 + cos(angle) * spd;
    pt.vy = pt.vy * 0.82 + sin(angle) * spd;
    pt.x += pt.vx;
    pt.y += pt.vy;

    let dx = pt.x - W / 2;
    let dy = pt.y - H / 2;
    let dist = sqrt(dx * dx + dy * dy);
    let outOfBounds = dist > 178 || pt.x < 5 || pt.x > W-5 || pt.y < 5 || pt.y > H-5;

    if (outOfBounds || pt.age > pt.maxAge) {
      resetParticle(pt, pal);
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

  // 渲染到投影面
  pg_.clear();
  pg_.push();
  pg_.background(0);
  pg_.image(pg, width/2, height/4);
  pg_.pop();
}

// ---- 第二个面：原样保留 ------------------------------------
function myOtherSketch(pg_) {
  pg_.clear();
  pg_.push();

  pg_.background(255, 0, 0);
  pg_.rectMode(CORNERS);

  pg_.pop();
}

// ---- 粒子工具函数 ------------------------------------------
function makeParticle(pal) {
  let angle = random(TWO_PI);
  let r     = random(0, 155);
  return {
    x:      W / 2 + r * cos(angle),
    y:      H / 2 + r * sin(angle),
    vx: 0, vy: 0,
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
  pt.vx = 0; pt.vy = 0;
  pt.age    = 0;
  pt.maxAge = random(100, 260);
  pt.size   = random(1.5, 4.0);
  pt.alpha  = 0;
  pt.color  = pal[floor(random(pal.length))];
}

// ---- 按键 & 窗口 ------------------------------------------
function keyPressed() {
  switch (key) {
    case "c": pMapper.toggleCalibration(); break;
    case "f": fullscreen(!fullscreen());   break;
    case "l": pMapper.load("map.json");    break;
    case "s": pMapper.save("map.json");    break;
  }
}
c
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}