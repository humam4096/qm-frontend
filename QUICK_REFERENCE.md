# Live Logs Modules - Quick Reference Card

## 🎯 Module Quick Reference

| Module | Channel Pattern | Events | Query Key |
|--------|----------------|--------|-----------|
| **Submissions** | `submissions.{global\|branch.{id}}` | `submission.created`<br>`submission.status.updated` | `submission-logs` |
| **Kitchen Stages** | `kitchen-stage-progress.{global\|branch.{id}}` | `kitchen.stage.progress.updated` | `kitchen-stage-logs` |
| **Meal Time** | `meal-time-window-tracker.{global\|branch.{id}}` | `meal.time.window.tracker.updated` | `meal-time-logs` |

---

## 📁 File Locations

```
src/modules/live-logs/
├── submissions-logs/
├── kitchen-stages-logs/
└── meal-time-logs/
```

---

## 🔧 Configuration

### Persistence (Already Configured ✅)
**File:** `src/lib/persistQueryClient.ts`
- **Duration:** 24 hours
- **Storage:** localStorage
- **Query Keys:** All three modules included

### Memory Limits
**Each Module:** 200 logs maximum
**Location:** `MAX_LOGS` constant in each `use[Module]Logs.ts` file

---

## 🚀 Integration Checklist

### Routes (Add to `routeConfig.ts`)
```typescript
{ path: "/submissions-logs", element: <SubmissionLogsPage /> }
{ path: "/kitchen-stages-logs", element: <KitchenStageLogsPage /> }
{ path: "/meal-time-logs", element: <MealTimeLogsPage /> }
```

### Navigation (Add to `navigationConfig.ts`)
```typescript
{ title: "Submissions", path: "/submissions-logs", icon: FileTextIcon }
{ title: "Kitchen Stages", path: "/kitchen-stages-logs", icon: ActivityIcon }
{ title: "Meal Time", path: "/meal-time-logs", icon: ClockIcon }
```

### Imports
```typescript
import { SubmissionLogsPage } from "@/modules/live-logs/submissions-logs/pages/SubmissionLogsPage";
import { KitchenStageLogsPage } from "@/modules/live-logs/kitchen-stages-logs/pages/KitchenStageLogsPage";
import { MealTimeLogsPage } from "@/modules/live-logs/meal-time-logs/pages/MealTimeLogsPage";
```

---

## 🎨 Status Colors Reference

### Submissions
- `under_supervisor_review` → Yellow
- `under_quality_manager_review` → Blue
- `approved_by_quality_manager` → Green

### Kitchen Stages
- `not_started` → Gray
- `in_progress` → Blue
- `completed` → Green
- `paused` → Yellow

### Meal Time
- `not_started` → Gray
- `preparation` → Yellow
- `cooking` → Orange
- `serving` → Blue
- `completed` → Green
- `delayed` → Red

---

## 🔌 WebSocket Events

### Backend Must Broadcast To:

**Submissions:**
```php
// On create
broadcast(new SubmissionCreated($submission))
  ->toOthers();

// On status update
broadcast(new SubmissionStatusUpdated($submission))
  ->toOthers();
```

**Kitchen Stages:**
```php
broadcast(new KitchenStageProgressUpdated($stage))
  ->toOthers();
```

**Meal Time:**
```php
broadcast(new MealTimeWindowTrackerUpdated($mealTime))
  ->toOthers();
```

---

## 🧪 Quick Test

1. **Open DevTools Console**
2. **Navigate to any log page**
3. **Check for:** `"Connected to channel: [channel-name]"`
4. **Trigger backend event**
5. **Verify log appears in UI**

---

## 🔧 Common Customizations

### Change Log Limit
```typescript
// In use[Module]Logs.ts
const MAX_LOGS = 100; // Change from 200
```

### Change Persistence Duration
```typescript
// In persistQueryClient.ts
maxAge: 1000 * 60 * 60 * 48, // 48 hours instead of 24
```

### Add More Roles
```typescript
// In use[Module]LogsController.ts
if (user.role === "branch_manager" && user.scope?.id) {
  return `[channel].branch.${user.scope.id}`;
}
```

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Max logs per module | 200 |
| Memory per log | ~2KB |
| Total memory (3 modules) | ~1.2MB |
| Persistence duration | 24 hours |
| Storage location | localStorage |

---

## 🐛 Troubleshooting

### Logs Not Appearing
1. Check WebSocket connection status
2. Verify channel name in DevTools
3. Check user role and scope
4. Verify backend is broadcasting to correct channel

### Logs Not Persisting
1. Check localStorage quota
2. Verify query key matches in `persistQueryClient.ts`
3. Check browser localStorage settings

### Connection Failed
1. Verify Echo configuration
2. Check WebSocket server status
3. Verify authentication token
4. Check CORS settings

---

## 📞 Support

- **Documentation:** See `ALL_LIVE_LOGS_MODULES_SUMMARY.md`
- **Detailed Guides:** See individual module `.md` files
- **Pattern Reference:** Check existing `complaint-logs` module

---

## ✅ Done!

All three modules are ready to use. Just add the routes and navigation links!
