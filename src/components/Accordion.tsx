// Improvement 1: Wraps @radix-ui/react-accordion directly — bypasses shadcn/accordion which
// applies rounded defaults that violate §8.8 zero-radius. Radix is headless: the design-system
// classes applied here are the entire visual contract.
// Improvement 2: Trigger left-border upgrades from 2px --rule to 6px --accent on open state,
// driven by Radix's `data-state="open"` attribute — no JS state, no animation lib. Matches
// §8.8 "slab variant applied vertically" requirement with a single Tailwind line.
// Template: none — spec build (knowledge/design-system/07-components.md §8.8).

'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b border-rule last:border-b-0', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Trigger bar — §8.8 spec
        'group flex w-full items-center justify-between',
        'h-[56px] px-[24px] bg-bg-raised text-left',
        'font-sans font-medium text-body text-fg',
        // Left-border slab: 2px --rule by default, 6px --accent when open (data-state).
        'border-l-[2px] border-l-rule data-[state=open]:border-l-[6px] data-[state=open]:border-l-accent',
        // Instant --dur-fast transition on the border — no animation library.
        'transition-[border-left-width,border-left-color] duration-[120ms] motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {children}
      <ArrowUpRight
        size={16}
        aria-hidden="true"
        className="shrink-0 transition-transform duration-[120ms] motion-reduce:transition-none group-data-[state=open]:rotate-90"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // Radix sets --radix-accordion-content-height — use grid-template-rows: 0fr ↔ 1fr
    // animation per §8.8 (zero JS measurement needed).
    className={cn(
      'overflow-hidden text-body-sm text-fg-muted',
      'data-[state=open]:animate-none',
      'data-[state=closed]:animate-none',
    )}
    {...props}
  >
    <div className={cn('px-[24px] py-[16px] bg-bg', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';
