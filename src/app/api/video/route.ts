import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, motionPrompt } = await req.json()

    // Start the prediction
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '25700b3b9e09e51b0e8bbf8b7be4a66cd5c4e3a9b53f9b0e49a83e39b3d7d9f4',
        input: {
          image: imageUrl,
          motion_bucket_id: 127,
          cond_aug: 0.02,
          fps: 6,
          num_frames: 25,
          prompt: motionPrompt || 'smooth cinematic camera movement, subtle motion',
        },
      }),
    })

    const prediction = await response.json()
    return NextResponse.json({ predictionId: prediction.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const predictionId = searchParams.get('id')
  if (!predictionId) return NextResponse.json({ error: 'No prediction ID' }, { status: 400 })

  const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
    headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` },
  })

  const data = await response.json()
  return NextResponse.json({ status: data.status, output: data.output })
}
