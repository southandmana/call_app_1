import { createClient } from '@supabase/supabase-js'

// TODO: Switch to env vars before production deploy
const supabaseUrl = 'https://skyffnybsqwfbbkbqcxy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNreWZmbnlic3F3ZmJia2JxY3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjk3MDAsImV4cCI6MjA3NDcwNTcwMH0.VDBotu0zwfBj8scowj01driNHTUp6HjkLWgUgBJ9eSI'

// Singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

export const supabase = getSupabaseClient()