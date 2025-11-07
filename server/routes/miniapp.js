import express from 'express';
import { config as loadEnv } from 'dotenv';

import MiniApp from '../models/Miniapp.js';

loadEnv();

const router = express.Router();

const API_BASE = 'https://api.neynar.com';
const API_KEY = process.env.NEYNAR_API_KEY;

// GET - Fetch all mini apps
router.get('/miniapps', async (req, res) => {
  try {
    const miniApps = await MiniApp.find();
    res.json({
      success: true,
      count: miniApps.length,
      data: miniApps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mini apps',
      error: error.message
    });
  }
});

// GET - Fetch single mini app by appId
router.get('/miniapps/:appId', async (req, res) => {
  try {
    const miniApp = await MiniApp.findOne({ appId: req.params.appId });
    
    if (!miniApp) {
      return res.status(404).json({
        success: false,
        message: 'Mini app not found'
      });
    }
    
    res.json({
      success: true,
      data: miniApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching mini app',
      error: error.message
    });
  }
});

// POST - Create or increment visits (upsert)
router.post('/miniapps/:appId/visit', async (req, res) => {
  try {
    const { appId } = req.params;
    
    if (!appId) {
      return res.status(400).json({
        success: false,
        message: 'appId is required'
      });
    }
    
    // Find the mini app and increment visits, or create if not exists
    const miniApp = await MiniApp.findOneAndUpdate(
      { appId },
      { $inc: { visits: 1 } },
      { 
        new: true,           // Return updated document
        upsert: true,        // Create if doesn't exist
        setDefaultsOnInsert: true
      }
    );
    
    res.json({
      success: true,
      data: miniApp,
      message: miniApp.visits === 1 ? 'Mini app created' : 'Visit recorded'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error recording visit',
      error: error.message
    });
  }
});

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