var c = document.getElementById("gemu");
var ctx = c.getContext("2d");

var x = 0;
var y = 0;
var size = 100;
var keys = { Escape: false };

const cx = 925;
const cy = 375;

const num = 100;
var pnum = 5;

var puntuacion = 0;
var level = 0;

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    keys[event.key] = keys[event.key] ? false : true;
  } else {
    keys[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === "Escape") {
    return;
  }
  keys[event.key] = false;
});

/*
var map = new Array(size * size);

for (var i = 0; i < size; i++) {
  for (var j = 0; j < size; j++) {
    map[j + j * i] = getRandomColor();
  }
}

var mapGeneration = () => {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      ctx.fillStyle = map[j + j * i];
      ctx.fillRect(x + 50 * i, y + 50 * j - 50, 50, 50);
    }
  }
};
*/
function renderMap() {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      const side = 64;
      var xx = x + side * i;
      var yy = y + side * j;
      if (-side < xx && xx < 2160 && -side < yy && yy < 1500) {
        var cases = Math.ceil(
          Math.cos((i * 180) / (Math.PI * 10)) *
            Math.cos((j * 180) / (Math.PI * 10)) *
            4,
        );
        if (cases < 0) {
          cases = Math.abs(cases);
          switch (cases) {
            case 1:
              ctx.drawImage(g0, xx, yy, side, side);
              break;
            case 2:
              ctx.drawImage(g1, xx, yy, side, side);
              break;
            case 3:
              ctx.drawImage(g2, xx, yy, side, side);
              break;
            case 4:
              ctx.drawImage(g3, xx, yy, side, side);
              break;
          }
        } else {
          switch (cases) {
            case 0:
              ctx.drawImage(mid, xx, yy, side, side);
              break;
            case 1:
              ctx.drawImage(a1, xx, yy, side, side);
              break;
            case 2:
              ctx.drawImage(a2, xx, yy, side, side);
              break;
            case 3:
              ctx.drawImage(a3, xx, yy, side, side);
              break;
            case 4:
              ctx.drawImage(a4, xx, yy, side, side);
              break;
          }
        }
      }
    }
  }
}

const imgHeart = new Image();
imgHeart.src = "imgs/heart.png";

const mid = new Image();
mid.src = "imgs/mid.png";

const val = new Image();
val.src = "imgs/val.png";

const g0 = new Image();
g0.src = "imgs/grass0.png";
const g1 = new Image();
g1.src = "imgs/grass3.png";
const g2 = new Image();
g2.src = "imgs/grass2.png";
const g3 = new Image();
g3.src = "imgs/grass1.png";

const a0 = new Image();
a0.src = "imgs/0.png";
const a1 = new Image();
a1.src = "imgs/1.png";
const a2 = new Image();
a2.src = "imgs/1.png";
const a3 = new Image();
a3.src = "imgs/3.png";
const a4 = new Image();
a4.src = "imgs/4.png";

const bubble = new Image();
bubble.src = "imgs/bubble.png";

class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  rotation(deg) {
    var x = this.x - cx;
    var y = this.y - cy;
    this.x = x * Math.cos(deg) - y * Math.sin(deg) + cx;
    this.y = x * Math.sin(deg) + y * Math.cos(deg) + cy;
  }

  render() {
    ctx.drawImage(bubble, this.x - 25, this.y - 25, 50, 50);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
  }
}

var bullets = new Array(pnum);

for (var i = 0; i < pnum; i++) {
  var ang = ((360 / pnum) * i * Math.PI) / 180;

  bullets[i] = new Projectile(
    Math.cos(ang) * 300 + cx,
    Math.sin(ang) * 300 + cy,
  );
}

class Enemy {
  constructor(x, y) {
    this.x = y;
    this.y = x;
  }

  update() {
    var n = Math.sqrt(
      (cx - this.x) * (cx - this.x) + (cy - this.y) * (cy - this.y),
    );
    this.x += 5 * ((cx - this.x) / n);
    this.y += 5 * ((cy - this.y) / n);

    for (var i = 0; i < pnum; i++) {
      if (
        bullets[i].x - 40 < this.x &&
        this.x < bullets[i].x + 40 &&
        bullets[i].y - 40 < this.y &&
        this.y < bullets[i].y + 40
      ) {
        var ang = (Math.floor(Math.random() * 360) * Math.PI) / 180;
        this.x = Math.cos(ang) * 1000 + cx;
        this.y = Math.sin(ang) * 1000 + cy;
        puntuacion += 5;
      }
    }
  }

  move(x, y) {
    this.x += x;
    this.y += y;
  }

  render() {
    //var rot = Math.floor(Math.random() * 360)*Math.PI/180;
    ctx.drawImage(imgHeart, this.x - 40, this.y - 40, 80, 80);
  }
}

var enemies = new Array(num);

for (var i = 0; i < num; i++) {
  enemies[i] = new Enemy(0, 0);
}

var speed = 15;

function enemiesMove(x, y) {
  for (var i = 0; i < num; i++) {
    enemies[i].move(x, y);
  }
}

const update = () => {
  if (keys["a"] || keys["A"]) {
    x += speed;
    enemiesMove(speed, 0);
  }
  if (keys["d"] || keys["D"]) {
    x -= speed;
    enemiesMove(-speed, 0);
  }
  if (keys["s"] || keys["S"]) {
    y -= speed;
    enemiesMove(0, -speed);
  }
  if (keys["w"] || keys["W"]) {
    y += speed;
    enemiesMove(0, speed);
  }

  for (var i = 0; i < num; i++) {
    enemies[i].update();
  }

  for (var i = 0; i < pnum; i++) {
    bullets[i].rotation((1 * Math.PI) / 180);
  }

  // Boundary checks
  x = Math.max(-3000, Math.min(x, 0));
  y = Math.max(-3000, Math.min(y, 0));

  if (
    Math.floor(puntuacion / 100) > 5 &&
    Math.floor(puntuacion / 100) != pnum
  ) {
    pnum = Math.floor(puntuacion / 100);

    bullets.push(new Projectile(0, 0));

    for (var i = 0; i < pnum; i++) {
      var ang = ((360 / pnum) * i * Math.PI) / 180;

      bullets[i].move(Math.cos(ang) * 300 + cx, Math.sin(ang) * 300 + cy);
    }
  }

  if (Math.floor(puntuacion / 500) > level) {
    level += 1;
    keys["Escape"] = false;
  }
};

const render = () => {
  renderMap();

  ctx.drawImage(val, cx - 62, cy - 62, 124, 124);

  for (var i = 0; i < num; i++) {
    enemies[i].render();
  }

  for (var i = 0; i < pnum; i++) {
    bullets[i].render();
  }

  ctx.font = "bold italic 100px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(puntuacion, cx, 100);
};

var gameLoop = () => {
  if (keys["Escape"]) {
    update();
  }
  render();
  requestAnimationFrame(gameLoop);
};

gameLoop();
