# Admin Route Security Implementation

## Overview

This document outlines the security measures implemented to encrypt and protect the admin routes of the application.

## Security Features Implemented

### 1. **Route Protection**

- ✅ Protected routes using `AdminLayout` with authentication checks
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Role-based access control (RBAC) via `ProtectedRoute` component
- ✅ Session validation on every route change

### 2. **Authentication Security**

- ✅ Supabase Auth integration with JWT tokens
- ✅ PKCE (Proof Key for Code Exchange) flow for enhanced security
- ✅ Automatic token refresh
- ✅ Session encryption using Web Crypto API (AES-GCM 256-bit)
- ✅ Secure password validation

### 3. **Rate Limiting & Brute Force Protection**

- ✅ Maximum 5 login attempts within 5 minutes
- ✅ 15-minute account lockout after failed attempts
- ✅ Attempt tracking in localStorage
- ✅ Clear attempts on successful login

### 4. **Session Management**

- ✅ Session timeout after 1 hour of inactivity (configurable)
- ✅ Activity monitoring (mouse, keyboard, scroll, touch events)
- ✅ Automatic logout on timeout
- ✅ Session token stored in database with expiry
- ✅ CSRF token generation and validation

### 5. **Input Sanitization**

- ✅ XSS prevention through input sanitization
- ✅ SQL injection prevention via Supabase parameterized queries
- ✅ Email and password validation

### 6. **HTTP Security Headers**

- ✅ Content Security Policy (CSP)
- ✅ X-Frame-Options (prevent clickjacking)
- ✅ X-Content-Type-Options (prevent MIME sniffing)
- ✅ X-XSS-Protection
- ✅ Strict-Transport-Security (HTTPS enforcement)
- ✅ Referrer-Policy
- ✅ Permissions-Policy

### 7. **Data Encryption**

- ✅ Session data encryption using AES-GCM
- ✅ Secure token storage
- ✅ Environment variable protection

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Admin Security
VITE_ADMIN_ENCRYPTION_KEY=your_secure_random_key_here
VITE_SESSION_TIMEOUT=3600000  # 1 hour in milliseconds
VITE_ADMIN_MAX_INACTIVE_TIME=1800000  # 30 minutes
```

**Generate encryption key:**

```bash
openssl rand -base64 32
```

### 2. Database Setup

Ensure you have the following tables in Supabase:

```sql
-- Admin users table (should already exist)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('superadmin', 'admin', 'moderator')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_user ON admin_sessions(admin_user_id);
```

### 3. Supabase Row Level Security (RLS)

Enable RLS on admin tables:

```sql
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their own data
CREATE POLICY "Users can view own data" ON admin_users
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Allow system to manage sessions
CREATE POLICY "Allow session management" ON admin_sessions
  FOR ALL
  USING (auth.uid() = admin_user_id);
```

### 4. Usage Example

#### Protected Route

```tsx
import ProtectedRoute from "@/admin/components/ProtectedRoute";

// In your routes
<Route
  path="/admin/settings"
  element={
    <ProtectedRoute requiredRole="superadmin">
      <Settings />
    </ProtectedRoute>
  }
/>;
```

#### Using Security Manager

```tsx
import { SecurityManager } from "@/admin/utils/securityManager";

// Check session timeout
if (SecurityManager.checkSessionTimeout()) {
  logout();
}

// Validate input
const sanitized = SecurityManager.sanitizeInput(userInput);

// Validate password
const { valid, errors } = SecurityManager.validatePassword(password);
```

## Security Best Practices

### 1. **Password Requirements**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&\*)

### 2. **Token Management**

- Tokens automatically refresh before expiry
- Sessions expire after 24 hours
- Inactive timeout after 1 hour (configurable)

### 3. **Production Deployment**

1. **Always use HTTPS** in production
2. **Never commit** `.env` files to version control
3. **Rotate encryption keys** regularly
4. **Monitor** failed login attempts
5. **Enable** Supabase security features:
   - Email confirmation
   - Password strength requirements
   - Rate limiting at database level

### 4. **Additional Security Measures**

- Consider implementing 2FA (Two-Factor Authentication)
- Add IP whitelisting for admin access
- Implement audit logging for all admin actions
- Regular security audits
- Keep dependencies updated

## Testing Security

### Test Rate Limiting

1. Attempt to login with wrong credentials 5 times
2. Verify account is locked for 15 minutes

### Test Session Timeout

1. Login to admin panel
2. Leave browser idle for configured timeout period
3. Attempt to navigate - should redirect to login

### Test Protected Routes

1. Try to access `/admin/dashboard` without authentication
2. Should redirect to `/admin/login`

## Troubleshooting

### Issue: Session keeps timing out too quickly

**Solution:** Increase `VITE_SESSION_TIMEOUT` in `.env`

### Issue: Account locked unexpectedly

**Solution:** Clear localStorage or wait 15 minutes

### Issue: CORS errors in production

**Solution:** Configure Supabase allowed origins in project settings

## Security Checklist

- [x] Authentication implemented
- [x] Session management configured
- [x] Rate limiting enabled
- [x] Input sanitization implemented
- [x] Security headers configured
- [x] HTTPS enforced (production)
- [x] Environment variables secured
- [x] RLS policies configured
- [x] CSRF protection enabled
- [x] XSS prevention implemented
- [ ] 2FA implementation (optional)
- [ ] Audit logging (optional)
- [ ] IP whitelisting (optional)

## Contact & Support

For security concerns or questions, please refer to the main documentation or contact the development team.

---

**Last Updated:** January 4, 2026
