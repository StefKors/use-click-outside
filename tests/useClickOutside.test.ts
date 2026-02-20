import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import { useClickOutside } from "../src/index"
import type { RefObject } from "react"

function createRef<T>(value: T | null = null): RefObject<T | null> {
  return { current: value }
}

function fireMouseDown(target: EventTarget = document.body) {
  const event = new MouseEvent("mousedown", { bubbles: true })
  Object.defineProperty(event, "target", { value: target })
  document.dispatchEvent(event)
  return event
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("useClickOutside", () => {
  it("does not throw when called with a null ref", () => {
    const ref = createRef<HTMLDivElement>()
    const handler = vi.fn()
    expect(() => {
      renderHook(() => useClickOutside(ref, handler))
    }).not.toThrow()
  })

  it("does not call handler when clicking inside the ref element", () => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    const ref = createRef<HTMLDivElement>(element)
    const handler = vi.fn()

    renderHook(() => useClickOutside(ref, handler))

    fireMouseDown(element)
    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it("calls handler when clicking outside the ref element", () => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    const ref = createRef<HTMLDivElement>(element)
    const handler = vi.fn()

    renderHook(() => useClickOutside(ref, handler))

    const outside = document.createElement("span")
    document.body.appendChild(outside)
    fireMouseDown(outside)
    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
    document.body.removeChild(outside)
  })

  it("does not call handler when enabled is false", () => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    const ref = createRef<HTMLDivElement>(element)
    const handler = vi.fn()

    renderHook(() => useClickOutside(ref, handler, false))

    fireMouseDown(document.body)
    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(element)
  })

  it("keeps handler ref current when handler changes", () => {
    const element = document.createElement("div")
    document.body.appendChild(element)
    const ref = createRef<HTMLDivElement>(element)
    const firstHandler = vi.fn()
    const secondHandler = vi.fn()

    const { rerender } = renderHook(
      ({ handler }) => useClickOutside(ref, handler),
      { initialProps: { handler: firstHandler } },
    )

    rerender({ handler: secondHandler })

    const outside = document.createElement("span")
    document.body.appendChild(outside)
    fireMouseDown(outside)

    expect(firstHandler).not.toHaveBeenCalled()
    expect(secondHandler).toHaveBeenCalledTimes(1)

    document.body.removeChild(element)
    document.body.removeChild(outside)
  })

  it("removes listeners on unmount", () => {
    const removeSpy = vi.spyOn(document, "removeEventListener")

    const element = document.createElement("div")
    document.body.appendChild(element)
    const ref = createRef<HTMLDivElement>(element)
    const handler = vi.fn()

    const { unmount } = renderHook(() => useClickOutside(ref, handler))
    unmount()

    const removedTypes = removeSpy.mock.calls.map((call) => call[0])
    expect(removedTypes).toContain("mousedown")
    expect(removedTypes).toContain("touchstart")

    document.body.removeChild(element)
  })
})
