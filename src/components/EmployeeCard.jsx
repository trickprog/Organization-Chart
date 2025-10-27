import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Users,
  X
} from 'lucide-react';

const EmployeeCard = ({ employee, onToggleExpand, isExpanded, level = 0, onEmployeeClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
  
  const getDepartmentColor = (department) => {
    const colors = {
      'Executive': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-green-100 text-green-800',
      'Human Resources': 'bg-purple-100 text-purple-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-red-100 text-red-800',
      'Sales': 'bg-cyan-100 text-cyan-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="relative">
      <div
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 p-4 cursor-pointer relative"
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => onEmployeeClick && onEmployeeClick(employee)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {hasSubordinates && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(employee.id);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            
            <div className="flex items-center gap-3">
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
                className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ display: employee.avatar ? 'none' : 'flex' }}
              >
                {getInitials(employee.name)}
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </span>
                  {hasSubordinates && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Users className="w-3 h-3" />
                      {employee.subordinates.length}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute z-50 left-full ml-4 top-0 bg-white border shadow-lg rounded-lg p-4 w-80 animate-fade-in">
            <div className="flex items-start gap-3 mb-3">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {getInitials(employee.name)}
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{employee.title}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                  {employee.department}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{employee.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Joined {new Date(employee.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            {employee.skills && employee.skills.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Skills</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {employee.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subordinates */}
      {hasSubordinates && isExpanded && (
        <div className="animate-slide-down">
          {employee.subordinates.map(subordinate => (
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

// Employee Detail Modal
const EmployeeDetailModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  const getDepartmentColor = (department) => {
    const colors = {
      'Executive': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-green-100 text-green-800',
      'Human Resources': 'bg-purple-100 text-purple-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-red-100 text-red-800',
      'Sales': 'bg-cyan-100 text-cyan-800'
    };
    return colors[department] || 'bg-gray-100 text-gray-800';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Employee Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-start gap-6 mb-6">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {getInitials(employee.name)}
              </div>
            )}
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{employee.name}</h3>
              <p className="text-lg text-gray-600 mb-3">{employee.title}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(employee.department)}`}>
                {employee.department}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{employee.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">{employee.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Employment Details</h4>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-gray-900">{new Date(employee.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
              {employee.subordinates && employee.subordinates.length > 0 && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Direct Reports</p>
                    <p className="text-gray-900">{employee.subordinates.length} team members</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {employee.skills && employee.skills.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-gray-400" />
                <h4 className="text-lg font-semibold text-gray-900">Skills & Expertise</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-blue-50 text-blue-700 text-sm rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {employee.subordinates && employee.subordinates.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Direct Reports</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {employee.subordinates.map(subordinate => (
                  <div key={subordinate.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {subordinate.avatar ? (
                      <img
                        src={subordinate.avatar}
                        alt={subordinate.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(subordinate.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{subordinate.name}</p>
                      <p className="text-sm text-gray-600 truncate">{subordinate.title}</p>
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
