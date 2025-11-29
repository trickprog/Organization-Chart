import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Mail, MapPin, Users } from 'lucide-react';

import { CompanyCard } from './CompanyCard';
import { NavigationControls } from './NavigationControls';
import { OrgChartCanvas } from './OrgChartCanvas';
import { PathHighlightLines } from './PathHighlightLines';
import { usePanCanvas } from '../../hooks/usePanCanvas';
import {
  buildHierarchy,
  findEmployeeById as findById,
  findPathToEmployee as findPath,
  getAllManagerIds,
  getDepartmentBadgeColor,
  getInitials
} from '../../utils/hierarchyUtils';

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

  const chartContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const treeWrapperRef = useRef(null);
  const nodeRefs = useRef({});

  // Use pan canvas hook
  const { isPanning, panOffset, handleMouseDown, resetView } = usePanCanvas(canvasRef);

  // Build hierarchy from employees
  const hierarchy = buildHierarchy(employees);

  // Helper to find employee by ID
  const findEmployeeById = (id) => findById(hierarchy, id);

  // Helper to find path to employee
  const findPathToEmployee = (targetId) => findPath(hierarchy, targetId);

  // Auto-expand and navigate on search
  useEffect(() => {
    if (isSearchActive && searchResults.length > 0) {
      const newExpandedNodes = new Set();
      const newHighlightedEmployees = new Set();

      searchResults.forEach(emp => newHighlightedEmployees.add(emp.id));

      searchResults.forEach(employee => {
        const managerIds = getAllManagerIds(employees, employee.id);
        managerIds.forEach(id => newExpandedNodes.add(id));

        if (employee.subordinates && employee.subordinates.length > 0) {
          newExpandedNodes.add(employee.id);
        }
      });

      setExpandedNodes(newExpandedNodes);
      setHighlightedEmployees(newHighlightedEmployees);

      if (searchResults.length > 0) {
        const firstResult = searchResults[0];

        if (firstResult.managerId) {
          setCurrentParentId(firstResult.managerId);

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
          setCurrentParentId(firstResult.id);
          setCurrentSiblingIndex(0);
        }
      }
    } else {
      setHighlightedEmployees(new Set());
      setExpandedNodes(new Set());
      setTargetEmployeeId(null);
    }
  }, [isSearchActive, searchResults, employees]);

  // Navigate to specific employee
  const navigateToEmployee = (employeeId) => {
    const employee = findEmployeeById(employeeId);
    if (!employee) return;

    setTargetEmployeeId(employeeId);

    const path = findPathToEmployee(employeeId);
    if (path) {
      setHighlightedEmployees(new Set(path));
    } else {
      setHighlightedEmployees(new Set([employeeId]));
    }

    if (employee.managerId) {
      setCurrentParentId(employee.managerId);

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

  // Clear highlighting
  const clearHighlighting = () => {
    setHighlightedEmployees(new Set());
    setTargetEmployeeId(null);
    setPathLines([]);
  };

  // Calculate path lines
  const calculatePathLines = useCallback(() => {
    if (!treeWrapperRef.current || !targetEmployeeId) {
      setPathLines([]);
      return;
    }

    const lines = [];
    const wrapperRect = treeWrapperRef.current.getBoundingClientRect();

    const targetEmployee = employees.find(e => e.id === targetEmployeeId);
    if (!targetEmployee) {
      setPathLines([]);
      return;
    }

    const fullPath = findPathToEmployee(targetEmployeeId);
    if (!fullPath) {
      setPathLines([]);
      return;
    }

    const currentParentIndex = fullPath.indexOf(currentParentId);
    if (currentParentIndex === -1) {
      setPathLines([]);
      return;
    }

    const visiblePath = fullPath.slice(currentParentIndex);
    const renderedPath = visiblePath.filter(id => nodeRefs.current[id]);

    if (renderedPath.length < 2) {
      setPathLines([]);
      return;
    }

    for (let i = 0; i < renderedPath.length - 1; i++) {
      const parentId = renderedPath[i];
      const childId = renderedPath[i + 1];

      const parentNode = nodeRefs.current[parentId];
      const childNode = nodeRefs.current[childId];

      if (parentNode && childNode) {
        const parentRect = parentNode.getBoundingClientRect();
        const childRect = childNode.getBoundingClientRect();

        const parentCenterX = parentRect.left + parentRect.width / 2 - wrapperRect.left;
        const parentBottom = parentRect.bottom - wrapperRect.top;
        const childCenterX = childRect.left + childRect.width / 2 - wrapperRect.left;
        const childTop = childRect.top - wrapperRect.top;

        const midY = parentBottom + (childTop - parentBottom) / 2;
        const lineThickness = 4;

        lines.push({
          id: `v1-${parentId}-${childId}`,
          type: 'vertical',
          x: parentCenterX - lineThickness / 2,
          y: parentBottom,
          height: midY - parentBottom + lineThickness / 2
        });

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

  // Recalculate path lines on changes
  useEffect(() => {
    const timer = setTimeout(calculatePathLines, 50);
    window.addEventListener('resize', calculatePathLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePathLines);
    };
  }, [calculatePathLines, currentParentId, panOffset]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    navigateToEmployee,
    clearHighlighting
  }));

  // Navigation functions
  const getCurrentParent = () => findEmployeeById(currentParentId);

  const getCurrentParentSiblings = () => {
    const parent = getCurrentParent();
    if (!parent) return [];
    if (parent.managerId === null) return [parent];

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

  // Check if employee is highlighted
  const isEmployeeHighlighted = (employee) => highlightedEmployees.has(employee.id);
  const isInHighlightedPath = (employeeId) => highlightedEmployees.has(employeeId);
  const hasActiveHighlight = highlightedEmployees.size > 0;

  // Register node ref
  const registerNodeRef = (employeeId, element) => {
    if (element) {
      nodeRefs.current[employeeId] = element;
    }
  };

  // Employee Card Component (inline for tree nodes)
  const EmployeeNodeCard = ({ employee, isParent = false }) => {
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    const isHighlighted = isEmployeeHighlighted(employee);
    const isTarget = employee.id === targetEmployeeId;
    const isInPath = isHighlighted && !isTarget;
    const isDimmed = hasActiveHighlight && !isHighlighted;

    const getCardClasses = () => {
      if (isTarget) {
        return 'border-amber-400 shadow-lg shadow-amber-100 ring-2 ring-amber-400 ring-offset-2';
      }
      if (isInPath) {
        return 'border-amber-200 bg-amber-50/50';
      }
      return 'border-gray-100 hover:shadow-lg hover:border-gray-200';
    };

    const wrapperClasses = isDimmed ? 'org-node-dimmed' : '';

    return (
      <div className={wrapperClasses}>
        <div
          className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer w-72 mx-auto ${getCardClasses()}`}
          onClick={() => onEmployeeClick && onEmployeeClick(employee)}
        >
          {(isTarget || isInPath) && (
            <div className={`border-b px-4 py-2 rounded-t-2xl ${
              isTarget ? 'bg-amber-100 border-amber-200' : 'bg-amber-50 border-amber-100'
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
                <p className="text-xs text-gray-500 truncate">{employee.title}</p>
              </div>
            </div>

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

  // Render tree node
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
            <EmployeeNodeCard employee={employee} isParent={isParent} />
          </div>
        }
      >
        {employee.subordinates && employee.subordinates.map(child => renderTreeNode(child, false))}
      </TreeNode>
    );
  };

  // Get current view data
  const getCurrentView = () => {
    const parent = getCurrentParent();
    if (!parent) return { parent: null, children: [] };
    return { parent, children: parent.subordinates || [] };
  };

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
      <NavigationControls
        onGoToRoot={goToRoot}
        onGoUp={goUpOneLevel}
        onPreviousSibling={goToPreviousSibling}
        onNextSibling={goToNextSibling}
        onClearHighlight={clearHighlighting}
        canGoUp={canGoUp}
        navigationInfo={navigationInfo}
        currentViewName={currentView.parent?.name}
        isSearchActive={isSearchActive}
        searchResultsCount={searchResults.length}
        hasActiveHighlight={hasActiveHighlight}
      />

      <OrgChartCanvas
        canvasRef={canvasRef}
        chartContainerRef={chartContainerRef}
        onMouseDown={handleMouseDown}
        isPanning={isPanning}
        panOffset={panOffset}
        hasActiveHighlight={hasActiveHighlight}
      >
        <div ref={treeWrapperRef} className="employee-card-wrapper relative">
          <Tree
            lineWidth={'2px'}
            lineColor={'#D1D5DB'}
            lineBorderRadius={'12px'}
            label={
              <CompanyCard
                companyName={companyName}
                companyTagline={companyTagline}
                companyLogo={companyLogo}
              />
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
                    <EmployeeNodeCard employee={currentView.parent} isParent={true} />
                  </div>
                }
              >
                {currentView.children.map(child => renderTreeNode(child, false))}
              </TreeNode>
            )}
          </Tree>

          <PathHighlightLines pathLines={pathLines} />
        </div>
      </OrgChartCanvas>
    </div>
  );
});

export { ProfessionalOrgChart };
