# WebSocket Error Handling Explained

## What Happens When Things Go Wrong?

### 1. ❌ **Wrong URL/Host (wsHost)**

**Example:** Change `VITE_REVERB_HOST` from `dev.api.qm.humam.sa` to `wrong-url.com`

**What Happens:**
- ❌ WebSocket connection **FAILS**
- 🔴 Connection status shows: **"Connection Failed"** (red dot)
- Console logs:
  ```
  📡 WebSocket connecting...
  ❌ WebSocket connection failed
  ```

**UI Behavior:**
- First status card: 🔴 "Connection Failed"
- Second status card: Not shown (because not connected)
- Message: "Connect to see events"

---

### 2. ⚠️ **Wrong Channel Name**

**Example:** Change channel from `complaints.global` to `wrong.channel`

**What Happens:**
- ✅ WebSocket connection **SUCCEEDS** (green dot)
- ⚠️ Channel subscription **NEVER CONFIRMS**
- 🟡 Subscription status shows: **"Subscribing..."** (yellow dot)
- After 10 seconds: Console warning:
  ```
  ⚠️ Channel subscription timeout for: wrong.channel
  This might indicate the channel doesn't exist or there's a configuration issue
  ```

**UI Behavior:**
- First status card: 🟢 "Connected"
- Second status card: 🟡 "Subscribing..." → stays yellow
- Message: "Subscribing to channel..."
- After timeout: Warning in console (but UI stays in "subscribing" state)

**Why No Error?**
- Laravel Reverb/Pusher doesn't reject invalid public channel names
- The subscription request is sent, but never confirmed
- This is a limitation of the WebSocket protocol for public channels

---

### 3. ❌ **Wrong Event Name**

**Example:** Change event from `.complaint.created` to `.wrong.event`

**What Happens:**
- ✅ WebSocket connection **SUCCEEDS**
- ✅ Channel subscription **SUCCEEDS**
- 🟢 Both status cards show green
- ❌ But you'll **NEVER receive events** (silent failure)

**UI Behavior:**
- First status card: 🟢 "Connected"
- Second status card: 🟢 "Subscribed • Channel: complaints.global"
- Message: "Waiting for events..." (forever)

**Why No Error?**
- The channel exists and subscription works
- But the event name doesn't match what the backend broadcasts
- No way to detect this from the frontend

---

## Status Indicators Summary

### Connection Status (First Card)

| State | Color | Meaning |
|-------|-------|---------|
| 🟢 Connected | Green | WebSocket connected to server |
| 🟡 Connecting... | Yellow | Attempting to connect |
| 🔴 Connection Failed | Red | Cannot reach WebSocket server |
| ⚫ Disconnected | Gray | Not connected |

### Subscription Status (Second Card - Only shown when connected)

| State | Color | Meaning |
|-------|-------|---------|
| 🟢 Subscribed | Green | Successfully subscribed to channel |
| 🟡 Subscribing... | Yellow | Waiting for subscription confirmation |
| 🔴 Subscription Failed | Red | Channel subscription error (rare) |
| ⚫ Not Subscribed | Gray | Idle state |

---

## How to Diagnose Issues

### Step 1: Check Connection Status
- If 🔴 **Connection Failed**: Check URL, port, SSL settings
- If 🟢 **Connected**: Connection is good, move to next step

### Step 2: Check Subscription Status
- If 🟡 **Subscribing...** (stays yellow): Wrong channel name or backend not running
- If 🟢 **Subscribed**: Channel subscription is good, move to next step

### Step 3: Check Event Reception
- If no events appear: Wrong event name or backend not broadcasting
- Click **"Debug Info"** to verify all settings

### Step 4: Use Debug Info Button
```javascript
🔍 Connection Debug Info: {
  socketId: "123456.789012",     // ✅ Should have a value
  state: "connected",             // ✅ Should be "connected"
  channels: ["complaints.global"] // ✅ Should include your channel
}

👤 Current User: { role: "system_manager", ... }
📡 Channel Name: "complaints.global"  // ✅ Verify this matches backend
🎯 Event Name: ".complaint.created"   // ✅ Verify this matches backend
📊 Subscription State: "subscribed"   // ✅ Should be "subscribed"
```

---

## Testing Error Scenarios

### Test 1: Wrong URL
```env
# In .env, change:
VITE_REVERB_HOST="wrong-url.com"
```
**Expected:** 🔴 Connection Failed

### Test 2: Wrong Channel
```typescript
// In LiveLogsPage.tsx, change:
return "wrong.channel.name";
```
**Expected:** 🟢 Connected, 🟡 Subscribing... (stays yellow)

### Test 3: Wrong Event
```typescript
// In LiveLogsPage.tsx, change:
".complaint.created" to ".wrong.event"
```
**Expected:** 🟢 Connected, 🟢 Subscribed, but no events received

---

## Limitations

### What We CAN Detect:
✅ WebSocket connection failures (wrong URL, port, SSL)  
✅ Network connectivity issues  
✅ Server unavailable  
✅ Subscription timeouts (10 second warning)  

### What We CANNOT Detect:
❌ Invalid channel names (for public channels)  
❌ Wrong event names  
❌ Backend not broadcasting events  
❌ Event data structure mismatches  

### Why These Limitations?
- **Public channels** don't require authorization, so the server accepts any channel name
- **Event listeners** are passive - they just wait, no confirmation if the event name is valid
- This is standard WebSocket/Pusher behavior, not a bug in our implementation

---

## Best Practices

1. **Always use Debug Info** when troubleshooting
2. **Check console logs** for detailed connection flow
3. **Test with Laravel Tinker** to verify backend is broadcasting
4. **Match channel names exactly** between frontend and backend
5. **Remember the dot prefix** for event names (`.complaint.created`)
6. **Wait for green dots** before expecting events
7. **If yellow dot persists**, check channel name and backend

---

## Quick Troubleshooting Checklist

- [ ] Connection status is 🟢 Green
- [ ] Subscription status is 🟢 Green
- [ ] Channel name matches backend exactly
- [ ] Event name matches backend (with dot prefix)
- [ ] Backend Reverb server is running
- [ ] Backend is actually broadcasting events
- [ ] Queue worker is running (if using queued broadcasts)
- [ ] Debug Info shows correct socketId and channels
