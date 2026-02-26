# MangaGo Translation System

## Overview
This project now supports English and Mongolian (монгол хэл) translations using i18next.

## Files Created
- `client/src/locales/en.json` - English translations
- `client/src/locales/mn.json` - Mongolian translations
- `client/src/lib/i18n.ts` - i18n configuration
- `client/src/lib/language-context.tsx` - Language context provider
- `client/src/components/language-switcher.tsx` - Language switcher component

## How to Use Translations

### 1. In Components
```tsx
import { useLanguage } from '@/lib/language-context';

function MyComponent() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
      <p>{t('manga.synopsis')}</p>
    </div>
  );
}
```

### 2. With Variables
```tsx
// For translations with variables, use interpolation
const { t } = useLanguage();

// Translation: "Showing {{count}} results"
<p>{t('search.showingResults', { count: 10 })}</p>

// Translation: "Successfully purchased {{count}} coins!"
toast.success(t('notifications.coinsPurchased', { count: 50 }));
```

### 3. Available Translation Keys

#### Common
- `common.home` - Home
- `common.browse` - Browse
- `common.latest` - Latest
- `common.genres` - Genres
- `common.profile` - Profile
- `common.signIn` - Sign In
- `common.login` - Login
- `common.logout` - Log out
- `common.search` - Search manga...

#### Navigation
- `navigation.filtersAndSort` - Filters & Sort
- `navigation.favorites` - Favorites
- `navigation.topUpCoins` - Top Up Coins
- `navigation.settings` - Settings

#### Manga
- `manga.chapters` - Chapters
- `manga.synopsis` - Synopsis
- `manga.author` - Author
- `manga.rating` - Rating
- `manga.status` - Status
- `manga.ongoing` - Ongoing
- `manga.completed` - Completed

#### Genres
- `genres.action` - Action / Экшн
- `genres.romance` - Romance / Романтик
- `genres.fantasy` - Fantasy / Уран зөгнөл

#### User
- `user.username` - Username
- `user.email` - Email
- `user.password` - Password
- `user.readingHistory` - Reading History

#### Notifications
- `notifications.loginSuccess` - Logged in successfully!
- `notifications.logoutSuccess` - Logged out successfully
- `notifications.coinsPurchased` - Successfully purchased {{count}} coins!

### 4. Switching Languages
Users can switch languages using the language switcher button in the header (globe icon).

The selected language is automatically saved to localStorage and persists across sessions.

### 5. Adding New Translations
1. Add the new key to both `en.json` and `mn.json`
2. Use the key in your component: `t('section.key')`

Example:
```json
// en.json
{
  "newSection": {
    "newKey": "New text in English"
  }
}

// mn.json
{
  "newSection": {
    "newKey": "Шинэ текст монголоор"
  }
}
```

```tsx
// In component
const { t } = useLanguage();
<p>{t('newSection.newKey')}</p>
```

## Current Status
✅ Translation files created (English & Mongolian)
✅ i18n configuration set up
✅ Language context provider implemented
✅ Language switcher component created
✅ Layout component updated with translations
✅ Packages installed (i18next, react-i18next)

## Next Steps to Complete Translation
To fully translate your app, you'll need to update each component to use `t()` function:
- [ ] Home page (home.tsx)
- [ ] Browse page (browse.tsx)
- [ ] Genres page (genres.tsx)
- [ ] Latest page (latest.tsx)
- [ ] Manga details page (manga-details.tsx)
- [ ] Reader page (reader.tsx)
- [ ] Profile page (profile.tsx)
- [ ] Auth page (auth.tsx)
- [ ] Admin pages
- [ ] Components (manga-card.tsx, payment-modal.tsx, etc.)

Would you like help updating specific pages?

