/**
 * Build hierarchy structure from flat employee array
 */
export const buildHierarchy = (employees) => {
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

/**
 * Find employee by ID in hierarchy
 */
export const findEmployeeById = (hierarchy, id) => {
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

/**
 * Find path to employee (returns array of employee IDs from root to target)
 */
export const findPathToEmployee = (hierarchy, targetId, currentNode = null, path = []) => {
  if (!currentNode) {
    for (const rootNode of hierarchy) {
      const foundPath = findPathToEmployee(hierarchy, targetId, rootNode, []);
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
      const foundPath = findPathToEmployee(hierarchy, targetId, child, newPath);
      if (foundPath) return foundPath;
    }
  }

  return null;
};

/**
 * Get all manager IDs in hierarchy for an employee
 */
export const getAllManagerIds = (employees, employeeId) => {
  const managerIds = new Set();
  const employee = employees.find(emp => emp.id === employeeId);

  if (employee && employee.managerId) {
    managerIds.add(employee.managerId);
    const parentManagerIds = getAllManagerIds(employees, employee.managerId);
    parentManagerIds.forEach(id => managerIds.add(id));
  }

  return managerIds;
};

/**
 * Get department color
 */
export const getDepartmentColor = (department) => {
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

/**
 * Get department badge color classes
 */
export const getDepartmentBadgeColor = (department) => {
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

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};
