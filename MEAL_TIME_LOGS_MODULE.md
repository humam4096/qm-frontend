# Meal Time Logs Module

## 📦 Module Overview

**Purpose:** Real-time monitoring of meal time window tracker updates

**Location:** `src/modules/live-logs/meal-time-logs/`

**Channel Configuration:**
- **Global Channel:** `meal-time-window-tracker.global` (for system_manager)
- **Branch Channel:** `meal-time-window-tracker.branch.{branchId}` (for catering_manager)

**Events Listened:**
- `meal.time.window.tracker.updated` - Meal time window tracker updated

---

## 📁 Files Created

```
src/modules/live-logs/meal-time-logs/
├── types/
│   └── index.ts                          # MealTimeLog type definitions
├── hooks/
│   ├── useMealTimeLogs.ts                # Log state management
│   └── useMealTimeLogsController.ts      # WebSocket connection & event handling
├── components/
│   ├── MealTimeLogItem.tsx               # Individual log card with progress bar
│   ├── MealTimeLogsList.tsx              # List container with loading states
│   └── ConnectionHeader.tsx              # Connection status & controls
└── pages/
    └── MealTimeLogsPage.tsx              # Main page component
```

---

## 🎨 Features

### Visual Elements
- **Status Badges** with color coding:
  - `not_started` - Gray
  - `preparation` - Yellow
  - `cooking` - Orange
  - `serving` - Blue
  - `completed` - Green
  - `delayed` - Red

- **Progress Bar** with dynamic colors based on completion percentage
- **Current Stage Badge** showing the active stage
- **Time Window Display** showing start and end times
- **Meal Metrics** showing prepared and served counts

### Data Display
- Meal name and kitchen information
- Branch information (when applicable)
- Service date and time window
- Progress percentage with visual bar
- Total meals prepared and served
- Updated by user information
- Notes section for additional context
- Relative timestamps (e.g., "2 minutes ago")

### Interaction Features
- Real-time updates via WebSocket
- Pause/Resume streaming
- Clear logs button
- 200-log memory cap with auto-pruning
- 24-hour persistence in localStorage

---

## 🔧 Type Definitions

```typescript
export interface MealTimeLog {
  id: string;
  meal_time_window_id: string;
  meal_name: string;
  kitchen_id: string;
  kitchen_name: string;
  branch_id?: string;
  branch_name?: string;
  start_time: string;
  end_time: string;
  service_date: string;
  status: MealTimeStatus;
  progress: number;
  current_stage?: string;
  total_meals_prepared?: number;
  total_meals_served?: number;
  notes?: string;
  updated_at: string;
  updated_by?: User;
}

export type MealTimeStatus = 
  | "not_started"
  | "preparation"
  | "cooking"
  | "serving"
  | "completed"
  | "delayed"
  | string;
```

---

## 🔌 Integration Steps

### 1. Add Route

Update your router configuration (e.g., `src/app/router/routeConfig.ts`):

```typescript
import { MealTimeLogsPage } from "@/modules/live-logs/meal-time-logs/pages/MealTimeLogsPage";

// Add to your routes array:
{
  path: "/meal-time-logs",
  element: <MealTimeLogsPage />,
  // Add role guards as needed
}
```

### 2. Add Navigation Link

Update your navigation configuration (e.g., `src/app/router/navigationConfig.ts`):

```typescript
{
  title: "Meal Time Logs",
  path: "/meal-time-logs",
  icon: ClockIcon, // or your preferred icon
  roles: ["system_manager", "catering_manager"]
}
```

### 3. Verify Persistence Configuration

The module is already configured for 24-hour persistence in `src/lib/persistQueryClient.ts`:

```typescript
dehydrateOptions: {
  shouldDehydrateQuery: (query) =>
    query.queryKey[0] === "complaints-logs" ||
    query.queryKey[0] === "submission-logs" ||
    query.queryKey[0] === "kitchen-stage-logs" ||
    query.queryKey[0] === "meal-time-logs", // ✅ Added
}
```

---

## 📊 Data Flow

```
Backend Event → WebSocket → Echo Channel → useEchoChannel Hook
                                              ↓
                                    useMealTimeLogsController
                                              ↓
                                      useMealTimeLogs (React Query)
                                              ↓
                                      MealTimeLogsPage
                                              ↓
                                      MealTimeLogsList
                                              ↓
                                      MealTimeLogItem (UI)
```

---

## 🎯 Key Implementation Details

### Event Handling Strategy

The module uses an **upsert pattern** for the `meal.time.window.tracker.updated` event:

```typescript
useEchoChannel<MealTimeLog>(
  channelName || "",
  ".meal.time.window.tracker.updated",
  (updatedMealTime) => {
    // Check if log exists, update it, otherwise add it
    const existingLog = logs.find(log => log.id === updatedMealTime.id);
    if (existingLog) {
      updateLog(updatedMealTime.id, updatedMealTime);
    } else {
      addLog(updatedMealTime);
    }
  }
);
```

This ensures that:
- New meal time windows are added to the list
- Existing meal time windows are updated in place
- Progress updates are reflected in real-time
- No duplicate entries are created

### Memory Management

- **Max Logs:** 200 entries (configurable via `MAX_LOGS` constant)
- **Persistence:** 24 hours in localStorage
- **Auto-pruning:** Oldest logs are removed when limit is reached

### Role-Based Access

```typescript
const channelName = useMemo(() => {
  if (!user) return null;

  if (user.role === "system_manager") 
    return "meal-time-window-tracker.global";
    
  if (user.role === "catering_manager" && user.scope?.id) {
    return `meal-time-window-tracker.branch.${user.scope.id}`;
  }

  return null;
}, [user]);
```

---

## 🧪 Testing Checklist

- [ ] Verify WebSocket connection establishes
- [ ] Test global channel (system_manager role)
- [ ] Test branch channel (catering_manager role)
- [ ] Verify meal.time.window.tracker.updated events are received
- [ ] Test progress bar updates in real-time
- [ ] Test status badge color changes
- [ ] Test pause/resume functionality
- [ ] Test clear logs functionality
- [ ] Verify 200-log memory cap
- [ ] Test 24-hour persistence (refresh page)
- [ ] Test responsive design on mobile
- [ ] Verify loading states
- [ ] Test connection failure states
- [ ] Verify role-based access control
- [ ] Test with missing optional fields (notes, updated_by, etc.)

---

## 🎨 Customization Options

### Adjust Log Limit

```typescript
// In useMealTimeLogs.ts
const MAX_LOGS = 300; // Increase or decrease as needed
```

### Add More Status Types

```typescript
// In types/index.ts
export type MealTimeStatus = 
  | "not_started"
  | "preparation"
  | "cooking"
  | "serving"
  | "completed"
  | "delayed"
  | "cancelled"  // Add new status
  | string;

// In MealTimeLogItem.tsx
const getStatusColor = (status: string) => {
  switch (status) {
    // ... existing cases
    case "cancelled":
      return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
    // ...
  }
};
```

### Add Filtering by Status

```typescript
// In MealTimeLogsPage.tsx
const [statusFilter, setStatusFilter] = useState<string>("all");

const filteredLogs = useMemo(() => {
  if (statusFilter === "all") return logs;
  return logs.filter(log => log.status === statusFilter);
}, [logs, statusFilter]);
```

### Add Sorting Options

```typescript
const [sortBy, setSortBy] = useState<"time" | "progress">("time");

const sortedLogs = useMemo(() => {
  return [...logs].sort((a, b) => {
    if (sortBy === "progress") {
      return b.progress - a.progress;
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}, [logs, sortBy]);
```

---

## 📝 Backend Event Example

Expected event payload structure:

```json
{
  "id": "mtw-123",
  "meal_time_window_id": "window-456",
  "meal_name": "Lunch Service",
  "kitchen_id": "kitchen-789",
  "kitchen_name": "Main Kitchen",
  "branch_id": "branch-101",
  "branch_name": "Downtown Branch",
  "start_time": "12:00",
  "end_time": "14:00",
  "service_date": "2026-04-24",
  "status": "serving",
  "progress": 65,
  "current_stage": "Main Course",
  "total_meals_prepared": 150,
  "total_meals_served": 98,
  "notes": "Running smoothly",
  "updated_at": "2026-04-24T13:30:00Z",
  "updated_by": {
    "id": "user-202",
    "name": "John Doe",
    "role": "kitchen_manager"
  }
}
```

---

## 🚀 Summary

The Meal Time Logs module provides comprehensive real-time tracking of meal preparation and service windows with:

✅ Real-time WebSocket updates  
✅ Visual progress tracking  
✅ Status-based color coding  
✅ 24-hour persistence  
✅ Role-based channel access  
✅ Responsive design  
✅ Memory-efficient with auto-pruning  
✅ Comprehensive meal metrics display  

The module follows the same proven pattern as the other log modules, ensuring consistency and maintainability across your application.
