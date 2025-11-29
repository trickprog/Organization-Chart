import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import {
  Mail,
  MapPin,
  Users,
  ChevronRight,
  ArrowLeft,
  Home,
  ChevronLeft,
  Search,
  X,
  Move
} from 'lucide-react';

const ProfessionalOrgChart = forwardRef(({
  employees,
  onEmployeeClick,
  searchResults = [],
  searchQuery = '',
  isSearchActive = false,
  companyName = 'Acme Corp',
  companyTagline = 'Innovation at Work',
  companyLogo = 'A'
}, ref) => {
  const [currentParentId, setCurrentParentId] = useState(1);
  const [currentSiblingIndex, setCurrentSiblingIndex] = useState(0);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [highlightedEmployees, setHighlightedEmployees] = useState(new Set());
  const [targetEmployeeId, setTargetEmployeeId] = useState(null);
  const [pathLines, setPathLines] = useState([]);

  // Canvas pan state (no zoom)
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const chartContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const treeWrapperRef = useRef(null);
  const nodeRefs = useRef({});
  
  const buildHierarchy = (employees) => {
    const employeeMap = new Map();
    const hierarchy = [];

    employees.forEach(employee => {
      employeeMap.set(employee.id, { ...employee, subordinates: [] });
    });

    employees.forEach(employee => {
      if (employee.managerId === null) {
        hierarchy.push(employeeMap.get(employee.id));
      } else {
        const manager = employeeMap.get(employee.managerId);
        if (manager) {
          manager.subordinates.push(employeeMap.get(employee.id));
        }
      }
    });

    return hierarchy;
  };

  const hierarchy = buildHierarchy(employees);

  // Find path to employee (returns array of employee IDs from root to target)
  const findPathToEmployee = (targetId, currentNode = null, path = []) => {
    if (!currentNode) {
      // Start from root
      for (const rootNode of hierarchy) {
        const foundPath = findPathToEmployee(targetId, rootNode, []);
        if (foundPath) return foundPath;
      }
      return null;
    }

    const newPath = [...path, currentNode.id];
    
    if (currentNode.id === targetId) {
      return newPath;
    }

    if (currentNode.subordinates) {
      for (const child of currentNode.subordinates) {
        const foundPath = findPathToEmployee(targetId, child, newPath);
        if (foundPath) return foundPath;
      }
    }

    return null;
  };

  // Get all manager IDs in hierarchy for an employee
  const getAllManagerIds = (employeeId) => {
    const managerIds = new Set();
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (employee && employee.managerId) {
      managerIds.add(employee.managerId);
      const parentManagerIds = getAllManagerIds(employee.managerId);
      parentManagerIds.forEach(id => managerIds.add(id));
    }
    
    return managerIds;
  };

  // Auto-expand hierarchy and navigate to show search results
  useEffect(() => {
    if (isSearchActive && searchResults.length > 0) {
      const newExpandedNodes = new Set();
      const newHighlightedEmployees = new Set();

      // Highlight all search results
      searchResults.forEach(emp => newHighlightedEmployees.add(emp.id));

      // Find all paths to search results and expand them
      searchResults.forEach(employee => {
        // Add all managers in hierarchy to expanded nodes
        const managerIds = getAllManagerIds(employee.id);
        managerIds.forEach(id => newExpandedNodes.add(id));
        
        // Also expand the employee if they have subordinates
        if (employee.subordinates && employee.subordinates.length > 0) {
          newExpandedNodes.add(employee.id);
        }
      });

      setExpandedNodes(newExpandedNodes);
      setHighlightedEmployees(newHighlightedEmployees);

      // Navigate to show the first search result
      if (searchResults.length > 0) {
        const firstResult = searchResults[0];
        
        // If the first result has a manager, navigate to show that context
        if (firstResult.managerId) {
          setCurrentParentId(firstResult.managerId);
          
          // Find sibling index
          const manager = employees.find(emp => emp.id === firstResult.managerId);
          if (manager && manager.managerId) {
            const grandparent = employees.find(emp => emp.id === manager.managerId);
            if (grandparent && grandparent.subordinates) {
              const siblingIndex = grandparent.subordinates.findIndex(sibling => sibling.id === firstResult.managerId);
              setCurrentSiblingIndex(siblingIndex >= 0 ? siblingIndex : 0);
            }
          } else {
            setCurrentSiblingIndex(0);
          }
        } else {
          // If it's a top-level employee, show from root
          setCurrentParentId(firstResult.id);
          setCurrentSiblingIndex(0);
        }
      }
    } else {
      // Clear highlighting when search is cleared
      setHighlightedEmployees(new Set());
      setExpandedNodes(new Set());
      setTargetEmployeeId(null);
    }
  }, [isSearchActive, searchResults, employees]);

  const findEmployeeById = (id) => {
    const search = (nodes) => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.subordinates) {
          const found = search(node.subordinates);
          if (found) return found;
        }
      }
      return null;
    };
    return search(hierarchy);
  };

  // Navigate to specific employee (for search results)
  const navigateToEmployee = (employeeId) => {
    const employee = findEmployeeById(employeeId);
    if (!employee) return;

    // Set the target employee
    setTargetEmployeeId(employeeId);

    // Find the full path from root to this employee and highlight all nodes in the path
    const path = findPathToEmployee(employeeId);
    if (path) {
      setHighlightedEmployees(new Set(path));
    } else {
      setHighlightedEmployees(new Set([employeeId]));
    }

    if (employee.managerId) {
      setCurrentParentId(employee.managerId);

      // Find correct sibling index
      const manager = findEmployeeById(employee.managerId);
      if (manager && manager.managerId) {
        const grandparent = findEmployeeById(manager.managerId);
        if (grandparent && grandparent.subordinates) {
          const siblingIndex = grandparent.subordinates.findIndex(sibling => sibling.id === employee.managerId);
          setCurrentSiblingIndex(siblingIndex >= 0 ? siblingIndex : 0);
        }
      } else {
        setCurrentSiblingIndex(0);
      }
    } else {
      setCurrentParentId(employeeId);
      setCurrentSiblingIndex(0);
    }
  };

  // Clear all highlighting
  const clearHighlighting = () => {
    setHighlightedEmployees(new Set());
    setTargetEmployeeId(null);
    setPathLines([]);
  };

  // Calculate overlay path lines - only from current parent to target child (not grandparent)
  const calculatePathLines = useCallback(() => {
    if (!treeWrapperRef.current || !targetEmployeeId) {
      setPathLines([]);
      return;
    }

    const lines = [];
    const wrapperRect = treeWrapperRef.current.getBoundingClientRect();

    // Only draw line from the immediate parent (currentParentId) to the target employee
    // This means we only show the line within the current visible tree level
    const targetEmployee = employees.find(e => e.id === targetEmployeeId);
    if (!targetEmployee) {
      setPathLines([]);
      return;
    }

    // Get the path from current view's parent to target
    const fullPath = findPathToEmployee(targetEmployeeId);
    if (!fullPath) {
      setPathLines([]);
      return;
    }

    // Find where currentParentId is in the path
    const currentParentIndex = fullPath.indexOf(currentParentId);
    if (currentParentIndex === -1) {
      setPathLines([]);
      return;
    }

    // Only draw lines from currentParentId onwards (visible portion)
    const visiblePath = fullPath.slice(currentParentIndex);

    // Filter to only nodes that have refs (are rendered)
    const renderedPath = visiblePath.filter(id => nodeRefs.current[id]);

    if (renderedPath.length < 2) {
      setPathLines([]);
      return;
    }

    // Draw lines between consecutive nodes in the visible path
    for (let i = 0; i < renderedPath.length - 1; i++) {
      const parentId = renderedPath[i];
      const childId = renderedPath[i + 1];

      const parentNode = nodeRefs.current[parentId];
      const childNode = nodeRefs.current[childId];

      if (parentNode && childNode) {
        const parentRect = parentNode.getBoundingClientRect();
        const childRect = childNode.getBoundingClientRect();

        // Calculate positions relative to the tree wrapper
        const parentCenterX = parentRect.left + parentRect.width / 2 - wrapperRect.left;
        const parentBottom = parentRect.bottom - wrapperRect.top;
        const childCenterX = childRect.left + childRect.width / 2 - wrapperRect.left;
        const childTop = childRect.top - wrapperRect.top;

        const midY = parentBottom + (childTop - parentBottom) / 2;
        const lineThickness = 4;

        // Line 1: Vertical from parent bottom to midpoint
        lines.push({
          id: `v1-${parentId}-${childId}`,
          type: 'vertical',
          x: parentCenterX - lineThickness / 2,
          y: parentBottom,
          height: midY - parentBottom + lineThickness / 2
        });

        // Line 2: Horizontal at midpoint (only if parent and child aren't aligned)
        if (Math.abs(parentCenterX - childCenterX) > 5) {
          const minX = Math.min(parentCenterX, childCenterX);
          const maxX = Math.max(parentCenterX, childCenterX);
          lines.push({
            id: `h-${parentId}-${childId}`,
            type: 'horizontal',
            x: minX - lineThickness / 2,
            y: midY - lineThickness / 2,
            width: maxX - minX + lineThickness
          });
        }

        // Line 3: Vertical from midpoint to child top
        lines.push({
          id: `v2-${parentId}-${childId}`,
          type: 'vertical',
          x: childCenterX - lineThickness / 2,
          y: midY - lineThickness / 2,
          height: childTop - midY + lineThickness / 2
        });
      }
    }

    setPathLines(lines);
  }, [targetEmployeeId, currentParentId, employees]);

  // Recalculate path lines when view changes
  useEffect(() => {
    const timer = setTimeout(calculatePathLines, 50);
    window.addEventListener('resize', calculatePathLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePathLines);
    };
  }, [calculatePathLines, currentParentId, panOffset]);

  // Expose navigateToEmployee to parent via ref
  useImperativeHandle(ref, () => ({
    navigateToEmployee,
    clearHighlighting
  }));

  // Canvas pan handlers
  const handleMouseDown = (e) => {
    // Allow pan from anywhere in the canvas except on buttons/interactive elements
    const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.tagName === 'BUTTON';
    if (!isInteractive && canvasRef.current && canvasRef.current.contains(e.target)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  }, [isPanning, panStart]);

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  // Add mouse event listeners for panning
  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove]);

  const getCurrentParent = () => {
    return findEmployeeById(currentParentId);
  };

  const getCurrentParentSiblings = () => {
    const parent = getCurrentParent();
    if (!parent) return [];

    if (parent.managerId === null) {
      return [parent];
    }

    const grandparent = findEmployeeById(parent.managerId);
    if (!grandparent || !grandparent.subordinates) return [parent];

    return grandparent.subordinates;
  };

  const drillDownToChild = (childId) => {
    const child = findEmployeeById(childId);
    if (child && child.subordinates && child.subordinates.length > 0) {
      setCurrentParentId(childId);
      setCurrentSiblingIndex(0);
    }
  };

  const goUpOneLevel = () => {
    const parent = getCurrentParent();
    if (parent && parent.managerId) {
      setCurrentParentId(parent.managerId);
      
      const grandparent = findEmployeeById(parent.managerId);
      if (grandparent && grandparent.subordinates) {
        const siblingIndex = grandparent.subordinates.findIndex(sibling => sibling.id === parent.id);
        setCurrentSiblingIndex(siblingIndex >= 0 ? siblingIndex : 0);
      } else {
        setCurrentSiblingIndex(0);
      }
    }
  };

  const goToRoot = () => {
    setCurrentParentId(1);
    setCurrentSiblingIndex(0);
  };

  const goToNextSibling = () => {
    const siblings = getCurrentParentSiblings();
    if (siblings.length <= 1) return;
    
    const nextIndex = (currentSiblingIndex + 1) % siblings.length;
    const nextSibling = siblings[nextIndex];
    
    if (nextSibling) {
      setCurrentParentId(nextSibling.id);
      setCurrentSiblingIndex(nextIndex);
    }
  };

  const goToPreviousSibling = () => {
    const siblings = getCurrentParentSiblings();
    if (siblings.length <= 1) return;
    
    const prevIndex = currentSiblingIndex === 0 ? siblings.length - 1 : currentSiblingIndex - 1;
    const prevSibling = siblings[prevIndex];
    
    if (prevSibling) {
      setCurrentParentId(prevSibling.id);
      setCurrentSiblingIndex(prevIndex);
    }
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Executive': '#3B82F6',
      'Technology': '#10B981',
      'Human Resources': '#8B5CF6',
      'Finance': '#F59E0B',
      'Marketing': '#EF4444',
      'Sales': '#06B6D4'
    };
    return colors[department] || '#6B7280';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Check if employee matches search
  const isEmployeeHighlighted = (employee) => {
    return highlightedEmployees.has(employee.id);
  };

  // Get highlight reason for employee
  const getHighlightReason = (employee) => {
    if (!isSearchActive || !searchQuery) return null;
    
    const query = searchQuery.toLowerCase();
    if (employee.name.toLowerCase().includes(query)) return 'name';
    if (employee.title.toLowerCase().includes(query)) return 'title';
    if (employee.department.toLowerCase().includes(query)) return 'department';
    if (employee.email.toLowerCase().includes(query)) return 'email';
    if (employee.location.toLowerCase().includes(query)) return 'location';
    if (employee.skills && employee.skills.some(skill => skill.toLowerCase().includes(query))) return 'skills';
    
    return 'filter'; // Matched by filter criteria
  };

  const getDepartmentBadgeColor = (department) => {
    const colors = {
      'Executive': 'bg-blue-50 text-blue-700 border-blue-200',
      'Technology': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Human Resources': 'bg-violet-50 text-violet-700 border-violet-200',
      'Finance': 'bg-amber-50 text-amber-700 border-amber-200',
      'Marketing': 'bg-rose-50 text-rose-700 border-rose-200',
      'Sales': 'bg-cyan-50 text-cyan-700 border-cyan-200'
    };
    return colors[department] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // Check if any highlighting is active
  const hasActiveHighlight = highlightedEmployees.size > 0;

  const EmployeeCard = ({ employee, isParent = false }) => {
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    const isHighlighted = isEmployeeHighlighted(employee);
    const isTarget = employee.id === targetEmployeeId;
    const isInPath = isHighlighted && !isTarget;
    const isDimmed = hasActiveHighlight && !isHighlighted;

    // Determine card styling based on highlight state
    const getCardClasses = () => {
      if (isTarget) {
        return 'border-amber-400 shadow-lg shadow-amber-100 ring-2 ring-amber-400 ring-offset-2';
      }
      if (isInPath) {
        return 'border-amber-200 bg-amber-50/50';
      }
      return 'border-gray-100 hover:shadow-lg hover:border-gray-200';
    };

    // Wrapper classes for dimming effect
    const wrapperClasses = isDimmed ? 'org-node-dimmed' : '';

    return (
      <div className={wrapperClasses}>
        <div
          className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer w-72 mx-auto ${getCardClasses()}`}
          onClick={() => onEmployeeClick && onEmployeeClick(employee)}
        >
        {/* Highlight Indicator */}
        {(isTarget || isInPath) && (
          <div className={`border-b px-4 py-2 rounded-t-2xl ${
            isTarget
              ? 'bg-amber-100 border-amber-200'
              : 'bg-amber-50 border-amber-100'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isTarget ? 'bg-amber-500' : 'bg-amber-300'}`} />
              <span className={`text-xs font-medium ${isTarget ? 'text-amber-700' : 'text-amber-600'}`}>
                {isTarget ? 'Selected Employee' : 'In Path'}
              </span>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Header: Avatar + Info */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex-shrink-0 ${isTarget ? 'ring-2 ring-amber-400 ring-offset-2 rounded-full' : ''}`}>
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-11 h-11 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  isTarget
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : isInPath
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                      : 'bg-gradient-to-br from-gray-700 to-gray-900'
                }`}
                style={{ display: employee.avatar ? 'none' : 'flex' }}
              >
                {getInitials(employee.name)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm truncate ${isTarget ? 'text-amber-900' : 'text-gray-900'}`}>
                {employee.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {employee.title}
              </p>
            </div>
          </div>

          {/* Department + Team Count */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getDepartmentBadgeColor(employee.department)}`}>
              {employee.department}
            </span>
            {hasSubordinates && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="w-3 h-3" />
                {employee.subordinates.length}
              </span>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="truncate">{employee.location}</span>
            </div>
          </div>

          {/* Actions */}
          <div className={`flex items-center gap-2 pt-3 border-t ${isTarget || isInPath ? 'border-amber-100' : 'border-gray-100'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEmployeeClick && onEmployeeClick(employee);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isTarget
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              View Profile
            </button>
            {hasSubordinates && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  drillDownToChild(employee.id);
                }}
                className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Users className="w-3 h-3" />
                Team
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  };

  // Check if this employee is in the highlighted path
  const isInHighlightedPath = (employeeId) => {
    return highlightedEmployees.has(employeeId);
  };

  // Register node ref for path line calculation
  const registerNodeRef = (employeeId, element) => {
    if (element) {
      nodeRefs.current[employeeId] = element;
    }
  };

  // Render tree node with highlighted line wrapper
  const renderTreeNode = (employee, isParent = false) => {
    const isHighlighted = isInHighlightedPath(employee.id);

    return (
      <TreeNode
        key={employee.id}
        label={
          <div
            ref={(el) => registerNodeRef(employee.id, el)}
            className={isHighlighted ? 'highlighted-path-node' : ''}
          >
            <EmployeeCard employee={employee} isParent={isParent} />
          </div>
        }
      >
        {employee.subordinates && employee.subordinates.map(child => renderTreeNode(child, false))}
      </TreeNode>
    );
  };

  // Get the current view (parent + children)
  const getCurrentView = () => {
    const parent = getCurrentParent();
    if (!parent) return { parent: null, children: [] };
    
    return {
      parent: parent,
      children: parent.subordinates || []
    };
  };

  // Get navigation info for current level
  const getNavigationInfo = () => {
    const parent = getCurrentParent();
    if (!parent) return null;
    
    const siblings = getCurrentParentSiblings();
    if (siblings.length <= 1) return null;
    
    return {
      current: currentSiblingIndex + 1,
      total: siblings.length,
      hasNext: currentSiblingIndex < siblings.length - 1,
      hasPrev: currentSiblingIndex > 0,
      currentName: parent.name,
      nextName: siblings[(currentSiblingIndex + 1) % siblings.length]?.name || '',
      prevName: siblings[currentSiblingIndex === 0 ? siblings.length - 1 : currentSiblingIndex - 1]?.name || ''
    };
  };

  const navigationInfo = getNavigationInfo();
  const currentView = getCurrentView();
  const canGoUp = currentView.parent && currentView.parent.managerId !== null;

  return (
    <div className="org-chart-container h-full flex flex-col">
      {/* Navigation Controls */}
      <div className="flex justify-start mb-4 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-2 flex-wrap">
          {/* Root and Up Navigation */}
          <button
            onClick={goToRoot}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Root
          </button>

          {canGoUp && (
            <button
              onClick={goUpOneLevel}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* Sibling Navigation */}
          {navigationInfo && navigationInfo.total > 1 && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={goToPreviousSibling}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                title={`Previous: ${navigationInfo.prevName}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1.5 bg-gray-50 rounded-xl text-sm">
                <span className="text-gray-500">{navigationInfo.current}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-500">{navigationInfo.total}</span>
              </div>

              <button
                onClick={goToNextSibling}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                title={`Next: ${navigationInfo.nextName}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Current View Info */}
          <div className="w-px h-6 bg-gray-200 mx-1" />
          <div className="px-3 py-1.5 text-sm">
            <span className="text-gray-400">Viewing: </span>
            <span className="font-medium text-gray-900">
              {currentView.parent?.name || 'None'}
            </span>
          </div>

          {/* Search Active Indicator */}
          {isSearchActive && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium">
                <Search className="w-3.5 h-3.5" />
                {searchResults.length} found
              </div>
            </>
          )}

          {/* Clear Path Highlight Button */}
          {hasActiveHighlight && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <button
                onClick={clearHighlighting}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl text-sm font-medium transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear Path
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Container - Full screen pannable area */}
      <div
        ref={canvasRef}
        className="org-chart-canvas flex-1"
        onMouseDown={handleMouseDown}
        style={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#fafafa',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          cursor: isPanning ? 'grabbing' : 'grab'
        }}
      >
        {/* Pan hint */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs text-gray-500 border border-gray-200 z-10">
          <Move className="w-3 h-3" />
          Drag to pan
        </div>

        {/* Inner container with transform */}
        <div
          ref={chartContainerRef}
          className={`org-chart-canvas-inner ${hasActiveHighlight ? 'org-chart-has-selection' : ''}`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'top center',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '40px',
            paddingBottom: '100px',
            minWidth: '100%',
            position: 'relative'
          }}
        >
          {/* Tree wrapper - path lines are positioned relative to this */}
          <div ref={treeWrapperRef} className="employee-card-wrapper relative">
            <Tree
              lineWidth={'2px'}
              lineColor={'#D1D5DB'}
              lineBorderRadius={'12px'}
              label={
                <div className="bg-white rounded-2xl border border-gray-100 shadow-md w-48 p-3 mx-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {companyLogo}
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-sm font-semibold text-gray-900 truncate">{companyName}</h1>
                      <p className="text-[10px] text-gray-500 truncate">{companyTagline}</p>
                    </div>
                  </div>
                </div>
              }
            >
              {currentView.parent && (
                <TreeNode
                  key={currentView.parent.id}
                  label={
                    <div
                      ref={(el) => registerNodeRef(currentView.parent.id, el)}
                      className={isInHighlightedPath(currentView.parent.id) ? 'highlighted-path-node' : ''}
                    >
                      <EmployeeCard employee={currentView.parent} isParent={true} />
                    </div>
                  }
                >
                  {currentView.children.map(child => renderTreeNode(child, false))}
                </TreeNode>
              )}
            </Tree>

            {/* Custom Path Highlight Lines Overlay - inside tree wrapper so they move with tree */}
            {pathLines.map(line => (
              <div
                key={line.id}
                className="path-highlight-line"
                style={{
                  position: 'absolute',
                  left: `${line.x}px`,
                  top: `${line.y}px`,
                  width: line.type === 'horizontal' ? `${line.width}px` : '4px',
                  height: line.type === 'vertical' ? `${line.height}px` : '4px',
                  background: 'linear-gradient(180deg, #f59e0b, #fbbf24)',
                  borderRadius: '4px',
                  boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)',
                  zIndex: 50,
                  pointerEvents: 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export { ProfessionalOrgChart };