import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbmcgknknkisaypslwnp.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRibWNna25rbmtpc2F5cHNsd25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Mzk0MDgsImV4cCI6MjA5NTQxNTQwOH0.xlPVaD6yyG4Ea01_WcytLefFvEKGv8plE0EzERvM_l8'

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

export const getSupabase = () => createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
