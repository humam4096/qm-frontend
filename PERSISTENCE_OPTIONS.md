# Persistence Options for Live Logs

## Current Setup: ✅ 2-Hour Persistence (Recommended)

The live logs now persist for **2 hours** instead of 24 hours. This provides:
- Fast initial load (shows cached data immediately)
- Fresh data (refetches in background)
- Reasonable storage usage

## Option 2: Remove Persistence Completely

If you want to **remove persistence** and always fetch fresh data:

### Step 1: Update `persistQueryClient.ts`

```typescript
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      // Remove these lines to disable persistence for live logs:
      // query.queryKey[0] === "complaints-logs" ||
      // query.queryKey[0] === "submission-logs" ||
      // query.queryKey[0] === "meal-time-logs",
      false, // Don't persist any live logs
  },
});
```

### Step 2: Update the hooks to remove `staleTime: Infinity`

**In `useLiveLogs.ts` and `useMealTimeLogs.ts`:**

```typescript
const { data: apiResponse, isLoading, isFetching } = useQuery({
  queryKey: ["complaints-logs"], // or ["meal-time-logs"]
  queryFn: async () => {
    const response = await API.getData({ per_page: MAX_LOGS });
    return response;
  },
  // Remove: staleTime: Infinity,
  staleTime: 0, // Always consider data stale
  refetchOnMount: true,
  refetchOnWindowFocus: false,
});
```

## Comparison

| Feature | With Persistence (2h) | Without Persistence |
|---------|----------------------|---------------------|
| **Initial Load Speed** | ⚡ Instant (cached) | 🐌 Waits for API |
| **Data Freshness** | ✅ Refetches in background | ✅ Always fresh |
| **Offline Viewing** | ✅ Shows last data | ❌ Shows nothing |
| **API Calls** | 📉 Fewer calls | 📈 More calls |
| **Storage Usage** | 💾 Uses localStorage | 💾 No storage used |
| **Complexity** | 🔧 More complex | 🔧 Simpler |

## My Recommendation

**Keep the 2-hour persistence** because:

1. ✅ **Better UX** - Users see data instantly
2. ✅ **Less server load** - Fewer API calls
3. ✅ **Still fresh** - 2 hours is reasonable for live logs
4. ✅ **Background refetch** - Data updates automatically with `refetchOnMount: true`

## How It Works Now

```
User opens page
    ↓
Shows cached data (if < 2 hours old) ← INSTANT
    ↓
Fetches fresh data in background ← UPDATES
    ↓
Replaces cached data with fresh data
    ↓
WebSocket events update in real-time
```

## If You Want Different Durations

```typescript
// 30 minutes
maxAge: 1000 * 60 * 30

// 1 hour
maxAge: 1000 * 60 * 60

// 2 hours (current)
maxAge: 1000 * 60 * 60 * 2

// 6 hours
maxAge: 1000 * 60 * 60 * 6

// 24 hours (original)
maxAge: 1000 * 60 * 60 * 24
```

## Testing

To test the behavior:

1. **With Persistence:**
   - Open page → See data instantly
   - Refresh → See same data instantly, then updates
   - Wait 2+ hours → Fetches fresh data

2. **Without Persistence:**
   - Open page → Loading spinner → See data
   - Refresh → Loading spinner → See data
   - Always fetches from API

## Clear Cache for Testing

```javascript
// In browser console
localStorage.clear()
location.reload()
```
