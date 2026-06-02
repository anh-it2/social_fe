# Login Page Implementation Guide

---

## Section 1: Project Setup — SCSS + Tailwind CSS 4 + Dark/Light Mode

### 1.1 What's Already Installed

```
next@16.2.2          # App Router, React 19
tailwindcss@4        # Tailwind CSS v4 (CSS-first config)
@tailwindcss/postcss # PostCSS plugin for Tailwind 4
sass                 # SCSS compiler (just installed)
antd@6               # Ant Design component library
```

### 1.2 Install `next-themes` (Dark/Light Mode Provider)

```bash
npm install next-themes
```

`next-themes` handles theme switching (dark/light/system) with zero flash on page load.
It works by toggling a `class` or `data-*` attribute on `<html>`.

---

### 1.3 Configure `globals.css` — Tailwind 4 + Dark Mode + Design Tokens

Replace the contents of `src/app/globals.css`:

```css
/* ================================================================
   1. TAILWIND CSS 4 IMPORT
   ================================================================ */
@import "tailwindcss";

/* ================================================================
   2. DARK MODE — class-based strategy (used by next-themes)
   In Tailwind 4, there is NO tailwind.config.js for dark mode.
   We use @custom-variant to define the `dark:` prefix behavior.
   ================================================================ */
@custom-variant dark (&:where(.dark, .dark *));

/* ================================================================
   3. DESIGN TOKENS — CSS Custom Properties
   These are your single source of truth for all colors, spacing,
   typography, etc. Dark mode overrides the same variable names.
   ================================================================ */

/* ---- Light Mode (default) ---- */
:root {
  /* Brand */
  --color-primary: #1877f2;
  --color-primary-dark: #0d5bc4;
  --color-primary-light: #42a5f5;
  --color-primary-bg: #e6f4ff;

  /* Semantic */
  --color-success: #52c41a;
  --color-warning: #faad14;
  --color-error: #ff4d4f;

  /* Surfaces */
  --color-bg: #ffffff;
  --color-bg-secondary: #fafbfc;
  --color-bg-tertiary: #f0f2f5;

  /* Text */
  --color-text: #1a1a2e;
  --color-text-secondary: #374151;
  --color-text-muted: #6b7280;
  --color-text-placeholder: #9ca3af;

  /* Borders */
  --color-border: #e5e7eb;
  --color-border-light: #f0f0f0;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Typography */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "Geist Mono", monospace;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

/* ---- Dark Mode ---- */
.dark {
  --color-primary: #4096ff;
  --color-primary-dark: #1877f2;
  --color-primary-light: #69b1ff;
  --color-primary-bg: #111a2c;

  --color-success: #73d13d;
  --color-warning: #ffc53d;
  --color-error: #ff7875;

  --color-bg: #0a0a0a;
  --color-bg-secondary: #141414;
  --color-bg-tertiary: #1f1f1f;

  --color-text: #f0f0f0;
  --color-text-secondary: #d4d4d8;
  --color-text-muted: #a1a1aa;
  --color-text-placeholder: #71717a;

  --color-border: #2e2e2e;
  --color-border-light: #252525;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
}

/* ================================================================
   4. TAILWIND THEME — map CSS variables to Tailwind utilities
   This lets you write: bg-primary, text-muted, border-default, etc.
   ================================================================ */
@theme inline {
  --color-primary: var(--color-primary);
  --color-primary-dark: var(--color-primary-dark);
  --color-primary-light: var(--color-primary-light);
  --color-primary-bg: var(--color-primary-bg);

  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-error: var(--color-error);

  --color-surface: var(--color-bg);
  --color-surface-secondary: var(--color-bg-secondary);
  --color-surface-tertiary: var(--color-bg-tertiary);

  --color-foreground: var(--color-text);
  --color-foreground-secondary: var(--color-text-secondary);
  --color-foreground-muted: var(--color-text-muted);
  --color-foreground-placeholder: var(--color-text-placeholder);

  --color-border-default: var(--color-border);
  --color-border-light: var(--color-border-light);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}

/* ================================================================
   5. BASE RESET
   ================================================================ */
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

/* Smooth color transitions when theme changes */
*,
*::before,
*::after {
  transition: background-color var(--transition-base),
              border-color var(--transition-base),
              color var(--transition-base);
}
```

---

### 1.4 Configure `layout.tsx` — Theme Provider + Fonts

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit - Log in or sign up",
  description: "Connect with friends and the world around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inter font (all weights used in design) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
        {/* Material Symbols for icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"       
          defaultTheme="system"   
          enableSystem             
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

> **Important:** `ThemeProvider` uses React Context, which requires a Client Component boundary.
> Create `src/app/providers.tsx` if you get a Server Component error:

```tsx
// src/app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

Then in `layout.tsx`, wrap `{children}` with `<Providers>`:

```tsx
import { Providers } from "./providers";

// ... in the return:
<body>
  <Providers>{children}</Providers>
</body>
```

---

### 1.5 Theme Toggle Component (Reusable)

Create `src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-secondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
```

---

### 1.6 How to Use Dark Mode in Your Code

**With Tailwind classes:**
```tsx
<div className="bg-surface text-foreground dark:bg-surface-tertiary">
  <p className="text-foreground-muted dark:text-foreground-secondary">...</p>
</div>
```

**With SCSS (via CSS variables — auto-switches):**
```scss
.card {
  background: var(--color-bg);           // auto light/dark
  border: 1px solid var(--color-border); // auto light/dark
  color: var(--color-text);              // auto light/dark
}
```

> Because all tokens use CSS variables, SCSS components automatically
> respond to dark mode. No need for `@media (prefers-color-scheme)` or
> `.dark &` selectors — just use the variables.

---

### 1.7 File Structure Overview

```
src/
├── app/
│   ├── globals.css              # Tailwind 4 + tokens + dark mode
│   ├── layout.tsx               # Root layout with ThemeProvider
│   ├── providers.tsx            # "use client" ThemeProvider wrapper
│   ├── page.tsx                 # Home page
│   └── login/
│       ├── page.tsx             # Login page component
│       └── login.module.scss    # Login page SCSS module
├── components/
│   └── ThemeToggle.tsx          # Dark/light toggle button
```

---

---

## Section 2: Implement the Creative Login Page

### 2.1 Create `src/app/login/login.module.scss`

```scss
// ============================================================
// VARIABLES (local to this file, supplement CSS tokens)
// ============================================================
$gradient-start: #1a1a4e;
$gradient-mid: #2d1b69;
$fb-blue: #1877f2;
$fb-blue-light: #42a5f5;
$fb-blue-dark: #0d5bc4;
$white: #ffffff;
$radius: 10px;
$input-height: 48px;
$transition: all 0.2s ease;

// ============================================================
// PAGE — full-screen split layout
// ============================================================
.page {
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

// ============================================================
// LEFT HERO PANEL — 58%, gradient background
// ============================================================
.heroPanel {
  position: relative;
  width: 58%;
  min-height: 100vh;
  background: linear-gradient(
    160deg,
    $gradient-start 0%,
    $gradient-mid 30%,
    $fb-blue 70%,
    $fb-blue-light 100%
  );
  overflow: hidden;
  display: flex;
  align-items: center;

  @media (max-width: 1024px) {
    display: none;
  }
}

// ---- Decorative transparent blobs ----
.blob {
  position: absolute;
  border-radius: 50%;
  background: rgba($white, 0.05);
  pointer-events: none;

  &1 { width: 500px; height: 500px; top: -80px; left: -100px; }
  &2 { width: 350px; height: 350px; bottom: -20px; right: -40px; }
  &3 { width: 200px; height: 200px; top: 100px; right: 200px; background: rgba($white, 0.03); }
}

// ---- Dot grid overlay ----
.dotGrid {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  pointer-events: none;
  background-image: radial-gradient(circle, $white 1.5px, transparent 1.5px);
  background-size: 80px 80px;
  background-position: 80px 120px;
}

// ---- Floating avatar bubbles ----
.avatar {
  position: absolute;
  border-radius: 50%;
  background: rgba($white, 0.08);
  border: 2px solid rgba($white, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba($white, 0.5);

  // Gentle floating animation
  animation: float 6s ease-in-out infinite;

  &1 { width: 56px; height: 56px; top: 15%; right: 35%; animation-delay: 0s; }
  &2 { width: 44px; height: 44px; top: 23%; right: 22%; animation-delay: 1s; }
  &3 { width: 64px; height: 64px; top: 11%; right: 12%; animation-delay: 2s; }
  &4 { width: 40px; height: 40px; top: 38%; right: 25%; animation-delay: 3s; }
  &5 { width: 50px; height: 50px; top: 49%; right: 15%; animation-delay: 4s; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// ---- Connection lines ----
.line {
  position: absolute;
  height: 1px;
  background: rgba($white, 0.07);
  pointer-events: none;

  &1 { width: 80px; top: 19%; right: 22%; }
  &2 { width: 60px; top: 27%; right: 13%; }
  &3 { width: 70px; top: 41%; right: 17%; }
}

// ---- Brand content ----
.brandContent {
  position: relative;
  z-index: 1;
  padding: 0 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 620px;
}

.logoRow {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logoIcon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: $fb-blue;
    font-size: 30px;
    font-weight: 800;
  }
}

.logoText {
  color: $white;
  font-size: 36px;
  font-weight: 700;
}

.heroTitle {
  color: $white;
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
}

.heroSubtitle {
  color: rgba($white, 0.8);
  font-size: 18px;
  line-height: 1.6;
  max-width: 520px;
}

.statsRow {
  display: flex;
  gap: 40px;
}

.statValue {
  color: $white;
  font-size: 28px;
  font-weight: 700;
}

.statLabel {
  color: rgba($white, 0.6);
  font-size: 13px;
}

// ============================================================
// RIGHT LOGIN PANEL — 42%, light bg
// ============================================================
.loginPanel {
  width: 42%;
  min-height: 100vh;
  background: var(--color-bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 80px;
  position: relative;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 40px 24px;
  }
}

.formContainer {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

// ---- Welcome heading ----
.welcomeTitle {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.welcomeSubtitle {
  font-size: 15px;
  color: var(--color-text-muted);
}

// ---- Form fields ----
.formFields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fieldGroup {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fieldLabel {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.fieldLabelRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgotLink {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  &:hover { text-decoration: underline; }
}

// ---- Input wrapper ----
.inputWrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: $input-height;
  padding: 0 16px;
  border-radius: $radius;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  transition: $transition;

  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba($fb-blue, 0.1);
  }

  .icon {
    color: var(--color-text-placeholder);
    font-size: 20px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: var(--color-text);
    font-family: inherit;

    &::placeholder {
      color: var(--color-text-placeholder);
    }
  }

  .eyeToggle {
    color: var(--color-text-placeholder);
    font-size: 20px;
    cursor: pointer;
    flex-shrink: 0;
    &:hover { color: var(--color-text-secondary); }
  }
}

// ---- Remember me ----
.rememberRow {
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--color-primary);
    cursor: pointer;
  }

  label {
    font-size: 13px;
    color: var(--color-text-muted);
    cursor: pointer;
  }
}

// ---- Actions ----
.actionsBlock {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.signInButton {
  width: 100%;
  height: $input-height;
  border: none;
  border-radius: $radius;
  background: linear-gradient(180deg, $fb-blue, $fb-blue-dark);
  color: $white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: $transition;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($fb-blue, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
}

// ---- Divider ("or") ----
.dividerRow {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dividerLine {
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.dividerText {
  font-size: 13px;
  color: var(--color-text-placeholder);
}

// ---- Social buttons ----
.socialRow {
  display: flex;
  gap: 12px;
}

.socialButton {
  flex: 1;
  height: $input-height;
  border-radius: $radius;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: $transition;
  font-family: inherit;

  &:hover {
    border-color: var(--color-text-placeholder);
    background: var(--color-bg-secondary);
  }

  .socialIcon {
    font-size: 18px;
    font-weight: 700;
  }

  .socialLabel {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-secondary);
  }
}

// ---- Sign-up link ----
.signupRow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  span {
    font-size: 14px;
    color: var(--color-text-muted);
  }

  a {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}

// ---- Footer ----
.footer {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 11px;
  color: var(--color-text-placeholder);
  padding: 0 40px;
}

// ---- Theme toggle position ----
.themeToggle {
  position: absolute;
  top: 24px;
  right: 24px;
}
```

---

### 2.2 Create `src/app/login/page.tsx`

```tsx
import styles from "./login.module.scss";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      {/* ============= LEFT HERO PANEL ============= */}
      <div className={styles.heroPanel}>
        {/* Decorative blobs */}
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />

        {/* Dot grid */}
        <div className={styles.dotGrid} />

        {/* Floating avatars */}
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={`${styles.avatar} ${styles[`avatar${n}`]}`}>
            <span className="material-symbols-rounded" style={{ fontSize: n === 3 ? 32 : n === 2 || n === 4 ? 20 : 24 }}>
              person
            </span>
          </div>
        ))}

        {/* Connection lines */}
        <div className={`${styles.line} ${styles.line1}`} />
        <div className={`${styles.line} ${styles.line2}`} />
        <div className={`${styles.line} ${styles.line3}`} />

        {/* Brand content */}
        <div className={styles.brandContent}>
          <div className={styles.logoRow}>
            <div className={styles.logoIcon}>
              <span>f</span>
            </div>
            <span className={styles.logoText}>orbit</span>
          </div>

          <h1 className={styles.heroTitle}>
            Connect with your
            <br />
            world, your way.
          </h1>

          <p className={styles.heroSubtitle}>
            Join billions of people who use Orbit to share ideas, find
            communities, and grow closer to the people who matter most.
          </p>

          <div className={styles.statsRow}>
            {[
              { value: "2.9B+", label: "Monthly users" },
              { value: "200M+", label: "Communities" },
              { value: "100B+", label: "Messages daily" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============= RIGHT LOGIN PANEL ============= */}
      <div className={styles.loginPanel}>
        {/* Theme toggle */}
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>

        <div className={styles.formContainer}>
          {/* Welcome */}
          <div>
            <h2 className={styles.welcomeTitle}>Welcome back</h2>
            <p className={styles.welcomeSubtitle}>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <div className={styles.formFields}>
            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Email address</label>
              <div className={styles.inputWrapper}>
                <span className={`material-symbols-rounded ${styles.icon}`}>
                  mail
                </span>
                <input type="email" placeholder="name@example.com" />
              </div>
            </div>

            {/* Password */}
            <div className={styles.fieldGroup}>
              <div className={styles.fieldLabelRow}>
                <label className={styles.fieldLabel}>Password</label>
                <a href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </a>
              </div>
              <div className={styles.inputWrapper}>
                <span className={`material-symbols-rounded ${styles.icon}`}>
                  lock
                </span>
                <input type="password" placeholder="Enter your password" />
                <span
                  className={`material-symbols-rounded ${styles.eyeToggle}`}
                >
                  visibility_off
                </span>
              </div>
            </div>

            {/* Remember me */}
            <div className={styles.rememberRow}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me for 30 days</label>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actionsBlock}>
            <button className={styles.signInButton}>Sign in</button>

            <div className={styles.dividerRow}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>or</span>
              <div className={styles.dividerLine} />
            </div>

            <div className={styles.socialRow}>
              <button className={styles.socialButton}>
                <span
                  className={styles.socialIcon}
                  style={{ color: "#4285f4" }}
                >
                  G
                </span>
                <span className={styles.socialLabel}>Google</span>
              </button>
              <button className={styles.socialButton}>
                <span
                  className="material-symbols-rounded"
                  style={{ fontSize: 20 }}
                >
                  laptop_mac
                </span>
                <span className={styles.socialLabel}>Apple</span>
              </button>
            </div>
          </div>

          {/* Sign up */}
          <div className={styles.signupRow}>
            <span>Don&apos;t have an account?</span>
            <a href="/register">Sign up for free</a>
          </div>
        </div>

        <p className={styles.footer}>
          Protected by reCAPTCHA and subject to the Orbit Privacy Policy and
          Terms of Service.
        </p>
      </div>
    </div>
  );
}
```

---

### 2.3 Run & Test

```bash
npm run dev
```

Open **http://localhost:3000/login** — you should see the creative login page.

Click the **moon/sun icon** (top-right of login panel) to toggle dark/light mode.

---

## Quick Reference

| What | Where |
|------|-------|
| Design tokens (all colors, spacing) | `src/app/globals.css` — `:root` and `.dark` |
| Dark mode strategy | `@custom-variant dark (...)` in `globals.css` |
| Theme toggle logic | `src/components/ThemeToggle.tsx` |
| Theme provider | `src/app/providers.tsx` |
| Login page styles | `src/app/login/login.module.scss` |
| Login page component | `src/app/login/page.tsx` |

### SCSS Benefits Used

| Feature | How It Helps |
|---------|--------------|
| `$variables` | Local constants for gradients, sizes |
| Nesting | `.inputWrapper { input { ... } }` — cleaner than flat CSS |
| `&` parent selector | `&:focus-within`, `&:hover`, `&1`, `&2` modifiers |
| `rgba($var, 0.1)` | Dynamic transparency from Sass variables |
| `@keyframes` inside file | Scoped animations (avatar float) |
| `.module.scss` | Auto-scoped class names — no naming conflicts |

### Dark Mode — How It Works

```
next-themes adds class="dark" to <html>
        ↓
globals.css .dark { } overrides CSS variables
        ↓
All components using var(--color-*) auto-switch
        ↓
No extra code needed per component!
```
