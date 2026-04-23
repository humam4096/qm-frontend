# Live Logs Modules Summary

This document summarizes the two new live logs modules created for real-time monitoring.

## 📦 Modules Created

### 1. Submissions Logs Module (`src/modules/submissions-logs/`)

**Purpose:** Real-time monitoring of submission creation and status updates

**Channel Configuration:**
- **Global Channel:** `submissions.global` (for system_manager)
- **Branch Channel:** `submissions.branch.{branchId}` (for catering_manager)

**Events Listened:**
- `submission.created` - New submission created
- `submission.status.updated` - Submission status changed

**Files Created:**
```
src/modules/submissions-logs/
├── types/
│   └── index.ts                          # SubmissionLog type definitions
├── hooks/
│   ├── useSubmissionLogs.ts              # Log state management
│   └── useSubmissionLogsController.ts    # WebSocket connection & event handling
├── components/
│   ├── SubmissionLogItem.tsx             # Individual log card display
│   ├── SubmissionLogsList.tsx            # List container with loading states
│   └── ConnectionHeader.tsx              # Connection status & controls
└── pages/
    └── SubmissionLogsPage.tsx            # Main page component
```

**Features:**
- Real-time submission tracking
- Status badge with color coding
- Branch approval status display
- Score and inspection date tracking
- Submitted by user information
- Time slot reference
- Notes display

---

### 2. Kitchen Stages Logs Module (`src/modules/kitchen-stages-logs/`)

**Purpose:** Real-time monitoring of kitchen stage progress updates

**Channel Configuration:**
- **Global Channel:** `kitchen-stage-progress.global` (for system_manager)
- **Branch Channel:** `kitchen-stage-progress.branch.{branchId}` (for catering_manager)

**Events Listened:**
- `kitchen.stage.progress.updated` - Kitchen stage progress updated

**Files Created:**
```
src/modules/kitchen-stages-logs/
├── types/
│   └── index.ts                          # KitchenStageLog type definitions
├── hooks/
│   ├── useKitchenStageLogs.ts            # Log state management
│   └── useKitchenStageLogsController.ts  # WebSocket connection & event handling
├── components/
│   ├── KitchenStageLogItem.tsx           # Individual log card with progress bar
│   ├── KitchenStageLogsList.tsx          # List container with loading states
│   └── ConnectionHeader.tsx              # Connection status & controls
└── pages/
    └── KitchenStageLogsPage.tsx          # Main page component
```

**Features:**
- Real-time stage progress tracking
- Visual progress bar with color coding
- Status badges (not_started, in_progress, completed, paused)
- Kitchen name display
- Started/completed timestamps
- Updated by user information
- Notes display

---

## 🎨 Common Features

Both modules share these features:

1. **Role-Based Channel Selection**
   - System managers see global activity
   - Catering managers see branch-specific activity

2. **Connection Management**
   - Real-time connection status indicator
   - Animated pulse on active connection
   - Connection state display (connected/connecting/failed)

3. **Log Controls**
   - Pause/Resume streaming
   - Clear logs button
   - Maximum 50 logs in memory (auto-pruning)

4. **UI States**
   - Loading skeletons
   - Empty state messages
   - Failed connection state
   - Animated log entries

5. **Responsive Design**
   - Mobile-friendly layouts
   - Adaptive grid displays
   - Sticky connection header

---

## 🔌 Integration Steps

To integrate these modules into your application:

### 1. Add Routes

Update your router configuration (e.g., `src/app/router/routeConfig.ts`):

```typescript
import { SubmissionLogsPage } from "@/modules/submissions-logs/pages/SubmissionLogsPage";
import { KitchenStageLogsPage } from "@/modules/kitchen-stages-logs/pages/KitchenStageLogsPage";

// Add to your routes array:
{
  path: "/submissions-logs",
  element: <SubmissionLogsPage />,
  // Add role guards as needed
},
{
  path: "/kitchen-stages-logs",
  element: <KitchenStageLogsPage />,
  // Add role guards as needed
}
```

### 2. Add Navigation Links

Update your navigation configuration (e.g., `src/app/router/navigationConfig.ts`):

```typescript
{
  title: "Submission Logs",
  path: "/submissions-logs",
  icon: FileTextIcon, // or your preferred icon
  roles: ["system_manager", "catering_manager"]
},
{
  title: "Kitchen Stage Logs",
  path: "/kitchen-stages-logs",
  icon: ActivityIcon, // or your preferred icon
  roles: ["system_manager", "catering_manager"]
}
```

### 3. Verify WebSocket Configuration

Ensure your Echo/WebSocket configuration supports:
- Private channels with authentication
- Event listening with dot notation (`.submission.created`, etc.)
- Branch-specific channel subscriptions

---

## 📊 Data Flow

### Submissions Module
```
Backend Event → WebSocket → Echo Channel → useEchoChannel Hook
                                              ↓
                                    useSubmissionLogsController
                                              ↓
                                      useSubmissionLogs (React Query)
                                              ↓
                                      SubmissionLogsPage
                                              ↓
                                      SubmissionLogsList
                                              ↓
                                      SubmissionLogItem (UI)
```

### Kitchen Stages Module
```
Backend Event → WebSocket → Echo Channel → useEchoChannel Hook
                                              ↓
                                    useKitchenStageLogsController
                                              ↓
                                      useKitchenStageLogs (React Query)
                                              ↓
                                      KitchenStageLogsPage
                                              ↓
                                      KitchenStageLogsList
                                              ↓
                                      KitchenStageLogItem (UI)
```

---

## 🎯 Key Implementation Details

### Event Handling

**Submissions:**
- `submission.created` → Adds new log to the list
- `submission.status.updated` → Updates existing log in place

**Kitchen Stages:**
- `kitchen.stage.progress.updated` → Updates existing log or adds if new

### Memory Management

Both modules implement a 50-log cap to prevent memory issues:
```typescript
if (updated.length > MAX_LOGS) {
  return updated.slice(0, MAX_LOGS);
}
```

### Type Safety

All data structures are fully typed with TypeScript interfaces for:
- Log entries
- Status enums
- User references
- Nested objects

---

## 🧪 Testing Checklist

- [ ] Verify WebSocket connection establishes
- [ ] Test global channel (system_manager role)
- [ ] Test branch channel (catering_manager role)
- [ ] Verify events are received and displayed
- [ ] Test pause/resume functionality
- [ ] Test clear logs functionality
- [ ] Verify 50-log memory cap
- [ ] Test responsive design on mobile
- [ ] Verify loading states
- [ ] Test connection failure states
- [ ] Verify role-based access control

---

## 🔧 Customization Options

### Adjust Log Limit
Change `MAX_LOGS` constant in the hooks files:
```typescript
const MAX_LOGS = 100; // Increase or decrease as needed
```

### Modify Status Colors
Update color mappings in the LogItem components:
```typescript
const getStatusColor = (status: string) => {
  // Add or modify status colors
}
```

### Add Filtering
Extend the controllers to add filtering capabilities:
```typescript
const [filter, setFilter] = useState<string>("");
const filteredLogs = logs.filter(log => /* your filter logic */);
```

---

## 📝 Notes

- Both modules follow the same pattern as the existing `live-logs` module
- All components use shadcn/ui components for consistency
- React Query is used for state management
- WebSocket connections are managed by existing Echo hooks
- Animations use Tailwind CSS utilities
- All timestamps use the existing `formatRelativeTime` utility

---

## 🚀 Next Steps

1. Add the routes to your router configuration
2. Add navigation menu items
3. Test WebSocket connections with your backend
4. Adjust types if backend data structure differs
5. Customize styling to match your design system
6. Add any additional filtering or sorting features as needed
