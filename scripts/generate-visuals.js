#!/usr/bin/env node
/**
 * Pipeline automatique : Replicate API → assets/videos/
 * Usage: REPLICATE_API_TOKEN=r8_xxx node scripts/generate-visuals.js "un chat astronaute"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.REPLICATE_API_TOKEN;
const PROMPT = process.argv[2] || 'futuristic city at night, neon lights, cinematic';
const OUTPUT_DIR = path.join(__dirname, '../site/assets/videos');

if (!TOKEN) {
  console.error('❌  REPLICATE_API_TOKEN manquant. Export ta clé : export REPLICATE_API_TOKEN=r8_xxx');
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=60',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

async function poll(predictionId) {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const { body } = await request('GET', `https://api.replicate.com/v1/predictions/${predictionId}`);
    if (body.status === 'succeeded') return body.output;
    if (body.status === 'failed') throw new Error(body.error);
    process.stdout.write('.');
  }
  throw new Error('Timeout');
}

async function main() {
  console.log(`\n🎬  Génération vidéo: "${PROMPT}"\n`);

  // Wan 2.1 — Text to Video (modèle Replicate public)
  const { status, body } = await request(
    'POST',
    'https://api.replicate.com/v1/models/wavespeedai/wan-2.1-t2v-480p/predictions',
    {
      input: {
        prompt: PROMPT,
        num_frames: 49,
        guidance_scale: 5,
        num_inference_steps: 30,
      },
    }
  );

  let output = body.output;

  if (!output) {
    console.log('⏳  En attente de la génération...');
    output = await poll(body.id);
  }

  const videoUrl = Array.isArray(output) ? output[0] : output;
  const filename = `video_${Date.now()}.mp4`;
  const dest = path.join(OUTPUT_DIR, filename);

  console.log(`\n⬇️   Téléchargement...`);
  await download(videoUrl, dest);

  const size = (fs.statSync(dest).size / 1024 / 1024).toFixed(1);
  console.log(`✅  Vidéo sauvegardée: site/assets/videos/${filename} (${size}MB)`);
  console.log(`\n💡  Pour intégrer dans index.html, remplace la section #video par :`);
  console.log(`    <video src="assets/videos/${filename}" autoplay loop muted playsinline></video>\n`);
}

main().catch(console.error);
