# Tipzeus

A Premier League tips site — public dashboard + admin page for managing content.

## Local setup

```bash
npm install
npm run dev
```

Visit http://localhost:3000 for the public dashboard, http://localhost:3000/admin for the admin page.

## Structure

- `app/page.js` — public tips dashboard (home page)
- `app/admin/page.js` — admin page for adding/editing/deleting tips
- `components/TipzeusDashboard.jsx` — dashboard UI, fetches published tips from `/api/tips`
- `components/AdminTips.jsx` — admin UI, reads/writes tips via `/api/tips`
- `app/api/tips/route.js` — list tips, create a tip
- `app/api/tips/[id]/route.js` — update or delete a tip
- `lib/tipsStore.js` — reads/writes `data/tips.json`, seeding it on first run
- `data/tips.json` — the tips data file (created automatically, gitignored)

Tips you add, edit, publish/unpublish, or delete on `/admin` are saved to `data/tips.json` and immediately show up on the public dashboard (unpublished tips are hidden from the public page but stay visible in admin as drafts).

## Deploying to Vercel

1. Push this repo to GitHub
2. In Vercel, "Add New Project" → import the repo → Deploy
3. In Vercel project settings → Domains → add your custom domain, then update DNS at your registrar with the records Vercel gives you

Note: Vercel's serverless filesystem isn't reliably persistent across deploys/instances, so `data/tips.json` is fine for local dev but not for production — see "Next steps" below.

## Next steps

- The current storage (`data/tips.json` on the local filesystem) is only reliable for local development — swap `lib/tipsStore.js` for a real database (e.g. Supabase or Neon Postgres) before going live on Vercel
- The `/admin` page has no authentication — anyone who finds the URL can edit tips. Add auth before going live
