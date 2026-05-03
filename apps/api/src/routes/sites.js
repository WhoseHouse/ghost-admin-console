import { Router } from 'express';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dir = dirname(fileURLToPath(import.meta.url));
const SITES_JSON = join(__dir, '../../sites.json');

function loadSites() {
  // 1. Prefer sites.json next to package.json — avoids dotenv multiline issues
  if (existsSync(SITES_JSON)) {
    try {
      return JSON.parse(readFileSync(SITES_JSON, 'utf8'));
    } catch (e) {
      console.error('Failed to parse sites.json:', e.message);
    }
  }

  // 2. Fall back to GHOST_SITES env var (must be single-line JSON)
  if (process.env.GHOST_SITES) {
    try {
      return JSON.parse(process.env.GHOST_SITES);
    } catch {
      console.error('Failed to parse GHOST_SITES env var');
    }
  }

  // 3. Development mock data
  console.warn('No sites.json or GHOST_SITES found — using mock data');
  return [
    { id: 'my-blog',        label: 'My Blog',        url: 'https://my-blog.ghost.io' },
    { id: 'my-second-blog', label: 'My Second Blog',  url: 'https://my-second-blog.ghost.io' },
    { id: 'my-third-blog',  label: 'My Third Blog',   url: 'https://my-third-blog.ghost.io' },
  ];
}

// GET /api/sites — strips API keys before sending to browser
router.get('/', (_req, res) => {
  const sites = loadSites().map(({ id, label, url }) => ({ id, label, url }));
  res.json(sites);
});

export default router;
