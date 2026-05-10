---
name: clone-style
description: Styling conventions for this Next.js + Tailwind 4 + Ant Design project. Use this skill when writing or editing any UI component, page, or styling. Triggers on phrases like "style this", "add styling", "create page", "create component", "build UI", "/clone-style", or any UI/CSS/Tailwind/SCSS work in this repo.
---

# clone-style — Project styling rules

Apply these rules to **every** UI change. Order matters: try Tailwind first, then SCSS module, never raw `<style>`.

## 1. Styling priority

1. **Tailwind utility classes** — default for layout, spacing, sizing, flex, grid, typography, simple hover.
2. **CSS Modules (`.module.scss`)** — only when Tailwind cannot express it (deep antd `:global(.ant-...)` selectors, complex `&:hover` chains, keyframes, `:has()` cascades).
3. **Inline `style={{ ... }}`** — only for *dynamic* values that depend on JS (gradient computed at runtime, computed dimensions, theme-driven colors via CSS vars).
4. **Never** use a raw `<style>{`...`}</style>` JSX tag. If global CSS is required, put it in `globals.css` or a `.module.scss` file.

## 2. Colors must use CSS variables

The project supports light + dark themes via CSS custom properties defined in `src/app/globals.css`. **Never hardcode hex/rgb colors for theme-aware surfaces.** Use the variables below.

| Variable | Use for |
|---|---|
| `--color-bg` | App-level background |
| `--color-bg-secondary` | Cards, panels, modals, top nav |
| `--color-bg-tertiary` | Hover states, input fields, chips |
| `--color-text` | Primary text |
| `--color-text-secondary` | Secondary text, icons |
| `--color-text-muted` | Muted/meta text, placeholders |
| `--color-text-placeholder` | Input placeholders |
| `--color-border` | Borders, dividers |
| `--color-border-light` | Subtle borders |
| `--color-primary` / `--color-primary-dark` / `--color-primary-light` / `--color-primary-bg` / `--color-on-primary` | Brand actions |
| `--color-success` / `--color-warning` / `--color-error` | Status colors |

```tsx
// good
<div style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }} />

// bad — locks color to one theme
<div style={{ background: "#fafbfc", color: "#1a1a2e" }} />
```

Brand-specific gradients/decorations that must look the same in both themes (logo, avatar gradients) may use literal colors via `gradientBg([...])`.

## 3. Tailwind: arbitrary values + `!` important for antd overrides

Antd injects its own classes; sometimes Tailwind utilities are outranked. The project convention is the **`!` prefix** form (`!h-10`, `!w-10`, `!rounded-full`) — keep using it when overriding antd, even though Tailwind v4 also supports `class!` suffix. Match existing files.

```tsx
<Button className="!h-10 !w-10 !rounded-[10px] !p-0" />
```

For one-off pixel values use Tailwind's arbitrary-value syntax: `!h-[72px]`, `!w-[min(380px,calc(100vw-16px))]`, `!right-[344px]`.

Responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoints. Mobile-first.

## 4. SCSS module pattern

Create `<Component>.module.scss` next to the component. Import as `styles`. Wrap antd internals with `:global(...)`.

```scss
// PostHeader.module.scss
.moreBtn {
  &:hover {
    background: var(--color-bg-tertiary) !important;
  }
}

.confirmModal {
  :global(.ant-modal-content) {
    background: var(--color-bg-secondary) !important;
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }
}
```

```tsx
import styles from "./PostHeader.module.scss";

<Button className={`${styles.moreBtn} !h-9 !w-9`} />
<Modal rootClassName={styles.confirmModal} />
```

Reuse modules across siblings when the rule is generic (e.g. `topnav/NavBtn.module.scss` exposes `.hoverBg` used by ChatNavBtn / NotificationNavBtn / ThemeNavBtn / NavBtn).

## 5. Modals — use the shared `DarkModal` + `ConfirmModal`

- `src/shared/components/modal/DarkModal.tsx` — base. Accepts `bg` and `borderColor` props that flow into `--dark-modal-bg` / `--dark-modal-border` CSS vars used by its scss module.
- `src/shared/components/modal/ConfirmModal.tsx` — theme-aware confirm dialog (icon, title, description, ok/cancel). Use this for any destructive action prompt — **do not use `Modal.confirm` from antd directly**, since it bypasses theme styling.

```tsx
<ConfirmModal
  open={open}
  title="Remove this post?"
  description="This will be permanently removed."
  okText="Remove"
  danger
  onOk={onRemove}
  onCancel={() => setOpen(false)}
/>
```

For full custom dialogs:

```tsx
<DarkModal open={...} bg="var(--color-bg-secondary)" borderColor="var(--color-border)" />
```

## 6. Components: prefer Ant Design over raw HTML

For new pages and components, reach for `antd` first:

| Need | Use |
|---|---|
| Button | `Button` (`type="text"` / `"primary"`, `shape="circle"`) |
| Layout row/col | `Flex`, `Row`/`Col` |
| Text | `Typography.Text` / `Typography.Title` |
| Form input | `Input`, `Input.TextArea`, `Input.Search` |
| Dropdowns | `Dropdown` with `menu={{ items, style }}` (but see §7) |
| Badge / Tag | `Badge`, `Tag` |
| Avatar | `Avatar` |
| Modal / Popover / Tooltip | `Modal` (via `DarkModal`/`ConfirmModal`), `Popover`, `Tooltip` |
| Upload | `Upload`, `Upload.Dragger` |

Use raw `<div>`, `<span>`, `<button>` only when antd has no equivalent or the element is a pure visual primitive (decorative dot, gradient background, absolute-positioned overlay).

Icons: `<Icon name="..." />` from `@/shared/components/Icon` (Material Symbols Rounded). Pass `color="var(--color-text-secondary)"` etc.

## 7. Header dropdowns — bypass antd `Dropdown` for viewport-anchored panels

Antd `Dropdown` anchors to its trigger. On narrow viewports, panels anchored to a far-right trigger overflow off-screen. Pattern used by ChatNavBtn / NotificationNavBtn:

- Manage `open` state manually.
- Render the panel as a sibling `<div>` with `!fixed !top-14 !right-2 sm:!right-4 lg:!right-8 !z-[1000]`.
- Cap panel width: `!w-[min(360px,calc(100vw-16px))]`.
- Add a `useEffect` for `mousedown` outside + `Escape` to close.

## 8. Responsive sidebars on Feed/Chat layouts

- Hide left sidebar `<lg`, hide right sidebar `<xl`. Center column uses `!mx-auto !max-w-[680px]` below lg, full width at lg+.
- Chat boxes: `right-2` mobile, `sm:right-6`, `xl:right-[344px]` (clears right sidebar). Cap width `calc(100vw-16px)` mobile, `328px` `sm+`. Hide siblings beyond first on mobile via `[&>*:nth-child(n+2)]:!hidden sm:[&>*:nth-child(n+2)]:!flex`.

## 9. Quick checklist before finishing a UI change

- [ ] No hardcoded colors for theme surfaces — used `var(--color-*)`.
- [ ] No `<style>{...}</style>` JSX tags introduced. SCSS module if Tailwind insufficient.
- [ ] Antd component used where one exists.
- [ ] Tested visually in both light and dark modes (toggle via theme button).
- [ ] Mobile / tablet / desktop checked at `sm` / `lg` / `xl` breakpoints.
- [ ] `npx tsc --noEmit` clean for touched files.
