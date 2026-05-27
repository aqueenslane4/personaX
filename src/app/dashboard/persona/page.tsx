'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Save, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const vibes = ['Bold & Unapologetic','Soft & Inspiring','Witty & Sarcastic','Luxury & Aspirational','Raw & Relatable','Educational Expert','Mysterious & Edgy','Funny & Entertaining']
const styles = ['Glam & Editorial','Natural & Minimalist','Streetwear & Edgy','Futuristic & Digital','Cottagecore & Soft','Athletic & Sporty','Business & Professional','Dark & Moody']
const niches = ['Beauty & Skincare','Fitness & Wellness','Fashion & Style','Relationship & Dating','Business & Hustle','Travel & Lifestyle','Spirituality & Mindset','Food & Recipes','Gaming & Tech','Comedy & Entertainment','Parenting','Crypto & Finance']

type PersonaForm = {
  name: string
  gender: string
  vibe: string
  style: string
  niche: string
  audience: string
  bio: string
}

export default function PersonaBuilder() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<PersonaForm>({ name: '', gender: '', vibe: '', style: '', niche: '', audience: '', bio: '' })

  const setField = (k: keyof PersonaForm, v: string) => setForm(f => ({ ...f, [k]: v }))
  const totalSteps = 4

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    await supabase.from('personas').insert({ user_id: user.id, ...form })
    router.push('/dashboard?persona=created')
  }

  const chip = (val: string, selected: boolean, onClick: () => void) => (
    <button key={val} onClick={onClick} style={{
      fontSize: 13, padding: '8px 16px', borderRadius: 6,
      border: selected ? '1px solid var(--electric)' : '1px solid rgba(255,255,255,0.1)',
      background: selected ? 'rgba(0,245,255,0.08)' : 'transparent',
      color: selected ? 'var(--electric)' : 'rgba(255,255,255,0.5)',
      cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left'
    }}>{val}</button>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark)', padding: '0 0 60px' }}>
      <nav style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="font-display" style={{ fontSize: 18, color: 'var(--cream)' }}>PERSONA <span style={{ color: 'var(--electric)' }}>BUILDER</span></div>
      </nav>

      <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px' }}>

        {/* PROGRESS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < step ? 'var(--electric)' : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {/* STEP 1 — Identity */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--electric)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Step 1 of 4</div>
            <h2 className="font-display" style={{ fontSize: 36, marginBottom: 6 }}>WHO IS YOUR PERSONA?</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>Give them a name and identity.</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Persona name</label>
              <input value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Nova, Zara, Kai, Marcus..." />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Gender presentation</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Female', 'Male', 'Non-binary', 'No preference'].map(g => chip(g, form.gender === g, () => setField('gender', g)))}
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)} disabled={!form.name || !form.gender} style={{ width: '100%', justifyContent: 'center', opacity: !form.name || !form.gender ? 0.4 : 1 }}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2 — Personality */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--electric)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Step 2 of 4</div>
            <h2 className="font-display" style={{ fontSize: 36, marginBottom: 6 }}>PERSONALITY & STYLE</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>What's {form.name}'s energy?</p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Personality vibe</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {vibes.map(v => chip(v, form.vibe === v, () => setField('vibe', v)))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Visual style</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {styles.map(s => chip(s, form.style === s, () => setField('style', s)))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
              <button className="btn-primary" onClick={() => setStep(3)} disabled={!form.vibe || !form.style} style={{ flex: 2, justifyContent: 'center', opacity: !form.vibe || !form.style ? 0.4 : 1 }}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Niche */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--electric)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Step 3 of 4</div>
            <h2 className="font-display" style={{ fontSize: 36, marginBottom: 6 }}>NICHE & AUDIENCE</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>Where does {form.name} dominate?</p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Content niche</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {niches.map(n => chip(n, form.niche === n, () => setField('niche', n)))}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Target audience</label>
              <input value={form.audience} onChange={e => setField('audience', e.target.value)} placeholder="e.g. Women 25-40 going through a glow-up..." />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
              <button className="btn-primary" onClick={() => setStep(4)} disabled={!form.niche} style={{ flex: 2, justifyContent: 'center', opacity: !form.niche ? 0.4 : 1 }}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Bio + Review */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--electric)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Step 4 of 4</div>
            <h2 className="font-display" style={{ fontSize: 36, marginBottom: 6 }}>REVIEW & LAUNCH</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>Add a bio or let AI write it on the content page.</p>

            <div style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.15)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
              {[
                { label: 'Name', value: form.name },
                { label: 'Gender', value: form.gender },
                { label: 'Vibe', value: form.vibe },
                { label: 'Style', value: form.style },
                { label: 'Niche', value: form.niche },
                { label: 'Audience', value: form.audience || 'Not set' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>{r.label}</span>
                  <span style={{ color: 'var(--cream)' }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Bio (optional — AI will generate one)</label>
              <textarea value={form.bio} onChange={e => setField('bio', e.target.value)} placeholder={`Tell us about ${form.name}...`} style={{ minHeight: 80, resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setStep(3)} style={{ flex: 1, justifyContent: 'center' }}>Back</button>
              <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 2, justifyContent: 'center', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving...' : <><Save size={16} /> Save Persona</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
