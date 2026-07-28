import { getSupabaseAdmin } from '../lib/supabase.js'
import { normalizePhone } from '../lib/validate.js'
import {
  formatSearchResults,
  getOwnerChatId,
  OWNER_KEYBOARD,
  sendTelegramMessage,
} from '../lib/telegram.js'

const BTN_LAST = '📋 Последние заявки'
const BTN_SEARCH = '🔍 Поиск'
const BTN_HELP = 'ℹ️ Помощь'

const HELP_TEXT = [
  '<b>Бот заявок «Vip шторы»</b>',
  '',
  'Нажмите кнопку внизу экрана:',
  `• <b>${BTN_LAST}</b> — последние 5 заявок`,
  `• <b>${BTN_SEARCH}</b> — подсказка по поиску`,
  `• <b>${BTN_HELP}</b> — эта справка`,
  '',
  'Или просто напишите имя или телефон — бот найдёт заявки.',
  '',
  'Новые заявки с сайта приходят сюда автоматически.',
].join('\n')

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

/** /last@MyBot → { command: '/last', args: '' } */
function parseCommand(text) {
  const trimmed = (text || '').trim()
  const match = trimmed.match(/^(\/[a-zA-Z0-9_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/)
  if (!match) {
    return { command: null, args: '', raw: trimmed }
  }
  return {
    command: match[1].toLowerCase(),
    args: (match[2] || '').trim(),
    raw: trimmed,
  }
}

async function reply(chatId, text) {
  await sendTelegramMessage(chatId, text, {
    reply_markup: OWNER_KEYBOARD,
  })
}

async function sendLastLeads(chatId) {
  const leads = await getLastLeads(5)
  await reply(chatId, formatSearchResults(leads, 'последние'))
}

async function handleOwnerMessage(chatId, text) {
  const trimmed = (text || '').trim()
  const { command, args, raw } = parseCommand(trimmed)

  if (command === '/start' || command === '/help' || raw === BTN_HELP) {
    await reply(chatId, HELP_TEXT)
    return
  }

  if (command === '/last' || raw === BTN_LAST) {
    await sendLastLeads(chatId)
    return
  }

  if (raw === BTN_SEARCH) {
    await reply(
      chatId,
      'Напишите имя или телефон сообщением, например:\n<code>Анна</code> или <code>8918</code>',
    )
    return
  }

  if (command === '/find') {
    if (!args) {
      await reply(
        chatId,
        'Укажите запрос после команды или просто напишите имя/телефон.',
      )
      return
    }
    const leads = await searchLeads(args)
    await reply(chatId, formatSearchResults(leads, args))
    return
  }

  if (trimmed && !command) {
    const leads = await searchLeads(trimmed)
    await reply(chatId, formatSearchResults(leads, trimmed))
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

    await handleOwnerMessage(chatId, message.text || '')
    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return res.status(200).json({ ok: true })
  }
}
