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
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-xs font-medium border ${getDepartmentBadgeColor(employee.department)}`}>
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

export { EmployeeDetailModal };
