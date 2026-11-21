import fs from 'node:fs';
import path from 'node:path';
import { buildCvDocument } from '../src/utils/generatePdfCv.ts';

const doc = buildCvDocument();
const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

const publicPath = path.resolve(process.cwd(), 'public', 'Rajveersinh_Vishal_Pardeshi_CV.pdf');
const distPath = path.resolve(process.cwd(), 'dist', 'Rajveersinh_Vishal_Pardeshi_CV.pdf');

fs.writeFileSync(publicPath, pdfBuffer);
console.log(`Wrote CV PDF to ${publicPath} (${pdfBuffer.length} bytes)`);

if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
  fs.writeFileSync(distPath, pdfBuffer);
  console.log(`Wrote CV PDF to ${distPath} (${pdfBuffer.length} bytes)`);
}
