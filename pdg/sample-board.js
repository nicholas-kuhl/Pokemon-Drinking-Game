const sharp = require('./node_modules/sharp');
const path = 'c:/Users/nkuhl_settlor/Documents/pdg/gameBoard.webp';

async function sampleBoard() {
  const image = sharp(path);
  const { width, height } = await image.metadata();
  const raw = await image.raw().toBuffer();

  const centers = Array.from({ length: 9 }, (_, i) => 5.5555 + i * 11.1111);
  const positions = [];

  // Outer ring
  centers.slice().reverse().forEach((y) => positions.push({ x: centers[0], y }));
  centers.slice(1).forEach((x) => positions.push({ x, y: centers[0] }));
  centers.slice(1).forEach((y) => positions.push({ x: centers[8], y }));
  centers.slice(1, -1).reverse().forEach((x) => positions.push({ x, y: centers[8] }));

  // Second ring
  centers.slice(1, 8).reverse().forEach((y) => positions.push({ x: centers[1], y }));
  centers.slice(2, 8).forEach((x) => positions.push({ x, y: centers[1] }));
  centers.slice(2, 8).forEach((y) => positions.push({ x: centers[7], y }));
  centers.slice(2, 7).reverse().forEach((x) => positions.push({ x, y: centers[7] }));

  // Third ring
  centers.slice(2, 7).reverse().forEach((y) => positions.push({ x: centers[2], y }));
  centers.slice(3, 7).forEach((x) => positions.push({ x, y: centers[2] }));
  centers.slice(3, 7).forEach((y) => positions.push({ x: centers[6], y }));
  centers.slice(3, 6).reverse().forEach((x) => positions.push({ x, y: centers[6] }));

  console.log('positions', positions.length);

  positions.forEach((pos, idx) => {
    const cx = Math.max(0, Math.min(width - 1, Math.round(pos.x / 100 * width)));
    const cy = Math.max(0, Math.min(height - 1, Math.round(pos.y / 100 * height)));
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    let count = 0;
    for (let dx = -4; dx <= 4; dx += 1) {
      for (let dy = -4; dy <= 4; dy += 1) {
        const px = Math.max(0, Math.min(width - 1, cx + dx));
        const py = Math.max(0, Math.min(height - 1, cy + dy));
        const offset = (py * width + px) * 3;
        sumR += raw[offset];
        sumG += raw[offset + 1];
        sumB += raw[offset + 2];
        count += 1;
      }
    }
    const r = Math.round(sumR / count);
    const g = Math.round(sumG / count);
    const b = Math.round(sumB / count);
    console.log(idx, cx, cy, `rgb(${r},${g},${b})`);
  });
}

sampleBoard().catch(err => {
  console.error(err);
  process.exit(1);
});
