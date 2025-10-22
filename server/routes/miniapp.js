import express from 'express';
import { config as loadEnv } from 'dotenv';

loadEnv();

const router = express.Router();

const API_BASE = 'https://api.neynar.com';
const API_KEY = process.env.NEYNAR_API_KEY; 

router.get('/detail', async (req, res) => {
  const params = new URLSearchParams();
  try {
   const response = await fetch(`${API_BASE}/v2/farcaster/cast/search?${params.toString()}`, {
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
    const data = await response.json();
    console.log(data);
    res.json({ data });
   } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function fetchMentions(cursor = null, limit = 50) {
  const params = new URLSearchParams();
  params.set('q', MIN_APP_URL);
  params.set('limit', limit);
  if (cursor) {
    params.set('cursor', cursor);
  }
  const resp = await fetch(`${API_BASE}/v2/farcaster/cast/search?${params.toString()}`, {
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
  if (!resp.ok) {
    throw new Error(`Error fetching mentions: ${resp.status} ${await resp.text()}`);
  }
  const data = await resp.json();
  return data;  // has fields like `.casts` or `.results` and `.next` cursor
}

export default router;