import { Router } from 'express';
import { getClients, adminFetch } from '../lib/ghostClients.js';

const router = Router();

// ── helpers ────────────────────────────────────────────────────────────────

async function fetchStats(client) {
  const { api, site } = client;

  const [allPosts, pubPosts, allMembers, paidMembers, recentPost] = await Promise.allSettled([
    api.posts.browse({ limit: 1, fields: 'id' }),
    api.posts.browse({ limit: 1, fields: 'id', filter: 'status:published' }),
    api.members.browse({ limit: 1, fields: 'id' }),
    api.members.browse({ limit: 1, fields: 'id', filter: 'status:paid' }),
    api.posts.browse({ limit: 1, fields: 'title,published_at', filter: 'status:published', order: 'published_at desc' }),
  ]);

  const total   = (r) => r.status === 'fulfilled' ? (r.value?.meta?.pagination?.total ?? 0) : 0;
  const first   = (r) => r.status === 'fulfilled' ? r.value[0] ?? null : null;

  return {
    id:           site.id,
    label:        site.label,
    url:          site.url,
    status:       'online',
    posts:        total(allPosts),
    published:    total(pubPosts),
    members:      total(allMembers),
    paidMembers:  total(paidMembers),
    lastPost:     first(recentPost)
      ? { title: first(recentPost).title, date: first(recentPost).published_at }
      : null,
  };
}

// ── GET /api/data/stats ────────────────────────────────────────────────────
// Returns aggregate totals + per-site breakdown for dashboard site cards.
// ?siteId=x  restrict to one site
router.get('/stats', async (req, res) => {
  const { siteId } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) {
    return res.status(404).json({ error: 'No matching site(s) found' });
  }

  try {
    const siteStats = await Promise.all(targets.map(fetchStats));

    const totals = siteStats.reduce(
      (acc, s) => {
        acc.posts       += s.posts;
        acc.published   += s.published;
        acc.members     += s.members;
        acc.paidMembers += s.paidMembers;
        return acc;
      },
      { posts: 0, published: 0, members: 0, paidMembers: 0 }
    );

    res.json({ totals, sites: siteStats });
  } catch (err) {
    console.error('stats error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/data/posts ────────────────────────────────────────────────────
// ?siteId=x   restrict to one site (default: all sites)
// ?status=published|draft|all  (default: all)
// ?limit=n    (default: 20)
router.get('/posts', async (req, res) => {
  const { siteId, status = 'all', limit = '20' } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) {
    return res.status(404).json({ error: 'No matching site(s) found' });
  }

  const browseOpts = {
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    fields: 'id,title,status,published_at,url',
    include: 'tags',
    order: 'published_at desc',
    ...(status !== 'all' ? { filter: `status:${status}` } : {}),
  };

  try {
    const perSite = await Promise.all(
      targets.map(async ({ api, site }) => {
        const posts = await api.posts.browse(browseOpts);
        return posts.map(p => ({
          id:          p.id,
          title:       p.title,
          status:      p.status,
          date:        p.published_at ? p.published_at.slice(0, 10) : '—',
          tag:         p.tags?.[0]?.name ?? '',
          url:         p.url,
          siteId:      site.id,
          siteLabel:   site.label,
          siteUrl:     site.url,
        }));
      })
    );

    const posts = perSite
      .flat()
      .sort((a, b) => (b.date > a.date ? 1 : -1))
      .slice(0, parseInt(limit, 10) || 20);

    res.json(posts);
  } catch (err) {
    console.error('posts error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/data/members ─────────────────────────────────────────────────
// ?siteId=x
// ?tier=paid|free|all  (default: all)
// ?limit=n             (default: 20)
router.get('/members', async (req, res) => {
  const { siteId, tier = 'all', limit = '20' } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) {
    return res.status(404).json({ error: 'No matching site(s) found' });
  }

  const browseOpts = {
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    fields: 'id,name,email,status,created_at,last_seen_at',
    order: 'created_at desc',
    ...(tier !== 'all' ? { filter: `status:${tier}` } : {}),
  };

  try {
    const perSite = await Promise.all(
      targets.map(async ({ api, site }) => {
        const members = await api.members.browse(browseOpts);
        return members.map(m => ({
          id:        m.id,
          name:      m.name || '(no name)',
          initials:  initials(m.name || m.email),
          email:     m.email,
          tier:      m.status === 'paid' ? 'paid' : 'free',
          joined:    m.created_at ? m.created_at.slice(0, 10) : '—',
          lastSeen:  relativeTime(m.last_seen_at),
          siteId:    site.id,
          siteLabel: site.label,
        }));
      })
    );

    const members = perSite
      .flat()
      .sort((a, b) => (b.joined > a.joined ? 1 : -1))
      .slice(0, parseInt(limit, 10) || 20);

    res.json(members);
  } catch (err) {
    console.error('members error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/data/pages ───────────────────────────────────────────────────
router.get('/pages', async (req, res) => {
  const { siteId, status = 'all', limit = '20' } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) return res.status(404).json({ error: 'No matching site(s) found' });

  const opts = {
    limit: Math.min(parseInt(limit, 10) || 20, 100),
    fields: 'id,title,status,url,updated_at',
    order: 'updated_at desc',
    ...(status !== 'all' ? { filter: `status:${status}` } : {}),
  };

  try {
    const perSite = await Promise.all(
      targets.map(async ({ api, site }) => {
        const pages = await api.pages.browse(opts);
        return pages.map(p => ({
          id:        p.id,
          title:     p.title,
          status:    p.status,
          url:       p.url,
          updatedAt: p.updated_at ? p.updated_at.slice(0, 10) : '—',
          siteId:    site.id,
          siteLabel: site.label,
          siteUrl:   site.url,
        }));
      })
    );
    const pages = perSite.flat().sort((a, b) => b.updatedAt > a.updatedAt ? 1 : -1).slice(0, parseInt(limit, 10) || 20);
    res.json(pages);
  } catch (err) {
    console.error('pages error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/data/newsletters ─────────────────────────────────────────────
router.get('/newsletters', async (req, res) => {
  const { siteId } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) return res.status(404).json({ error: 'No matching site(s) found' });

  try {
    const perSite = await Promise.all(
      targets.map(async ({ api, site }) => {
        const newsletters = await api.newsletters.browse({ limit: 'all' });
        return newsletters.map(n => ({
          id:          n.id,
          name:        n.name,
          status:      n.status,
          description: n.description || '',
          senderName:  n.sender_name || site.label,
          siteId:      site.id,
          siteLabel:   site.label,
          siteUrl:     site.url,
        }));
      })
    );
    res.json(perSite.flat());
  } catch (err) {
    console.error('newsletters error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/data/tiers ───────────────────────────────────────────────────
router.get('/tiers', async (req, res) => {
  const { siteId } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) return res.status(404).json({ error: 'No matching site(s) found' });

  try {
    const perSite = await Promise.all(
      targets.map(async ({ site }) => {
        const body = await adminFetch(site, 'tiers/', { limit: 'all', include: 'monthly_price,yearly_price,benefits' });
        return (body.tiers ?? []).map(t => ({
          id:           t.id,
          name:         t.name,
          type:         t.type,
          status:       t.status,
          description:  t.description || '',
          monthlyPrice: t.monthly_price ? (t.monthly_price.amount ?? t.monthly_price) / 100 : null,
          yearlyPrice:  t.yearly_price  ? (t.yearly_price.amount  ?? t.yearly_price)  / 100 : null,
          currency:     t.monthly_price?.currency ?? t.currency ?? 'USD',
          benefits:     (t.benefits ?? []).map(b => (typeof b === 'string' ? b : b.name)),
          siteId:       site.id,
          siteLabel:    site.label,
          siteUrl:      site.url,
        }));
      })
    );
    res.json(perSite.flat());
  } catch (err) {
    console.error('tiers error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── GET /api/data/offers ──────────────────────────────────────────────────
router.get('/offers', async (req, res) => {
  const { siteId } = req.query;
  const clients = getClients();
  const targets = siteId
    ? (clients[siteId] ? [clients[siteId]] : [])
    : Object.values(clients);

  if (targets.length === 0) return res.status(404).json({ error: 'No matching site(s) found' });

  try {
    const perSite = await Promise.all(
      targets.map(async ({ site }) => {
        const body = await adminFetch(site, 'offers/', { limit: 'all' });
        return (body.offers ?? []).map(o => ({
          id:              o.id,
          name:            o.name,
          code:            o.code,
          displayTitle:    o.display_title || o.name,
          type:            o.type,
          status:          o.status,
          discountAmount:  o.discount_amount,
          duration:        o.duration,
          redemptionCount: o.redemption_count ?? 0,
          currency:        o.currency || '',
          siteId:          site.id,
          siteLabel:       site.label,
          siteUrl:         site.url,
        }));
      })
    );
    res.json(perSite.flat());
  } catch (err) {
    console.error('offers error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── small helpers ──────────────────────────────────────────────────────────

function initials(str = '') {
  return str.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function relativeTime(iso) {
  if (!iso) return 'never';
  const now = Date.now();
  const then = new Date(iso).getTime();
  const mins = Math.round((now - then) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default router;
