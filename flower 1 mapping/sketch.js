// ---- CONFIG ------------------------------------------------
const SPEED = 1.0;
const PARTICLE_COUNT = 700;
const COLOR_MODE = 'ocean';
const COLS = 40, ROWS = 40;

const PALETTES = {
  ocean:  [[80,200,240],[60,140,220],[130,230,255],[40,160,210],[100,180,255]],
  aurora: [[160,100,240],[200,130,255],[100,220,200],[180,150,255],[80,200,180]],
  rose:   [[255,130,170],[240,100,150],[255,180,200],[220,80,130],[255,210,220]],
  ink:    [[180,180,200],[140,140,160],[200,190,220],[160,160,190],[120,120,150]],
};

let flows = [
  { x: 820, y: 310, size: 90,  angleOffset: 0.0 },
  { x: 940, y: 340, size: 120, angleOffset: 1.0 },
  { x: 820, y: 420, size: 110, angleOffset: 2.0 },
  { x: 990, y: 450, size: 120, angleOffset: 3.0 },
  { x: 850, y: 500, size: 120, angleOffset: 4.2 },
  { x: 960, y: 540, size: 100, angleOffset: 5.5 },
];

let pgs = [];
let particleGroups = [];
let flowFields = [];
let times = [0.0, 0.3, 0.6, 0.9, 1.2, 1.5];

// 时间设置
let brightMs  = 2750; // 亮的持续时间
let fadeMs    = 1000;   // 过渡时间
let darkMs    = 270; // 暗的持续时间f
// 总周期 = 亮 + 淡出过渡 + 暗 + 淡入过渡
let totalMs   = brightMs + fadeMs + darkMs + fadeMs;

let globalAlpha = 1.0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 6; i++) {
    let W = flows[i].size;
    let H = flows[i].size;

    let g = createGraphics(W, H);
    g.colorMode(RGB);
    g.noStroke();
    g.background(0);
    pgs.push(g);

    let pts = [];
    let pal = PALETTES[COLOR_MODE];
    for (let j = 0; j < PARTICLE_COUNT; j++) {
      pts.push(makeParticle(pal, W, H));
    }
    particleGroups.push(pts);

    flowFields.push(new Array(COLS * ROWS));
  }
}

function draw() {
  background(255);

  // 计算当前在周期里的位置（毫秒）
  let pos = millis() % totalMs;

  if (pos < brightMs) {
    // 亮的阶段
    globalAlpha = 1.0;

  } else if (pos < brightMs + fadeMs) {
    // 淡出过渡
    let t = (pos - brightMs) / fadeMs;
    globalAlpha = 1.0 - t;

  } else if (pos < brightMs + fadeMs + darkMs) {
    // 暗的阶段
    globalAlpha = 0.0;

  } else {
    // 淡入过渡
    let t = (pos - brightMs - fadeMs - darkMs) / fadeMs;
    globalAlpha = t;
  }

  for (let i = 0; i < 6; i++) {
    times[i] += 0.003 * SPEED;
    let W = flows[i].size;
    let H = flows[i].size;
    updateAll(particleGroups[i], flowFields[i], pgs[i], times[i], flows[i].angleOffset, W, H);

    tint(255, globalAlpha * 255);

    if (i === 4) {
      push();
      translate(flows[i].x, flows[i].y);
      scale(1, 0.5);
      image(pgs[i], -W/2, -H/2);
      pop();
    } else if (i === 5) {
      push();
      translate(flows[i].x, flows[i].y);
      scale(1, 0.5);
      image(pgs[i], -W/2, -H/2);
      pop();
    } else {
      image(pgs[i], flows[i].x - W/2, flows[i].y - H/2);
    }
  }

  noTint();
}

function updateAll(particles, flowField, pg, t, angleOffset, W, H) {
  let pal = PALETTES[COLOR_MODE];
  let CELL = W / COLS;

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      let nx = col * 0.08 + t * 0.3;
      let ny = row * 0.08 + t * 0.2;
      let angle = noise(nx, ny, t * 0.15) * TWO_PI * 2.5;
      let curl  = noise(nx + 100, ny + 100, t * 0.1) * TWO_PI;
      flowField[col + row * COLS] = angle * 0.6 + curl * 0.4 + angleOffset;
    }
  }

  pg.fill(0, 0, 0, 18);
  pg.rect(0, 0, W, H);

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
    let radius = W / 2 - 20;

    if (dist > radius || pt.x < 5 || pt.x > W-5 || pt.y < 5 || pt.y > H-5 || pt.age > pt.maxAge) {
      resetParticle(pt, pal, W, H);
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

function makeParticle(pal, W, H) {
  let angle = random(TWO_PI);
  let r = random(0, W/2 - 15);
  return {
    x:      W / 2 + r * cos(angle),
    y:      H / 2 + r * sin(angle),
    vx: 0, vy: 0,
    age:    random(0, 150),
    maxAge: random(100, 260),
    size:   random(0.5, 2.0),
    alpha:  0,
    color:  pal[floor(random(pal.length))],
  };
}

function resetParticle(pt, pal, W, H) {
  let angle = random(TWO_PI);
  let r = random(5, W/2 - 15);
  pt.x      = W / 2 + r * cos(angle);
  pt.y      = H / 2 + r * sin(angle);
  pt.vx = 0; pt.vy = 0;
  pt.age    = 0;
  pt.maxAge = random(100, 260);
  pt.size   = random(0.5, 2.0);
  pt.alpha  = 0;
  pt.color  = pal[floor(random(pal.length))];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}