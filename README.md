# Productivity Pylons

A southern-gothic productivity world (in-world name: Starline). Every chore lights the wire — no penalties, only stars.

Out in **Powerline Valley**, three places sit on the line:

- **The Switchboard** (`/quests`) — post quests, claim them, and watch the crackle ride the wire into your star counter. Longer and more dreaded work pays brighter.
- **Circuit Breaker** (`/wheel`) — an old carnival wheel wired into the grid. Feed it 40 stars; it gives what it will.
- **Ohmstead** (`/broadcast`) — the Night Broadcast. Each claimed quest clears static from the week's hidden station. Eight quests locks the frequency: the transmission plays, pays out, and files itself in your log.

Ambient extras: a toggleable storm (`STORM`), and a generated dark-ambient drone (`HUM`) — sub-bass, powerline 60Hz, wind, and internal static, synthesized live with the Web Audio API.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · Prisma 7 + SQLite (better-sqlite3 adapter). No external services; the whole world lives in one SQLite file.

## Local development

```bash
npm install
npx prisma migrate deploy   # creates/updates dev.db
npm run dev                 # http://localhost:3000
```

`DATABASE_URL` lives in `.env` (default `file:./dev.db`).

## Valleys

Starline is multi-tenant by **valley**: each group founds a valley and shares its secret
invite link (`/v/<code>`, copy it with the INVITE button in the header). Everyone on the link
shares that valley's players, quests, wheels, and broadcasts — and sees nothing of any other
valley.

## Live address

**https://www.powerlinevalley.com** — `powerlinevalley.com` redirects there. Registered and
DNS-hosted through Vercel, so the records manage themselves. The older
`productivity-app-pylons.vercel.app` address still works, but some networks can't resolve
`*.vercel.app`, which is why the app has its own domain. `git push` to `main` auto-deploys.

## Deploying (Vercel + Turso)

The code auto-switches databases: local dev uses the SQLite file; when `TURSO_DATABASE_URL`
is set it talks to [Turso](https://turso.tech) (hosted SQLite) instead.

1. Push this repo to GitHub.
2. On [turso.tech](https://turso.tech): create a (free) database → copy its **URL**
   (`libsql://…`) and create an **auth token**.
3. On [vercel.com](https://vercel.com): "Add New Project" → import the GitHub repo.
   - Environment variables: `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
   - Override the Build Command: `npx prisma migrate deploy && next build`.
4. Deploy. The migration step creates all tables (including the genesis valley) on first build.

### A note on players

There are no passwords — a valley's invite link is its only key, and the player switcher
trusts whoever's on the page. That's the right amount of security for households sharing a
link, and the wrong amount for anything more public. Real logins can layer on later.
