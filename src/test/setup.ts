import '@testing-library/jest-dom'

// ─── jsdom gap: IntersectionObserver ─────────────────────────────────────────
// jsdom does not implement IntersectionObserver. Provide a minimal stub so any
// component that creates an observer mounts without "not a constructor" errors.
// Tests that need to assert on observe/disconnect calls should override
// window.IntersectionObserver locally with their own vi.fn() spies.
if (!window.IntersectionObserver) {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: class {
      observe = vi.fn()
      disconnect = vi.fn()
      unobserve = vi.fn()
    },
  })
}

// ─── jsdom gap: matchMedia ────────────────────────────────────────────────────
// jsdom does not implement matchMedia. Default stub returns matches: false
// (no prefers-reduced-motion), which is the correct default for visual tests.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
