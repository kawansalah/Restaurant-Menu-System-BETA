# Admin Route Security - URL Obfuscation

## Overview

Your admin panel URL has been changed from the default `/admin` to a custom, obscure path to improve security through obscurity.

## Current Configuration

**Default Admin URL:** `http://localhost:3000/sys-panel-2026`

You can access your admin panel at:

- Login: `http://localhost:3000/sys-panel-2026/login`
- Dashboard: `http://localhost:3000/sys-panel-2026/dashboard`
- Users: `http://localhost:3000/sys-panel-2026/users`
- Categories: `http://localhost:3000/sys-panel-2026/categories`
- And all other admin routes...

## How to Change the Admin Route

### Method 1: Using Environment Variable (Recommended)

1. Create or edit your `.env` file:

```bash
VITE_ADMIN_ROUTE_PATH=your-custom-path
```

2. Examples of good admin paths:

```bash
VITE_ADMIN_ROUTE_PATH=dashboard-2026
VITE_ADMIN_ROUTE_PATH=mng-sys
VITE_ADMIN_ROUTE_PATH=control-x7k
VITE_ADMIN_ROUTE_PATH=backend-secure
VITE_ADMIN_ROUTE_PATH=management-portal
VITE_ADMIN_ROUTE_PATH=secure-admin-xyz
```

3. Restart your development server:

```bash
npm run dev
```

### Method 2: Edit Configuration File Directly

Edit [src/admin/config/routes.ts](../src/admin/config/routes.ts):

```typescript
export const ADMIN_CONFIG = {
  // Change this line:
  ROUTE_PATH: import.meta.env.VITE_ADMIN_ROUTE_PATH || "your-custom-path",
  // ...
};
```

## Best Practices for Admin Path

### ✅ Good Examples:

- `mng-portal-2026` (includes year, abbreviation)
- `secure-backend-xyz` (includes random suffix)
- `ctrl-sys-9k2` (alphanumeric combination)
- `dashboard-secure-v2` (version number)

### ❌ Avoid:

- `admin` (too obvious)
- `login` (too common)
- `dashboard` (too generic)
- `control` (too predictable)
- `backend` (too obvious)

### Security Tips:

1. **Use random combinations**: Mix letters, numbers, and hyphens
2. **Make it unpredictable**: Avoid common words
3. **Add year/version**: Makes it unique
4. **Keep it secret**: Don't share publicly
5. **Change periodically**: Update every few months
6. **Use alphanumeric**: `sys-7k2m-panel`

## Important Notes

⚠️ **After changing the admin path:**

1. Update all your bookmarks
2. Inform your admin team
3. Update any documentation
4. Clear browser cache if needed

⚠️ **Production deployment:**

- Make sure to set `VITE_ADMIN_ROUTE_PATH` in your hosting platform's environment variables
- Don't commit your `.env` file to version control
- Use different paths for staging and production

## Testing

After changing the route, test these URLs:

✅ Should work:

- `http://localhost:3000/your-custom-path/login`
- `http://localhost:3000/your-custom-path/dashboard`

❌ Should return 404:

- `http://localhost:3000/admin`
- `http://localhost:3000/admin/login`

## Files Modified

All admin routes are automatically updated in:

- ✅ App.tsx (main routing)
- ✅ AdminLayout.tsx (authentication redirects)
- ✅ ProtectedRoute.tsx (role-based access)
- ✅ AdminDashboard.tsx (navigation links)
- ✅ All admin components and pages

## Additional Security Layers

This URL obfuscation works best when combined with:

1. ✅ Strong authentication (already implemented)
2. ✅ Rate limiting (already implemented)
3. ✅ Session management (already implemented)
4. ✅ HTTPS in production
5. ✅ IP whitelisting (optional)
6. ✅ VPN access (optional)

---

**Remember:** Security through obscurity should be one layer of many security measures, not the only one!
