'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Video, RefreshCw, Download, Sparkles, Lock, ArrowRight } from 'lucide-react'
import { supabase, UserProfile } from '@/lib/supabase'

const motionStyles = [
  { label: 'Subtle & Cinematic', value: 'subtle cinematic motion, gentle camera drift, professional' },
  { label: 'Dynamic & Bold',     value: 'dynamic motion, bold camera movement, energetic' },
  { label: 'Walking Toward',     value: 'person walking toward camera, confident stride' },
  { label: 'Hair & Wind',        value: 'hair blowing in wind, natural outdoor movement' },
  { label: 'Look Around',        value: 'slowly looking around, environmental awareness' },
  { label: 'Breathing & Still',  value: 'natural breathing motion, subtle body movement, still' },
]

export default function VideoStudio() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [motion, setMotion] = useState(motionStyles[0])
  const [customPrompt, setCustomPrompt] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle'|'uploading'|'generating'|'polling'|'done'|'error'>('idle')
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [videos, setVideos] = useState<string[]>([])
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
    load()
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  useEffect(() => {
    if (predictionId && status === 'polling') {
      pollRef.current = setInterval(async () => {
        const res = await fetch(`/api/video?id=${predictionId}`)
        const data = await res.json()
        if (data.status === 'succeeded' && data.output) {
          clearInterval(pollRef.current!)
          setVideoUrl(data.output[0] || data.output)
          setVideos(prev => [data.output[0] || data.output, ...prev])
          setStatus('done')
          if (profile) {
            await supabase.from('profiles').update({ video_credits: Math.max(0, profile.video_credits - 1) }).eq('id', profile.id)
            setProfile(p => p ? { ...p, video_credits: Math.max(0, p.video_credits - 1) } : p)
          }
        } else if (data.status === 'failed') {
          clearInterval(pollRef.current!)
          setError('Video generation failed. Try again.')
          setStatus('error')
        }
      }, 3000)
    }
  }, [predictionId, status, profile])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setUploadedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const generateVideo = async () => {
    if (!uploadedImage) return
    setStatus('generating')
    setError('')
    setVideoUrl(null)
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadedImage,
          motionPrompt: customPrompt || motion.value,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); setStatus('error'); return }
      setPredictionId(data.predictionId)
      setStatus('polling')
    } catch { setError('Failed to start generation.'); setStatus('error') }
  }

  const credits = profile?.video_credits || 0
  const isPro = profile?.plan === 'pro'
  const outOfCredits = credits <= 0
  const isGenerating = status === 'generating' || status === 'polling'

  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark)', paddingBottom: 60 }}>
      <nav style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="font-display" style={{ fontSize: 18, color: 'var(--cream)' }}>VIDEO <span style={{ color: 'var(--electric)' }}>STUDIO</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Video size={14} color={credits > 0 ? 'var(--electric)' : '#ff6b6b'} />
          <span style={{ fontSize: 13, color: credits > 0 ? 'var(--electric)' : '#ff6b6b' }}>{credits} video credits</span>
          {!isPro && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>(Starter: 2/mo)</span>}
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '28px auto', padding: '0 24px' }}>

        {/* UPGRADE HOOK — when credits run out */}
        {outOfCredits && (
          <div style={{ background: 'linear-gradient(135deg, rgba(255,77,0,0.08), rgba(123,47,255,0.08))', border: '1px solid rgba(255,77,0,0.25)', borderRadius: 12, padding: '24px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Sparkles size={16} color="var(--fire)" />
                <span style={{ fontWeight: 500, fontSize: 15 }}>You've seen what video can do.</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                {isPro ? 'Your monthly credits reset soon.' : 'Upgrade to Pro — get 15 videos/mo + character lock + 100 images.'}
              </p>
            </div>
            {!isPro && (
              <Link href="/pricing?plan=pro" className="btn-primary" style={{ padding: '11px 24px', fontSize: 13, whiteSpace: 'nowrap' }}>
                Upgrade to Pro <ArrowRight size={15} />
              </Link>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>

          {/* CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Upload image */}
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Source image</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ aspectRatio: '1', borderRadius: 10, border: uploadedImage ? '1px solid rgba(0,245,255,0.3)' : '2px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, transition: 'all 0.2s' }}
              >
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Source" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <Upload size={28} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Upload your AI persona photo</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>JPG or PNG</span>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              {uploadedImage && (
                <button onClick={() => fileRef.current?.click()} style={{ width: '100%', marginTop: 8, padding: '7px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 12 }}>
                  Change image
                </button>
              )}
            </div>

            {/* Motion style */}
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Motion style</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {motionStyles.map(m => (
                  <button key={m.label} onClick={() => setMotion(m)} style={{ padding: '9px 12px', borderRadius: 6, border: motion.label === m.label ? '1px solid var(--electric)' : '1px solid rgba(255,255,255,0.07)', background: motion.label === m.label ? 'rgba(0,245,255,0.06)' : 'transparent', color: motion.label === m.label ? 'var(--electric)' : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: 12, textAlign: 'left' }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom prompt */}
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Custom motion (optional)</label>
              <input value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Describe the exact motion you want..." />
            </div>

            {error && <p style={{ fontSize: 12, color: '#ff6b6b', lineHeight: 1.5 }}>{error}</p>}

            <button
              className="btn-primary"
              onClick={generateVideo}
              disabled={isGenerating || !uploadedImage || outOfCredits}
              style={{ width: '100%', justifyContent: 'center', opacity: isGenerating || !uploadedImage || outOfCredits ? 0.5 : 1 }}
            >
              {isGenerating
                ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> {status === 'polling' ? 'Processing...' : 'Starting...'}</>
                : outOfCredits
                ? <><Lock size={15} /> No Credits Left</>
                : <><Sparkles size={15} /> Generate Video</>
              }
            </button>

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
              ~45-90 seconds · {credits} credit{credits !== 1 ? 's' : ''} remaining
            </p>
          </div>

          {/* OUTPUT */}
          <div>
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
              {status === 'done' && videoUrl ? (
                <video src={videoUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : isGenerating ? (
                <>
                  <div style={{ position: 'relative' }}>
                    <RefreshCw size={44} color="var(--electric)" style={{ animation: 'spin 2s linear infinite' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 14, color: 'var(--electric)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {status === 'polling' ? 'Animating your persona...' : 'Starting generation...'}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>This takes 45-90 seconds</div>
                  </div>
                  {uploadedImage && (
                    <div style={{ position: 'absolute', opacity: 0.15 }}>
                      <img src={uploadedImage} alt="" style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8, filter: 'blur(4px)' }} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Video size={52} color="rgba(255,255,255,0.08)" />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Your video will play here</span>
                  {!uploadedImage && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Upload an image to get started</span>}
                </>
              )}
            </div>

            {status === 'done' && videoUrl && (
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={videoUrl} download={`personax-${Date.now()}.mp4`} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <Download size={15} /> Download MP4
                </a>
                <button className="btn-ghost" onClick={generateVideo} style={{ flex: 1, justifyContent: 'center' }}>
                  <RefreshCw size={15} /> Regenerate
                </button>
              </div>
            )}

            {/* Previous videos */}
            {videos.length > 1 && (
              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>Previous videos</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {videos.slice(1).map((v, i) => (
                    <video key={i} src={v} onClick={() => setVideoUrl(v)} muted style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: videoUrl === v ? '2px solid var(--electric)' : '1px solid rgba(255,255,255,0.06)' }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}
