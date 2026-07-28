export function normalizePhone(phone) {
  return String(phone ?? '').replace(/\D/g, '')
}

/** Российский номер → цифры с ведущей 7 (8… → 7…). */
export function normalizeRuPhoneDigits(phone) {
  let digits = normalizePhone(phone)

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (digits.length === 10 && digits.startsWith('9')) {
    digits = `7${digits}`
  }

  return digits.slice(0, 11)
}

export function formatRuPhoneMask(phone) {
  const digits = normalizeRuPhoneDigits(phone)
  if (!digits.startsWith('7') || digits.length !== 11) {
    return String(phone ?? '').trim()
  }

  const local = digits.slice(1)
  return `+7(${local.slice(0, 3)})-${local.slice(3, 6)}-${local.slice(6, 8)}-${local.slice(8, 10)}`
}

export function validateLead({ name, phone }) {
  const trimmedName = String(name ?? '').trim().slice(0, 80)
  const phoneDigits = normalizeRuPhoneDigits(phone)

  if (trimmedName.length < 2) {
    return { ok: false, error: 'Укажите имя (минимум 2 символа)' }
  }

  if (!/^7\d{10}$/.test(phoneDigits)) {
    return {
      ok: false,
      error: 'Укажите российский номер в формате +7(9XX)-XXX-XX-XX',
    }
  }

  return {
    ok: true,
    name: trimmedName,
    phone: formatRuPhoneMask(phoneDigits),
    phoneDigits,
  }
}
