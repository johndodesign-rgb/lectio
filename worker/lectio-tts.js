// Lectio key server — a Cloudflare Worker that holds the Azure Speech key so it
// never has to be typed into (or stored on) any device.
//
// The app sends SSML to  POST https://<worker-url>/tts  and gets MP3 back.
//
// Settings (Cloudflare dashboard → this Worker → Settings → Variables and Secrets):
//   AZURE_KEY        Secret.  Your Azure Speech key (KEY 1).
//   AZURE_REGION     Text.    Your Speech resource region, e.g. eastus
//   ALLOWED_ORIGINS  Text.    Optional. Sites allowed to use this server, comma
//                             separated. Default: https://johndodesign-rgb.github.io

const DEFAULT_ORIGINS = 'https://johndodesign-rgb.github.io';
const MAX_SSML_CHARS  = 20000; // far above Lectio's largest chunk; blocks abuse-sized requests

export default {
  async fetch(request, env) {
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map(s => s.trim()).filter(Boolean);
    const origin  = request.headers.get('Origin') || '';
    const okOrigin = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const reply = (status, text) => new Response(text, { status, headers: { ...cors, 'Content-Type': 'text/plain' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: okOrigin ? 204 : 403, headers: cors });
    if (!okOrigin) return reply(403, 'This key server only works for Lectio.');

    const path = new URL(request.url).pathname;
    if (request.method !== 'POST' || path !== '/tts') return reply(404, 'Not found');
    if (!env.AZURE_KEY) return reply(500, 'AZURE_KEY secret is not set on the Worker.');

    const ssml = await request.text();
    if (!ssml.trimStart().startsWith('<speak') || ssml.length > MAX_SSML_CHARS) return reply(400, 'Bad request');

    const region = (env.AZURE_REGION || 'eastus').trim().toLowerCase();
    const azure = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': env.AZURE_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'lectio-key-server',
      },
      body: ssml,
    });

    return new Response(azure.body, {
      status: azure.status,
      headers: { ...cors, 'Content-Type': azure.headers.get('Content-Type') || 'audio/mpeg', 'Cache-Control': 'no-store' },
    });
  },
};
