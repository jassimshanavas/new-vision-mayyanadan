# Fix: Reorder Button Not Appearing

## Problem
The Reorder button is not appearing even after running the migration and restarting `npm run dev`. This is because:
1. Multiple node processes are running
2. Hot Module Replacement (HMR) is failing
3. The browser is caching the old JavaScript bundle

## Solution

### Step 1: Stop ALL Node Processes

```powershell
# Stop all node processes
Get-Process node | Stop-Process -Force

# Verify they're stopped
Get-Process node
# Should show "Get-Process : Cannot find a process with the name 'node'"
```

### Step 2: Clear Browser Cache

1. Open your browser
2. Press `Ctrl + Shift + Delete`
3. Select "Cached images and files"
4. Click "Clear data"

**OR** do a hard refresh:
- Press `Ctrl + F5` on the admin page
- Or `Ctrl + Shift + R`

### Step 3: Restart Development Server

```powershell
cd c:\Users\jassi\Desktop\new-vision-new
npm run dev
```

Wait for the message: `ready - started server on 0.0.0.0:3000`

### Step 4: Test the Feature

1. Navigate to `http://localhost:3000/admin/login`
2. Login with `admin` / `admin123`
3. Click "News Articles" tab
4. You should now see the purple **"Reorder"** button next to "Add News"

## Alternative: Manual Build

If the above doesn't work, try a full rebuild:

```powershell
# Stop all node processes first
Get-Process node | Stop-Process -Force

# Navigate to client directory
cd c:\Users\jassi\Desktop\new-vision-new\client

# Remove node_modules and rebuild
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install

# Go back to root and restart
cd ..
npm run dev
```

## Verification

The Reorder button should appear like this:
- Purple button with grip icon (⋮⋮)
- Text says "Reorder"
- Located to the left of "Add News" button
- Disabled if there are no news articles

Once you click it:
- The button changes to green "Save Order" and gray "Cancel"
- Drag handles appear on each news row
- Purple info banner shows instructions
