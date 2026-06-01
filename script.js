const canvas = document.querySelector("#hero-canvas");
const ctx = canvas.getContext("2d");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

const pointer = {
  x: 0.5,
  y: 0.5,
};

const agents = Array.from({ length: 18 }, (_, index) => ({
  x: Math.random(),
  y: Math.random(),
  vx: (Math.random() - 0.5) * 0.0018,
  vy: (Math.random() - 0.5) * 0.0018,
  radius: index % 4 === 0 ? 4.5 : 3,
  color: index % 4 === 0 ? "#ffcc66" : "#41d3bd",
}));

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
  canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawGrid(width, height) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.055)";
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawSightLines(width, height) {
  const targetX = pointer.x * width;
  const targetY = pointer.y * height;

  agents.forEach((agent) => {
    const ax = agent.x * width;
    const ay = agent.y * height;
    const distance = Math.hypot(targetX - ax, targetY - ay);

    if (distance < 260) {
      ctx.strokeStyle = `rgba(65, 211, 189, ${1 - distance / 260})`;
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();
    }
  });
}

function updateAgents() {
  agents.forEach((agent) => {
    const dx = pointer.x - agent.x;
    const dy = pointer.y - agent.y;
    const distance = Math.hypot(dx, dy) || 1;

    agent.vx += (dx / distance) * 0.000015;
    agent.vy += (dy / distance) * 0.000015;
    agent.vx *= 0.995;
    agent.vy *= 0.995;
    agent.x += agent.vx;
    agent.y += agent.vy;

    if (agent.x < 0.04 || agent.x > 0.96) agent.vx *= -1;
    if (agent.y < 0.08 || agent.y > 0.92) agent.vy *= -1;

    agent.x = Math.max(0.04, Math.min(0.96, agent.x));
    agent.y = Math.max(0.08, Math.min(0.92, agent.y));
  });
}

function drawAgents(width, height) {
  agents.forEach((agent) => {
    const x = agent.x * width;
    const y = agent.y * height;

    ctx.fillStyle = agent.color;
    ctx.shadowColor = agent.color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x, y, agent.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  const playerX = pointer.x * width;
  const playerY = pointer.y * height;

  ctx.fillStyle = "#ff6b6b";
  ctx.shadowColor = "#ff6b6b";
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(playerX, playerY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255, 107, 107, 0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(playerX, playerY, 34, 0, Math.PI * 2);
  ctx.stroke();
}

function animate() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);
  drawGrid(width, height);
  updateAgents();
  drawSightLines(width, height);
  drawAgents(width, height);

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX / window.innerWidth;
  pointer.y = event.clientY / window.innerHeight;
});

resizeCanvas();
animate();
