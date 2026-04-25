# Live Logs API Integration Summary

## ✅ Completed Integrations

### 1. **Complaints Logs** ✅
- **API Endpoint**: `/complaints`
- **Hook**: `useLiveLogs.ts`
- **Fetches**: Up to 200 complaints on page load
- **Updates**: Real-time via WebSocket events
- **Events**: 
  - `.complaint.created` - Adds new complaint
  - `.complaint.status.updated` - Updates existing complaint

### 2. **Submissions Logs** ✅
- **API Endpoint**: `/form-submissions`
- **Hook**: `useSubmissionLogs.ts`
- **Fetches**: Up to 200 form submissions on page load
- **Updates**: Real-time via WebSocket events
- **Events**:
  - `.submission.created` - Adds new submission
  - `.submission.status.updated` - Updates existing submission

### 3. **Meal Time Logs** ✅
- **API Endpoint**: `/meal-time-window-tracker`
- **Hook**: `useMealTimeLogs.ts`
- **Fetches**: Up to 200 meal time windows on page load
- **Updates**: Real-time via WebSocket events
- **Events**:
  - `.meal.time.window.tracker.updated` - Updates/adds meal time window

---

## ⚠️ Kitchen Stages Logs - No API Available

### Current Status
The **Kitchen Stages Logs** module does NOT have an API endpoint to fetch initial data. It only receives updates via WebSocket events.

### Why?
Kitchen stage progress is likely event-driven and doesn't have a dedicated REST endpoint for listing all progress updates. The data is generated and broadcast in real-time as stages progress.

### Options

#### Option 1: Keep Current Implementation (Recommended)
- Starts with empty logs
- Populates as WebSocket events arrive
- Persists for 2 hours in localStorage
- **Pros**: Simple, works with available infrastructure
- **Cons**: No historical data on first load

#### Option 2: Create Backend Endpoint
If you need historical kitchen stage progress data, ask your backend team to create:

```
GET /kitchen-stage-progress
```

Response:
```json
{
  "data": [
    {
      "id": "stage-123",
      "kitchen_name": "Main Kitchen",
      "stage_name": "Preparation",
      "progress": 75,
      "status": "in_progress",
      "started_at": "2026-04-24T08:00:00Z",
      "updated_at": "2026-04-24T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

Then update the hook:
```typescript
// In useKitchenStageLogs.ts
import { KitchenStageProgressAPI } from "../api/kitchen-stage-progress.api";

const { data: apiResponse, isLoading } = useQuery({
  queryKey: ["kitchen-stage-logs"],
  queryFn: () => KitchenStageProgressAPI.getProgress({ per_page: MAX_LOGS }),
  staleTime: Infinity,
  refetchOnMount: true,
});
```

---

## 📊 Summary Table

| Module | API Endpoint | Initial Fetch | WebSocket Events | Status |
|--------|-------------|---------------|------------------|--------|
| **Complaints** | `/complaints` | ✅ Yes | ✅ Yes | ✅ Complete |
| **Submissions** | `/form-submissions` | ✅ Yes | ✅ Yes | ✅ Complete |
| **Meal Time** | `/meal-time-window-tracker` | ✅ Yes | ✅ Yes | ✅ Complete |
| **Kitchen Stages** | ❌ None | ❌ No | ✅ Yes | ⚠️ Events Only |

---

## 🔄 How It Works Now

### Modules with API (Complaints, Submissions, Meal Time)

```
User opens page
    ↓
Fetch initial data from API (up to 200 records)
    ↓
Display data immediately
    ↓
Connect to WebSocket channel
    ↓
Receive real-time updates
    ↓
Update/add logs in real-time
    ↓
Persist to localStorage (2 hours)
```

### Kitchen Stages (Events Only)

```
User opens page
    ↓
Load persisted data from localStorage (if < 2 hours old)
    ↓
Connect to WebSocket channel
    ↓
Receive real-time updates
    ↓
Add/update logs as events arrive
    ↓
Persist to localStorage (2 hours)
```

---

## 🎯 Benefits of API Integration

### Before (Events Only)
- ❌ Empty page on first visit
- ❌ No historical data
- ❌ Missed events if page not open
- ✅ Real-time updates

### After (API + Events)
- ✅ Shows data immediately
- ✅ Historical data available
- ✅ Catches up on missed events
- ✅ Real-time updates
- ✅ Better user experience

---

## 🧪 Testing

### Check if API Fetch is Working

1. **Open Browser DevTools**
2. **Go to Console tab**
3. **Navigate to a logs page**
4. **Look for console logs**:
   ```
   🔄 Fetching complaints from API...
   ✅ Complaints fetched: {data: [...], pagination: {...}}
   ```

5. **Go to Network tab**
6. **Look for API requests**:
   - `/complaints?per_page=200`
   - `/form-submissions?per_page=200`
   - `/meal-time-window-tracker?per_page=200`

### Verify WebSocket Events

1. **Keep page open**
2. **Trigger an event** (create complaint, update submission, etc.)
3. **Check if log appears** in real-time
4. **Check console** for WebSocket messages

---

## 📝 Configuration

### Persistence Duration
**File**: `src/lib/persistQueryClient.ts`

```typescript
maxAge: 1000 * 60 * 60 * 2, // 2 hours
```

### Max Logs Per Module
**Files**: Each `use[Module]Logs.ts`

```typescript
const MAX_LOGS = 200;
```

### Query Keys
```typescript
"complaints-logs"     // Complaints
"submission-logs"     // Submissions  
"meal-time-logs"      // Meal Time
"kitchen-stage-logs"  // Kitchen Stages (events only)
```

---

## 🚀 Next Steps

1. ✅ **Test all three integrated modules** (Complaints, Submissions, Meal Time)
2. ✅ **Verify API calls in Network tab**
3. ✅ **Test WebSocket events**
4. ⚠️ **Decide on Kitchen Stages**: Keep as-is or request backend endpoint
5. ✅ **Monitor localStorage usage**
6. ✅ **Test persistence** (refresh page after < 2 hours)

---

## 💡 Recommendations

1. **Keep Kitchen Stages as-is** unless historical data is critical
2. **Monitor API performance** with 200 records per request
3. **Consider pagination** if data grows significantly
4. **Add error handling** for failed API requests
5. **Add retry logic** for transient failures

---

## 🔧 Troubleshooting

### API Not Fetching
- Check console for errors
- Verify API endpoint exists
- Check authentication/permissions
- Clear localStorage and retry

### WebSocket Not Updating
- Check connection status indicator
- Verify channel name in console
- Check backend broadcasting
- Verify user role/permissions

### Data Not Persisting
- Check localStorage quota
- Verify query key in `persistQueryClient.ts`
- Check browser localStorage settings
- Try clearing cache

---

## ✅ Conclusion

Three out of four live logs modules now fetch initial data from APIs, providing a much better user experience with immediate data display and historical context. Kitchen Stages remains event-driven, which is acceptable for real-time progress tracking.
