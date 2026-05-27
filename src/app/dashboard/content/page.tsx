'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, RefreshCw, Zap, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Persona = { id: string; name: string; vibe: string; niche: string; audience: string; style: string }

const contentTypes = [
  { key: 'bio',     label: 'Bio',          desc: 'Instagram/TikTok bio',     needsTopic: false },
  { key: 'caption', label: 'Caption',      desc: 'Post caption',             needsTopic: true,  placeholder: 'What is this post about?' },
  { key: 'hashtags',label: 'Hashtags',     desc: '30 targeted hashtags',     needsTopic: false },
  { key: 'script',  label: 'Video Script', desc: '30s Reels/TikTok script',  needsTopic: true,  placeholder: 'What\'s the video topic?' },
  { key: 'email',   label: 'Newsletter',   desc: 'Email newsletter intro',   needsTopic: true,  placeholder: 'What\'s the newsletter about?' },
]

export default function ContentEngine() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [contentType, setContentType] = useState(contentTypes[0])
  const [topic, setTopic] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('personas').select('*').eq('user_id', user.id)
      if (data?.length) { setPersonas(data); setSelectedPersona(data[0]) }
    }
    load()
  }, [])

  const generate = async () => {
    if (!selectedPersona) return
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: contentType.key, persona: selectedPersona, extra: topic }),
      })
      const data = await res.json()
      setOutput(data.content || data.error || 'Something went wrong')
    } catch { setOutput('Failed to generate. Check your Groq API key.') }
    setLoading(false)
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark)', paddingBottom: 60 }}>
      <nav style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <div className="font-display" style={{ fontSize: 18, color: 'var(--cream)' }}>CONTENT <span style={{ color: 'var(--electric)' }}>ENGINE</span></div>
      </nav>

      <div style={{ maxWidth: 800, margin: '32px auto', padding: '0 24px' }}>

        {personas.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Zap size={40} color="var(--electric)" style={{ margin: '0 auto 16px' }} />
            <h2 className="font-display" style={{ fontSize: 28, marginBottom: 10 }}>NO PERSONA YET</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>Build your AI persona first to start generating content.</p>
            <Link href="/dashboard/persona" className="btn-primary">Build My Persona</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* LEFT — Controls */}
            <div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Persona</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {personas.map(p => (
                    <button key={p.id} onClick={() => setSelectedPersona(p)} style={{
                      padding: '10px 14px', borderRadius: 8, border: selectedPersona?.id === p.id ? '1px solid var(--electric)' : '1px solid rgba(255,255,255,0.08)',
                      background: selectedPersona?.id === p.id ? 'rgba(0,245,255,0.06)' : 'transparent',
                      color: selectedPersona?.id === p.id ? 'var(--electric)' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', fontSize: 14, textAlign: 'left', transition: 'all 0.15s'
                    }}>{p.name}</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Content type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {contentTypes.map(ct => (
                    <button key={ct.key} onClick={() => { setContentType(ct); setOutput('') }} style={{
                      padding: '10px 14px', borderRadius: 8, border: contentType.key === ct.key ? '1px solid var(--electric)' : '1px solid rgba(255,255,255,0.08)',
                      background: contentType.key === ct.key ? 'rgba(0,245,255,0.06)' : 'transparent',
                      color: contentType.key === ct.key ? 'var(--electric)' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{ct.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{ct.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {contentType.needsTopic && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Topic</label>
                  <input value={topic} onChange={e => setTopic(e.target.value)} placeholder={contentType.placeholder} />
                </div>
              )}

              <button className="btn-primary" onClick={generate} disabled={loading || (contentType.needsTopic && !topic)} style={{ width: '100%', justifyContent: 'center', opacity: loading || (contentType.needsTopic && !topic) ? 0.5 : 1 }}>
                {loading ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Zap size={15} /> Generate</>}
              </button>
            </div>

            {/* RIGHT — Output */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Output</label>
                {output && (
                  <button onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px', color: copied ? 'var(--electric)' : 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                    {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <div style={{ minHeight: 320, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16, fontSize: 14, color: output ? 'var(--cream)' : 'rgba(255,255,255,0.2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--electric)', fontSize: 13 }}>
                    <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Writing in {selectedPersona?.name}'s voice...
                  </div>
                ) : output || `Your ${contentType.label.toLowerCase()} will appear here...`}
              </div>

              {selectedPersona && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--electric)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Active persona</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--cream)' }}>{selectedPersona.name}</strong> · {selectedPersona.vibe} · {selectedPersona.niche}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
