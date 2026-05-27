import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: { userId?: string; planId?: string } }
    const userId = session.metadata?.userId
    const planId = session.metadata?.planId as keyof typeof PLANS

    if (userId && planId && PLANS[planId]) {
      const plan = PLANS[planId]
      await supabase.from('profiles').update({
        plan: planId,
        image_credits: plan.images,
        video_credits: plan.videos,
      }).eq('id', userId)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as { customer?: string; subscription?: string }
    const customerId = invoice.customer
    if (customerId) {
      const { data: profile } = await supabase.from('profiles').select('id, plan').eq('stripe_customer_id', customerId).single()
      if (profile && profile.plan in PLANS) {
        const plan = PLANS[profile.plan as keyof typeof PLANS]
        await supabase.from('profiles').update({
          image_credits: plan.images,
          video_credits: plan.videos,
        }).eq('id', profile.id)
      }
    }
  }

  return NextResponse.json({ received: true })
}
