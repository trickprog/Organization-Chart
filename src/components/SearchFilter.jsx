import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Users, 
  MapPin, 
  Mail,
  Award,
  ChevronDown,
  Zap
} from 'lucide-react';

const SearchFilter = ({ 
  employees, 
  onSearchResults, 
  onClearSearch,
  searchResults,
  isSearchActive 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    departments: [],
    locations: [],
    skills: []
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showDropdowns, setShowDropdowns] = useState({
    departments: false,
    locations: false,
    skills: false
  });
  
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
      // Text search across multiple fields
      const textMatch = !query || 
        employee.name.toLowerCase().includes(query) ||
        employee.title.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.location.toLowerCase().includes(query) ||
        (employee.skills && employee.skills.some(skill => 
          skill.toLowerCase().includes(query)
        ));

      // Department filter
      const departmentMatch = selectedFilters.departments.length === 0 ||
        selectedFilters.departments.includes(employee.department);

      // Location filter
      const locationMatch = selectedFilters.locations.length === 0 ||
        selectedFilters.locations.includes(employee.location);

      // Skills filter
      const skillsMatch = selectedFilters.skills.length === 0 ||
        selectedFilters.skills.some(skill => 
          employee.skills && employee.skills.includes(skill)
        );

      return textMatch && departmentMatch && locationMatch && skillsMatch;
    });

    onSearchResults(matches, query);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter toggle
  const toggleFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  // Clear all filters and search
  const clearAll = () => {
    setSearchQuery('');
    setSelectedFilters({
      departments: [],
      locations: [],
      skills: []
    });
    onClearSearch();
  };

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown) => {
    setShowDropdowns(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setShowDropdowns({
      departments: false,
      locations: false,
      skills: false
    });
  };

  // Effect to perform search when query or filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedFilters]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-dropdown')) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get active filter count
  const getActiveFilterCount = () => {
    return selectedFilters.departments.length + 
           selectedFilters.locations.length + 
           selectedFilters.skills.length;
  };

  const FilterDropdown = ({ title, items, selectedItems, filterType, icon: Icon }) => (
    <div className="filter-dropdown relative">
      <button
        onClick={() => toggleDropdown(filterType)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors ${
          selectedItems.length > 0 ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{title}</span>
        {selectedItems.length > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {selectedItems.length}
          </span>
        )}
        <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdowns[filterType] && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48 max-h-64 overflow-y-auto">
          <div className="p-2">
            {items.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item)}
                  onChange={() => toggleFilter(filterType, item)}
                  className="text-blue-600"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 mb-6">
      <div className="flex flex-col gap-4">
        {/* Main Search Bar */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search employees by name, title, department, email, location, or skills..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
              showAdvancedFilters || getActiveFilterCount() > 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-white text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 animate-fade-in">
            <div className="flex flex-wrap gap-3 mb-4">
              <FilterDropdown
                title="Department"
                items={departments}
                selectedItems={selectedFilters.departments}
                filterType="departments"
                icon={Users}
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
                icon={Award}
              />
            </div>
            
            {/* Active Filters Display */}
            {getActiveFilterCount() > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm text-gray-600">Active filters:</span>
                
                {selectedFilters.departments.map(dept => (
                  <span
                    key={dept}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    <Users className="w-3 h-3" />
                    {dept}
                    <button
                      onClick={() => toggleFilter('departments', dept)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {selectedFilters.locations.map(location => (
                  <span
                    key={location}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    <MapPin className="w-3 h-3" />
                    {location}
                    <button
                      onClick={() => toggleFilter('locations', location)}
                      className="hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {selectedFilters.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                  >
                    <Award className="w-3 h-3" />
                    {skill}
                    <button
                      onClick={() => toggleFilter('skills', skill)}
                      className="hover:bg-purple-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Results Summary */}
        {isSearchActive && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  Found {searchResults.length} employee{searchResults.length !== 1 ? 's' : ''} 
                  {searchQuery && ` matching "${searchQuery}"`}
                  {getActiveFilterCount() > 0 && ` with ${getActiveFilterCount()} filter${getActiveFilterCount() !== 1 ? 's' : ''}`}
                </span>
              </div>
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SearchFilter };
