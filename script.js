const elements = {
  line1: document.getElementById("line1"),
  line2: document.getElementById("line2"),
  distancePx: document.getElementById("distance-px"),
  distanceCm: document.getElementById("distance-cm"),
  container: document.querySelector(".container"),
};

let isDragging = false;
let activeLine = null;

const CONVERSIONS = {
  PX_TO_CM: 0.02646,
};

function interpolateColor(color1, color2, factor) {
  return `rgb(${color1.map((start, index) => Math.round(start + factor * (color2[index] - start))).join(",")})`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

const colorStart = hexToRgb("#eb6e6e");
const colorEnd = hexToRgb("#81e67c");

function calculateDistance() {
  const distance = Math.abs(elements.line2.offsetTop - elements.line1.offsetTop);
  const distanceInCm = distance * CONVERSIONS.PX_TO_CM;

  elements.distancePx.textContent = `${distance}px`;
  elements.distanceCm.textContent = `${distanceInCm.toFixed(2)} cm`;

  const factor = Math.min(distance / elements.container.offsetHeight, 1);
  elements.container.style.backgroundColor = interpolateColor(colorStart, colorEnd, factor);
}

elements.line2.addEventListener("mousedown", () => {
  isDragging = true;
  activeLine = elements.line2;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && activeLine) {
    const containerRect = elements.container.getBoundingClientRect();
    let newY = Math.max(0, Math.min(e.clientY - containerRect.top, containerRect.height - activeLine.offsetHeight));
    activeLine.style.top = `${newY}px`;
    calculateDistance();
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  activeLine = null;
});

calculateDistance();

