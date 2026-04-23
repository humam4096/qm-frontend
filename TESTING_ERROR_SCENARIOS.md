# Testing WebSocket Error Scenarios

This guide shows you exactly what to change to trigger each error state.

---

## 🔴 Scenario 1: Connection Failed (Wrong URL)

### What to Change:
Edit `.env` file and change the host to an invalid URL:

```env
# ❌ Change this:
VITE_REVERB_HOST="dev.api.qm.humam.sa"

# ✅ To this (invalid URL):
VITE_REVERB_HOST="wrong-url-that-does-not-exist.com"
```

### Expected Result:
- 🔴 First card: "Connection Failed" (red dot)
- ⚫ Second card: Not shown (because not connected)
- Console logs:
  ```
  📡 WebSocket connecting...
  ❌ WebSocket connection failed
  ```

### How to Test:
1. Change `.env` file
2. Restart your dev server (`npm run dev`)
3. Open Live Logs page
4. See red "Connection Failed" status

---

## 🟡 Scenario 2: Subscription Timeout (Wrong Channel)

### What to Change:
Edit `src/modules/live-logs/pages/LiveLogsPage.tsx`:

```typescript
const channelName = useMemo(() => {
  if (!user) return null;

  if (user.role === "system_manager") {
    // ❌ Change this:
    return "complaints.global";
    
    // ✅ To this (wrong channel):
    return "wrong.channel.name";
  }

  if (user.role === "catering_manager" && user.scope?.id) {
    // ❌ Change this:
    return `complaints.branch.${user.scope.id}`;
    
    // ✅ To this (wrong channel):
    return `wrong.branch.${user.scope.id}`;
  }

  return null;
}, [user]);
```

### Expected Result:
- 🟢 First card: "Connected" (green dot)
- 🟡 Second card: "Subscribing..." (yellow dot - stays yellow)
- After 10 seconds, console warning:
  ```
  ⚠️ Channel subscription timeout for: wrong.channel.name
  This might indicate the channel doesn't exist or there's a configuration issue
  ```

### How to Test:
1. Change channel name in code
2. Save file (hot reload)
3. Watch subscription status stay yellow
4. Wait 10 seconds for timeout warning

---

## 🟢 Scenario 3: Wrong Event Name (Silent Failure)

### What to Change:
Edit `src/modules/live-logs/pages/LiveLogsPage.tsx`:

```typescript
const { subscriptionState, isSubscribed } = useEchoChannel<ComplaintEvent>(
  channelName || "",
  // ❌ Change this:
  ".complaint.created",
  
  // ✅ To this (wrong event):
  ".wrong.event.name",
  
  handleEventReceived,
  {
    onSubscribed: handleSubscribed,
    onError: handleError,
  }
);
```

### Expected Result:
- 🟢 First card: "Connected" (green dot)
- 🟢 Second card: "Subscribed" (green dot)
- ✅ Console shows: "Successfully subscribed to: complaints.global"
- ❌ But NO events will ever be received
- Message: "Waiting for events..." (forever)

### How to Test:
1. Change event name in code
2. Save file (hot reload)
3. Both status cards show green
4. Trigger event from backend
5. Nothing appears in UI (silent failure)

---

## 🔴 Scenario 4: Wrong Port

### What to Change:
Edit `.env` file:

```env
# ❌ Change this:
VITE_REVERB_PORT=443

# ✅ To this (wrong port):
VITE_REVERB_PORT=9999
```

### Expected Result:
- 🔴 First card: "Connection Failed" (red dot)
- Console logs:
  ```
  ❌ WebSocket unavailable
  ```

### How to Test:
1. Change port in `.env`
2. Restart dev server
3. Open Live Logs page
4. See red "Connection Failed"

---

## 🔴 Scenario 5: Wrong Scheme (HTTP instead of HTTPS)

### What to Change:
Edit `.env` file:

```env
# ❌ Change this:
VITE_REVERB_SCHEME=https

# ✅ To this (wrong scheme):
VITE_REVERB_SCHEME=http
```

### Expected Result:
- 🔴 First card: "Connection Failed" (red dot)
- Browser may show mixed content error (HTTPS page trying to connect to WS instead of WSS)

### How to Test:
1. Change scheme in `.env`
2. Restart dev server
3. Open Live Logs page
4. See connection failure

---

## 🔴 Scenario 6: Missing Auth Token (For Private Channels)

**Note:** This only applies if you switch to private channels later.

### What to Change:
Edit `src/lib/echo.ts`:

```typescript
echoInstance = new Echo({
  // ... existing config
  auth: {
    headers: {
      // ❌ Provide invalid or missing token:
      Authorization: `Bearer invalid-token-here`,
    },
  },
});
```

### Expected Result:
- 🟢 First card: "Connected" (green dot)
- 🔴 Second card: "Subscription Failed" (red dot)
- Error message shown in UI

---

## 🧪 Quick Test Script

Here's a quick way to test all scenarios:

### Test 1: Wrong URL
```bash
# In .env
VITE_REVERB_HOST="invalid.url.com"
npm run dev
```

### Test 2: Wrong Channel
```typescript
// In LiveLogsPage.tsx
return "test.wrong.channel";
```

### Test 3: Wrong Event
```typescript
// In LiveLogsPage.tsx
".test.wrong.event"
```

### Test 4: Backend Not Running
```bash
# Stop your Laravel Reverb server
# Frontend will connect but subscription will timeout
```

---

## 📊 Error State Summary

| Scenario | Connection | Subscription | Events | Detection |
|----------|-----------|--------------|--------|-----------|
| Wrong URL | 🔴 Failed | ⚫ N/A | ❌ None | ✅ Immediate |
| Wrong Port | 🔴 Failed | ⚫ N/A | ❌ None | ✅ Immediate |
| Wrong Scheme | 🔴 Failed | ⚫ N/A | ❌ None | ✅ Immediate |
| Wrong Channel | 🟢 Connected | 🟡 Timeout | ❌ None | ⚠️ 10s delay |
| Wrong Event | 🟢 Connected | 🟢 Subscribed | ❌ None | ❌ Silent |
| Backend Down | 🔴 Failed | ⚫ N/A | ❌ None | ✅ Immediate |

---

## 🎯 Recommended Test Order

1. **Start with working config** - Verify everything is green
2. **Test wrong URL** - See connection failure
3. **Fix URL, test wrong channel** - See subscription timeout
4. **Fix channel, test wrong event** - See silent failure
5. **Fix everything** - Back to working state

---

## 🔍 Debug Checklist

When testing, always:
- [ ] Check browser console for logs
- [ ] Click "Debug Info" button
- [ ] Check Network tab for WebSocket connection
- [ ] Verify both status cards
- [ ] Wait 10 seconds for timeout warnings
- [ ] Try triggering events from backend

---

## 💡 Pro Tips

1. **Use browser DevTools Network tab**
   - Filter by "WS" to see WebSocket connections
   - Check connection status (101 = success)
   - View messages tab to see subscribe/unsubscribe

2. **Check Console Logs**
   - Look for 🔧 Echo Configuration
   - Look for ✅ Successfully subscribed
   - Look for ⚠️ Timeout warnings
   - Look for ❌ Error messages

3. **Test with Laravel Tinker**
   ```php
   // Trigger a test event
   event(new App\Events\ComplaintCreated($complaint));
   ```

4. **Verify Backend is Broadcasting**
   ```bash
   # Check Laravel logs
   tail -f storage/logs/laravel.log
   
   # Check Reverb is running
   php artisan reverb:start
   ```
