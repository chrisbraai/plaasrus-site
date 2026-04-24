// Improvement 1: Sonner wrapped with Yielde-specific defaults — `theme="system"` follows the
// user's prefers-color-scheme, `closeButton` per §8.9 dismiss-by-click, `duration` for success
// matches the 4000ms auto-dismiss spec and error defaults to Infinity so errors stick.
// Improvement 2: `toastOptions.classNames` maps every Sonner slot to semantic tokens — no
// Sonner default styling leaks through; zero-radius enforced globally via globals.css `*`
// selector, plus explicit `rounded-none` classes here as belt-and-braces.
// Template: none — spec build using `sonner`.

'use client';

import { Toaster as SonnerToaster, toast } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      // Default for success — error toasts override to Infinity at the call site.
      duration={4000}
      // Sonner's offset defaults to 32px; matches the 24px-from-edge §8.9 spec when including
      // the outer 8px gap between stacked toasts.
      offset={24}
      gap={8}
      theme="system"
      toastOptions={{
        classNames: {
          toast:
            '!rounded-none !border-0 !border-l-[2px] !bg-bg-raised !text-fg !font-sans !shadow-none',
          title: '!font-sans !font-medium !text-body !text-fg',
          description: '!text-body-sm !text-fg-quiet',
          success: '!border-l-[var(--accent)]',
          error: '!border-l-[var(--danger)]',
          // Icon slot intentionally blank — Yielde toast spec does not use iconography.
          icon: '!hidden',
        },
      }}
    />
  );
}

// Re-export the imperative API so consumers can `import { notify } from '@/components/Toast'`
// without reaching into the sonner package and rediscovering its defaults.
export const notify = {
  success: (title: string, description?: string) => toast.success(title, { description }),
  // Errors default to no auto-dismiss per §8.9 ("Errors do not auto-dismiss").
  error: (title: string, description?: string) =>
    toast.error(title, { description, duration: Infinity }),
  info: (title: string, description?: string) => toast(title, { description }),
};
