# Collected component rules

Every component in `/design-system/collected` must meet these rules. Where one conflicts with the original site, the rule wins, and the difference goes in
the entry's `substitutions`.

## 1. Every element has an intention

Nothing goes on screen just because it's available. For each label, tag, or line, ask what the
reader does with it. If the answer is nothing, remove it.

## 2. Light and dark modes

- Every component takes `theme?: "light" | "dark"`, and it defaults to the original's mode.
- Colours are CSS custom properties on the root, redefined under `[data-theme="dark"]`. Nothing
  else changes between modes: not layout, motion, or type.
- The component stays transparent. The surface behind it belongs to the frame or preview.
- The docs page has one example called `Light` and one called `Dark`, each on a matching surface.
- Don't simply invert. Soften saturated accents on dark, and keep the same hue in glows and
  gradients.
- The mode the original doesn't have is listed in `substitutions`.

## 3. Typography

Type must be easy to read and carry visible hierarchy, even if the original's is lighter.

| Text | Weight | Size | Line height |
| --- | --- | --- | --- |
| Section heading | 500 | 24–36px | 1.15–1.25 |
| Supporting heading | 400, quieter colour | Same as the heading | Same as the heading |
| Lead sentence | 500 | Same as its body | Same as its body |
| Body copy | 400 | 16–20px | 1.4–1.5 |
| Buttons and links | 500 | 14–16px | Set by the control |

- Never go below weight 400. If a free font looks thin at 400, use a different font.
- Set hierarchy with weight and colour first, then size.
- Quiet text must keep at least 4.5:1 contrast on its surface, in both modes.
- Sizes step down at narrower widths, and body copy never goes below 16px.
- Text inside a mock product preview, such as a fake app window, is an illustration and can be
  smaller.

## 4. Stay faithful everywhere else

- Geometry, spacing, states, motion, and behaviour match the original, measured rather than
  guessed.
- Third-party images, logos, icons, and paid fonts aren't copied. Use original or permitted assets and free fonts.
- No UI kits or new dependencies.
- Honour `prefers-reduced-motion`, and keep controls reachable by keyboard.

## 5. Motion

Motion can't look like a glitch. If a state change would show something awkward, such as text
visibly rotating, hide the change instead of animating it.

## 6. Docs page

- The page runs in this order, and nothing else goes on it:
  1. Name, description, then pills for the site (linked) and capture date.
  2. Tabs, one per version, with `Code` at the far right.
  3. The preview of the selected version.
  4. An accordion, closed by default: Installation, Usage, Composition, API reference,
     Differences from the original, Source.
- The description is quiet: 15px, tight line height, secondary colour.
- Keep rebuild file links and contributor credit in Source; leave out the breadcrumb, pager, and "on this page" list.
- Each entry has an `icon`: a small line drawing of the component's shape, added to
  `components/design-system/docs/CollectedIcons.tsx` and shown on its overview card.
- `substitutions` lists every deviation, and `fidelity` reports the real numbers. Compare layout
  with text and images hidden, and say what a change in type does to the result.

## 7. Before calling it done

- Screenshot both modes at desktop and phone widths, and look at them.
- `npm run lint && npm run build` pass.
