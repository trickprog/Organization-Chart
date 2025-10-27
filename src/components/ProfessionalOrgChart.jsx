import React, { useState, useEffect } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import { 
  Mail, 
  MapPin, 
  Users,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Home,
  ChevronLeft,
  Search,
  Target,
  Zap,
  Eye,
  Navigation
} from 'lucide-react';

const ProfessionalOrgChart = ({ 
  employees, 
  onEmployeeClick, 
  searchResults = [], 
  searchQuery = '', 
  isSearchActive = false 
}) => {
  const [currentParentId, setCurrentParentId] = useState(1);
  const [currentSiblingIndex, setCurrentSiblingIndex] = useState(0);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [highlightedEmployees, setHighlightedEmployees] = useState(new Set());
  
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

  const EmployeeCard = ({ employee, isParent = false }) => {
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    const deptColor = getDepartmentColor(employee.department);
    const isHighlighted = isEmployeeHighlighted(employee);
    const highlightReason = getHighlightReason(employee);

    return (
      <div 
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 w-72 mx-auto relative ${
          isHighlighted 
            ? 'ring-4 ring-yellow-300 ring-opacity-50 shadow-2xl transform scale-105 animate-pulse-glow' 
            : ''
        }`}
        style={{ borderColor: isHighlighted ? '#F59E0B' : deptColor }}
        onClick={() => onEmployeeClick && onEmployeeClick(employee)}
      >
        {/* Search Highlight Indicator */}
        {isHighlighted && (
          <div className="absolute -top-2 -right-2 z-10">
            <div className="bg-yellow-500 text-white p-1 rounded-full shadow-lg animate-bounce">
              <Search className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Highlight Badge */}
        {isHighlighted && highlightReason && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
              Match: {highlightReason}
            </div>
          </div>
        )}

        <div 
          className="h-3 rounded-t-xl"
          style={{ backgroundColor: isHighlighted ? '#F59E0B' : deptColor }}
        />
        
        <div className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="relative flex-shrink-0">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                style={{ display: employee.avatar ? 'none' : 'flex' }}
              >
                {getInitials(employee.name)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-gray-900 text-base leading-tight mb-1 ${
                isHighlighted ? 'text-yellow-700' : ''
              }`}>
                {employee.name}
              </h3>
              <p className="text-sm text-gray-600 font-medium mb-3 leading-relaxed">
                {employee.title}
              </p>
            </div>

            <button 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span 
              className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
              style={{ backgroundColor: isHighlighted ? '#F59E0B' : deptColor }}
            >
              {employee.department}
            </span>
            {hasSubordinates && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <Users className="w-3 h-3" />
                {employee.subordinates.length}
              </span>
            )}
            {isHighlighted && (
              <span className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full animate-pulse">
                <Target className="w-3 h-3" />
                Found
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs text-gray-500 mb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>{employee.location}</span>
            </div>
          </div>

          {hasSubordinates && (
            <div className="flex justify-center pt-3 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  drillDownToChild(employee.id);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                Show Team ({employee.subordinates.length})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTreeNode = (employee, isParent = false) => {
    return (
      <TreeNode
        key={employee.id}
        label={<EmployeeCard employee={employee} isParent={isParent} />}
      />
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

  // Search Results Quick Navigation
  const SearchResultsNavigation = () => {
    if (!isSearchActive || searchResults.length === 0) return null;

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Search Results</h3>
            <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full">
              {searchResults.length}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {searchResults.map(employee => (
            <button
              key={employee.id}
              onClick={() => navigateToEmployee(employee.id)}
              className="flex items-center gap-3 p-3 bg-white border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors text-left"
            >
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {getInitials(employee.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{employee.name}</p>
                <p className="text-xs text-gray-600 truncate">{employee.title}</p>
                <p className="text-xs text-yellow-600">{employee.department}</p>
              </div>
              <Navigation className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  const navigationInfo = getNavigationInfo();
  const currentView = getCurrentView();
  const canGoUp = currentView.parent && currentView.parent.managerId !== null;

  return (
    <div className="org-chart-container">
      {/* Search Results Navigation */}
      <SearchResultsNavigation />

      {/* Navigation Controls */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-lg shadow-md border p-4 flex items-center gap-4 flex-wrap">
          {/* Root and Up Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToRoot}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Root View
            </button>
            
            {canGoUp && (
              <button
                onClick={goUpOneLevel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          
          {/* Sibling Navigation */}
          {navigationInfo && navigationInfo.total > 1 && (
            <div className="flex items-center gap-2 border-l pl-4">
              <button
                onClick={goToPreviousSibling}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title={`Previous: ${navigationInfo.prevName}`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                <span className="text-gray-600">
                  {navigationInfo.current} of {navigationInfo.total}
                </span>
                <span className="text-gray-400">|</span>
                <span className="font-medium text-gray-900 max-w-32 truncate">
                  {navigationInfo.currentName}
                </span>
              </div>
              
              <button
                onClick={goToNextSibling}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                title={`Next: ${navigationInfo.nextName}`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Current Level Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 border-l pl-4">
            <span>Current Parent:</span>
            <span className="font-semibold text-gray-900">
              {currentView.parent?.name || 'None'}
            </span>
            {isSearchActive && (
              <span className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">
                <Eye className="w-3 h-3" />
                Search Mode
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Org Chart Display */}
      <div className="flex justify-center w-full">
        <Tree
          lineWidth={'2px'}
          lineColor={'#D1D5DB'}
          lineBorderRadius={'12px'}
        >
          {currentView.parent && (
            <TreeNode
              key={currentView.parent.id}
              label={<EmployeeCard employee={currentView.parent} isParent={true} />}
            >
              {currentView.children.map(child => renderTreeNode(child, false))}
            </TreeNode>
          )}
        </Tree>
      </div>
    </div>
  );
};

export { ProfessionalOrgChart };