import { useCallback, useRef } from 'react'

const THRESHOLD = 50

export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const startX = useRef(null)
  const startY = useRef(null)
  const active = useRef(false)

  const onPointerDown = useCallback((event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    active.current = true
    startX.current = event.clientX
    startY.current = event.clientY
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }, [])

  const finish = useCallback(
    (event) => {
      if (!active.current || startX.current == null) return

      const dx = event.clientX - startX.current
      const dy = event.clientY - startY.current

      active.current = false
      startX.current = null
      startY.current = null

      if (Math.abs(dx) < THRESHOLD) return
      if (Math.abs(dx) < Math.abs(dy)) return

      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    },
    [onSwipeLeft, onSwipeRight],
  )

  const onPointerCancel = useCallback(() => {
    active.current = false
    startX.current = null
    startY.current = null
  }, [])

  return {
    onPointerDown,
    onPointerUp: finish,
    onPointerCancel,
  }
}
