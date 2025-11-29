import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  X
} from 'lucide-react';
import { getDepartmentBadgeColor, getInitials } from '../../utils/hierarchyUtils';

const EmployeeDetailModal = ({ employee, isOpen, onClose }) => {
  if (!isOpen || !employee) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-5 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Employee Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-5 overflow-y-auto max-h-[calc(95vh-60px)] sm:max-h-[calc(90vh-80px)]">
          {/* Profile Header */}
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            {employee.avatar ? (
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-xl flex-shrink-0">
                {getInitials(employee.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 truncate">{employee.name}</h3>
              <p className="text-gray-500 text-xs sm:text-sm truncate">{employee.title}</p>
              <span className={`inline-block mt-1 sm:mt-2 px-2 py-0.5 rounded-md text-xs font-medium border ${getDepartmentBadgeColor(employee.department)}`}>
                {employee.department}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700 truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">{employee.location}</span>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Details</h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 mb-1">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="text-[10px] sm:text-xs">Joined</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  {new Date(employee.joinDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              {employee.subordinates && employee.subordinates.length > 0 && (
                <div className="p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 mb-1">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[10px] sm:text-xs">Team Size</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700">
                    {employee.subordinates.length} members
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {employee.skills && employee.skills.length > 0 && (
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Skills</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {employee.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Reports */}
          {employee.subordinates && employee.subordinates.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Direct Reports</h4>
              <div className="space-y-2">
                {employee.subordinates.map((subordinate) => (
                  <div
                    key={subordinate.id}
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl"
                  >
                    {subordinate.avatar ? (
                      <img
                        src={subordinate.avatar}
                        alt={subordinate.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium text-[10px] sm:text-xs flex-shrink-0">
                        {getInitials(subordinate.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{subordinate.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{subordinate.title}</p>
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

export { EmployeeDetailModal };
