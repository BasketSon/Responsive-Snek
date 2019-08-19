window.addEventListener('load', () => {
  resizeCanvas();
  document.addEventListener('keydown', changeDir);
  loop();
 });
window.addEventListener('resize', resizeCanvas);

let
    canvas        = document.getElementById('can'),
    canvasWrapper = document.querySelector('.canv-wrap'),
    ctx           = canvas.getContext('2d'),
    gs = fkp      = false,
    speed = baseSpeed = 3,
    color         = randomColor(),
    xv = yv       = 0,
    px            = canvas.width / 2,
    py            = canvas.height / 2,
    pw = ph       = 20,
    aw = ah       = appleSize(),
    apples        = new Set(),
    trail         = [],
    tail          = 30,
    tailSafeZone  = 20,
    cooldown      = false,
    score         = 0,
    frameID,
    img = new Image;

img.src = '../img/apple.png';

function resizeCanvas () {
  canvas.width = canvasWrapper.clientWidth;
  canvas.height = canvasWrapper.clientHeight;
  aw = ah = appleSize();
  drawApples()
}

function appleSize () {
  return Math.max(canvas.height / 10, 30)
}

function loop () {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  px += xv;
  py += yv;

  if (px > canvas.width) px = 0;
  if (px + pw < 0) px = canvas.width;
  if (py > canvas.height) py = 0;
  if (py + ph < 0) py = canvas.height;

  let head = {
    x: px,
    y: py,
    color: ctx.fillStyle
  }

  trail.push(head);
  if (trail.length > tail) {
    trail = trail.slice(-tail)
  }

  for (let i = 0; i < trail.length; i++) {

    let
      radius = pw / 2,
      x = trail[i].x + pw / 2,
      y = trail[i].y + pw / 2;

    ctx.fillStyle = color;
    if (i < 40 && trail[i] !== head) {
      radius -=  (40 - i) / 6;
    }
    if (!(i % 4) && trail[i] !== head) {
      ctx.fillStyle = '#' + lightenDarkenColor(color, -20);
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  if (trail.length >= tail && gs) {
    for (let i = trail.length - tailSafeZone; i >= 0; i--) {
      if (headCollision(trail[i], pw)) {
        tail = tailSafeZone;
        speed = baseSpeed;
        color = randomColor();
        apples.clear();


        for (let cutTail of trail) {
          cutTail.color = 'red';
          if (trail.indexOf(cutTail) >= trail.length - tail) break;
        }
      }
    }
  }
  drawApples();
  eatApple();


  frameID = requestAnimationFrame(loop)
}

function headCollision (point, pointSide) {
  if (px < point.x + pointSide
         && px + pw > point.x
         && py < point.y + pointSide
         && py + ph > point.y) {
    return true
  }
}

function eatApple () {
  for (let apple of apples) {
    if (headCollision(apple, aw)) {
      apples.delete(apple);
      tail += ~~((aw - 20) / 2);
      speed += ~~(aw / 7) / 100;
    }
  }
}

function lightenDarkenColor(col,amt) {
    if (col.startsWith('#')) col = col.slice(1);
    let num = parseInt(col,16);
    let r = (num >> 16) + amt;
    let b = ((num >> 8) & 0x00FF) + amt;
    let g = (num & 0x0000FF) + amt;
    let newColor = g | (b << 8) | (r << 16);
    return newColor.toString(16);
}

function Apple () {
  function getX () {
    let x = ~~(Math.random() * canvas.width);
    if (x < aw || x > canvas.width - aw) {
      x = getX()
    }
    return x
  };
  function getY () {
    let y = ~~(Math.random() * canvas.height);
    if (y < ah || y > canvas.height - ah) {
      y = getY()
    }
    return y
  }
  let x = getX();
  let y = getY();

  for (let i of trail) {
    if (x < i.x + aw
        && x + aw > i.x
        && y < i.y + ah
        && y + ah > i.y) {
        x = getX();
        y = getY();
    }
  };

  this.x = x;
  this.y = y;
  this.color = 'red';
};

Apple.prototype.spawn = function () {
  apples.add(this);
}

function spawnApples () {
  if (apples.size < 10) {
    let apple = new Apple();
    apple.spawn();
  }
  if (apples.size < 9 && ~~(Math.random() * 100) > 50) {
    let secondApple = new Apple();
    secondApple.spawn();
  }
   setTimeout(spawnApples, 3000)
}

function drawApples () {
  for (let apple of apples) {
    ctx.drawImage(img, apple.x, apple.y, aw, ah)
  }
}


function randomColor () {
  return `#${(~~(Math.random() * 155) + 100).toString(16)}${(~~(Math.random() * 155) + 100).toString(16)}${(~~(Math.random() * 155) + 100).toString(16)}`
}

function changeDir (evt) {
  if (!fkp) {
    setTimeout(() => gs = true, 1000);
    fkp = true;
    spawnApples()
  }
  if (cooldown) {
    return false;
  }

  switch (evt.which) {
    case 37:
    case 65:
      xv = xv > 0 ? xv : -speed; yv = 0;
      break;
    case 38:
    case 87:
      xv = 0; yv = yv > 0 ? yv : -speed;
      break;
    case 39:
    case 68:
      xv = xv < 0 ? xv : speed; yv = 0;
      break;
    case 40:
    case 83:
      xv = 0; yv = yv < 0 ? yv : speed;
      break;
    defa
  }
  cooldown = true;
  setTimeout(() => cooldown = false, 50)
};
