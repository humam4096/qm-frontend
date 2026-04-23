# WebSocket Connection Verification Guide

This guide helps you verify that your frontend is correctly connected to your Laravel backend's Reverb WebSocket server.

## 🔍 Quick Verification Steps

### 1. **Check Browser Console Logs**

When you open the Live Logs page, you should see:

```
🔧 Echo Configuration: {
  broadcaster: "reverb",
  key: "1234567890",
  wsHost: "dev.api.qm.humam.sa",
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  authEndpoint: "https://dev.api.qm.humam.sa/broadcasting/auth"
}

📡 WebSocket connecting...
✅ WebSocket connected - Socket ID: 123456.789012
📡 Subscribing to channel: complaints.global
🎧 Listening for event: .complaint.created
✅ Successfully subscribed to: complaints.global
```

### 2. **Click "Debug Info" Button**

On the Live Logs page, click the "Debug Info" button in the top right. This will log:

```javascript
🔍 Connection Debug Info: {
  socketId: "123456.789012",  // Your unique socket ID
  state: "connected",          // Current connection state
  channels: ["complaints.global"] // Active channels
}

👤 Current User: {
  id: 1,
  role: "system_manager",
  scope: { id: 5, name: "Branch Name" }
}

📡 Channel Name: "complaints.global"
🎯 Event Name: ".complaint.created"
```

### 3. **Verify Backend Configuration**

Ensure your Laravel backend has:

#### **config/broadcasting.php**
```php
'reverb' => [
    'driver' => 'reverb',
    'key' => env('REVERB_APP_KEY'),
    'secret' => env('REVERB_APP_SECRET'),
    'app_id' => env('REVERB_APP_ID'),
    'options' => [
        'host' => env('REVERB_HOST', '0.0.0.0'),
        'port' => env('REVERB_PORT', 8080),
        'scheme' => env('REVERB_SCHEME', 'http'),
    ],
],
```

#### **.env (Backend)**
```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=1234567890
REVERB_APP_SECRET=your-secret
REVERB_HOST=dev.api.qm.humam.sa
REVERB_PORT=443
REVERB_SCHEME=https
```

### 4. **Test Event Broadcasting**

#### **Your Laravel Event Class**
```php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ComplaintCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public $complaint
    ) {}

    public function broadcastOn(): Channel
    {
        // For system_manager
        return new Channel('complaints.global');
        
        // For catering_manager (branch-specific)
        // return new Channel('complaints.branch.' . $this->complaint->branch_id);
    }

    public function broadcastAs(): string
    {
        return 'complaint.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->complaint->id,
            'title' => $this->complaint->title,
            'status' => $this->complaint->status,
            'created_at' => $this->complaint->created_at,
        ];
    }
}
```

#### **Trigger the Event**
```php
// In your controller or service
use App\Events\ComplaintCreated;

event(new ComplaintCreated($complaint));
```

### 5. **Test with Tinker**

```bash
php artisan tinker
```

```php
// Create a test complaint
$complaint = (object) [
    'id' => 999,
    'title' => 'Test Complaint',
    'status' => 'pending',
    'created_at' => now(),
];

// Broadcast the event
event(new App\Events\ComplaintCreated($complaint));
```

You should see the event appear in your frontend immediately!

## 🐛 Common Issues & Solutions

### Issue 1: "Connection Failed" or "Connecting..." Forever

**Possible Causes:**
- Reverb server not running
- Wrong host/port configuration
- Firewall blocking WebSocket connections
- SSL certificate issues

**Solutions:**
```bash
# Check if Reverb is running
php artisan reverb:start

# Check with SSL (production)
php artisan reverb:start --host=0.0.0.0 --port=8080

# Verify the server is accessible
curl https://dev.api.qm.humam.sa:443
```

### Issue 2: Connected but No Events Received

**Possible Causes:**
- Channel name mismatch
- Event name mismatch (missing dot prefix)
- Event not implementing `ShouldBroadcast`
- Queue not running (if using queued broadcasts)

**Solutions:**
1. Verify channel names match exactly:
   - Frontend: `complaints.global`
   - Backend: `new Channel('complaints.global')`

2. Verify event names match:
   - Frontend: `.complaint.created` (with dot)
   - Backend: `broadcastAs()` returns `complaint.created` (without dot)

3. Check if queues are running:
```bash
php artisan queue:work
```

### Issue 3: Wrong Channel for User Role

**Check:**
- System Manager should see: `complaints.global`
- Catering Manager should see: `complaints.branch.{id}`

**Debug:**
```javascript
// In browser console after clicking "Debug Info"
// Check if the channel name matches your expectation
```

## 📊 Network Tab Verification

1. Open Chrome DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. You should see a connection to: `wss://dev.api.qm.humam.sa:443`
4. Click on it to see:
   - **Status**: 101 Switching Protocols
   - **Messages**: Subscribe/unsubscribe events

## ✅ Success Indicators

You know everything is working when:

1. ✅ Green dot showing "Connected"
2. ✅ Console shows: `✅ Successfully subscribed to: complaints.global`
3. ✅ Debug Info shows valid `socketId` and correct `channels`
4. ✅ When you trigger an event in Laravel, it appears in the frontend within 1 second
5. ✅ Console shows: `📥 Event received on complaints.global: .complaint.created {data}`

## 🔐 Authentication (If Needed Later)

Currently using **public channels** (no auth required).

If you need **private channels** later:

### Frontend:
```typescript
// In src/lib/echo.ts, add auth headers
echoInstance = new Echo({
  // ... existing config
  auth: {
    headers: {
      Authorization: `Bearer ${yourAuthToken}`,
    },
  },
});
```

### Backend:
```php
// routes/channels.php
Broadcast::channel('complaints.branch.{branchId}', function ($user, $branchId) {
    return $user->scope_id === (int) $branchId;
});
```

## 📝 Checklist

- [ ] Reverb server is running (`php artisan reverb:start`)
- [ ] Frontend shows "Connected" with green dot
- [ ] Console logs show successful subscription
- [ ] Channel name matches between frontend and backend
- [ ] Event name matches (with/without dot prefix)
- [ ] Event implements `ShouldBroadcast`
- [ ] Queue worker is running (if using queued broadcasts)
- [ ] Test event triggers successfully from Tinker
- [ ] Event appears in frontend UI

## 🆘 Still Having Issues?

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check Reverb logs in the terminal where it's running
3. Check browser console for errors
4. Verify network connectivity to WebSocket server
5. Test with a simple public channel first before adding complexity
