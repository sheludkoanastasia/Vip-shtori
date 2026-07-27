const TELEGRAM_API = 'https://api.telegram.org'

export function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) throw new Error('Не задан TELEGRAM_BOT_TOKEN')
  return token
}

export function getOwnerChatId() {
  const chatId = process.env.TELEGRAM_OWNER_CHAT_ID
  if (!chatId) throw new Error('Не задан TELEGRAM_OWNER_CHAT_ID')
  return String(chatId)
}

export async function sendTelegramMessage(chatId, text, extra = {}) {
  const token = getBotToken()
  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...extra,
    }),
  })

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.description || 'Ошибка Telegram sendMessage')
  }
  return data
}

export function formatLeadMessage(lead) {
  const when = lead.created_at
    ? new Date(lead.created_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })
    : 'сейчас'

  return [
    '<b>Новая заявка — Vip шторы</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Время:</b> ${escapeHtml(when)}`,
  ].join('\n')
}

export function formatSearchResults(leads, query) {
  if (!leads.length) {
    return `По запросу «${escapeHtml(query)}» заявок не найдено.`
  }

  const lines = [
    `<b>Найдено: ${leads.length}</b> (запрос: ${escapeHtml(query)})`,
    '',
  ]

  for (const lead of leads.slice(0, 10)) {
    const when = new Date(lead.created_at).toLocaleString('ru-RU', {
      timeZone: 'Europe/Moscow',
    })
    lines.push(
      `• <b>${escapeHtml(lead.name)}</b> — ${escapeHtml(lead.phone)}`,
      `  <i>${escapeHtml(when)}</i>`,
      '',
    )
  }

  if (leads.length > 10) {
    lines.push(`…и ещё ${leads.length - 10}`)
  }

  return lines.join('\n')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
