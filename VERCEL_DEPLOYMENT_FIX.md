# 🚨 VERCEL DEPLOYMENT INSTRUCTIONS

## Issue: Admin path still showing `sys-panel-2026` on Vercel

### ✅ FIXED IN THIS COMMIT:
1. ✅ Login redirect issue (was going to 404)
2. ✅ All hardcoded `/admin` paths replaced with `ADMIN_CONFIG`

---

## 🔧 VERCEL SETUP (MUST DO AFTER PUSHING):

### Step 1: Add Environment Variable in Vercel

1. Go to: **https://vercel.com/your-project**
2. Click: **Settings** → **Environment Variables**
3. Add new variable:
   ```
   Key:   VITE_ADMIN_ROUTE_PATH
   Value: ctrl-sys-9k2
   ```
4. Select: ✅ Production, ✅ Preview, ✅ Development
5. Click: **Save**

### Step 2: FORCE REBUILD (Critical!)

**⚠️ IMPORTANT:** Vercel needs to rebuild to pick up the new env var!

**Option A - Via Vercel Dashboard:**
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **⋯** (three dots)
4. Click **Redeploy**
5. **⚠️ UNCHECK** "Use existing Build Cache"
6. Click **Redeploy**

**Option B - Trigger from terminal (after push):**
Just push this commit - Vercel will auto-rebuild

### Step 3: Verify After Deployment

1. Open your Vercel URL
2. Try: `https://your-site.vercel.app/ctrl-sys-9k2/login` ✅
3. Try: `https://your-site.vercel.app/admin` ❌ (should be 404)

---

## 📋 Quick Checklist:

- [ ] Push this commit to trigger deployment
- [ ] Add `VITE_ADMIN_ROUTE_PATH=ctrl-sys-9k2` in Vercel Settings
- [ ] Force redeploy WITHOUT build cache
- [ ] Test new URL after deployment

---

## 🐛 If Still Not Working:

### Check 1: Environment Variable Visible?
In Vercel dashboard, go to Settings → Environment Variables
- Should show: `VITE_ADMIN_ROUTE_PATH = ctrl-sys-9k2`

### Check 2: Build Logs
In deployment logs, search for "VITE_ADMIN_ROUTE_PATH"
- Should NOT be "undefined"

### Check 3: Clear Cache
Sometimes Vercel needs cache cleared:
1. Go to deployment
2. Click "Redeploy"
3. **UNCHECK** "Use existing Build Cache"

---

## 💡 Why This Happens:

Vite environment variables are **build-time variables**, not runtime.
They are replaced during the build process, so:

1. Change in Vercel settings → ✅
2. Must redeploy/rebuild → ✅
3. Cannot just restart server → ❌

---

## ✅ Expected Result After Fix:

**Your new admin URLs:**
- Login: `https://your-site.vercel.app/ctrl-sys-9k2/login`
- Dashboard: `https://your-site.vercel.app/ctrl-sys-9k2/dashboard`
- All other admin pages with `/ctrl-sys-9k2/...`

**Should return 404:**
- `https://your-site.vercel.app/admin`
- `https://your-site.vercel.app/sys-panel-2026`

---

**Remember:** After adding environment variable in Vercel, you MUST redeploy!
