# A Queen's Studio — AI Influencer App

## 🚀 Setup in 4 Steps

### Step 1 — Supabase (free)
1. Go to supabase.com → create new project
2. Go to SQL Editor → paste contents of `supabase-schema.sql` → Run
3. Go to Settings > API → copy Project URL and anon key into `.env.local`

### Step 2 — Stripe (free to start)
1. Go to stripe.com → create account
2. Dashboard > Products → create two products:
   - "Starter Plan" — $9.99/month recurring → copy Price ID
   - "Pro Plan" — $19.99/month recurring → copy Price ID
3. Developers > API Keys → copy publishable + secret keys
4. Developers > Webhooks → add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Listen for: `checkout.session.completed`, `invoice.payment_succeeded`
   - Copy webhook signing secret
5. Paste all into `.env.local`

### Step 3 — AI APIs (free tiers)
- **Groq** (text): console.groq.com → API Keys → free
- **Hugging Face** (images): huggingface.co/settings/tokens → free
- **Replicate** (video): replicate.com/account/api-tokens → pay per use

### Step 4 — Deploy to Vercel (free)
1. Push this folder to a GitHub repo
2. vercel.com → Import project → select repo
3. Add all .env.local variables in Vercel project settings
4. Deploy → your app is live!
5. Add custom domain: app.aqueenslane.com in Vercel settings

## 📁 What's Built (Phase 1)
- ✅ Landing page (app.aqueenslane.com)
- ✅ Sign up page
- ✅ Login page  
- ✅ User dashboard
- ✅ Pricing page
- ✅ Stripe subscription checkout ($9.99 / $19.99)
- ✅ Stripe webhook (auto-grants credits on payment)
- ✅ Supabase auth + database schema
- ✅ User profiles, personas, generations tables

## 🔜 Phase 2 (Next Session)
- Persona builder wizard
- Text content engine (Groq)
- Image generator (HuggingFace)

## 🔜 Phase 3
- Video generator (Replicate)
- Upgrade hook (video credit counter)
- Character consistency lock
