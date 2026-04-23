# Private Channels Setup

The WebSocket integration now uses **private channels** for both global and branch-specific channels, requiring authentication.

---

## 🔐 What Changed

### 1. **Echo Configuration** (`src/lib/echo.ts`)

**Added Authentication Headers:**
```typescript
import { api } from "./api";

const token = api.getToken();

const config = {
  // ... existing config
  authEndpoint: `${import.meta.env.VITE_SERVER_API_LIVE}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  },
};
```

**What This Does:**
- Retrieves the user's auth token from localStorage
- Sends it with every channel subscription request
- Laravel validates the token and authorizes the subscription

---

### 2. **Channel Hook** (`src/hooks/useEchoChannel.ts`)

**Changed from Public to Private:**
```typescript
// ❌ Before (Public Channel)
const channel = echo.channel(channelName);

// ✅ After (Private Channel)
const channel = echo.private(channelName);
```

**Updated Cleanup:**
```typescript
// ❌ Before
echo.leaveChannel(channelName);

// ✅ After
echo.leave(`private-${channelName}`);
```

---

## 🔧 Backend Requirements

Your Laravel backend must now handle private channel authorization:

### 1. **Update Event Class**

```php
// app/Events/ComplaintCreated.php

use Illuminate\Broadcasting\PrivateChannel;

class ComplaintCreated implements ShouldBroadcast
{
    public function broadcastOn(): Channel
    {
        // ❌ Before (Public)
        // return new Channel('complaints.global');
        
        // ✅ After (Private)
        return new PrivateChannel('complaints.global');
        
        // For branch-specific:
        // return new PrivateChannel('complaints.branch.' . $this->complaint->branch_id);
    }
}
```

### 2. **Define Channel Authorization** (`routes/channels.php`)

```php
use Illuminate\Support\Facades\Broadcast;

// Global channel - Only system managers
Broadcast::channel('complaints.global', function ($user) {
    return $user->role === 'system_manager';
});

// Branch-specific channel - Only catering managers for their branch
Broadcast::channel('complaints.branch.{branchId}', function ($user, $branchId) {
    return $user->role === 'catering_manager' 
        && $user->scope_id === (int) $branchId;
});
```

### 3. **Ensure Broadcasting Auth Route Exists** (`routes/api.php`)

```php
// This should already exist, but verify:
Broadcast::routes(['middleware' => ['auth:sanctum']]);
```

---

## 🔍 How It Works

### Authentication Flow:

1. **User logs in** → Token stored in localStorage
2. **Echo initializes** → Token added to auth headers
3. **Subscribe to private channel** → Echo makes POST request:
   ```
   POST https://dev.api.qm.humam.sa/broadcasting/auth
   Headers: {
     Authorization: Bearer <token>
   }
   Body: {
     socket_id: "123456.789012",
     channel_name: "private-complaints.global"
   }
   ```
4. **Laravel validates** → Checks token and runs authorization callback
5. **Laravel returns signature** → If authorized
6. **Echo subscribes** → Using the signature
7. **Subscription succeeds** → Green dot in UI

---

## ✅ Testing Private Channels

### Test 1: Valid Token

**Expected:**
- 🟢 Connection succeeds
- 🟢 Subscription succeeds
- ✅ Events received

**Console:**
```
📡 Subscribing to private channel: complaints.global
✅ Successfully subscribed to private channel: complaints.global
```

---

### Test 2: No Token (Logged Out)

**Expected:**
- 🟢 Connection succeeds (WebSocket doesn't need auth)
- 🔴 Subscription fails (Channel auth fails)
- ❌ No events received

**Console:**
```
📡 Subscribing to private channel: complaints.global
❌ Channel subscription error (complaints.global): Unauthorized
```

---

### Test 3: Wrong Role

**Example:** Quality Inspector trying to access global channel

**Expected:**
- 🟢 Connection succeeds
- 🔴 Subscription fails (Authorization callback returns false)
- ❌ No events received

**Console:**
```
❌ Channel subscription error (complaints.global): Forbidden
```

---

### Test 4: Catering Manager - Wrong Branch

**Example:** Manager for branch 5 trying to access branch 10

**Expected:**
- 🟢 Connection succeeds
- 🔴 Subscription fails (scope_id doesn't match)
- ❌ No events received

---

## 🐛 Troubleshooting

### Issue 1: "Unauthorized" Error

**Symptoms:**
- Connection succeeds
- Subscription fails with "Unauthorized"

**Causes:**
- No auth token
- Invalid/expired token
- Token not being sent in headers

**Solutions:**
```typescript
// Check if token exists
const token = api.getToken();
console.log("Token:", token ? "Present" : "Missing");

// Check Echo config
console.log("Auth Header:", config.auth.headers.Authorization);
```

---

### Issue 2: "Forbidden" Error

**Symptoms:**
- Connection succeeds
- Token is valid
- Subscription fails with "Forbidden"

**Causes:**
- User doesn't have permission for this channel
- Authorization callback returns false

**Solutions:**
```php
// In routes/channels.php, add logging
Broadcast::channel('complaints.global', function ($user) {
    \Log::info('Channel auth attempt', [
        'user_id' => $user->id,
        'role' => $user->role,
    ]);
    
    return $user->role === 'system_manager';
});
```

---

### Issue 3: Auth Endpoint Not Found (404)

**Symptoms:**
- Subscription fails with 404 error

**Causes:**
- Broadcasting routes not registered
- Wrong auth endpoint URL

**Solutions:**
```php
// In routes/api.php or routes/channels.php
Broadcast::routes(['middleware' => ['auth:sanctum']]);

// Verify endpoint exists:
php artisan route:list | grep broadcasting
```

---

## 📊 Comparison: Public vs Private

| Feature | Public Channel | Private Channel |
|---------|---------------|-----------------|
| **Syntax** | `echo.channel()` | `echo.private()` |
| **Auth Required** | ❌ No | ✅ Yes |
| **Token Needed** | ❌ No | ✅ Yes |
| **Authorization** | None | Laravel callback |
| **Security** | Low | High |
| **Use Case** | Public data | User-specific data |

---

## 🔐 Security Benefits

### Before (Public Channels):
- ❌ Anyone could subscribe to any channel
- ❌ No access control
- ❌ Data exposed to all connected clients

### After (Private Channels):
- ✅ Only authenticated users can subscribe
- ✅ Role-based access control
- ✅ Branch-specific data isolation
- ✅ Laravel validates every subscription

---

## 📝 Summary

**Frontend Changes:**
1. ✅ Added auth token to Echo config
2. ✅ Changed `echo.channel()` to `echo.private()`
3. ✅ Updated cleanup to use `echo.leave()`

**Backend Requirements:**
1. ✅ Change `Channel` to `PrivateChannel` in events
2. ✅ Define authorization in `routes/channels.php`
3. ✅ Ensure broadcasting auth routes are registered

**Result:**
- 🔐 Secure, authenticated WebSocket channels
- 👥 Role-based access control
- 🏢 Branch-specific data isolation
- ✅ Production-ready implementation

---

## 🧪 Quick Test

```bash
# In Laravel Tinker
php artisan tinker

# Create test complaint
$complaint = (object) [
    'id' => '999',
    'description' => 'Test complaint',
    'status' => 'open',
    'priority' => 'high',
    'created_at' => now(),
    'resolved_at' => null,
    'resolution_notes' => null,
    'complaint_type' => (object) ['id' => '1', 'name' => 'Food Quality'],
    'kitchen' => (object) ['id' => '1', 'name' => 'Main Kitchen'],
    'raised_by' => (object) ['id' => '1', 'name' => 'John Doe'],
];

# Broadcast event
event(new App\Events\ComplaintCreated($complaint));
```

If everything is set up correctly:
- ✅ Frontend shows green "Subscribed" status
- ✅ Event appears in UI immediately
- ✅ Console logs show successful subscription
