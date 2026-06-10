"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/* Affiliate links (US market)                                         */
/* Once your Amazon Associates tag is approved, set                    */
/* NEXT_PUBLIC_AMAZON_TAG in Vercel (e.g. "pcfit0c-20") and redeploy.  */
/* Links work as plain search URLs until then.                         */
/* ------------------------------------------------------------------ */
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG || "";

function amazonUrl(term: string) {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(term)}`;
  return AMAZON_TAG ? `${base}&tag=${AMAZON_TAG}` : base;
}
function neweggUrl(term: string) {
  return `https://www.newegg.com/p/pl?d=${encodeURIComponent(term)}`;
}

/* ------------------------------------------------------------------ */
/* Form options                                                        */
/* ------------------------------------------------------------------ */
const USES = ["Gaming", "Streaming / content creation", "Work & productivity", "School", "AI / 3D rendering", "Everyday browsing"];
const TARGETS = ["1080p, high FPS (esports)", "1440p sweet spot", "4K, max settings", "Not sure — recommend for me"];
const BUDGETS = ["Under $800", "$800–$1,200", "$1,200–$2,000", "$2,000–$3,000", "$3,000+"];
const SCOPES = ["Just the tower", "Tower + monitor", "Full setup (monitor, keyboard, mouse, headset)"];
const EXPERIENCE = ["First build ever", "I've built before", "I'd rather buy a prebuilt"];
const PRIORITIES = ["Max FPS per dollar", "Quiet operation", "Small form factor", "Looks & RGB", "Future-proof / upgradeable", "Easy to assemble"];

const ALLOC_COLORS = ["#22d3ee", "#fbbf24", "#34d399", "#a78bfa", "#f472b6", "#fb923c", "#60a5fa", "#facc15", "#4ade80", "#e879f9"];

type Part = { category: string; item: string; why: string; price: number; searchTerm: string };
type Build = {
  buildName: string;
  summary: string;
  totalEstimate: number;
  parts: Part[];
  tips: string[];
  prebuiltAlternative?: string;
};

export default function Home() {
  const [uses, setUses] = useState<string[]>(["Gaming"]);
  const [games, setGames] = useState("");
  const [target, setTarget] = useState(TARGETS[1]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [scope, setScope] = useState(SCOPES[0]);
  const [experience, setExperience] = useState(EXPERIENCE[0]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [build, setBuild] = useState<Build | null>(null);

  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  async function submit() {
    setLoading(true);
    setError("");
    setBuild(null);
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uses, games, target, budget, scope, experience, priorities, notes }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      if (!data.parts) throw new Error("Bad response");
      setBuild(data);
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 80);
    } catch {
      setError("Something went wrong generating your build. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  const allocTotal = build ? build.parts.reduce((s, p) => s + (p.price || 0), 0) : 0;

  return (
    <main className="container">
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="hero">
        <span className="eyebrow">AI PC Build Advisor · Free</span>
        <h1>
          Your budget. Your games.
          <br />
          <span className="amber">A complete parts list.</span>
        </h1>
        <p className="sub">
          PCPartPicker tells you if parts are compatible — but not <strong>which parts to pick</strong>.
          PCFit answers that. Tell us what you play and what you can spend, and get a full,
          balanced build with prices and where to buy each part.
        </p>
      </section>

      {/* ------------------------------ Form ------------------------------ */}
      <section className="advisor" aria-label="Build advisor form">
        <div className="field">
          <div className="field-label"><span className="num">01</span>What will you use it for?</div>
          <div className="chips">
            {USES.map((u) => (
              <button key={u} type="button" className={`chip ${uses.includes(u) ? "on" : ""}`} onClick={() => toggle(uses, setUses, u)}>
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span className="num">02</span>Which games do you play (or want to play)?</div>
          <p className="field-hint">Optional, but the more specific, the better the build. e.g. "Cyberpunk 2077, Warzone, Baldur's Gate 3"</p>
          <input className="text-input" value={games} onChange={(e) => setGames(e.target.value)} placeholder="List your games…" />
        </div>

        <div className="field">
          <div className="field-label"><span className="num">03</span>What are you aiming for?</div>
          <div className="chips">
            {TARGETS.map((t) => (
              <button key={t} type="button" className={`chip ${target === t ? "on" : ""}`} onClick={() => setTarget(t)}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span className="num">04</span>Total budget</div>
          <div className="chips">
            {BUDGETS.map((b) => (
              <button key={b} type="button" className={`chip money ${budget === b ? "on" : ""}`} onClick={() => setBudget(b)}>
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span className="num">05</span>What does the budget need to cover?</div>
          <div className="chips">
            {SCOPES.map((s) => (
              <button key={s} type="button" className={`chip ${scope === s ? "on" : ""}`} onClick={() => setScope(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span className="num">06</span>Your experience</div>
          <div className="chips">
            {EXPERIENCE.map((x) => (
              <button key={x} type="button" className={`chip ${experience === x ? "on" : ""}`} onClick={() => setExperience(x)}>
                {x}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span className="num">07</span>What matters most? <span style={{ fontWeight: 400, color: "var(--muted)", fontSize: 13 }}>(pick any)</span></div>
          <div className="chips">
            {PRIORITIES.map((p) => (
              <button key={p} type="button" className={`chip ${priorities.includes(p) ? "on" : ""}`} onClick={() => toggle(priorities, setPriorities, p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <div className="field-label"><span className="num">08</span>Anything else?</div>
          <p className="field-hint">Parts you already own and want to reuse, brand preferences, microphone needs, etc.</p>
          <textarea className="text-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional…" />
        </div>

        <button className="cta" onClick={submit} disabled={loading}>
          {loading ? "Building your spec…" : "Get my build →"}
        </button>
        {error && <p className="form-error">{error}</p>}
      </section>

      {/* ------------------------------ Loading ------------------------------ */}
      {loading && (
        <div className="loading-wrap">
          <p style={{ color: "var(--muted)" }}>Balancing your budget across GPU, CPU, and the rest…</p>
          <div className="loading-bar"><div /></div>
        </div>
      )}

      {/* ------------------------------ Results ------------------------------ */}
      {build && (
        <section className="build-sheet" id="results" aria-label="Your recommended build">
          <div className="sheet-head">
            <h2>{build.buildName}</h2>
            <span className="total mono">Estimated total: ${build.totalEstimate?.toLocaleString?.() ?? build.totalEstimate}</span>
            <p>{build.summary}</p>

            {/* Budget allocation bar — see where your money goes */}
            {allocTotal > 0 && (
              <>
                <div className="alloc-bar" role="img" aria-label="Budget allocation by component">
                  {build.parts.map((p, i) => (
                    <div key={i} style={{ width: `${(p.price / allocTotal) * 100}%`, background: ALLOC_COLORS[i % ALLOC_COLORS.length] }} />
                  ))}
                </div>
                <div className="alloc-legend">
                  {build.parts.map((p, i) => (
                    <span key={i}>
                      <span className="dot" style={{ background: ALLOC_COLORS[i % ALLOC_COLORS.length] }} />
                      {p.category} {Math.round((p.price / allocTotal) * 100)}%
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {build.parts.map((p, i) => (
            <div className="part-row" key={i}>
              <div className="part-cat">{p.category}</div>
              <div>
                <div className="part-name">{p.item}</div>
                <div className="part-why">{p.why}</div>
              </div>
              <div className="part-side">
                <div className="part-price mono">~${p.price?.toLocaleString?.() ?? p.price}</div>
                <div className="buy-links">
                  <a href={amazonUrl(p.searchTerm || p.item)} target="_blank" rel="noopener nofollow sponsored">View on Amazon →</a>
                  <a href={neweggUrl(p.searchTerm || p.item)} target="_blank" rel="noopener nofollow sponsored">Check Newegg →</a>
                </div>
              </div>
            </div>
          ))}

          {(build.tips?.length > 0 || build.prebuiltAlternative) && (
            <div className="tips-box">
              <h3>Build notes</h3>
              <ul>
                {build.tips?.map((t, i) => <li key={i}>{t}</li>)}
                {build.prebuiltAlternative && <li><strong>Prebuilt alternative:</strong> {build.prebuiltAlternative}</li>}
              </ul>
            </div>
          )}

          <p className="disclosure-inline">
            Prices are AI estimates and change daily — always confirm on the retailer page. Some links
            above are affiliate links: if you buy through them, PCFit earns a small commission at no
            extra cost to you. <a href="/disclosure">Full disclosure</a>.
          </p>

          <button className="again-btn" onClick={() => { setBuild(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            ↺ Adjust answers & rebuild
          </button>
        </section>
      )}

      {/* ------------------------------ Why ------------------------------ */}
      {!build && !loading && (
        <section className="why">
          <h2>Why PCFit?</h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>The step before PCPartPicker</h3>
              <p>Compatibility checkers assume you already know what you want. PCFit starts where you actually are: a budget and a list of games.</p>
            </div>
            <div className="why-card">
              <h3>Balanced, not bottlenecked</h3>
              <p>The #1 beginner mistake is bad budget allocation. PCFit splits your money the way experienced builders do — GPU first, no weak links.</p>
            </div>
            <div className="why-card">
              <h3>Plain-English reasons</h3>
              <p>Every part comes with a one-line reason why it's in your build, so you learn while you shop instead of just trusting a list.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
