// Improvement 1: Semantic HTML table elements (table/thead/tbody/tr/th/td) with forwardRef on
// each — every component accepts a ref for animation hooks and keeps the underlying element
// type intact for screen readers. No ARIA grid pattern; native table semantics are sufficient.
// Improvement 2: TableCell exposes a `numeric` boolean that swaps text-align to right AND
// switches the font to --font-mono per §8.10 — right-aligned numeric columns are the single
// permitted non-display use of Geist Mono, enforced through the type boundary.
// Template: none — spec build (knowledge/design-system/07-components.md §8.10).

import * as React from 'react';
import { cn } from '@/lib/utils';

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn('w-full border-collapse text-body-sm text-fg', className)}
        {...props}
      />
    </div>
  ),
);
Table.displayName = 'Table';

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-bg-raised border-b border-rule-strong',
      '[&_th]:px-[16px] [&_th]:py-[12px]',
      '[&_th]:font-sans [&_th]:font-medium [&_th]:text-body-xs [&_th]:tracking-micro [&_th]:uppercase [&_th]:text-left',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      // Alternating --bg / --bg-subtle per §8.10.
      '[&_tr:nth-child(even)]:bg-bg-subtle',
      '[&_tr]:border-b [&_tr]:border-rule',
      '[&_tr:last-child]:border-b-0',
      className,
    )}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => <tr ref={ref} className={className} {...props} />);
TableRow.displayName = 'TableRow';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** When true, right-aligns content and switches to --font-mono per §8.10. */
  numeric?: boolean;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, numeric = false, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'px-[16px] py-[12px] align-middle',
        numeric && 'text-right font-mono text-body-sm',
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';

export const TableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }
>(({ className, numeric = false, ...props }, ref) => (
  <th
    ref={ref}
    scope="col"
    className={cn(numeric && 'text-right', className)}
    {...props}
  />
));
TableHeaderCell.displayName = 'TableHeaderCell';
