# PocketBase Setup Guide

This guide will walk you through setting up PocketBase for the Manga Stream application.

## Prerequisites

- Node.js v18 or higher
- PocketBase v0.22 or higher
- Google OAuth2 credentials (Client ID and Secret)

## Step 1: Download and Install PocketBase

1. Visit [https://pocketbase.io/docs/](https://pocketbase.io/docs/)
2. Download the appropriate version for your operating system
3. Extract the archive to a directory of your choice

## Step 2: Start PocketBase

```bash
# Navigate to the PocketBase directory
cd path/to/pocketbase

# Start PocketBase
./pocketbase serve

# PocketBase will start on http://127.0.0.1:8090
```

## Step 3: Create Admin Account

1. Open your browser and navigate to `http://127.0.0.1:8090/_/`
2. Create an admin account with email and password
3. Log in to the PocketBase Admin UI

## Step 4: Configure Google OAuth2

### Get Google OAuth2 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Set application type to "Web application"
6. Add authorized redirect URI:
   - For development: `http://127.0.0.1:8090/api/oauth2-redirect`
   - For production: `https://your-domain.com/api/oauth2-redirect`
7. Copy the Client ID and Client Secret

### Configure in PocketBase Admin

1. In PocketBase Admin UI, go to **Settings** → **Auth providers**
2. Find **Google** and click to enable it
3. Enter your Google OAuth2 credentials:
   - **Client ID**: Your Google Client ID
   - **Client Secret**: Your Google Client Secret
4. Click **Save changes**

## Step 5: Create Collections

Create the following collections with their respective fields:

### 1. Users Collection (Built-in - Extend)

The `users` collection is built-in. Add these custom fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `coins` | Number | Yes | Default: 0 |
| `role` | Text | Yes | Default: "USER", Pattern: `^(USER\|ADMIN)$` |
| `avatar` | File | No | Max size: 5MB, Types: image/png, image/jpeg |

### 2. manga Collection

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `title` | Text | Yes | Min: 1, Max: 200 |
| `altTitle` | Text | No | Max: 200 |
| `author` | Text | Yes | Max: 100 |
| `artist` | Text | No | Max: 100 |
| `coverUrl` | URL | Yes | |
| `synopsis` | Text | Yes | Max: 2000 |
| `genres` | JSON | Yes | Example: `["Action", "Fantasy"]` |
| `status` | Select | Yes | Options: "Ongoing", "Completed", "Hiatus" |
| `releaseYear` | Number | Yes | Min: 1900, Max: current year |
| `rating` | Text | Yes | Pattern: `^\d+(\.\d+)?$` |
| `reviews` | Number | Yes | Default: 0 |

### 3. chapters Collection

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `manga` | Relation | Yes | Collection: manga, Single |
| `number` | Number | Yes | Min: 0 |
| `title` | Text | Yes | Max: 200 |
| `pageUrls` | JSON | Yes | Array of URLs |
| `price` | Number | Yes | Min: 0, Default: 0 |
| `isFree` | Bool | Yes | Default: false |
| `releaseDate` | Date | Yes | |

### 4. transactions Collection

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | Yes | Collection: users, Single |
| `type` | Select | Yes | Options: "COIN_PURCHASE", "CHAPTER_UNLOCK" |
| `amount` | Number | Yes | |
| `description` | Text | Yes | Max: 500 |
| `relatedChapter` | Relation | No | Collection: chapters, Single |

### 5. reading_history Collection

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | Yes | Collection: users, Single |
| `manga` | Relation | Yes | Collection: manga, Single |
| `chapter` | Relation | Yes | Collection: chapters, Single |
| `lastRead` | Date | Yes | |

**Indexes**: Create unique index on `user + chapter`

### 6. favorites Collection

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | Yes | Collection: users, Single |
| `manga` | Relation | Yes | Collection: manga, Single |

**Indexes**: Create unique index on `user + manga`

### 7. unlocked_chapters Collection

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| `user` | Relation | Yes | Collection: users, Single |
| `chapter` | Relation | Yes | Collection: chapters, Single |
| `unlockedAt` | Date | Yes | |

**Indexes**: Create unique index on `user + chapter`

## Step 6: Configure API Rules

Set appropriate access rules for each collection:

### users Collection
- **List/Search**: `@request.auth.id != ""`
- **View**: `@request.auth.id = id || @request.auth.role = "ADMIN"`
- **Create**: System only
- **Update**: `@request.auth.id = id || @request.auth.role = "ADMIN"`
- **Delete**: `@request.auth.role = "ADMIN"`

### manga Collection
- **List/Search**: `@request.auth.id != ""`
- **View**: `@request.auth.id != ""`
- **Create**: `@request.auth.role = "ADMIN"`
- **Update**: `@request.auth.role = "ADMIN"`
- **Delete**: `@request.auth.role = "ADMIN"`

### chapters Collection
- **List/Search**: `@request.auth.id != ""`
- **View**: `@request.auth.id != ""`
- **Create**: `@request.auth.role = "ADMIN"`
- **Update**: `@request.auth.role = "ADMIN"`
- **Delete**: `@request.auth.role = "ADMIN"`

### transactions Collection
- **List/Search**: `@request.auth.id = user || @request.auth.role = "ADMIN"`
- **View**: `@request.auth.id = user || @request.auth.role = "ADMIN"`
- **Create**: `@request.auth.id = user`
- **Update**: `@request.auth.role = "ADMIN"`
- **Delete**: `@request.auth.role = "ADMIN"`

### reading_history Collection
- **List/Search**: `@request.auth.id = user`
- **View**: `@request.auth.id = user`
- **Create**: `@request.auth.id = user`
- **Update**: `@request.auth.id = user`
- **Delete**: `@request.auth.id = user`

### favorites Collection
- **List/Search**: `@request.auth.id = user`
- **View**: `@request.auth.id = user`
- **Create**: `@request.auth.id = user`
- **Update**: System only
- **Delete**: `@request.auth.id = user`

### unlocked_chapters Collection
- **List/Search**: `@request.auth.id = user`
- **View**: `@request.auth.id = user`
- **Create**: `@request.auth.id = user`
- **Update**: System only
- **Delete**: `@request.auth.role = "ADMIN"`

## Step 7: Configure Application Environment

1. Copy `.env.example` to `.env` in your project root:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your PocketBase URL:
   ```env
   VITE_POCKETBASE_URL=http://127.0.0.1:8090
   ```

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev:client
   ```

2. Navigate to `http://localhost:5000`
3. Try to sign in with Google OAuth2
4. Verify that authentication works correctly

## Troubleshooting

### OAuth2 Issues

**Problem**: OAuth2 redirect fails
**Solution**: 
- Verify redirect URI in Google Console matches: `http://127.0.0.1:8090/api/oauth2-redirect`
- Ensure Google OAuth2 is enabled in PocketBase settings
- Check that Client ID and Secret are correct

### Connection Issues

**Problem**: Cannot connect to PocketBase
**Solution**:
- Ensure PocketBase is running (`./pocketbase serve`)
- Check that `VITE_POCKETBASE_URL` in `.env` matches your PocketBase URL
- Verify no firewall is blocking port 8090

### CORS Issues

**Problem**: CORS errors in browser console
**Solution**:
- In PocketBase Admin, go to Settings → Application
- Add your frontend URL to allowed origins (e.g., `http://localhost:5000`)

## Production Deployment

### PocketBase

1. Deploy PocketBase to your server
2. Set up a domain and SSL certificate
3. Update OAuth2 redirect URI in Google Console
4. Configure environment variables for production

### Application

1. Update `.env` with production PocketBase URL:
   ```env
   VITE_POCKETBASE_URL=https://your-pocketbase-domain.com
   ```

2. Build and deploy your application:
   ```bash
   npm run build
   npm start
   ```

## Security Recommendations

1. **Always use HTTPS in production**
2. **Keep OAuth credentials secure** - never commit to version control
3. **Regularly update PocketBase** to get security patches
4. **Review and test API rules** thoroughly
5. **Enable rate limiting** in PocketBase settings
6. **Use strong admin passwords**
7. **Backup your database regularly**

## Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [PocketBase JavaScript SDK](https://github.com/pocketbase/js-sdk)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)

## Support

If you encounter any issues:
1. Check PocketBase logs: Look in the PocketBase directory for `pb_data/logs/`
2. Check browser console for JavaScript errors
3. Verify all environment variables are set correctly
4. Review PocketBase API rules and permissions

