# TimeEngine

An interactive calendar app with date range selection, per-month themes, and a notes panel. Built as a frontend internship project.

## Features

- Monthly calendar with date range selection (click start → click end)
- Per-month color themes that change the entire UI palette
- Dark / light mode toggle (dark by default)
- Notes panel — write notes for a selected date range or the whole month
- Notes persist in `localStorage`, no backend needed
- Weekends highlighted, today's date marked
- Fully responsive — stacks on mobile

## Tech Stack

- Next.js 15 (App Router, static export)
- TypeScript
- Tailwind CSS + CSS custom properties
- Deployed via GitHub Actions → GitHub Pages

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx          # entry point
  layout.tsx        # root layout + metadata
  globals.css       # CSS variables, animations, base styles

components/
  CalendarContainer.tsx   # top-level state, dark mode, theme injection
  Calendar.tsx            # month grid, navigation, range selection
  DateCell.tsx            # individual day cell
  HeroSection.tsx         # sidebar with image, quote, stats
  NotesPanel.tsx          # tabbed notes with localStorage
  monthThemes.ts          # color + content config per month
```

## How Range Selection Works

1. Click any date — sets the start
2. Hover to preview the range
3. Click another date — sets the end
4. Click ✕ or start a new selection to reset
