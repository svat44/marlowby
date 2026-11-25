// Cuts and compresses the homepage hero loop from the source footage.
// Usage: npm run media -- "<path to source video>" [startSeconds] [durationSeconds]
// Source: Midtown Manhattan night flight footage, supplied by the team and used with the owner's permission.
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import ffmpeg from 'ffmpeg-static'

const [src, start = '148', dur = '12'] = process.argv.slice(2)
if (!src) {
  console.error('Pass the source video path.')
  process.exit(1)
}

const out = 'public/media'
mkdirSync(out, { recursive: true })
const cut = ['-hide_banner', '-loglevel', 'error', '-y', '-ss', start, '-t', dur, '-i', src, '-an']
const scale = 'scale=1920:-2:flags=lanczos,fps=25'

const run = (args, label) => {
  console.log(`Encoding ${label}...`)
  execFileSync(ffmpeg, args, { stdio: 'inherit' })
}

run([...cut, '-vf', scale, '-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}/nyc-hero.mp4`], 'MP4')
run([...cut, '-vf', scale, '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', `${out}/nyc-hero.webm`], 'WebM')
run(['-hide_banner', '-loglevel', 'error', '-y', '-ss', start, '-i', src, '-frames:v', '1', '-vf', 'scale=1920:-2', '-q:v', '4', `${out}/nyc-poster.jpg`], 'poster')
console.log('Done.')
