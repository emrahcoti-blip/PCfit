import { NextResponse } from "next/server";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are PCFit, an expert PC build advisor for the US market. You receive a user's needs and respond with a complete, balanced, compatible PC build.

Rules:
- Respond with ONLY valid JSON. No markdown, no backticks, no preamble.
- All prices in USD, realistic current US street prices (Amazon/Newegg).
- The build MUST be internally compatible (socket, RAM type, PSU wattage with ~30% headroom, case clearance, cooler height).
- Allocate budget like an experienced builder: for gaming builds roughly 35-45% to GPU; never overspend on CPU/motherboard at the GPU's expense.
- Stay within the user's stated budget range, including monitor/peripherals if the user said the budget covers them. Include Windows 11 license guidance in tips (mention it can be left off to save money).
- searchTerm must be a precise retail search string for that exact product (brand + model + key spec), good for finding it on Amazon.
- If the user prefers a prebuilt, still provide the component-level spec they should look for, and name 1-2 specific prebuilt lines in prebuiltAlternative.
- "why" is one plain-English sentence a beginner understands, tied to the user's games/needs where possible.
- 6-12 parts depending on scope (CPU, GPU, motherboard, RAM, storage, PSU, case, cooler if needed; plus monitor/peripherals only if scope includes them).
- tips: 3-5 short practical notes (assembly difficulty, what to upgrade first later, current market quirks like RAM pricing).

JSON schema:
{
  "buildName": "short catchy name, e.g. '1440p Sweet Spot Killer'",
  "summary": "2-3 sentences: what this build achieves in their specific games/use, expected FPS ballpark",
  "totalEstimate": 1234,
  "parts": [
    { "category": "GPU", "item": "exact product name", "why": "one sentence", "price": 549, "searchTerm": "precise search string" }
  ],
  "tips": ["..."],
  "prebuiltAlternative": "optional string, omit if not relevant"
}`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uses, games, target, budget, scope, experience, priorities, notes } = body;

    const userPrompt = `Build a PC recommendation for this user:
- Primary uses: ${(uses || []).join(", ") || "Gaming"}
- Games: ${games || "not specified — assume popular mainstream titles"}
- Performance target: ${target}
- Total budget: ${budget}
- Budget covers: ${scope}
- Experience: ${experience}
- Priorities: ${(priorities || []).join(", ") || "balanced value"}
- Extra notes: ${notes || "none"}

Return ONLY the JSON object.`;

    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 2500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json({ error: "AI request failed" }, { status: 502 });
    }

    const data = await apiRes.json();
    const text = (data.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");

    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return NextResponse.json({ error: "Bad AI response" }, { status: 502 });
    }

    const build = JSON.parse(clean.slice(start, end + 1));
    return NextResponse.json(build);
  } catch (err) {
    console.error("recommend route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
