import { createClient } from '@supabase/supabase-js'

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  plan: 'free' | 'starter' | 'pro'
  stripe_customer_id: string | null
  image_credits: number
  video_credits: number
  created_at: string
}

export const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not set')
  return createClient(url, key)
}
