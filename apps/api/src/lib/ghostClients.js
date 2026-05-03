import GhostAdminAPI from '@tryghost/admin-api';
import jwt from 'jsonwebtoken';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const SITES_JSON = join(__dir, '../../sites.json');

function loadSiteConfigs() {
  if (existsSync(SITES_JSON)) {
    try {
      return JSON.parse(readFileSync(SITES_JSON, 'utf8'));
    } catch (e) {
      console.error('ghostClients: failed to parse sites.json:', e.message);
    }
  }
  return [];
}

// Cache clients for the process lifetime
let _clients = null;

export function getClients() {
  if (_clients) return _clients;

  _clients = {};
  for (const site of loadSiteConfigs()) {
    if (!site.adminKey) continue;
    _clients[site.id] = {
      site,
      api: new GhostAdminAPI({
        url: site.url,
        key: site.adminKey,
        version: 'v5.0',
      }),
    };
  }
  return _clients;
}

export function getClient(siteId) {
  return getClients()[siteId] ?? null;
}

export function getSiteConfigs() {
  return loadSiteConfigs().map(({ id, label, url }) => ({ id, label, url }));
}

// Make a raw authenticated request to Ghost Admin API for resources not
// wrapped by @tryghost/admin-api (e.g. tiers, offers).
export function adminFetch(site, path, params = {}) {
  const [id, secret] = site.adminKey.split(':');
  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: '/ghost/admin/',
  });
  const url = new URL(`/ghost/api/admin/${path}`, site.url);
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined) url.searchParams.set(k, String(v)); });
  return fetch(url.toString(), {
    headers: {
      Authorization: `Ghost ${token}`,
      'Accept-Version': 'v5.0',
    },
  }).then(r => r.json());
}
