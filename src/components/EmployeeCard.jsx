import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Users,
  X,
  ArrowRight
} from 'lucide-react';

// Clean & Consistent Employee Card Component
const EmployeeCard = ({ employee, onToggleExpand, isExpanded, level = 0, onEmployeeClick }) => {
  const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;

  const getDepartmentColor = (department) => {
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${getDepartmentColor(employee.department)}`}>
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

// Clean Employee Detail Modal
const EmployeeDetailModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  const getDepartmentColor = (department) => {
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

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Employee Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {getInitials(employee.name)}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{employee.name}</h3>
              <p className="text-gray-500 text-sm">{employee.title}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-xs font-medium border ${getDepartmentColor(employee.department)}`}>
                {employee.department}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{employee.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{employee.location}</span>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Details</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs">Joined</span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(employee.joinDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              {employee.subordinates && employee.subordinates.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs">Team Size</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {employee.subordinates.length} members
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {employee.skills && employee.skills.length > 0 && (
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Reports */}
          {employee.subordinates && employee.subordinates.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Direct Reports</h4>
              <div className="space-y-2">
                {employee.subordinates.map((subordinate) => (
                  <div
                    key={subordinate.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    {subordinate.avatar ? (
                      <img
                        src={subordinate.avatar}
                        alt={subordinate.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium text-xs">
                        {getInitials(subordinate.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{subordinate.name}</p>
                      <p className="text-xs text-gray-500 truncate">{subordinate.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { EmployeeCard, EmployeeDetailModal };
