const { createWorker } = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const path = 'c:/Users/nkuhl_settlor/Documents/pdg/gameBoard.webp';
  const { width, height } = await sharp(path).metadata();
  const centers = Array.from({ length: 9 }, (_, i) => 15 + i * 8.75);
  const positions = [];

  centers.slice().reverse().forEach((y) => positions.push({ x: centers[0], y }));
  centers.slice(1).forEach((x) => positions.push({ x, y: centers[0] }));
  centers.slice(1).forEach((y) => positions.push({ x: centers[8], y }));
  centers.slice(1, -1).reverse().forEach((x) => positions.push({ x, y: centers[8] }));
  centers.slice(1, 8).reverse().forEach((y) => positions.push({ x: centers[1], y }));
  centers.slice(2, 8).forEach((x) => positions.push({ x, y: centers[1] }));
  centers.slice(2, 8).forEach((y) => positions.push({ x: centers[7], y }));
  centers.slice(2, 7).reverse().forEach((x) => positions.push({ x, y: centers[7] }));
  centers.slice(2, 7).reverse().forEach((y) => positions.push({ x: centers[2], y }));
  centers.slice(3, 7).forEach((x) => positions.push({ x, y: centers[2] }));
  centers.slice(3, 7).forEach((y) => positions.push({ x: centers[6], y }));
  centers.slice(3, 6).reverse().forEach((x) => positions.push({ x, y: centers[6] }));

  const worker = await createWorker({ logger: m => console.log(m) });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  const texts = [];
  for (let idx = 0; idx < positions.length; idx += 1) {
    const pos = positions[idx];
    const cx = Math.round((pos.x / 100) * width);
    const cy = Math.round((pos.y / 100) * height);
    const cropSize = Math.round(width * 0.12);
    const left = Math.max(0, cx - cropSize / 2);
    const top = Math.max(0, cy - cropSize / 2);
    const w = Math.min(cropSize, width - left);
    const h = Math.min(cropSize, height - top);
    const buffer = await sharp(path).extract({ left: Math.round(left), top: Math.round(top), width: Math.round(w), height: Math.round(h) }).resize(600).toBuffer();
    const { data: { text }} = await worker.recognize(buffer);
    console.log('===', idx + 1, '===');
    console.log(text);
    texts.push(text.trim());
  }

  await worker.terminate();
  fs.writeFileSync('board-text.json', JSON.stringify(texts, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});