'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Sparkles } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

function SignUpForm() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = getSupabase()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, selected_plan: plan } }
    })
    if (error) { setError(error.message); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" className="font-display" style={{ fontSize: 32, color: 'var(--cream)', textDecoration: 'none', letterSpacing: '0.08em' }}>
            PERSONA <span style={{ color: 'var(--electric)' }}>X</span>
          </Link>
          <p style={{ marginTop: 10, color: 'rgba(255,255,255,0.35)', fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {plan === 'pro' ? 'Pro Plan' : 'Starter Plan'} — Create Account
          </p>
        </div>

        {success ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: 40 }}>
            <Sparkles size={40} color="var(--electric)" style={{ margin: '0 auto 16px' }} />
            <h2 className="font-display" style={{ fontSize: 28, marginBottom: 10, letterSpacing: '0.06em' }}>CHECK YOUR EMAIL</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7 }}>
              Confirmation sent to <strong style={{ color: 'var(--electric)' }}>{form.email}</strong>.<br />Click the link to activate your account.
            </p>
          </div>
        ) : (
          <div className="card-glass" style={{ padding: 28 }}>
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Full name</label>
                <input type="text" required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Email</label>
                <input type="email" required placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>Password</label>
                <input type={showPass ? 'text' : 'password'} required placeholder="Min 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: 34, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: 12 }}>{error}</p>}
              <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 4, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
              Already have an account? <Link href="/login" style={{ color: 'var(--electric)', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function SignUp() {
  return <Suspense><SignUpForm /></Suspense>
}
