import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Minimal 5x7 bitmap font for crisp raster typography in PNG
const FONT: Record<string, string[]> = {
  'A': [' █ ', '█ █', '███', '█ █', '█ █'],
  'B': ['██ ', '█ █', '██ ', '█ █', '██ '],
  'C': [' ██', '█  ', '█  ', '█  ', ' ██'],
  'D': ['██ ', '█ █', '█ █', '█ █', '██ '],
  'E': ['███', '█  ', '██ ', '█  ', '███'],
  'F': ['███', '█  ', '██ ', '█  ', '█  '],
  'G': [' ██', '█  ', '█ █', '█ █', ' ██'],
  'H': ['█ █', '█ █', '███', '█ █', '█ █'],
  'I': ['███', ' █ ', ' █ ', ' █ ', '███'],
  'J': ['  █', '  █', '  █', '█ █', ' █ '],
  'K': ['█ █', '██ ', '█  ', '██ ', '█ █'],
  'L': ['█  ', '█  ', '█  ', '█  ', '███'],
  'M': ['█ █', '███', '█ █', '█ █', '█ █'],
  'N': ['██ ', '█ █', '█ █', '█ █', '█ █'],
  'O': [' █ ', '█ █', '█ █', '█ █', ' █ '],
  'P': ['██ ', '█ █', '██ ', '█  ', '█  '],
  'Q': [' █ ', '█ █', '█ █', '██ ', '  █'],
  'R': ['██ ', '█ █', '██ ', '█ █', '█ █'],
  'S': [' ██', '█  ', ' █ ', '  █', '██ '],
  'T': ['███', ' █ ', ' █ ', ' █ ', ' █ '],
  'U': ['█ █', '█ █', '█ █', '█ █', ' ██'],
  'V': ['█ █', '█ █', '█ █', '█ █', ' █ '],
  'W': ['█ █', '█ █', '█ █', '███', '█ █'],
  'X': ['█ █', ' █ ', ' █ ', ' █ ', '█ █'],
  'Y': ['█ █', '█ █', ' █ ', ' █ ', ' █ '],
  'Z': ['███', '  █', ' █ ', '█  ', '███'],
  ' ': ['   ', '   ', '   ', '   ', '   '],
  '-': ['   ', '   ', '███', '   ', '   '],
  '•': ['   ', ' █ ', ' █ ', '   ', '   '],
  ':': ['   ', ' █ ', '   ', ' █ ', '   '],
  '.': ['   ', '   ', '   ', '   ', ' █ '],
  '/': ['  █', '  █', ' █ ', '█  ', '█  '],
  '0': ['███', '█ █', '█ █', '█ █', '███'],
  '1': [' █ ', '██ ', ' █ ', ' █ ', '███'],
  '2': ['███', '  █', '███', '█  ', '███'],
  '3': ['███', '  █', '███', '  █', '███'],
  '4': ['█ █', '█ █', '███', '  █', '  █'],
  '5': ['███', '█  ', '███', '  █', '███'],
  '6': ['███', '█  ', '███', '█ █', '███'],
  '7': ['███', '  █', '  █', '  █', '  █'],
  '8': ['███', '█ █', '███', '█ █', '███'],
  '9': ['███', '█ █', '███', '  █', '███'],
};

function generateOgPng(width: number, height: number): Buffer {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type: string, data: Buffer) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const c = zlib.crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(c >>> 0, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(height * (1 + width * 4));

  function setPixel(x: number, y: number, r: number, g: number, b: number, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const offset = y * (1 + width * 4) + 1 + x * 4;
    raw[offset] = r;
    raw[offset + 1] = g;
    raw[offset + 2] = b;
    raw[offset + 3] = a;
  }

  // 1. Fill obsidian background (#121110)
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // Filter byte: none
    for (let x = 0; x < width; x++) {
      // Subtle mathematical grid dots every 32px
      const isGridDot = x % 32 === 0 && y % 32 === 0;
      if (isGridDot) {
        setPixel(x, y, 45, 40, 35, 140);
      } else {
        setPixel(x, y, 18, 17, 16, 255);
      }
    }
  }

  // 2. Draw outer cadastral frame (#f59e0b)
  const pad = 36;
  const amber = [245, 158, 11];
  const mutedAmber = [180, 115, 8];
  const inkMuted = [120, 110, 100];
  const inkPrimary = [237, 232, 223];

  // Borders
  for (let x = pad; x < width - pad; x++) {
    setPixel(x, pad, amber[0], amber[1], amber[2]);
    setPixel(x, pad + 1, mutedAmber[0], mutedAmber[1], mutedAmber[2], 120);
    setPixel(x, height - pad, amber[0], amber[1], amber[2]);
    setPixel(x, height - pad - 1, mutedAmber[0], mutedAmber[1], mutedAmber[2], 120);
  }
  for (let y = pad; y < height - pad; y++) {
    setPixel(pad, y, amber[0], amber[1], amber[2]);
    setPixel(pad + 1, y, mutedAmber[0], mutedAmber[1], mutedAmber[2], 120);
    setPixel(width - pad, y, amber[0], amber[1], amber[2]);
    setPixel(width - pad - 1, y, mutedAmber[0], mutedAmber[1], mutedAmber[2], 120);
  }

  // Cadastral corner brackets
  const cornerLen = 28;
  for (let d = 0; d < cornerLen; d++) {
    for (let t = 0; t < 3; t++) {
      setPixel(pad + d, pad + t, 255, 210, 77);
      setPixel(pad + t, pad + d, 255, 210, 77);
      setPixel(width - pad - d, pad + t, 255, 210, 77);
      setPixel(width - pad - t, pad + d, 255, 210, 77);
      setPixel(pad + d, height - pad - t, 255, 210, 77);
      setPixel(pad + t, height - pad - d, 255, 210, 77);
      setPixel(width - pad - d, height - pad - t, 255, 210, 77);
      setPixel(width - pad - t, height - pad - d, 255, 210, 77);
    }
  }

  // Text drawing helper
  function drawText(
    text: string,
    startX: number,
    startY: number,
    scale: number,
    color: number[]
  ) {
    let curX = startX;
    for (const char of text.toUpperCase()) {
      const glyph = FONT[char] || FONT[' '];
      for (let r = 0; r < glyph.length; r++) {
        for (let c = 0; c < glyph[r].length; c++) {
          if (glyph[r][c] === '█') {
            for (let sx = 0; sx < scale; sx++) {
              for (let sy = 0; sy < scale; sy++) {
                setPixel(curX + c * scale + sx, startY + r * scale + sy, color[0], color[1], color[2]);
              }
            }
          }
        }
      }
      curX += (glyph[0].length + 1) * scale;
    }
  }

  // Header tag
  drawText('PARDESHI RESEARCH ARCHIVE  •  VOL. I', pad + 32, pad + 36, 3, amber);

  // Big Title: RAJVEERSINH
  drawText('RAJVEERSINH', pad + 32, pad + 100, 14, inkPrimary);

  // Sub-title: VISHAL PARDESHI
  drawText('VISHAL PARDESHI', pad + 40, pad + 205, 8, mutedAmber);

  // Subtitle / Discipline
  drawText(
    'INDEPENDENT MATHEMATICAL RESEARCHER  •  PUNE, INDIA',
    pad + 32,
    pad + 300,
    3,
    inkMuted
  );

  // Divider line
  for (let x = pad + 32; x < width - pad - 32; x++) {
    setPixel(x, pad + 340, 56, 51, 45);
  }

  // Research focus bullets
  drawText('EXTREMAL COMBINATORICS  •  FORMAL VERIFICATION IN LEAN 4', pad + 32, pad + 375, 4, inkPrimary);
  drawText('VERIFIED SSA COMPILERS  •  TOPOLOGICAL DATA ANALYSIS', pad + 32, pad + 425, 4, inkPrimary);

  // Bottom footer bar
  drawText('ZENODO PREPRINTS  •  OFFLINE VECTOR PDF DOSSIER  •  OPEN SOURCE', pad + 32, height - pad - 50, 3, amber);

  const compressed = zlib.deflateSync(raw);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), idat, iend]);
}

// Generate and write
const width = 1200;
const height = 630;
const pngBuf = generateOgPng(width, height);

const publicPath = path.resolve(process.cwd(), 'public', 'og-image.png');
fs.writeFileSync(publicPath, pngBuf);
console.log(`Generated Open Graph image at ${publicPath} (${pngBuf.length} bytes)`);

const distDir = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distDir)) {
  const distPath = path.resolve(distDir, 'og-image.png');
  fs.writeFileSync(distPath, pngBuf);
  console.log(`Synchronized Open Graph image to ${distPath}`);
}
