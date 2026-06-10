# PCFit — AI PC Build Advisor (US market)

The step before PCPartPicker: budget + games in, complete balanced parts list out.
Same stack and deploy flow as RiderFit (Next.js 14, Vercel, Anthropic API).

## Deploy (same as RiderFit)

1. Push this folder to a new GitHub repo (e.g. `pcfit`).
2. Import the repo in Vercel.
3. In Vercel → Settings → Environment Variables add:
   - `ANTHROPIC_API_KEY` = your console.anthropic.com key
   - `NEXT_PUBLIC_AMAZON_TAG` = leave empty for now (see below)
4. Deploy. Connect your domain (e.g. pcfit.io via Porkbun, same DNS pattern:
   A record → 216.198.79.1, CNAME www → your Vercel DNS target).

## Monetization setup (US)

**Amazon Associates (primary — do this first):**
1. Sign up at affiliate-program.amazon.com using the live site URL.
2. In the application: site type = content/niche website, topic = computers/electronics,
   monetization = Amazon affiliate links, traffic = SEO + social.
3. You get a tracking tag immediately (e.g. `pcfit0c-20`). Set it as
   `NEXT_PUBLIC_AMAZON_TAG` in Vercel and redeploy — every "View on Amazon" link
   becomes a tagged affiliate link automatically.
4. IMPORTANT: Amazon requires **3 qualifying sales within 180 days** for final approval.
   The footer + /disclosure page already contain the required Associates disclosure text.

**Newegg (secondary):** Newegg's affiliate program runs through CJ (Commission Junction)
and Impact. Apply once you have some traffic; until then links are plain search URLs.

**Best Buy / B&H:** both run on Impact — add later as alternative links if approved.

## Where the affiliate logic lives

`app/page.tsx` → `amazonUrl()` / `neweggUrl()` near the top. Same pattern as RiderFit's
`affiliateUrl` function: search-URL format now, swap to deep links if a network
(e.g. Skimlinks/Sovrn as fallback) gives you product-level links later.

## Files

- `app/page.tsx` — advisor form + build sheet UI (client)
- `app/api/recommend/route.ts` — server route calling Claude (`claude-sonnet-4-5`),
  returns strict JSON: buildName, summary, totalEstimate, parts[], tips[]
- `app/disclosure|privacy|terms|about|contact` — required legal/compliance pages
  (FTC 16 CFR Part 255 disclosure included — Amazon checks for this)
- `app/robots.ts`, `app/sitemap.ts` — SEO basics
