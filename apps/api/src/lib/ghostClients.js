import GhostAdminAPI from '@tryghost/admin-api';
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
