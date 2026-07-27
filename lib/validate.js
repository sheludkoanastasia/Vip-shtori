export function normalizePhone(phone) {
  return String(phone ?? '').replace(/\D/g, '')
}

export function validateLead({ name, phone }) {
  const trimmedName = String(name ?? '').trim().slice(0, 80)
  const rawPhone = String(phone ?? '').trim().slice(0, 32)
  const phoneDigits = normalizePhone(rawPhone)

  if (trimmedName.length < 2) {
    return { ok: false, error: 'Укажите имя (минимум 2 символа)' }
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return { ok: false, error: 'Укажите корректный номер телефона' }
  }

  return {
    ok: true,
    name: trimmedName,
    phone: rawPhone,
    phoneDigits,
  }
}
