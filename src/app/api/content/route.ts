import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { type, persona, extra } = await req.json()

    const prompts: Record<string, string> = {
      bio: `You are writing for an AI influencer named "${persona.name}". 
Personality: ${persona.vibe}. Niche: ${persona.niche}. Audience: ${persona.audience}. Style: ${persona.style}.
Write a bold, punchy Instagram/TikTok bio in first person. Max 150 characters. No em dashes. No hashtags. Just pure voice and attitude.`,

      caption: `You are writing for an AI influencer named "${persona.name}".
Personality: ${persona.vibe}. Niche: ${persona.niche}. Audience: ${persona.audience}.
Write a viral Instagram caption about: "${extra}". 
3-5 sentences. Strong hook first line. Call to action at end. Bold voice. No em dashes.`,

      hashtags: `Generate 30 highly relevant hashtags for an influencer in the ${persona.niche} niche targeting ${persona.audience}.
Mix of: 10 large (1M+ posts), 10 medium (100K-1M), 10 niche (under 100K).
Return only hashtags separated by spaces. No explanation.`,

      script: `You are writing a TikTok/Reels video script for AI influencer "${persona.name}".
Personality: ${persona.vibe}. Niche: ${persona.niche}.
Topic: "${extra}".
Format: Hook (0-3s) | Body (3-25s) | CTA (25-30s).
Keep it punchy. Conversational. Viral energy. No em dashes.`,

      email: `Write a newsletter intro for AI influencer "${persona.name}" in the ${persona.niche} niche.
Topic: "${extra}". Audience: ${persona.audience}. Personality: ${persona.vibe}.
Warm, personal tone. 3 short paragraphs. No em dashes.`,
    }

    const prompt = prompts[type]
    if (!prompt) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.85,
      }),
    })

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ content })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
