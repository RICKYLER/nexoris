# Nexoris Mobile UI

Mobile-only interface files live here para dali ra i-maintain.

```text
mobile/
+-- components/
|   +-- market-scanner-mobile.tsx
|   +-- mobile-shell.tsx
|   +-- smart-money-mobile.tsx
|   +-- trading-terminal-mobile.tsx
+-- styles/
|   +-- mobile.css
+-- README.md
```

How it connects:

- `components/mobile-shell.tsx` renders the mobile top bar, account strip, bottom nav, and More menu.
- `components/trading-terminal-mobile.tsx` renders mobile cards for positions, orders, and terminal history.
- `components/market-scanner-mobile.tsx` renders the phone version of scanner rows.
- `components/smart-money-mobile.tsx` renders the phone version of smart-money movement rows.
- `styles/mobile.css` owns mobile breakpoints, bottom nav styling, swipe KPI rows, and phone-specific shell polish.
- `../src/components/dashboard/app-shell.tsx` imports the mobile shell.
- `../src/app/layout.tsx` imports the mobile stylesheet.

Keep desktop/shared dashboard components in `../src`. Put mobile-only shell changes and mobile-only styling in this folder.
