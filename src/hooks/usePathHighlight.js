import { useState, useCallback, useEffect, useRef } from 'react';
import { findPathToEmployee } from '../utils/hierarchyUtils';

/**
 * Hook for handling path highlighting in org chart
 */
export const usePathHighlight = (hierarchy, employees, currentParentId) => {
  const [highlightedEmployees, setHighlightedEmployees] = useState(new Set());
  const [targetEmployeeId, setTargetEmployeeId] = useState(null);
  const [pathLines, setPathLines] = useState([]);

  const treeWrapperRef = useRef(null);
  const nodeRefs = useRef({});

  // Register node ref for path line calculation
  const registerNodeRef = useCallback((employeeId, element) => {
    if (element) {
      nodeRefs.current[employeeId] = element;
    }
  }, []);

  // Check if employee is in highlighted path
  const isInHighlightedPath = useCallback((employeeId) => {
    return highlightedEmployees.has(employeeId);
  }, [highlightedEmployees]);

  // Set highlighted path
  const setHighlightPath = useCallback((employeeId) => {
    setTargetEmployeeId(employeeId);
    const path = findPathToEmployee(hierarchy, employeeId);
    if (path) {
      setHighlightedEmployees(new Set(path));
    } else {
      setHighlightedEmployees(new Set([employeeId]));
    }
  }, [hierarchy]);

  // Clear highlighting
  const clearHighlighting = useCallback(() => {
    setHighlightedEmployees(new Set());
    setTargetEmployeeId(null);
    setPathLines([]);
  }, []);

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

    const fullPath = findPathToEmployee(hierarchy, targetEmployeeId);
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
  }, [targetEmployeeId, currentParentId, employees, hierarchy]);

  // Recalculate on changes
  useEffect(() => {
    const timer = setTimeout(calculatePathLines, 50);
    window.addEventListener('resize', calculatePathLines);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculatePathLines);
    };
  }, [calculatePathLines]);

  return {
    highlightedEmployees,
    targetEmployeeId,
    pathLines,
    treeWrapperRef,
    registerNodeRef,
    isInHighlightedPath,
    setHighlightPath,
    clearHighlighting,
    setHighlightedEmployees,
    setTargetEmployeeId
  };
};
