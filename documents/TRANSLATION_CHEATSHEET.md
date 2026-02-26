# Translation Quick Reference

## How to Use

```tsx
import { useLanguage } from '@/lib/language-context';

const { t } = useLanguage();
```

## Most Common Translations

### Navigation
```tsx
{t('common.home')}           // Home / Нүүр хуудас
{t('common.browse')}         // Browse / Үзэх
{t('common.latest')}         // Latest / Шинэ
{t('common.genres')}         // Genres / Төрөл
{t('common.profile')}        // Profile / Профайл
```

### Actions
```tsx
{t('common.signIn')}         // Sign In / Нэвтрэх
{t('common.logout')}         // Log out / Гарах
{t('common.viewAll')}        // View All / Бүгдийг харах
{t('common.continue')}       // Continue / Үргэлжлүүлэх
{t('common.startReading')}   // Start Reading / Унших эхлэх
```

### Manga
```tsx
{t('manga.chapters')}        // Chapters / Бүлгүүд
{t('manga.chapter')}         // Chapter / Бүлэг
{t('manga.synopsis')}        // Synopsis / Товч агуулга
{t('manga.author')}          // Author / Зохиогч
{t('manga.rating')}          // Rating / Үнэлгээ
{t('manga.status')}          // Status / Төлөв байдал
{t('manga.ongoing')}         // Ongoing / Үргэлжилж байгаа
{t('manga.completed')}       // Completed / Дууссан
```

### User
```tsx
{t('user.username')}         // Username / Хэрэглэгчийн нэр
{t('user.email')}            // Email / Имэйл
{t('user.password')}         // Password / Нууц үг
{t('user.coins')}            // Coins / Зоос
```

### With Variables
```tsx
{t('search.showingResults', { count: 10 })}
// "Showing 10 results" / "10 үр дүн харуулж байна"

{t('notifications.coinsPurchased', { count: 50 })}
// "Successfully purchased 50 coins!" / "50 зоос амжилттай худалдаж авлаа!"
```

### Toasts/Notifications
```tsx
toast.success(t('notifications.loginSuccess'))
toast.error(t('notifications.loginFailed'))
toast.success(t('notifications.logoutSuccess'))
```

## Full Key Structure

```
common.*          // General UI (home, browse, login, etc.)
navigation.*      // Nav items (filters, settings, etc.)
manga.*           // Manga-related (chapters, status, etc.)
genres.*          // Genre names (action, romance, etc.)
time.*            // Time-related (this week, last updated, etc.)
user.*            // User account (username, email, etc.)
reader.*          // Reader interface (zoom, reading mode, etc.)
payment.*         // Payment/coins (purchase, bonus, etc.)
admin.*           // Admin dashboard
search.*          // Search & filters
auth.*            // Authentication pages
notifications.*   // Toast messages
errors.*          // Error pages (404, etc.)
ui.*              // Misc UI elements
footer.*          // Footer text
appName           // App name (MangaGo / МангаГо)
```

