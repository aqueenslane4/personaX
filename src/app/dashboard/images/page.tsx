'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, RefreshCw, Sparkles, Image as ImageIcon, Lock } from 'lucide-react'
import { UserProfile } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

type Persona = { id: string; name: string; vibe: string; niche: string; style: string }

const stylePresets = [
  { label: 'Photorealistic',   value: 'photorealistic, 8k, dramatic lighting, professional photography' },
  { label: 'Editorial',        value: 'editorial fashion photography, high contrast, magazine quality' },
  { label: 'Cinematic',        value: 'cinematic, movie still, golden hour, depth of field' },
  { label: 'Studio Glam',      value: 'studio photography, beauty lighting, glamorous, high end' },
  { label: 'Street Style',     value: 'street photography, urban, candid, authentic' },
  { label: 'Luxury Lifestyle', value: 'luxury lifestyle, aspirational, clean aesthetic, rich tones' },
  { label: 'Athletic',         value: 'athletic, action shot, sporty, dynamic, energetic' },
  { label: 'Dark & Moody',     value: 'dark moody aesthetic, dramatic shadows, noir, cinematic' },
]

const quickPrompts = [
  'Full body portrait, confident pose',
  'Close up face, looking at camera',
  'Sitting at a cafe, candid moment',
  'Outdoor lifestyle shot, golden hour',
  'Business professional, power pose',
  'Casual outfit, urban background',
]

export default function ImageStudio() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState(stylePresets[0])
  const [generated, setGenerated] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedImg, setSelectedImg] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: prof }, { data: pers }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('personas').select('*').eq('user_id', user.id),
      ])
      setProfile(prof)
      if (pers?.length) { setPersonas(pers); setSelectedPersona(pers[0]) }
    }
    load()
  }, [])

  const generate = async () => {
    if (!prompt) return
    setLoading(true)
    setError('')
    try {
      const supabase = getSupabase()
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: style.value, persona: selectedPersona }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setLoading(false); return }
      setGenerated(prev => [data.image, ...prev])
      setSelectedImg(data.image)
      if (profile) {
        await supabase.from('profiles').update({ image_credits: Math.max(0, profile.image_credits - 1) }).eq('id', profile.id)
        setProfile(p => p ? { ...p, image_credits: Math.max(0, p.image_credits - 1) } : p)
      }
    } catch { setError('Generation failed. Check your HuggingFace API key.') }
    setLoading(false)
  }

  const download = (img: string) => {
    const a = document.createElement('a'); a.href = img; a.download = `personax-${Date.now()}.jpg`; a.click()
  }

  const credits = profile?.image_credits || 0
  const outOfCredits = credits <= 0

  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark)', paddingBottom: 60 }}>
      <nav style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}><ArrowLeft size={16} /> Dashboard</Link>
          <div className="font-display" style={{ fontSize: 18, color: 'var(--cream)' }}>IMAGE <span style={{ color: 'var(--electric)' }}>STUDIO</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <ImageIcon size={14} color="var(--electric)" />
          <span style={{ color: credits > 5 ? 'var(--electric)' : '#ff6b6b' }}>{credits} credits left</span>
        </div>
      </nav>
      {outOfCredits ? (
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <Lock size={44} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 20px' }} />
          <h2 className="font-display" style={{ fontSize: 32, marginBottom: 10 }}>OUT OF CREDITS</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 28, lineHeight: 1.6 }}>You've used all your image credits this month.</p>
          <Link href="/pricing?plan=pro" className="btn-primary" style={{ justifyContent: 'center' }}>Upgrade to Pro — $19.99/mo</Link>
        </div>
      ) : (
        <div style={{ maxWidth: 1100, margin: '28px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {personas.length > 0 && (
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Persona</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {personas.map(p => <button key={p.id} onClick={() => setSelectedPersona(p)} style={{ padding: '9px 12px', borderRadius: 7, border: selectedPersona?.id === p.id ? '1px solid var(--electric)' : '1px solid rgba(255,255,255,0.08)', background: selectedPersona?.id === p.id ? 'rgba(0,245,255,0.06)' : 'transparent', color: selectedPersona?.id === p.id ? 'var(--electric)' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, textAlign: 'left' }}>{p.name} · {p.style}</button>)}
                </div>
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Visual style</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {stylePresets.map(s => <button key={s.label} onClick={() => setStyle(s)} style={{ fontSize: 12, padding: '6px 12px', borderRadius: 5, border: style.label === s.label ? '1px solid var(--electric)' : '1px solid rgba(255,255,255,0.08)', background: style.label === s.label ? 'rgba(0,245,255,0.08)' : 'transparent', color: style.label === s.label ? 'var(--electric)' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>{s.label}</button>)}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Quick prompts</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {quickPrompts.map(q => <button key={q} onClick={() => setPrompt(q)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12, textAlign: 'left' }}>{q}</button>)}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Custom prompt</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe the image you want..." style={{ minHeight: 80, resize: 'vertical' }} />
            </div>
            {error && <p style={{ fontSize: 12, color: '#ff6b6b', lineHeight: 1.5 }}>{error}</p>}
            <button className="btn-primary" onClick={generate} disabled={loading || !prompt} style={{ width: '100%', justifyContent: 'center', opacity: loading || !prompt ? 0.5 : 1 }}>
              {loading ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={15} /> Generate Image</>}
            </button>
          </div>
          <div>
            {selectedImg ? (
              <div style={{ marginBottom: 20 }}>
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '1', background: 'rgba(255,255,255,0.02)' }}>
                  <img src={selectedImg} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                  <button className="btn-primary" onClick={() => download(selectedImg)} style={{ flex: 1, justifyContent: 'center' }}><Download size={15} /> Download</button>
                  <button className="btn-ghost" onClick={generate} disabled={loading} style={{ flex: 1, justifyContent: 'center' }}><RefreshCw size={15} /> Regenerate</button>
                </div>
              </div>
            ) : (
              <div style={{ aspectRatio: '1', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                <ImageIcon size={48} color="rgba(255,255,255,0.1)" />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Your image will appear here</span>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
