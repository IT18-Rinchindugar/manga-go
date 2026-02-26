# InkFlow - Manga Reading Platform

## Overview
InkFlow is a manga reading platform prototype built with React and Vite. The frontend uses mock data for all API endpoints, making it a fully self-contained frontend application perfect for design iteration and prototyping. The platform features user authentication, a coin-based payment system for unlocking premium chapters, reading history tracking, and comprehensive administrative tools. The design follows a dark "Midnight Ink" theme with purple/violet accents.

**Note**: This is a frontend-only prototype with mock API data. All authentication, manga data, and transactions are simulated in the browser.

## Recent Changes (January 26, 2026)
- Converted to pure Vite client-only app structure
- Removed backend dependencies (express, passport, drizzle, pg, etc.)
- Created local TypeScript types in client/src/lib/types.ts
- Minimal server/index.ts that starts Vite dev server directly
- Added scroll-to-top behavior on route navigation
- Multi-select genre filtering on Genres page

## Project Architecture

### Tech Stack
- **Frontend**: React 19, Vite, Wouter (routing), Radix UI, Tailwind CSS
- **Build**: Vite dev server with HMR
- **Styling**: Custom dark theme with "Midnight Ink" aesthetic (hsl 265 89% 66% primary color)
- **Fonts**: Carter One (display), Outfit (body)

### Mock Data Features
- 6 sample manga with chapters
- 2 test users (demo and admin)
- Per-user session state (favorites, unlocked chapters, transactions)
- Simulated coin purchases and chapter unlocks

### Key Features
- **Authentication**: Mock login/register with session state
- **Monetization**: Coin-based system - first 3 chapters free, premium chapters cost 50 coins
- **Admin Dashboard**: Manga management, user analytics (mock data)
- **Reading Experience**: Vertical scroll and single-page reading modes
- **User Profile**: Reading history, favorites, transaction history, coin balance

### File Structure
```
client/
├── src/
│   ├── lib/
│   │   ├── api.ts          - Mock API client with all simulated endpoints
│   │   ├── auth-context.tsx - React authentication context
│   │   ├── types.ts        - TypeScript type definitions
│   │   ├── mock-data.ts    - Mock manga/user data
│   │   └── queryClient.ts  - React Query client
│   ├── pages/              - Page components
│   ├── components/         - Reusable UI components
│   └── App.tsx            - Main app with routing
├── index.html             - Entry HTML file
└── index.css              - Global styles
server/
└── index.ts               - Minimal Vite dev server starter
```

## User Preferences
- Design: Dark mode only with "Midnight Ink" theme
- Architecture: Frontend-only prototype with mock data

## Development

### Setup
1. Run `npm run dev` to start Vite development server on port 5000

### Test Credentials
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `demo`, password: `user123`

### Important Notes
- First 3 chapters of each manga are free
- Premium chapters cost 50 coins
- Demo user starts with 500 coins
- Admin user has 10,000 coins and access to admin dashboard
- All data is stored in browser memory (resets on page refresh)
