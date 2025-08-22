Below is a detailed and accurate plan outlining all the dependent files/changes, step-by-step modifications, error handling, and best practices for integrating the Academic Management Suite into your Next.js app with mock data and authentication.

---

## Detailed Implementation Plan

### 1. Authentication & Global State

- **Create Authentication Context:**
  - **File:** `src/context/AuthContext.tsx`
  - **Changes:**
    - Set up a React Context that holds the current user object (with role, name, etc.).
    - Provide functions to “log in” and “log out” (using mock data).
    - Wrap with proper error boundaries and default values.
- **Create Authentication Hook:**
  - **File:** `src/hooks/useAuth.ts`
  - **Changes:**
    - Create a custom hook that returns the AuthContext value.
    - Include error handling if the context is used outside its provider.
- **Integrate in Global Layout:**
  - **File:** `src/app/layout.tsx`
  - **Changes:**
    - Wrap the root layout with the `<AuthProvider>` imported from `AuthContext.tsx`.
    - Ensure the children are rendered only after the provider is set.

---

### 2. Dashboard Layout & Role Navigation

- **Create a Dashboard Layout:**
  - **File:** `src/app/dashboard/layout.tsx`
  - **Changes:**
    - Create a layout that includes a header, sidebar, and main content area.
    - Header shows the app title and user details (name/role displayed using typography and Tailwind spacing).
    - Sidebar will include navigation links (LMS, Enrollment, Library, HRIS, MMS).
    - Use existing shadcn/ui components (e.g., Button, Card) for a modern look.
    - Add client-side error boundaries for safe component loading.
- **Navigation Component:**
  - **File:** (Either create a new file in `src/components/ui/NavigationMenu.tsx` or modify an existing component)
  - **Changes:**
    - Build a custom navigation menu using plain typography, colors, and spacing.
    - The menu should check the user's role (through `useAuth`) and highlight allowed modules.
    - No non-native icons—only text links styled with CSS Tailwind classes.

---

### 3. Module Pages Implementation

For each system module, create a dedicated page folder under `src/app/dashboard/`. Each module page follows a similar structure using a modern card-based layout.

#### a. Learning Management System (LMS)
- **File:** `src/app/dashboard/lms/page.tsx`
- **Changes:**
  - Display a heading “Learning Management System.”
  - Render a list of sample courses (from mock data in `src/lib/mockData.ts`) in card layouts.
  - Include a section for student progress and recent assignments.
  - Use error handling (try/catch for data fetching) and a fallback loading UI.

#### b. Enrollment System
- **File:** `src/app/dashboard/enrollment/page.tsx`
- **Changes:**
  - Display a heading “Enrollment System.”
  - Render a registration form using shadcn/ui form components.
  - Present a table or list of applicant statuses and simple filters.
  - Handle form submission errors gracefully.

#### c. Library System with OPAC
- **File:** `src/app/dashboard/library/page.tsx`
- **Changes:**
  - Display a heading “Library System.”
  - Build a search/filter input (text-based) that filters a mock catalog list.
  - Use card views for each book.
  - Ensure responsive design with modern spacing and typography.
  - Add error messages if search fails or no results found.

#### d. Human Resource Information System (HRIS)
- **File:** `src/app/dashboard/hris/page.tsx`
- **Changes:**
  - Display a heading “HRIS.”
  - Render a list of employee records using cards or tables.
  - Add a mock “details view” when a record is clicked.
  - Incorporate error boundaries and loading indicators.

#### e. Material Management System (MMS)
- **File:** `src/app/dashboard/mms/page.tsx`
- **Changes:**
  - Display a heading “Material Management System.”
  - Render a list of materials/inventory items using cards.
  - Include a filter or sort option for inventory management.
  - Provide error handling and a fallback UI if data is absent.

---

### 4. Mock Data & Utility Library

- **Create Mock Data File:**
  - **File:** `src/lib/mockData.ts`
  - **Changes:**
    - Export sample data arrays/objects for courses, enrollment candidates, books, HR records, and materials.
    - Each module page will import the corresponding data for UI rendering.
    - Include try/catch wrappers in utility functions that read this data.

- **Update Utility Functions:**
  - **File:** `src/lib/utils.ts`
  - **Changes:**
    - Add helper functions for filtering and formatting the mock data.
    - Ensure error handling when data is undefined or empty.

---

### 5. Role-Based Access Control (RBAC)

- **Implement Role-Based Routing:**
  - **File:** Create a new component (e.g., `src/components/RoleBasedRoute.tsx`)
  - **Changes:**
    - Accept a prop for allowed roles and the child component.
    - Use the `useAuth` hook to check if the logged-in user’s role is allowed.
    - Redirect or render an error message if access is denied.
- **Integrate RBAC in Module Pages:**
  - Wrap each module page’s component content with `<RoleBasedRoute allowedRoles={["Administrator", "Dean", ...]}> ... </RoleBasedRoute>`.
  - Each module can decide its allowed roles (e.g., HRIS might be accessible only by Administrators and Deans).

---

### 6. UI/UX Styling & Guidelines

- **Modern UI Design:**
  - Use Shadcn's UI components with Tailwind CSS–ensuring consistent typography, spacing, and modern color palettes.
  - Avoid any third-party icon libraries; rely on text and CSS styling.  
  - For any required placeholder images:
    - For example, if a cover image is needed, use the placeholder:  
      `<img src="https://placehold.co/1920x1080?text=Modern+academic+dashboard+background" alt="Modern academic dashboard background with clean layout and minimal design" onerror="this.src='fallback.jpg'" />`
- **Responsive Layouts:**
  - Utilize Tailwind CSS breakpoints in all module pages and dashboards.
  - Ensure that the navigation, cards, and forms adjust gracefully to different screen sizes.
- **Error Handling & Fallback UI:**
  - Every page should include error boundaries (either via React’s error boundaries or simple try/catch with fallback UIs).
  - Loading states must be incorporated during data fetching (if simulated with delays).

---

### 7. Testing & Integration

- **Unit Testing:**
  - Write unit tests for the authentication context and each utility in `src/lib/utils.ts` if needed.
- **Route Testing:**
  - Manually verify each page in the Next.js app and use browser console to test role-based redirection.
- **API/Endpoint (Mock) Testing:**
  - Although backend endpoints are not implemented (using local state), simulate API calls with Promise-based mocks and validate using curl commands if needed later.
- **Final Integration:**
  - Ensure the app builds successfully and the navigation between modules works without errors.
  - Validate that the AuthContext provides correct user data and each module only renders for allowed roles.

---

## Summary

- Created an Authentication Context and hook in `src/context/AuthContext.tsx` and `src/hooks/useAuth.ts` for mock auth.
- Updated the global layout (`src/app/layout.tsx`) to include the AuthProvider.
- Developed a dashboard layout with modern navigation in `src/app/dashboard/layout.tsx` and a custom RoleBasedRoute component.
- Added dedicated pages for LMS, Enrollment, Library, HRIS, and MMS under `src/app/dashboard/`, each with modern, responsive UI using shadcn/ui and Tailwind CSS.
- Integrated mock data and utility functions in `src/lib/mockData.ts` and `src/lib/utils.ts` with proper error handling.
- Ensured role-based access control and detailed error fallback UI throughout.
- The design follows real-world academic management needs with a focus on clarity, user-friendly navigation, and responsive design.
