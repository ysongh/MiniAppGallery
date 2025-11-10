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
    
    // Get IP address from request
    const ip = req.ip || 
               req.headers['x-forwarded-for']?.split(',')[0] || 
               req.connection.remoteAddress ||
               req.socket.remoteAddress;
    
    // Time window to prevent duplicate visits (24 hours in milliseconds)
    const visitWindow = 24 * 60 * 60 * 1000;
    const cutoffTime = new Date(Date.now() - visitWindow);
    
    // Find existing mini app
    let miniApp = await MiniApp.findOne({ appId });
    
    if (!miniApp) {
      // Create new mini app with first visit
      miniApp = new MiniApp({
        appId,
        visits: 1,
        visitedIPs: [{ ip, lastVisit: new Date() }]
      });
      await miniApp.save();
      
      return res.json({
        success: true,
        data: miniApp,
        message: 'Mini app created',
        visitCounted: true
      });
    }
    
    // Check if IP has visited recently
    const recentVisit = miniApp.visitedIPs.find(
      v => v.ip === ip && v.lastVisit > cutoffTime
    );
    
    if (recentVisit) {
      // IP visited recently, don't increment
      return res.json({
        success: true,
        data: miniApp,
        message: 'Visit already recorded from this IP',
        visitCounted: false
      });
    }
    
    // Remove old IP entry if exists and add new one
    miniApp.visitedIPs = miniApp.visitedIPs.filter(v => v.ip !== ip);
    miniApp.visitedIPs.push({ ip, lastVisit: new Date() });
    miniApp.visits += 1;
    
    await miniApp.save();
    
    res.json({
      success: true,
      data: miniApp,
      message: 'Visit recorded',
      visitCounted: true
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