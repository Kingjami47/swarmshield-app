# SwarmShield — Project Dashboard

The public dashboard for **SwarmShield**, a Uniswap v4 hook that prices swarm trust into a
pool (Identity MD Hackathon entry, October 2026).

Live sections: problem → mechanics → interactive fee simulator → rug-shield exit curve →
architecture → 18-test suite → launch plan → hackathon criteria → repo map.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Lucide icons.
No database, no API keys — every figure is static data from the contract repo
(`src/lib/shield-data.ts`).

## Run locally

```bash
bun install
bun run dev        # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (e.g. `swarmshield-dashboard`).
2. Vercel → **Add New Project** → import the repo.
3. Framework preset auto-detects **Next.js**. Leave build settings as default
   (`bun install` + `next build`). No environment variables required.
4. Deploy → set the resulting URL as the X account's **website** field.

Optional: set `NEXT_PUBLIC_SITE_URL` to the final production URL so OG/Twitter card
images resolve with absolute URLs.

## Updating after launch

All content lives in `src/lib/shield-data.ts` (`LAUNCH_STEPS`, `CRITERIA`, addresses,
test list). After the IMD launch flips step 4 to done, edit that one file and redeploy —
the dashboard re-renders from it.

MIT © SwarmShield contributors
