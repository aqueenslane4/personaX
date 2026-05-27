'use client'
import Link from 'next/link'
import { Check, Zap, Image, Video, Sparkles, ArrowRight, User, TrendingUp } from 'lucide-react'

const features = [
  { icon: User,       title: 'Persona Builder',  desc: 'Design your AI influencer — name, look, voice, backstory. Male, female, or non-binary.' },
  { icon: Image,      title: 'Image Studio',      desc: 'Generate 100s of consistent photos. Same face, every single time.' },
  { icon: Video,      title: 'Video Studio',      desc: 'Animate your persona into cinematic reels. No camera. No crew.' },
  { icon: Zap,        title: 'Content Engine',    desc: 'Captions, bios, scripts, hashtags — written in your persona\'s voice.' },
  { icon: TrendingUp, title: 'Growth Tools',      desc: 'Content calendar, posting strategy, and niche targeting built in.' },
  { icon: Sparkles,   title: 'Character Lock',    desc: 'Pro feature — locks your AI persona\'s face across every image and video.' },
]

const plans = [
  {
    name: 'STARTER', price: '9.99', tag: null,
    features: ['30 image generations/mo', '2 video clips/mo — get hooked', 'Unlimited captions & bios', '1 AI persona', 'Hashtag & script generator'],
    cta: 'Start Building', href: '/signup?plan=starter',
  },
  {
    name: 'PRO', price: '19.99', tag: 'Most Popular',
    features: ['100 image generations/mo', '15 video clips/mo', 'Unlimited captions & bios', '3 AI personas', 'Character consistency lock', 'Content calendar', 'Priority generation speed'],
    cta: 'Go Pro', href: '/signup?plan=pro',
  },
]

const niches = ['Fitness', 'Fashion', 'Lifestyle', 'Gaming', 'Business', 'Beauty', 'Travel', 'Comedy', 'Spirituality', 'Dating', 'Food', 'Tech']

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark)' }}>

      {/* NAV */}
      <nav style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(16px)', zIndex: 100 }}>
        <div className="font-display" style={{ fontSize: 26, color: 'var(--cream)', letterSpacing: '0.08em' }}>
          PERSONA <span style={{ color: 'var(--electric)' }}>X</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" className="btn-ghost" style={{ padding: '8px 18px', fontSize: 12 }}>Sign In</Link>
          <Link href="/signup" className="btn-primary" style={{ padding: '8px 18px', fontSize: 12 }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '110px 32px 90px', textAlign: 'center', maxWidth: 960, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 100, left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="x-badge" style={{ marginBottom: 28 }}>
          <Sparkles size={12} /> Now in beta — join free
        </div>

        <h1 className="font-display" style={{ fontSize: 'clamp(56px, 10vw, 110px)', lineHeight: 0.95, marginBottom: 28, letterSpacing: '0.04em' }}>
          BUILD YOUR<br />
          <span className="shimmer-text">AI INFLUENCER</span><br />
          TONIGHT.
        </h1>

        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 300 }}>
          Create a powerful AI persona, generate consistent photos, animate cinematic reels, and write viral content — for any niche, any gender, any platform.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="btn-primary" style={{ fontSize: 14, padding: '15px 36px' }}>
            Create My Persona <ArrowRight size={16} />
          </Link>
          <Link href="#pricing" className="btn-ghost" style={{ fontSize: 14, padding: '15px 36px' }}>
            See Pricing
          </Link>
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>YOUR BRAND. YOUR AI. YOUR RULES.</p>
      </section>

      {/* NICHES */}
      <section style={{ padding: '0 32px 60px', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>Works for every niche</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
          {niches.map((n, i) => (
            <span key={i} style={{ fontSize: 12, padding: '5px 14px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{n}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 32px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 10 }}>ONE STUDIO. EVERYTHING.</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No switching between 10 different apps</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} className="card-glass">
              <div style={{ width: 42, height: 42, borderRadius: 8, background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <f.icon size={20} color="var(--electric)" />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: 'var(--cream)', letterSpacing: '0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section style={{ padding: '20px 32px 80px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 20 }}>
          {[
            { num: '10+', label: 'AI Models powering it' },
            { num: '$0', label: 'To get started' },
            { num: '5 min', label: 'To your first persona' },
            { num: '2x', label: 'Revenue vs Dzine' },
          ].map((s,i) => (
            <div key={i} style={{ padding: '20px 10px' }}>
              <div className="font-display" style={{ fontSize: 44, color: 'var(--electric)', letterSpacing: '0.05em' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '60px 32px 100px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 10 }}>SIMPLE PRICING</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>Cancel anytime. No hidden fees. No surprises.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 20 }}>
          {plans.map((plan, i) => (
            <div key={i} className={plan.tag ? 'glow-electric' : ''} style={{
              background: plan.tag ? 'rgba(0,245,255,0.04)' : 'rgba(255,255,255,0.02)',
              border: plan.tag ? '1px solid rgba(0,245,255,0.25)' : '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: 28, position: 'relative'
            }}>
              {plan.tag && (
                <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--electric), var(--violet))', borderRadius: 4, padding: '4px 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--dark)', whiteSpace: 'nowrap' }}>
                  {plan.tag}
                </div>
              )}
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', marginBottom: 6 }}>{plan.name}</div>
              <div style={{ marginBottom: 24 }}>
                <span className="font-display" style={{ fontSize: 54, letterSpacing: '0.02em' }}>${plan.price}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                    <Check size={14} color="var(--electric)" style={{ marginTop: 1, flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, letterSpacing: '0.08em' }}>
        <div className="font-display" style={{ fontSize: 22, color: 'var(--cream)', marginBottom: 8 }}>PERSONA <span style={{ color: 'var(--electric)' }}>X</span></div>
        <p>YOUR BRAND. YOUR AI. YOUR RULES. © 2026</p>
      </footer>
    </main>
  )
}
