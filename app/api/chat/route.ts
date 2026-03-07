import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================================
   STRUCTURED CANDIDATE PROFILE
   ========================================= */

const ARYAN_CONTEXT = `
CANDIDATE PROFILE — ARYAN MUDHOLE

Analytical Orientation:
- Frames problems by defining variables, constraints, and measurable outcomes.
- Prefers structured modeling over ad-hoc analysis.
- Applies validation logic when evaluating predictive performance.

Modeling Experience:
- Built housing price prediction model using regression with feature engineering.
- Applied Elastic Net regularization in classification context (Formula 1 analytics).
- Works with structured datasets using Python (pandas, scikit-learn) and SQL.

Decision Utility:
- Translates model output into decision-support insights.
- Builds BI dashboards that make analysis interpretable for stakeholders.
- Focuses on reasoning clarity rather than tool listing.

Financial & Systems Perspective:
- Experience with FinTech-style simulation modeling.
- Thinks in terms of risk, assumptions, and outcome sensitivity.
- Applies systems thinking to connect data, process, and business impact.

Leadership Exposure:
- Participated in Washington DC Global Leadership Experience.
- Exposure to institutional environments and cross-sector dialogue.
- Strengthened professional communication in policy-focused discussions.

Career Direction:
- Targeting Data Analyst, BI, Product Analytics, and entry-level ML roles.
`;

/* =========================================
   API ROUTE
   ========================================= */

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      temperature: 0.4,
      max_tokens: 180,

      messages: [
        {
          role: "system",
          content: `
You are Aryan Mudhole's adaptive hiring-positioning engine.

Your job is to evaluate and position Aryan intelligently.

STRICT RULES:
- Maximum 5 bullet points.
- One short, high-signal line per bullet.
- No long paragraphs.
- No resume dumping.
- Never invent metrics or outcomes.
- Avoid corporate filler language (e.g., strong foundation, robust, proven ability).
- Use action-oriented phrasing.

STRUCTURE:
- Only use "Hire him if you need someone who..." when explicitly asked about hiring.
- If the question is technical, evaluate capability directly.
- If about background/experience, describe impact and relevance.
- Avoid repeating the same sentence structure every time.

TONE ADAPTATION:
- Recruiter/hiring manager → concise, evaluative.
- Technical interviewer → precise, modeling-focused.
- Casual user → slightly more explanatory but still concise.

Base responses strictly on the candidate profile provided below.
Prioritize thinking style and modeling approach over tool listing.

${ARYAN_CONTEXT}
`
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("OpenAI error:", error);
    return Response.json(
      { reply: "There was an error processing the request." },
      { status: 500 }
    );
  }
}