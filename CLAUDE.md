# Claude Rules for Ghost Admin Console

This repository is an npm workspace (monorepo) consisting of a frontend React application and a backend Node.js API.

## Project Structure
- `apps/api/`: Backend Express server.
- `apps/web/`: Frontend React application (Vite).
- Root `package.json` manages the workspace and concurrent scripts.

## Tech Stack
### Frontend (`apps/web`)
- **Framework**: React 18, built with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (`@tanstack/react-query`)
- **Routing**: React Router DOM

### Backend (`apps/api`)
- **Framework**: Node.js with Express (ES Modules: `"type": "module"`)
- **Core Library**: `@tryghost/admin-api` for interacting with Ghost instances
- **Other**: `dotenv`, `cors`

## Commands
- **Install dependencies**: `npm install` from root
- **Development**: `npm run dev` from the root directory (runs both API and Web concurrently)
- **Build Frontend**: `npm run build` from the root directory (builds `apps/web`)
- **Individual Development**:
  - API: `npm run dev` from `apps/api` (uses `node --watch src/index.js`)
  - Web: `npm run dev` from `apps/web`

## Code Style & Best Practices
- **General**: Use ES Modules (`import`/`export`) in both frontend and backend.
- **React**: Write functional React components using hooks. Keep components small, focused, and reusable.
- **Styling**: Use Tailwind CSS for all styling in the frontend. Avoid writing custom CSS unless absolutely necessary.
- **State Management**: Manage client-side global state with Zustand.
- **Data Fetching**: Use React Query for API data fetching, caching, and server state management in the frontend.
- **Backend**: Structure backend routes and controllers logically in the Express app.
- **Environment**: Ensure environment variables are loaded securely (via `dotenv` in API, and Vite's `.env` support in Web).
- **Package Manager**: Always use `npm` for dependency management, respecting the monorepo workspace structure.

## Testing & Verification

No automated test suite yet. Use these curl smoke tests to confirm the API is working after changes (requires `npm run dev` to be running):

```bash
# Confirm sites.json is loaded and credentials are valid
curl -s http://localhost:3001/api/sites
# Expected: [{"id":"ev-chris-prod","label":"EV Chris","url":"https://evchris.com"}]

# Confirm Ghost Admin API calls succeed and return real stats
curl -s http://localhost:3001/api/data/stats
# Expected: JSON with totals.posts > 0 and sites array with lastPost.title

# Confirm posts endpoint returns real post data
curl -s "http://localhost:3001/api/data/posts?limit=3"
# Expected: array of objects with id, title, status, date, tag, url, siteId

# Confirm members endpoint (may return empty array if site has 0 members)
curl -s "http://localhost:3001/api/data/members?limit=3"
# Expected: array (can be empty [])

# Filter to a single site
curl -s "http://localhost:3001/api/data/stats?siteId=ev-chris-prod"

# List all backups
curl -s http://localhost:3001/api/backups
# Expected: [] initially, then array of backup records after running one

# Trigger a backup for a specific site
curl -s -X POST http://localhost:3001/api/backups/run \
  -H "Content-Type: application/json" \
  -d '{"siteId":"ev-chris-prod"}'
# Expected: array with one backup record, status "success", contentExportSize > 10000
```

### Common Issues
- **"No matching site(s) found"**: `apps/api/sites.json` is missing or the path in `ghostClients.js` is wrong. The `SITES_JSON` path must resolve to `apps/api/sites.json` — from `apps/api/src/lib/` that is `../../sites.json`.
- **"Request not understood"** on posts: Don't include `tags` in the `fields` param when also using `include: 'tags'` — they conflict in the Ghost Admin API.
- **Port 3001 already in use**: The dev server is already running, which is fine.
