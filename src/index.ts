import { useEffect, useRef } from "react"
import type { RefObject } from "react"

export type ClickOutsideEvent = MouseEvent | TouchEvent

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: ClickOutsideEvent) => void,
  enabled = true,
) {
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (!enabled) return

    const listener = (event: ClickOutsideEvent) => {
      const element = ref.current
      if (!element || element.contains(event.target as Node)) return
      handlerRef.current(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [enabled, ref])
}
