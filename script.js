const canvas = document.querySelector("#hero-canvas");
const ctx = canvas.getContext("2d");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const pointer = {
  x: 0.22,
  y: 0.62,
};

const coins = Array.from({ length: 14 }, (_, index) => ({
  x: 0.2 + (index % 7) * 0.095,
  y: 0.24 + Math.floor(index / 7) * 0.18,
  phase: Math.random() * Math.PI * 2,
}));

const clouds = [
  { x: 0.08, y: 0.14, speed: 0.00011, scale: 1.1 },
  { x: 0.45, y: 0.1, speed: 0.00008, scale: 0.9 },
  { x: 0.78, y: 0.2, speed: 0.0001, scale: 1.25 },
];

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
  canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function rect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
}

function drawCloud(x, y, scale) {
  const size = 18 * scale;
  rect(x, y + size, size * 5, size * 1.8, "#ffffff");
  rect(x + size, y, size * 1.8, size * 3, "#ffffff");
  rect(x + size * 2.4, y + size * 0.4, size * 2.1, size * 2.6, "#ffffff");
  rect(x + size * 4.1, y + size * 1.1, size * 1.5, size * 1.7, "#ffffff");
  rect(x, y + size * 2.7, size * 5.6, size * 0.35, "rgba(45, 23, 13, 0.12)");
}

function drawHill(x, groundY, width, height, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, groundY);
  ctx.quadraticCurveTo(x + width * 0.5, groundY - height, x + width, groundY);
  ctx.closePath();
  ctx.fill();
  rect(x + width * 0.28, groundY - height * 0.34, 12, 12, "rgba(255, 255, 255, 0.36)");
  rect(x + width * 0.62, groundY - height * 0.52, 10, 10, "rgba(255, 255, 255, 0.3)");
}

function drawBlock(x, y, size, type = "brick") {
  rect(x, y, size, size, type === "coin" ? "#ffd43b" : "#b84b2b");
  rect(x, y, size, 4, "rgba(255, 255, 255, 0.34)");
  rect(x, y + size - 5, size, 5, "rgba(45, 23, 13, 0.24)");
  rect(x, y, 4, size, "rgba(45, 23, 13, 0.18)");
  rect(x + size - 4, y, 4, size, "rgba(45, 23, 13, 0.28)");

  if (type === "coin") {
    ctx.fillStyle = "#7d2f1c";
    ctx.font = `${Math.max(22, size * 0.78)}px "Jersey 15", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", x + size / 2, y + size / 2 + 1);
  } else {
    rect(x + size * 0.08, y + size * 0.48, size * 0.84, 3, "rgba(45, 23, 13, 0.36)");
    rect(x + size * 0.48, y + 5, 3, size * 0.4, "rgba(45, 23, 13, 0.3)");
    rect(x + size * 0.22, y + size * 0.52, 3, size * 0.38, "rgba(45, 23, 13, 0.3)");
    rect(x + size * 0.72, y + size * 0.52, 3, size * 0.38, "rgba(45, 23, 13, 0.3)");
  }
}

function drawCoin(x, y, size, phase) {
  const squash = 0.55 + Math.abs(Math.sin(phase)) * 0.45;
  rect(x - (size * squash) / 2, y - size / 2, size * squash, size, "#ffd43b");
  rect(x - (size * squash) / 2 + 3, y - size / 2 + 3, Math.max(2, size * squash * 0.28), size - 6, "#fff2a6");
  rect(x - (size * squash) / 2, y + size / 2 - 3, size * squash, 3, "rgba(45, 23, 13, 0.26)");
}

function drawPipe(x, y, width, height) {
  rect(x, y, width, height, "#1fa243");
  rect(x - 10, y, width + 20, 24, "#25c254");
  rect(x + width * 0.12, y + 5, width * 0.2, height - 5, "rgba(255, 255, 255, 0.28)");
  rect(x + width * 0.78, y + 24, width * 0.12, height - 24, "rgba(45, 23, 13, 0.22)");
  rect(x - 10, y + 20, width + 20, 5, "rgba(45, 23, 13, 0.24)");
}

function drawPlayer(x, y, scale) {
  const s = scale;
  rect(x - 10 * s, y - 26 * s, 20 * s, 8 * s, "#e52521");
  rect(x - 14 * s, y - 18 * s, 26 * s, 10 * s, "#e52521");
  rect(x - 9 * s, y - 10 * s, 18 * s, 18 * s, "#ffd39b");
  rect(x - 3 * s, y - 5 * s, 4 * s, 4 * s, "#27170f");
  rect(x - 13 * s, y + 8 * s, 26 * s, 20 * s, "#2862d8");
  rect(x - 16 * s, y + 12 * s, 8 * s, 13 * s, "#ffd39b");
  rect(x + 8 * s, y + 12 * s, 8 * s, 13 * s, "#ffd39b");
  rect(x - 13 * s, y + 28 * s, 10 * s, 8 * s, "#5f321e");
  rect(x + 3 * s, y + 28 * s, 10 * s, 8 * s, "#5f321e");
}

function drawScene(time) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const groundY = height * 0.72;
  const blockSize = Math.max(32, Math.min(52, width * 0.045));

  ctx.clearRect(0, 0, width, height);

  const skyGradient = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGradient.addColorStop(0, "#6ecbff");
  skyGradient.addColorStop(1, "#bdf0ff");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, groundY);

  clouds.forEach((cloud) => {
    cloud.x += cloud.speed;
    if (cloud.x > 1.08) cloud.x = -0.18;
    drawCloud(cloud.x * width, cloud.y * height, cloud.scale);
  });

  drawHill(width * 0.04, groundY, width * 0.32, height * 0.22, "#65bd37");
  drawHill(width * 0.28, groundY, width * 0.28, height * 0.16, "#8bd94b");
  drawHill(width * 0.68, groundY, width * 0.34, height * 0.2, "#65bd37");

  for (let i = 0; i < 6; i += 1) {
    const type = i === 2 || i === 4 ? "coin" : "brick";
    drawBlock(width * 0.2 + i * (blockSize + 3), groundY - blockSize * 3.2, blockSize, type);
  }

  coins.forEach((coin) => {
    drawCoin(
      coin.x * width,
      coin.y * height + Math.sin(time / 360 + coin.phase) * 8,
      Math.max(14, blockSize * 0.45),
      time / 260 + coin.phase,
    );
  });

  drawPipe(width * 0.76, groundY - 92, 58, 92);
  drawPipe(width * 0.88, groundY - 124, 66, 124);

  rect(0, groundY, width, height - groundY, "#4f9b24");
  rect(0, groundY, width, 18, "#77c84a");

  for (let x = 0; x < width; x += 42) {
    rect(x, groundY + 18, 42, 26, "#b84b2b");
    rect(x, groundY + 42, 42, 26, "#9d3c24");
    rect(x + 1, groundY + 18, 40, 3, "rgba(255, 255, 255, 0.24)");
    rect(x, groundY + 42, 42, 3, "rgba(45, 23, 13, 0.24)");
  }

  const playerX = pointer.x * width;
  const playerY = Math.min(pointer.y * height, groundY - 38);
  drawPlayer(playerX, playerY, Math.max(0.8, Math.min(1.15, width / 1100)));
}

function animate(time = 0) {
  drawScene(time);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
});

resizeCanvas();
animate();
