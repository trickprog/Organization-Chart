import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Mail,
  Users,
  ArrowRight
} from 'lucide-react';
import { getDepartmentBadgeColor, getInitials } from '../../utils/hierarchyUtils';

const EmployeeCard = ({
  employee,
  onToggleExpand,
  isExpanded,
  level = 0,
  onEmployeeClick
}) => {
  const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;

  return (
    <div className="relative">
      <div
        className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5"
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => onEmployeeClick && onEmployeeClick(employee)}
      >
        <div className="flex items-center gap-4">
          {/* Expand/Collapse Button */}
          {hasSubordinates && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(employee.id);
              }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}

          {/* Avatar */}
          <div className="flex-shrink-0">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ display: employee.avatar ? 'none' : 'flex' }}
            >
              {getInitials(employee.name)}
            </div>
          </div>

          {/* Employee Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {employee.name}
            </h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {employee.title}
            </p>
            <div className="flex items-center gap-2 mt-2">
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
          </div>

          {/* Email */}
          <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
            <Mail className="w-3.5 h-3.5" />
            <span className="text-xs truncate max-w-[140px]">{employee.email}</span>
          </div>

          {/* View Profile Button */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEmployeeClick && onEmployeeClick(employee);
            }}
          >
            <span>View</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subordinates */}
      {hasSubordinates && isExpanded && (
        <div className="mt-2 space-y-2">
          {employee.subordinates.map((subordinate) => (
            <EmployeeCard
              key={subordinate.id}
              employee={subordinate}
              onToggleExpand={onToggleExpand}
              isExpanded={isExpanded}
              level={level + 1}
              onEmployeeClick={onEmployeeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { EmployeeCard };
