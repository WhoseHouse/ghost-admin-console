import { Router } from 'express';

const router = Router();

// Mock sites matching the generic schema — replace with real GHOST_SITES from .env
// when you're ready to connect to live blogs.
function loadSites() {
  if (process.env.GHOST_SITES) {
    try {
      return JSON.parse(process.env.GHOST_SITES);
    } catch {
      console.error('Failed to parse GHOST_SITES env var — falling back to mock data');
    }
  }

  return [
    {
      id: 'my-blog',
      label: 'My Blog',
      url: 'https://my-blog.ghost.io',
    },
    {
      id: 'my-second-blog',
      label: 'My Second Blog',
      url: 'https://my-second-blog.ghost.io',
    },
    {
      id: 'my-third-blog',
      label: 'My Third Blog',
      url: 'https://my-third-blog.ghost.io',
    },
  ];
}

// GET /api/sites — returns site list without exposing API keys
router.get('/', (_req, res) => {
  const sites = loadSites().map(({ id, label, url }) => ({ id, label, url }));
  res.json(sites);
});

export default router;
