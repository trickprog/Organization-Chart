# React HR Org Chart

A modern, interactive HR Organization Chart component for React with search, filtering, path highlighting, and pan navigation.

## Features

- **Interactive Organization Tree** - Visualize your company hierarchy
- **Search & Filter** - Find employees by name, title, department, location, or skills
- **Path Highlighting** - Highlight the path from root to selected employee
- **Pan Navigation** - Drag to pan around the org chart canvas
- **Collapsible Sidebar** - Search and filter employees with a collapsible sidebar
- **Responsive Design** - Works on desktop and tablet devices
- **Customizable** - Configure company name, logo, and styling
- **TypeScript Support** - Full TypeScript definitions included

## Installation

```bash
npm install react-hr-org-chart
```

or

```bash
yarn add react-hr-org-chart
```

## Peer Dependencies

Make sure you have React installed:

```bash
npm install react react-dom
```

## Quick Start

```jsx
import React from 'react';
import {
  ProfessionalOrgChart,
  SearchFilter,
  EmployeeDetailModal
} from 'react-hr-org-chart';
import 'react-hr-org-chart/styles';

const employees = [
  {
    id: 1,
    name: 'John Smith',
    title: 'CEO',
    department: 'Executive',
    email: 'john@company.com',
    location: 'New York',
    managerId: null,
    subordinates: []
  },
  // ... more employees
];

function App() {
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SearchFilter
        employees={employees}
        onSearchResults={(results, query) => console.log(results)}
        onClearSearch={() => {}}
        searchResults={[]}
        isSearchActive={false}
        onEmployeeClick={(emp) => {
          setSelectedEmployee(emp);
          setShowModal(true);
        }}
      />

      <div style={{ flex: 1 }}>
        <ProfessionalOrgChart
          employees={employees}
          onEmployeeClick={(emp) => {
            setSelectedEmployee(emp);
            setShowModal(true);
          }}
          companyName="Your Company"
          companyTagline="Innovation at Work"
          companyLogo="Y"
        />
      </div>

      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default App;
```

## Components

### ProfessionalOrgChart

The main organization chart component.

```jsx
<ProfessionalOrgChart
  employees={employees}           // Required: Array of employee objects
  onEmployeeClick={handleClick}   // Optional: Callback when employee card is clicked
  searchResults={[]}              // Optional: Array of search results
  searchQuery=""                  // Optional: Current search query
  isSearchActive={false}          // Optional: Whether search is active
  companyName="Your Company"      // Optional: Company name (default: "Acme Corp")
  companyTagline="Your Tagline"   // Optional: Company tagline
  companyLogo="Y"                 // Optional: Company logo letter/text
/>
```

### SearchFilter

Sidebar component for searching and filtering employees.

```jsx
<SearchFilter
  employees={employees}                    // Required: Array of all employees
  onSearchResults={handleSearchResults}    // Required: Callback with search results
  onClearSearch={handleClearSearch}        // Required: Callback to clear search
  searchResults={searchResults}            // Required: Current search results
  isSearchActive={isSearchActive}          // Required: Whether search is active
  onEmployeeClick={handleEmployeeClick}    // Optional: Callback when employee is clicked
  onNavigateToEmployee={handleNavigate}    // Optional: Callback to navigate to employee
/>
```

### EmployeeDetailModal

Modal component showing detailed employee information.

```jsx
<EmployeeDetailModal
  employee={selectedEmployee}    // Required: Employee object or null
  isOpen={showModal}             // Required: Whether modal is open
  onClose={handleClose}          // Required: Callback to close modal
/>
```

## Employee Object Structure

```typescript
interface Employee {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  location: string;
  avatar?: string;
  managerId: number | null;  // null for root employee
  joinDate?: string;
  skills?: string[];
  subordinates?: Employee[];
}
```

## Hooks

### usePanCanvas

Hook for implementing pan functionality.

```jsx
import { usePanCanvas } from 'react-hr-org-chart';

function MyComponent() {
  const canvasRef = useRef(null);
  const { isPanning, panOffset, handleMouseDown, resetView } = usePanCanvas(canvasRef);

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
    >
      {/* Content */}
    </div>
  );
}
```

### usePathHighlight

Hook for implementing path highlighting.

```jsx
import { usePathHighlight } from 'react-hr-org-chart';

function MyComponent({ hierarchy, employees, currentParentId }) {
  const {
    highlightedEmployees,
    targetEmployeeId,
    pathLines,
    setHighlightPath,
    clearHighlighting
  } = usePathHighlight(hierarchy, employees, currentParentId);

  // Use highlight state in your component
}
```

## Utilities

```jsx
import {
  buildHierarchy,
  findEmployeeById,
  findPathToEmployee,
  getAllManagerIds,
  getDepartmentColor,
  getDepartmentBadgeColor,
  getInitials
} from 'react-hr-org-chart';

// Build hierarchy from flat employee array
const hierarchy = buildHierarchy(employees);

// Find employee by ID
const employee = findEmployeeById(hierarchy, 5);

// Get initials from name
const initials = getInitials('John Smith'); // "JS"

// Get department badge color classes
const colorClasses = getDepartmentBadgeColor('Technology');
// "bg-emerald-50 text-emerald-700 border-emerald-200"
```

## Styling

The package includes Tailwind CSS styles. Import them in your app:

```jsx
import 'react-hr-org-chart/styles';
```

Or if you're using Tailwind CSS in your project, you can extend your config to include the package's classes.

## Department Colors

The following departments have predefined colors:

| Department | Color |
|------------|-------|
| Executive | Blue |
| Technology | Emerald |
| Human Resources | Violet |
| Finance | Amber |
| Marketing | Rose |
| Sales | Cyan |

## Development

### Running locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build:lib
```

### Project Structure

```
src/
├── components/
│   ├── OrgChart/
│   │   ├── CompanyCard.jsx
│   │   ├── NavigationControls.jsx
│   │   ├── OrgChartCanvas.jsx
│   │   ├── PathHighlightLines.jsx
│   │   └── ProfessionalOrgChart.jsx
│   ├── Employee/
│   │   ├── EmployeeCard.jsx
│   │   └── EmployeeDetailModal.jsx
│   └── SearchFilter.jsx
├── hooks/
│   ├── usePanCanvas.js
│   └── usePathHighlight.js
├── utils/
│   └── hierarchyUtils.js
└── lib/
    └── index.js (library entry point)
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

Copyright (c) 2025

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Organization chart from [React Organizational Chart](https://github.com/daniel-hauser/react-organizational-chart)
