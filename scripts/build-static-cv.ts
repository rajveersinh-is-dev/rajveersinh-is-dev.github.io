import fs from 'node:fs';
import path from 'node:path';
import { buildCvDocument } from '../src/utils/generatePdfCv.ts';

// 1. Build and write static vector PDF CV
const doc = buildCvDocument();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

const publicPdfPath = path.resolve(process.cwd(), 'public', 'Rajveersinh_Vishal_Pardeshi_CV.pdf');
const distPdfPath = path.resolve(process.cwd(), 'dist', 'Rajveersinh_Vishal_Pardeshi_CV.pdf');

fs.writeFileSync(publicPdfPath, pdfBuffer);
console.log(`Wrote CV PDF to ${publicPdfPath} (${pdfBuffer.length} bytes)`);

if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
  fs.writeFileSync(distPdfPath, pdfBuffer);
  console.log(`Wrote CV PDF to ${distPdfPath} (${pdfBuffer.length} bytes)`);
}

// 2. Synchronize Markdown CV source to dist
const publicMdPath = path.resolve(process.cwd(), 'public', 'Rajveersinh_Vishal_Pardeshi_CV.md');
const distMdPath = path.resolve(process.cwd(), 'dist', 'Rajveersinh_Vishal_Pardeshi_CV.md');

if (fs.existsSync(publicMdPath) && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
  fs.copyFileSync(publicMdPath, distMdPath);
  console.log(`Synchronized CV Markdown source to ${distMdPath}`);
}
