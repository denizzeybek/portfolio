import { writeFileSync } from 'node:fs'

import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0b0c0b"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="#8fd6b4"/>
  <text x="84" y="214" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" letter-spacing="6" fill="#6f7c73">SOFTWARE DEVELOPER</text>
  <text x="80" y="330" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="104" font-weight="700" fill="#e9e7df">Deniz Zeybek</text>
  <text x="84" y="404" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="36" fill="#98a59b">Mainly frontend — Vue, TypeScript, and the</text>
  <text x="84" y="454" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="36" fill="#98a59b">full stack when the feature needs it.</text>
  <text x="84" y="556" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="32" fill="#8fd6b4">denizzeybek.dev</text>
</svg>`

const png = await sharp(Buffer.from(svg)).png().toBuffer()
writeFileSync('public/og.png', png)
console.log(`og image — ${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(0)} KB`)
