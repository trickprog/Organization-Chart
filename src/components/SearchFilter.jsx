import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Building2,
  MapPin,
  Sparkles,
  ChevronDown,
  Check,
  ChevronRight,
  Users,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

const SearchFilter = ({
  employees,
  onSearchResults,
  onClearSearch,
  searchResults,
  isSearchActive,
  onEmployeeClick,
  onNavigateToEmployee
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    departments: [],
    locations: [],
    skills: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDropdowns, setShowDropdowns] = useState({
    departments: false,
    locations: false,
    skills: false
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const searchInputRef = useRef(null);

  // Extract unique values for filter options
  const getFilterOptions = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    const locations = [...new Set(employees.map(emp => emp.location))];
    const skills = [...new Set(employees.flatMap(emp => emp.skills || []))];

    return { departments, locations, skills };
  };

  const { departments, locations, skills } = getFilterOptions();

  // Perform search and filtering
  const performSearch = () => {
    if (!searchQuery.trim() && selectedFilters.departments.length === 0 &&
      selectedFilters.locations.length === 0 && selectedFilters.skills.length === 0) {
      onClearSearch();
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const matches = employees.filter(employee => {
      const textMatch = !query ||
        employee.name.toLowerCase().includes(query) ||
        employee.title.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.location.toLowerCase().includes(query) ||
        (employee.skills && employee.skills.some(skill =>
          skill.toLowerCase().includes(query)
        ));

      const departmentMatch = selectedFilters.departments.length === 0 ||
        selectedFilters.departments.includes(employee.department);

      const locationMatch = selectedFilters.locations.length === 0 ||
        selectedFilters.locations.includes(employee.location);

      const skillsMatch = selectedFilters.skills.length === 0 ||
        selectedFilters.skills.some(skill =>
          employee.skills && employee.skills.includes(skill)
        );

      return textMatch && departmentMatch && locationMatch && skillsMatch;
    });

    onSearchResults(matches, query);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAll = () => {
    setSearchQuery('');
    setSelectedFilters({
      departments: [],
      locations: [],
      skills: []
    });
    onClearSearch();
  };

  const toggleDropdown = (dropdown) => {
    setShowDropdowns(prev => ({
      departments: false,
      locations: false,
      skills: false,
      [dropdown]: !prev[dropdown]
    }));
  };

  const closeAllDropdowns = () => {
    setShowDropdowns({
      departments: false,
      locations: false,
      skills: false
    });
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedFilters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getActiveFilterCount = () => {
    return selectedFilters.departments.length +
      selectedFilters.locations.length +
      selectedFilters.skills.length;
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Executive': 'bg-blue-50 text-blue-700',
      'Technology': 'bg-emerald-50 text-emerald-700',
      'Human Resources': 'bg-violet-50 text-violet-700',
      'Finance': 'bg-amber-50 text-amber-700',
      'Marketing': 'bg-rose-50 text-rose-700',
      'Sales': 'bg-cyan-50 text-cyan-700'
    };
    return colors[department] || 'bg-gray-50 text-gray-700';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const FilterDropdown = ({ title, items, selectedItems, filterType, icon: Icon }) => (
    <div className="filter-dropdown relative">
      <button
        onClick={() => toggleDropdown(filterType)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          selectedItems.length > 0
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.length > 0 && (
            <span className="bg-white text-gray-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
              {selectedItems.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdowns[filterType] ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {showDropdowns[filterType] && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-2 max-h-48 overflow-y-auto">
            {items.map((item) => {
              const isSelected = selectedItems.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleFilter(filterType, item)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate">{item}</span>
                  {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className="h-full w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 gap-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="Expand sidebar"
        >
          <PanelLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => {
            setIsCollapsed(false);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          }}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => {
            setIsCollapsed(false);
            setShowFilters(true);
          }}
          className={`p-2 rounded-xl transition-colors relative ${
            getActiveFilterCount() > 0 ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Filters"
        >
          <SlidersHorizontal className="w-5 h-5" />
          {getActiveFilterCount() > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        {isSearchActive && (
          <div className="p-2 bg-gray-100 rounded-xl">
            <span className="text-xs font-semibold text-gray-900">{searchResults.length}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-80 bg-white border-r border-gray-200 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Search</h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-0 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="p-4 border-b border-gray-100">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            showFilters || getActiveFilterCount() > 0
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {getActiveFilterCount() > 0 && (
            <span className={`text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold ${
              showFilters || getActiveFilterCount() > 0
                ? 'bg-white text-gray-900'
                : 'bg-gray-900 text-white'
            }`}>
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        {showFilters && (
          <div className="mt-3 space-y-2">
            <FilterDropdown
              title="Department"
              items={departments}
              selectedItems={selectedFilters.departments}
              filterType="departments"
              icon={Building2}
            />
            <FilterDropdown
              title="Location"
              items={locations}
              selectedItems={selectedFilters.locations}
              filterType="locations"
              icon={MapPin}
            />
            <FilterDropdown
              title="Skills"
              items={skills}
              selectedItems={selectedFilters.skills}
              filterType="skills"
              icon={Sparkles}
            />

            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAll}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Active Filter Tags */}
        {getActiveFilterCount() > 0 && !showFilters && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedFilters.departments.map(dept => (
              <span
                key={dept}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {dept}
                <button onClick={() => toggleFilter('departments', dept)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedFilters.locations.map(loc => (
              <span
                key={loc}
                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
              >
                {loc}
                <button onClick={() => toggleFilter('locations', loc)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedFilters.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full"
              >
                {skill}
                <button onClick={() => toggleFilter('skills', skill)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Results Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {isSearchActive ? `${searchResults.length} results` : `${employees.length} employees`}
            </span>
            {isSearchActive && (
              <button
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto">
          {(isSearchActive ? searchResults : employees).map((employee) => (
            <div
              key={employee.id}
              className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors group"
              onClick={() => onEmployeeClick && onEmployeeClick(employee)}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {employee.avatar ? (
                    <img
                      src={employee.avatar}
                      alt={employee.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium text-xs">
                      {getInitials(employee.name)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {employee.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {employee.title}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${getDepartmentColor(employee.department)}`}>
                    {employee.department}
                  </span>
                </div>

                {/* Navigate Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToEmployee && onNavigateToEmployee(employee.id);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded-lg transition-all"
                  title="Navigate to employee"
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}

          {isSearchActive && searchResults.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
              <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { SearchFilter };
