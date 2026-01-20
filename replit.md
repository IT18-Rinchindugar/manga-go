# InkFlow - Manga Reading Platform

## Overview
InkFlow is a manga reading platform prototype built with React. The frontend uses mock data for all API endpoints, making it a fully self-contained frontend application perfect for design iteration and prototyping. The platform features user authentication, a coin-based payment system for unlocking premium chapters, reading history tracking, and comprehensive administrative tools. The design follows a dark "Midnight Ink" theme with purple/violet accents.

**Note**: This is a frontend-only prototype with mock API data. All authentication, manga data, and transactions are simulated in the browser.

## Recent Changes (January 20, 2026)
- Converted to frontend-only prototype with mock API data
- Removed unused backend files (auth.ts, db.ts, storage.ts, seed.ts)
- Simplified server to only serve the frontend
- Mock API supports per-user session state

## Project Architecture

### Tech Stack
- **Frontend**: React 19, Wouter (routing), Radix UI, Tailwind CSS
- **Backend**: Express.js (serves frontend only)
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
- `client/src/lib/api.ts` - Mock API client with all simulated endpoints
- `client/src/lib/auth-context.tsx` - React authentication context
- `client/src/pages/auth.tsx` - Login/register page
- `client/src/components/layout.tsx` - Main app layout with header/footer
- `server/index.ts` - Simple Express server (serves frontend only)
- `server/routes.ts` - Empty routes (all API handled by mock data)

## User Preferences
- Design: Dark mode only with "Midnight Ink" theme
- Architecture: Frontend-only prototype with mock data

## Development

### Setup
1. Run `npm run dev` to start development server on port 5000

### Test Credentials
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `demo`, password: `user123`

### Important Notes
- First 3 chapters of each manga are free
- Premium chapters cost 50 coins
- Demo user starts with 500 coins
- Admin user has 10,000 coins and access to admin dashboard
- All data is stored in browser memory (resets on page refresh)
