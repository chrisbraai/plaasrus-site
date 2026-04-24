# Geometry

<!-- YIELDE:START -->
```css
--radius:        0;
--rule-w:        1px;
--rule-w-thick:  2px;
--rule-w-slab:   6px;
--shadow:        none;
```

- **Zero border-radius everywhere**, except buttons (set per project). Enforced globally: `*, *::before, *::after { border-radius: 0 !important; }`.
- `2px` = card accent top-rule. `6px` = section terminator slab and page-top brand bar.
- **No shadows.** Depth is via colour-stop layering, never blur.
<!-- YIELDE:END -->
