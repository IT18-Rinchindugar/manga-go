# InkFlow - Manga Reading Platform

## Overview
InkFlow is a manga reading platform prototype built with React. The frontend uses mock data for all API endpoints, making it a fully self-contained frontend application perfect for design iteration and prototyping. The platform features user authentication, a coin-based payment system for unlocking premium chapters, reading history tracking, and comprehensive administrative tools. The design follows a dark "Midnight Ink" theme with purple/violet accents.

**Note**: This is a frontend-only prototype with mock API data. All authentication, manga data, and transactions are simulated in the browser.

## Recent Changes (January 15, 2026)
- **Database Setup**: Deployed PostgreSQL schema with 7 tables (users, manga, chapters, transactions, reading_history, favorites, unlocked_chapters)
- **Authentication System**: Implemented Passport.js with local strategy, session management, and bcrypt password hashing
- **API Routes**: Created separate API logic for web users (`/api/*`) and admin users (`/api/admin/*`)
- **Storage Layer**: Built comprehensive storage interface with Drizzle ORM for all CRUD operations
- **Frontend Integration**: Integrated auth context, API client, and updated Layout component
- **Seed Data**: Added sample manga, chapters, and test users (admin/admin123, demo/user123)

## Project Architecture

### Tech Stack
- **Frontend**: React 19, Wouter (routing), Radix UI, Tailwind CSS
- **Backend**: Express.js, Passport.js (authentication)
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Custom dark theme with "Midnight Ink" aesthetic (hsl 265 89% 66% primary color)
- **Fonts**: Carter One (display), Outfit (body)

### Database Schema
1. **users**: User accounts with roles (USER/ADMIN), coin balance, authentication
2. **manga**: Manga metadata (title, author, synopsis, genres, status, cover)
3. **chapters**: Individual chapters with pricing, pages, and free/premium status
4. **transactions**: Financial history (coin purchases, chapter unlocks)
5. **reading_history**: Track user reading progress
6. **favorites**: User's favorited manga
7. **unlocked_chapters**: Chapters purchased by users

### Key Features
- **Authentication**: Session-based auth with login/register
- **Monetization**: Coin-based system - first 3 chapters free, premium chapters cost 50 coins
- **Admin Dashboard**: Manga management, user analytics, content moderation
- **Reading Experience**: Vertical scroll and single-page reading modes
- **User Profile**: Reading history, favorites, transaction history, coin balance

### API Structure

#### Public Routes
- `GET /api/manga` - Browse all manga
- `GET /api/manga/:id` - Get manga details
- `GET /api/manga/search?q=` - Search manga

#### Authenticated User Routes
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/user` - Get current user
- `GET /api/chapters/:id` - Get chapter (locked if unpurchased)
- `POST /api/chapters/:id/unlock` - Unlock premium chapter
- `POST /api/user/purchase-coins` - Buy coins
- `GET /api/user/profile` - User profile
- `GET /api/user/history` - Reading history
- `POST /api/user/history` - Update reading progress
- `GET /api/user/favorites` - Favorite manga
- `POST /api/user/favorites` - Add favorite
- `DELETE /api/user/favorites/:mangaId` - Remove favorite

#### Admin Routes (Require ADMIN role)
- `GET /api/admin/analytics` - Dashboard statistics
- `POST /api/admin/manga` - Create manga
- `PUT /api/admin/manga/:id` - Update manga
- `DELETE /api/admin/manga/:id` - Delete manga
- `POST /api/admin/chapters` - Create chapter
- `PUT /api/admin/chapters/:id` - Update chapter
- `DELETE /api/admin/chapters/:id` - Delete chapter

### File Structure
- `shared/schema.ts` - Database schema and Zod validation
- `server/db.ts` - Database connection
- `server/storage.ts` - Data access layer (DatabaseStorage class)
- `server/auth.ts` - Passport.js configuration and auth middleware
- `server/routes.ts` - All API endpoints
- `server/seed.ts` - Database seeding script
- `client/src/lib/api.ts` - Frontend API client
- `client/src/lib/auth-context.tsx` - React authentication context
- `client/src/pages/auth.tsx` - Login/register page
- `client/src/components/layout.tsx` - Main app layout with header/footer

## User Preferences
- Design: Dark mode only with "Midnight Ink" theme
- Database: PostgreSQL with Drizzle ORM (not Prisma)
- Auth: Passport.js with local strategy
- IDs: UUID-based primary keys (varchar with gen_random_uuid())
- Architecture: Separate API logic for web users and admin users

## Development

### Setup
1. Database is auto-provisioned via DATABASE_URL environment variable
2. Run `npm run db:push` to sync schema changes
3. Run `tsx server/seed.ts` to populate sample data
4. Run `npm run dev` to start development server on port 5000

### Test Credentials
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `demo`, password: `user123`

### Important Notes
- First 3 chapters of each manga are free
- Premium chapters cost 50 coins
- Demo user starts with 500 coins
- Admin user has 10,000 coins and full access to admin dashboard
- Session secret defaults to development key (set SESSION_SECRET in production)

## Next Steps
- Integrate frontend pages (Home, Browse, Reader, Profile, Admin) with real API data
- Add search functionality
- Implement manga filtering by genre/status
- Add pagination for manga lists
- Enhance reader with bookmarking and page navigation
- Add image upload for manga covers and pages
