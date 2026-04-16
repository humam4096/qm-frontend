# Requirements Document

## Introduction

The Reports Module is a feature for a quality management system that enables users to view, filter, and manage report-type form submissions. Reports are inspection records submitted by quality inspectors for meal time windows at various kitchens. The module provides role-based access to view report details, manage approval workflows, and track submission history.

This module mirrors the existing form-submissions module structure but focuses specifically on report-type forms, providing a dedicated interface for report management with filtering, pagination, and approval capabilities.

## Glossary

- **Reports_Module**: The React component system that displays and manages report-type form submissions
- **Report**: A form submission with form_type="report" containing inspection data for a specific meal time window
- **Meal_Time_Window**: A time period (e.g., breakfast, lunch, dinner) with start and end times for meal service
- **API_Client**: The service layer that communicates with backend REST endpoints
- **Data_Table**: The UI component that displays reports in a paginated table format
- **Filter_System**: The component that allows users to filter reports by kitchen, form, type, and status
- **Approval_Dialog**: The UI component for branch managers to approve or reject reports
- **Details_Dialog**: The UI component that displays full report information including form sections and answers
- **React_Query_Hook**: Custom hooks that manage data fetching, caching, and mutations using React Query
- **Role_Guard**: Component that restricts UI elements based on user role permissions
- **Status_Badge**: UI component that displays the current approval status of a report
- **Branch_Approval**: The approval status (pending/accepted/rejected) assigned by branch managers

## Requirements

### Requirement 1: Display Reports List

**User Story:** As a quality manager, I want to view a list of all report submissions, so that I can monitor inspection activities across kitchens.

#### Acceptance Criteria

1. THE Reports_Module SHALL display a paginated table of reports with columns for form name, kitchen, inspection date, status, score, and branch approval
2. WHEN the Reports_Module loads, THE API_Client SHALL fetch reports from GET /meal-time-windows/submissions endpoint with form_type filter
3. THE Data_Table SHALL display report index, form name, kitchen name, inspection date, status badge, score badge, and branch approval badge for each report
4. WHEN a report score is >= 80, THE Status_Badge SHALL display with green styling
5. WHEN a report score is >= 60 and < 80, THE Status_Badge SHALL display with yellow styling
6. WHEN a report score is < 60, THE Status_Badge SHALL display with red styling
7. THE Data_Table SHALL support pagination with current page and total pages information
8. WHEN the user changes pages, THE API_Client SHALL fetch the corresponding page of reports

### Requirement 2: Filter Reports

**User Story:** As a quality supervisor, I want to filter reports by kitchen, form, and status, so that I can focus on specific inspection areas.

#### Acceptance Criteria

1. THE Filter_System SHALL provide filter options for kitchen, form, form type, and status
2. WHEN a user selects a kitchen filter, THE API_Client SHALL fetch reports filtered by kitchen_id parameter
3. WHEN a user selects a form filter, THE API_Client SHALL fetch reports filtered by form_id parameter
4. WHEN a user selects a status filter, THE API_Client SHALL fetch reports filtered by status parameter
5. THE Filter_System SHALL display active filters as removable badges
6. WHEN a user removes a filter badge, THE API_Client SHALL fetch reports without that filter
7. THE Filter_System SHALL provide a clear all filters action
8. THE Filter_System SHALL include a search input for text-based filtering

### Requirement 3: View Report Details

**User Story:** As a branch manager, I want to view complete report details including all form sections and answers, so that I can review inspection findings.

#### Acceptance Criteria

1. WHEN a user clicks the view action on a report, THE Details_Dialog SHALL open displaying full report information
2. THE Details_Dialog SHALL fetch report details from GET /form-submissions/{id}/show endpoint
3. THE Details_Dialog SHALL display report metadata including kitchen name, inspection date, submitted by user, and status history
4. THE Details_Dialog SHALL display all form sections with their questions and submitted answers
5. THE Details_Dialog SHALL display score information for each question and total score
6. THE Details_Dialog SHALL display branch approval status and notes if present
7. THE Details_Dialog SHALL support both Arabic (RTL) and English (LTR) text direction
8. WHEN the user closes the dialog, THE Details_Dialog SHALL clear the displayed report data

### Requirement 4: Manage Branch Approval

**User Story:** As a branch manager, I want to approve or reject reports, so that I can provide feedback on inspection findings.

#### Acceptance Criteria

1. WHERE the user role is branch_manager, THE Reports_Module SHALL display an approval action button for reports
2. WHEN a branch manager clicks the approval action, THE Approval_Dialog SHALL open with accept and reject options
3. THE Approval_Dialog SHALL provide a notes textarea for approval comments
4. WHEN the branch manager submits approval, THE API_Client SHALL POST to /form-submissions/{id}/branch-approval with status and notes
5. WHEN the approval request succeeds, THE Reports_Module SHALL refresh the reports list
6. WHEN the approval request fails, THE Reports_Module SHALL display an error message
7. THE Approval_Dialog SHALL validate that notes are provided when rejecting a report
8. WHEN approval status changes, THE Status_Badge SHALL update to reflect the new status

### Requirement 5: Support Role-Based Access

**User Story:** As a system administrator, I want different user roles to have appropriate access to report features, so that security and workflow policies are enforced.

#### Acceptance Criteria

1. WHERE the user role is system_manager, THE Reports_Module SHALL display all reports across all kitchens
2. WHERE the user role is quality_manager, THE Reports_Module SHALL display reports for assigned kitchens
3. WHERE the user role is quality_supervisor, THE Reports_Module SHALL display reports for supervised kitchens
4. WHERE the user role is branch_manager, THE Reports_Module SHALL display reports for their branch kitchens
5. WHERE the user role is project_manager, THE Reports_Module SHALL hide the branch approval column
6. THE Role_Guard SHALL restrict approval actions to users with branch_manager role
7. THE Role_Guard SHALL restrict report creation to users with quality_inspector, system_manager, or project_manager roles

### Requirement 6: Implement TypeScript Type Safety

**User Story:** As a developer, I want comprehensive TypeScript types for all report data structures, so that I can prevent runtime errors and improve code maintainability.

#### Acceptance Criteria

1. THE Reports_Module SHALL define TypeScript interfaces for Report, MealTimeWindow, Kitchen, SubmittedBy, and StatusHistory types
2. THE API_Client SHALL use typed request and response interfaces for all API calls
3. THE React_Query_Hook SHALL use generic types to ensure type safety for queries and mutations
4. THE Reports_Module SHALL define union types for ReportStatus and BranchApprovalStatus enums
5. THE Reports_Module SHALL export all types from a central types/index.ts file
6. WHEN the API response structure changes, THE TypeScript compiler SHALL detect type mismatches

### Requirement 7: Implement Internationalization

**User Story:** As a user, I want the reports module to support both Arabic and English languages, so that I can use the system in my preferred language.

#### Acceptance Criteria

1. THE Reports_Module SHALL use i18n translation keys for all user-facing text
2. THE Reports_Module SHALL support Arabic (RTL) and English (LTR) text direction
3. THE Reports_Module SHALL translate table headers, filter labels, button text, and status labels
4. WHEN the user switches language, THE Reports_Module SHALL re-render with translated text
5. THE Reports_Module SHALL format dates according to the selected locale
6. THE Reports_Module SHALL add translation keys to locales/ar.json and locales/en.json files

### Requirement 8: Implement Data Caching and Optimization

**User Story:** As a user, I want the reports module to load quickly and minimize unnecessary network requests, so that I can work efficiently.

#### Acceptance Criteria

1. THE React_Query_Hook SHALL cache report list data with a query key based on active filters
2. WHEN filters change, THE React_Query_Hook SHALL fetch new data and update the cache
3. WHEN a report is updated, THE React_Query_Hook SHALL invalidate related cache entries
4. THE React_Query_Hook SHALL implement automatic background refetching for stale data
5. THE Reports_Module SHALL display loading skeletons while data is being fetched
6. THE Reports_Module SHALL display cached data immediately while refetching in the background
7. WHEN a mutation succeeds, THE React_Query_Hook SHALL invalidate both list and detail queries

### Requirement 9: Handle Error States

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can understand and resolve issues.

#### Acceptance Criteria

1. WHEN an API request fails, THE Reports_Module SHALL display an error message to the user
2. WHEN the reports list is empty, THE Data_Table SHALL display a "no reports found" message
3. WHEN a filter returns no results, THE Data_Table SHALL display an appropriate empty state message
4. WHEN network connectivity is lost, THE Reports_Module SHALL display a connection error message
5. WHEN an approval action fails, THE Approval_Dialog SHALL display the error and remain open
6. THE Reports_Module SHALL log errors to the console for debugging purposes

### Requirement 10: Maintain Code Consistency

**User Story:** As a developer, I want the reports module to follow the same patterns as the form-submissions module, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Reports_Module SHALL use the same file structure as form-submissions module with api/, types/, hooks/, pages/, and components/ directories
2. THE API_Client SHALL follow the same naming conventions and patterns as FormSubmissionAPI
3. THE React_Query_Hook SHALL use the same query key factory pattern as form-submissions hooks
4. THE Reports_Module SHALL use the same UI components (DataTable, Badge, RowActions, ActionDialog) as form-submissions
5. THE Reports_Module SHALL follow the same code style for imports, exports, and component structure
6. THE Reports_Module SHALL use the same error handling patterns as form-submissions module
