import { createClient } from '@supabase/supabase-js'

function normalizeSupabaseUrl(raw) {
  const trimmed = String(raw ?? '').trim().replace(/\/+$/, '')
  return trimmed.replace(/\/rest\/v1$/i, '')
}

export function getSupabaseAdmin() {
  const url = normalizeSupabaseUrl(process.env.SUPABASE_URL)
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim()

  if (!url || !key) {
    throw new Error('Не заданы SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
