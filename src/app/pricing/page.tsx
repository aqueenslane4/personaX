'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'
import { PLANS } from '@/lib/stripe'

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)

    // Check auth by calling a lightweight API route instead of client-side Supabase
    const authRes = await fetch('/api/auth/me')
    const authData = await authRes.json()

    if (!authData.user) {
      window.location.href = `/signup?plan=${planId}`
      return
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, userId: authData.user.id, email: authData.user.email }),
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
                borderRadius: 16,
                padding: '32px 28px',
                position: 'relative',
              }}>
                {isPro && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(90deg, var(--teal), var(--rose))',
                    color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    padding: '4px 16px', borderRadius: 20,
                  }}>MOST POPULAR</div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {isPro && <Sparkles size={18} color="var(--teal)" />}
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: isPro ? 'var(--teal)' : 'var(--cream)' }}>{plan.name}</h2>
                  </div>
                  <div style={{ fontSize: 42, fontWeight: 800, color: 'var(--cream)', marginBottom: 4 }}>
                    ${plan.price}<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/mo</span>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f: string) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                      <Check size={15} color="var(--teal)" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(planId)}
                  disabled={loading === planId}
                  style={{
                    width: '100%', padding: '14px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: isPro ? 'linear-gradient(90deg, var(--teal), var(--rose))' : 'rgba(255,255,255,0.08)',
                    color: 'white', fontSize: 15, fontWeight: 700,
                    opacity: loading === planId ? 0.7 : 1,
                  }}
                >
                  {loading === planId ? 'Loading...' : `Get ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
