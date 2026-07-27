import { getSupabaseAdmin } from '../lib/supabase.js'
import { normalizePhone } from '../lib/validate.js'
import {
  formatSearchResults,
  getOwnerChatId,
  sendTelegramMessage,
} from '../lib/telegram.js'

async function searchLeads(query) {
  const supabase = getSupabaseAdmin()
  const trimmed = query.trim()
  const digits = normalizePhone(trimmed)

  if (digits.length >= 5) {
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, phone, created_at')
      .ilike('phone_digits', `%${digits}%`)
      .order('created_at', { ascending: false })
      .limit(15)

    if (error) throw error
    return data || []
  }

  const { data, error } = await supabase
    .from('leads')
    .select('id, name, phone, created_at')
    .ilike('name', `%${trimmed}%`)
    .order('created_at', { ascending: false })
    .limit(15)

  if (error) throw error
  return data || []
}

async function getLastLeads(limit = 5) {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('leads')
    .select('id, name, phone, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

async function handleOwnerCommand(chatId, text) {
  const trimmed = (text || '').trim()

  if (trimmed === '/start' || trimmed === '/help') {
    await sendTelegramMessage(
      chatId,
      [
        '<b>Бот заявок «Vip шторы»</b>',
        '',
        'Команды:',
        '/find имя или телефон — поиск заявки',
        '/last — последние 5 заявок',
        '/help — эта справка',
        '',
        'Новые заявки с сайта приходят сюда автоматически.',
      ].join('\n'),
    )
    return
  }

  if (trimmed === '/last') {
    const leads = await getLastLeads(5)
    await sendTelegramMessage(chatId, formatSearchResults(leads, 'последние'))
    return
  }

  if (trimmed.startsWith('/find')) {
    const query = trimmed.replace(/^\/find\s*/i, '').trim()
    if (!query) {
      await sendTelegramMessage(
        chatId,
        'Укажите запрос: <code>/find Анна</code> или <code>/find 8918</code>',
      )
      return
    }

    const leads = await searchLeads(query)
    await sendTelegramMessage(chatId, formatSearchResults(leads, query))
    return
  }

  if (trimmed && !trimmed.startsWith('/')) {
    const leads = await searchLeads(trimmed)
    await sendTelegramMessage(chatId, formatSearchResults(leads, trimmed))
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false })
  }

  try {
    const update = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const message = update?.message
    if (!message?.chat?.id) {
      return res.status(200).json({ ok: true })
    }

    const chatId = String(message.chat.id)
    const ownerId = getOwnerChatId()

    if (chatId !== ownerId) {
      await sendTelegramMessage(
        chatId,
        'Этот бот только для владельца сайта.',
      )
      return res.status(200).json({ ok: true })
    }

    await handleOwnerCommand(chatId, message.text || '')
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return res.status(200).json({ ok: true })
  }
}
