import { FC, ReactNode, RefObject } from 'react';

// Employee Types
export interface Employee {
  id: number;
  name: string;
  title: string;
  department: string;
  email: string;
  phone?: string;
  location: string;
  avatar?: string;
  managerId: number | null;
  joinDate?: string;
  skills?: string[];
  subordinates?: Employee[];
}

// Component Props
export interface ProfessionalOrgChartProps {
  employees: Employee[];
  onEmployeeClick?: (employee: Employee) => void;
  searchResults?: Employee[];
  searchQuery?: string;
  isSearchActive?: boolean;
  companyName?: string;
  companyTagline?: string;
  companyLogo?: string;
}

export interface CompanyCardProps {
  companyName?: string;
  companyTagline?: string;
  companyLogo?: string;
}

export interface NavigationControlsProps {
  onGoToRoot: () => void;
  onGoUp: () => void;
  onPreviousSibling: () => void;
  onNextSibling: () => void;
  onClearHighlight: () => void;
  canGoUp: boolean;
  navigationInfo: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    currentName: string;
    nextName: string;
    prevName: string;
  } | null;
  currentViewName?: string;
  isSearchActive?: boolean;
  searchResultsCount?: number;
  hasActiveHighlight?: boolean;
}

export interface OrgChartCanvasProps {
  canvasRef: RefObject<HTMLDivElement>;
  chartContainerRef: RefObject<HTMLDivElement>;
  onMouseDown: (e: React.MouseEvent) => void;
  isPanning: boolean;
  panOffset: { x: number; y: number };
  hasActiveHighlight: boolean;
  children: ReactNode;
}

export interface PathLine {
  id: string;
  type: 'vertical' | 'horizontal';
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface PathHighlightLinesProps {
  pathLines: PathLine[];
}

export interface EmployeeCardProps {
  employee: Employee;
  onToggleExpand?: (id: number) => void;
  isExpanded?: boolean;
  level?: number;
  onEmployeeClick?: (employee: Employee) => void;
}

export interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchFilterProps {
  employees: Employee[];
  onSearchResults: (results: Employee[], query: string) => void;
  onClearSearch: () => void;
  searchResults: Employee[];
  isSearchActive: boolean;
  onEmployeeClick?: (employee: Employee) => void;
  onNavigateToEmployee?: (employeeId: number) => void;
}

// Hook Return Types
export interface UsePanCanvasReturn {
  isPanning: boolean;
  panOffset: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent) => void;
  resetView: () => void;
}

export interface UsePathHighlightReturn {
  highlightedEmployees: Set<number>;
  targetEmployeeId: number | null;
  pathLines: PathLine[];
  treeWrapperRef: RefObject<HTMLDivElement>;
  registerNodeRef: (employeeId: number, element: HTMLElement | null) => void;
  isInHighlightedPath: (employeeId: number) => boolean;
  setHighlightPath: (employeeId: number) => void;
  clearHighlighting: () => void;
  setHighlightedEmployees: (employees: Set<number>) => void;
  setTargetEmployeeId: (id: number | null) => void;
}

// Components
export const ProfessionalOrgChart: FC<ProfessionalOrgChartProps>;
export const CompanyCard: FC<CompanyCardProps>;
export const NavigationControls: FC<NavigationControlsProps>;
export const OrgChartCanvas: FC<OrgChartCanvasProps>;
export const PathHighlightLines: FC<PathHighlightLinesProps>;
export const EmployeeCard: FC<EmployeeCardProps>;
export const EmployeeDetailModal: FC<EmployeeDetailModalProps>;
export const SearchFilter: FC<SearchFilterProps>;

// Hooks
export function usePanCanvas(canvasRef: RefObject<HTMLDivElement>): UsePanCanvasReturn;
export function usePathHighlight(
  hierarchy: Employee[],
  employees: Employee[],
  currentParentId: number
): UsePathHighlightReturn;

// Utilities
export function buildHierarchy(employees: Employee[]): Employee[];
export function findEmployeeById(hierarchy: Employee[], id: number): Employee | null;
export function findPathToEmployee(
  hierarchy: Employee[],
  targetId: number,
  currentNode?: Employee | null,
  path?: number[]
): number[] | null;
export function getAllManagerIds(employees: Employee[], employeeId: number): Set<number>;
export function getDepartmentColor(department: string): string;
export function getDepartmentBadgeColor(department: string): string;
export function getInitials(name: string): string;
