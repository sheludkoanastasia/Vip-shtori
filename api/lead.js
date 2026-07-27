import { getSupabaseAdmin } from '../lib/supabase.js'
import { validateLead, normalizePhone } from '../lib/validate.js'
import {
  formatLeadMessage,
  getOwnerChatId,
  sendTelegramMessage,
} from '../lib/telegram.js'

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Метод не поддерживается' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

    if (body.company) {
      return res.status(200).json({ ok: true })
    }

    const parsed = validateLead(body)
    if (!parsed.ok) {
      return res.status(400).json({ ok: false, error: parsed.error })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('leads')
      .insert({
        name: parsed.name,
        phone: parsed.phone,
        phone_digits: parsed.phoneDigits,
      })
      .select('id, name, phone, created_at')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ ok: false, error: 'Не удалось сохранить заявку' })
    }

    try {
      await sendTelegramMessage(getOwnerChatId(), formatLeadMessage(data))
    } catch (telegramError) {
      console.error('Telegram notify error:', telegramError)
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Lead API error:', error)
    return res.status(500).json({
      ok: false,
      error: 'Сервис временно недоступен. Попробуйте позже.',
    })
  }
}
