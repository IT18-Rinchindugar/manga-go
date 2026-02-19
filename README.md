# Manga Stream

A modern manga reading platform with user authentication, coin-based chapter unlocking, and reading progress tracking.

## Features

- 📚 Browse and read manga
- 🔐 OAuth2 authentication with Google (via PocketBase)
- 💰 Coin-based chapter unlocking system
- 📖 Reading history and favorites
- 🎨 Modern, responsive UI with Tailwind CSS
- 🌍 Multi-language support (English, Mongolian)
- 👑 Admin dashboard for analytics

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: PocketBase
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Authentication**: PocketBase OAuth2

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- [PocketBase](https://pocketbase.io/docs/) (v0.22 or higher)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Manga-Stream
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update it with your PocketBase URL:

```bash
cp .env.example .env
```

Edit `.env` and set your PocketBase instance URL:

```env
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

### 4. Setup PocketBase

#### Download and Run PocketBase

1. Download PocketBase from [pocketbase.io](https://pocketbase.io/)
2. Extract the downloaded file
3. Run PocketBase:

```bash
./pocketbase serve
```

PocketBase will start on `http://127.0.0.1:8090` by default.

#### Configure PocketBase Admin

1. Open `http://127.0.0.1:8090/_/` in your browser
2. Create an admin account
3. Configure OAuth2 providers:
   - Navigate to **Settings** > **Auth providers**
   - Enable **Google OAuth2**
   - Add your Google OAuth2 credentials (Client ID & Secret)
   - Set the redirect URL to match your app URL (e.g., `http://localhost:5000/auth/callback`)

#### Create Collections

Create the following collections in PocketBase Admin:

**Note**: The `users` collection is built-in. Extend it with these fields:
- `coins` (number) - User's coin balance
- `avatar` (file) - User avatar image
- `role` (text) - User role (user/admin)

Additional collections to create:
- `manga` - Manga information
- `chapters` - Chapter data
- `favorites` - User favorites
- `unlocked_chapters` - Unlocked chapters per user
- `transactions` - Coin purchase history
- `reading_history` - Reading progress

Refer to the PocketBase documentation for detailed schema definitions.

### 5. Run the Development Server

```bash
npm run dev:client
```

The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev:client` - Start the Vite development server
- `npm run dev` - Start the backend server (if applicable)
- `npm run build` - Build for production
- `npm start` - Serve the production build
- `npm run check` - Type check with TypeScript

## Project Structure

```
Manga-Stream/
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Utilities and configurations
│   │   │   ├── pocketbase.ts  # PocketBase client setup
│   │   │   ├── api.ts         # API functions
│   │   │   ├── auth-context.tsx  # Auth context
│   │   │   └── types.ts       # TypeScript types
│   │   ├── pages/         # Page components
│   │   ├── locales/       # i18n translations
│   │   └── hooks/         # Custom React hooks
│   ├── public/            # Static assets
│   └── index.html
├── server/                # Backend (if applicable)
├── .env.example          # Environment variable template
├── package.json
└── vite.config.ts        # Vite configuration
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_POCKETBASE_URL` | PocketBase instance URL | `http://127.0.0.1:8090` |

## Authentication Flow

The application uses PocketBase OAuth2 authentication:

1. User clicks "Sign in with Google"
2. User is redirected to Google OAuth consent screen
3. After authorization, Google redirects back to the app
4. PocketBase handles the OAuth callback and creates/updates the user
5. User session is maintained via PocketBase auth store

## Development

### Adding New Features

1. Create/modify PocketBase collections as needed
2. Update TypeScript types in `client/src/lib/types.ts`
3. Implement API functions in `client/src/lib/api.ts`
4. Create UI components and pages
5. Test thoroughly

### Code Style

This project uses:
- TypeScript for type safety
- ESLint for linting
- Prettier for code formatting (if configured)

## Security Considerations

- Never commit `.env` files to version control
- Keep PocketBase OAuth credentials secure
- Configure proper CORS settings in PocketBase
- Implement collection-level access rules in PocketBase Admin
- Validate user input on both client and server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

