const canvas = document.querySelector(".myCanvas");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight - 105);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "rgb(0)";
ctx.fillRect(0, 0, width, height);
const colorPick = document.querySelector('input[type= "color"]');
const sizePick = document.querySelector('input[type="range"]');
const clearbutton = document.querySelector("button");
const update = document.querySelector(".display");
let status = 0;
// declaring X and Y to keep track of the cursor position
// declaring press to paint when the mouse button is pressed
let X;
let Y;
let press = false;

function degTorad(degree) {
  return (degree * Math.PI) / 180;
}

canvas.onmousedown = function () {
  press = true;
};

canvas.onmouseup = function () {
  press = false;
};

sizePick.oninput = function () {
  update.textContent = sizePick.value;
};

clearbutton.onclick = cleared;

function cleared() {
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, width, height);
  cancelPendingAnim();
}
//  pageX and clientX are used to determine the position of cursor in pixels
//  scrollLeft and scrollTop are used to find number of pixels by which the elements have been scrolled horizontally and vertically resp

document.onmousemove = function (event) {
  X = window.Event
    ? event.pageX
    : event.clientX +
      (document.documentElement.scrollLeft
        ? document.documentElement.scrollLeft
        : document.body.scrollLeft);
  Y = window.Event
    ? event.pageY
    : event.clientY +
      (document.documentElement.scrollTop
        ? document.documentElement.scrollTop
        : document.body.scrollTop);
};

let circle = 0,
  rect = 0,
  ring = 0,
  inspired = 0;

function cancelPendingAnim() {
  cancelAnimationFrame(rect);
  cancelAnimationFrame(circle);
  cancelAnimationFrame(ring);
  cancelAnimationFrame(inspired);
}
//to draw a rectangle
function drawRect() {
  cancelPendingAnim();
  if (press) {
    ctx.fillStyle = colorPick.value;
    ctx.fillRect(X, Y - 105, sizePick.value, sizePick.value);
  }
  rect = window.requestAnimationFrame(drawRect);
}

//to draw a circle
function drawCircle() {
  cancelPendingAnim();
  if (press) {
    ctx.beginPath();
    ctx.arc(X, Y - 105, sizePick.value, 0, 2 * Math.PI);
    ctx.fillStyle = colorPick.value;
    ctx.fill();
  }
  circle = window.requestAnimationFrame(drawCircle);
}

//rings
function drawRing() {
  cancelPendingAnim();

  if (press) {
    ctx.beginPath();
    ctx.arc(X, Y - 105, sizePick.value, 0, 2 * Math.PI);
    ctx.strokeStyle = colorPick.value;
    ctx.stroke();
  }
  ring = window.requestAnimationFrame(drawRing);
}

function inspire(part) {
  let w = Math.random() * width,
    h = Math.random() * height;
  let size = 5 + Math.ceil(Math.random() * 12);
  cancelPendingAnim();
  let gradient = [
    makeGradient("#fcb045", "#fd1d1d", "#833ab4"),
    makeGradient("#24FE41", "#93EDC7", "#FDFC47"),
  ];
  let index = Math.floor(Math.random() * 2);

  //rings
  if (part == 0) {
    ctx.beginPath();
    ctx.arc(w, h, size, 0, 2 * Math.PI);
    ctx.strokeStyle = gradient[index];
    ctx.stroke();
    inspired = window.requestAnimationFrame(() => {
      inspire(0);
    });
  }

  //rectangles
  else if (part == 1) {
    ctx.fillRect(w, h, size, size);
    ctx.fillStyle = gradient[index];
    ctx.fill();
    inspired = window.requestAnimationFrame(() => {
      inspire(1);
    });
  }
  //circles
  else if (part == 2) {
    ctx.beginPath();
    ctx.arc(w, h, size, 0, 2 * Math.PI);
    ctx.fillStyle = gradient[index];
    ctx.fill();
    inspired = window.requestAnimationFrame(() => {
      inspire(2);
    });
  }
  //bezier path
  else if (part == 3) {
    h += 60;
    ctx.beginPath();
    ctx.moveTo(0, height / 3 + h / 9);
    ctx.bezierCurveTo(width / 4, h + 100, width / 2, h, width, h / 10);
    ctx.strokeStyle = gradient[0];
    ctx.stroke();
    inspired = window.requestAnimationFrame(() => {
      inspire(3);
    });
  }
}

function makeGradient(m, l, h) {
  let gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop("0", m);
  gradient.addColorStop("0.4", l);
  gradient.addColorStop("1", h);

  return gradient;
}
