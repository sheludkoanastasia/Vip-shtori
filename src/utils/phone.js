/** Только цифры из строки. */
export function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '')
}

/**
 * Цифры номера с ведущей 7 (макс. 11).
 * Пусто → ''.
 */
export function toRuDigits(value) {
  let digits = digitsOnly(value)
  if (!digits) return ''

  if (digits.startsWith('8')) {
    digits = `7${digits.slice(1)}`
  } else if (digits.startsWith('9')) {
    digits = `7${digits}`
  } else if (!digits.startsWith('7')) {
    digits = `7${digits}`
  }

  return digits.slice(0, 11)
}

/** Маска: +7(918)-126-76-33 */
export function formatRuPhoneFromDigits(digits) {
  if (!digits) return ''

  const normalized = digits.startsWith('7') ? digits.slice(0, 11) : toRuDigits(digits)
  if (!normalized) return ''

  const local = normalized.slice(1)
  let result = '+7'
  if (!local.length) return result

  result += `(${local.slice(0, 3)}`
  if (local.length < 3) return result

  result += ')'
  if (local.length === 3) return result

  result += `-${local.slice(3, 6)}`
  if (local.length <= 6) return result

  result += `-${local.slice(6, 8)}`
  if (local.length <= 8) return result

  result += `-${local.slice(8, 10)}`
  return result
}

export function formatRuPhoneMask(value) {
  return formatRuPhoneFromDigits(toRuDigits(value))
}

/** Позиция курсора после N-й цифры в отформатированной строке. */
export function caretPosAfterDigits(formatted, digitCount) {
  if (digitCount <= 0) {
    return formatted.startsWith('+') ? 1 : 0
  }

  let seen = 0
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      seen += 1
      if (seen >= digitCount) return i + 1
    }
  }
  return formatted.length
}

/**
 * Ввод с умным стиранием маски:
 * Backspace на скобке/дефисе удаляет предыдущую цифру.
 */
export function applyRuPhoneInput(prevValue, nextValue, caret) {
  if (!digitsOnly(nextValue)) {
    return { value: '', caret: 0 }
  }

  const prevDigits = toRuDigits(prevValue)
  const nextDigits = toRuDigits(nextValue)
  const shortened = nextValue.length < prevValue.length
  const digitsBeforeCaret = digitsOnly(nextValue.slice(0, caret)).length

  let digits = nextDigits
  let targetDigitCount = digitsBeforeCaret

  // Стёрли только символ маски — убираем цифру слева от курсора
  if (shortened && nextDigits.length >= prevDigits.length && prevDigits.length > 0) {
    const removeAt = Math.max(0, digitsBeforeCaret - 1)
    digits = `${prevDigits.slice(0, removeAt)}${prevDigits.slice(removeAt + 1)}`
    targetDigitCount = removeAt
  }

  if (!digits) {
    return { value: '', caret: 0 }
  }

  if (digits === '7') {
    return { value: '+7', caret: 2 }
  }

  digits = toRuDigits(digits)
  const value = formatRuPhoneFromDigits(digits)
  targetDigitCount = Math.min(Math.max(targetDigitCount, 0), digits.length)

  return {
    value,
    caret: caretPosAfterDigits(value, targetDigitCount),
  }
}

export function isCompleteRuPhone(phone) {
  return /^7\d{10}$/.test(toRuDigits(phone))
}

export function normalizeRuPhoneDigits(phone) {
  return toRuDigits(phone)
}
