'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { PLANS } from '@/lib/stripe'

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = `/signup?plan=${planId}`; return }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, userId: user.id, email: user.email }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setLoading(null)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--charcoal)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Link href="/" className="font-display" style={{ fontSize: 22, color: 'var(--cream)', textDecoration: 'none', display: 'block', marginBottom: 32 }}>
            PERSONA <span style={{ color: 'var(--teal)' }}>X</span>
          </Link>
          <h1 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 52px)', marginBottom: 12 }}>Choose your plan</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Cancel anytime. No hidden fees.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {Object.entries(PLANS).map(([planId, plan]) => {
            const isPro = planId === 'pro'
            return (
              <div key={planId} style={{
                background: isPro ? 'linear-gradient(145deg, rgba(10,186,181,0.08), rgba(194,24,91,0.05))' : 'rgba(255,255,255,0.03)',
                border: isPro ? '1px solid rgba(10,186,181,0.3)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: 28, position: 'relative'
              }}>
                {isPro && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--teal), var(--rose))', borderRadius: 50, padding: '4px 16px', fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    <Sparkles size={12} /> Most Popular
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{plan.name}</div>
                <div style={{ marginBottom: 24 }}>
                  <span className="font-display" style={{ fontSize: 52, fontWeight: 700 }}>${plan.price}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                      <Check size={15} color="var(--teal)" style={{ marginTop: 1, flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn-primary"
                  onClick={() => handleSubscribe(planId)}
                  disabled={loading === planId}
                  style={{ width: '100%', justifyContent: 'center', opacity: loading === planId ? 0.7 : 1 }}
                >
                  {loading === planId ? 'Redirecting...' : `Get ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          Secured by Stripe. Cancel anytime from your dashboard.
        </p>
      </div>
    </main>
  )
}
