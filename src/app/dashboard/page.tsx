'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Image, Video, Sparkles, User, LogOut, Zap, Lock, TrendingUp } from 'lucide-react'
import { UserProfile } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Dashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    getProfile()
  }, [router])

  const handleLogout = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isPro = profile?.plan === 'pro'
  const isStarter = profile?.plan === 'starter'
  const isPaid = isPro || isStarter

  if (loading) return (
    <main style={{ minHeight: '100vh', background: 'var(--charcoal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--teal)', fontSize: 15 }}>Loading your studio...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--charcoal)' }}>

      {/* NAV */}
      <nav style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(26,26,46,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div className="font-display" style={{ fontSize: 20, color: 'var(--cream)' }}>
          PERSONA <span style={{ color: 'var(--teal)' }}>X</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 12, padding: '4px 12px', borderRadius: 50, background: isPro ? 'rgba(10,186,181,0.15)' : 'rgba(255,255,255,0.07)', border: isPro ? '1px solid rgba(10,186,181,0.3)' : '1px solid rgba(255,255,255,0.1)', color: isPro ? 'var(--teal)' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {profile?.plan || 'free'}
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* WELCOME */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="font-display" style={{ fontSize: 32, marginBottom: 6 }}>
            Hey {profile?.full_name?.split(' ')[0] || 'Queen'} 👑
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 15 }}>Your AI influencer studio is ready.</p>
        </div>

        {/* UPGRADE BANNER — free users */}
        {!isPaid && (
          <div style={{ marginBottom: 28, background: 'linear-gradient(135deg, rgba(10,186,181,0.1), rgba(194,24,91,0.08))', border: '1px solid rgba(10,186,181,0.25)', borderRadius: 16, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Unlock your AI studio</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Start generating images, videos, and content for just $9.99/mo</div>
            </div>
            <Link href="/pricing" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>Upgrade Now</Link>
          </div>
        )}

        {/* CREDITS */}
        {isPaid && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 32 }}>
            {[
              { label: 'Images left', value: profile?.image_credits || 0, max: isPro ? 100 : 30, color: 'var(--teal)' },
              { label: 'Videos left', value: profile?.video_credits || 0, max: isPro ? 15 : 2, color: 'var(--rose)' },
              { label: 'Plan', value: isPro ? 'Pro' : 'Starter', max: null, color: 'var(--gold)' },
            ].map((stat, i) => (
              <div key={i} className="card-glass" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 500, color: stat.color }}>{stat.value}</div>
                {stat.max && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>of {stat.max} this month</div>}
              </div>
            ))}
          </div>
        )}

        {/* STUDIO MODULES */}
        <h2 style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Your Studio</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { icon: User, title: 'Persona Builder', desc: 'Create and manage your AI influencer identity', href: '/dashboard/persona', available: isPaid },
            { icon: Image, title: 'Image Studio', desc: 'Generate consistent AI influencer photos', href: '/dashboard/images', available: isPaid },
            { icon: Video, title: 'Video Studio', desc: `Animate your influencer into cinematic clips${!isPro ? ' — 2 clips/mo' : ''}`, href: '/dashboard/video', available: isPaid },
            { icon: Zap, title: 'Content Engine', desc: 'Captions, bios, hashtags written by AI', href: '/dashboard/content', available: isPaid },
            { icon: TrendingUp, title: 'Content Calendar', desc: 'Plan and schedule your content drops', href: '/dashboard/calendar', available: isPro },
          ].map((mod, i) => (
            <div key={i} className="card-glass" style={{ position: 'relative', opacity: mod.available ? 1 : 0.5, transition: 'all 0.2s' }}>
              {!mod.available && (
                <div style={{ position: 'absolute', top: 14, right: 14 }}>
                  <Lock size={14} color="rgba(255,255,255,0.3)" />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(10,186,181,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <mod.icon size={20} color="var(--teal)" />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 500 }}>{mod.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 16, lineHeight: 1.5 }}>{mod.desc}</p>
              {mod.available ? (
                <Link href={mod.href} className="btn-ghost" style={{ fontSize: 13, padding: '8px 18px', display: 'inline-block' }}>Open</Link>
              ) : (
                <Link href="/pricing" className="btn-ghost" style={{ fontSize: 13, padding: '8px 18px', display: 'inline-block', borderColor: 'rgba(212,175,55,0.3)', color: 'var(--gold)' }}>Upgrade to unlock</Link>
              )}
            </div>
          ))}
        </div>

        {/* UPGRADE TO PRO — starter users */}
        {isStarter && (
          <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(10,186,181,0.05))', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 16, padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 500, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={16} color="var(--gold)" /> Unlock the full studio
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Get 100 images, 15 videos, 3 personas + character lock for $19.99/mo</div>
            </div>
            <Link href="/pricing?plan=pro" className="btn-primary" style={{ padding: '10px 24px', fontSize: 14 }}>Upgrade to Pro</Link>
          </div>
        )}
      </div>
    </main>
  )
}
