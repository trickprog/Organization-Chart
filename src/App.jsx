import React, { useState, useRef } from "react";
import { ProfessionalOrgChart, EmployeeDetailModal, SearchFilter } from "./components";
import { mockEmployees } from "./data/mockData";
import "./index.css";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const orgChartRef = useRef(null);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
    setIsSearchActive(true);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
    setIsSearchActive(false);
  };

  const handleNavigateToEmployee = (employeeId) => {
    if (orgChartRef.current && orgChartRef.current.navigateToEmployee) {
      orgChartRef.current.navigateToEmployee(employeeId);
    }
  };

  return (
    <div className="App h-screen bg-gray-50 overflow-hidden flex">
      {/* Sidebar - Fixed width */}
      <div className="flex-shrink-0">
        <SearchFilter
          employees={mockEmployees}
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
          searchResults={searchResults}
          isSearchActive={isSearchActive}
          onEmployeeClick={handleEmployeeClick}
          onNavigateToEmployee={handleNavigateToEmployee}
        />
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 h-screen overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          {/* Organization Chart - Full height */}
          <ProfessionalOrgChart
            ref={orgChartRef}
            employees={mockEmployees}
            onEmployeeClick={handleEmployeeClick}
            searchResults={searchResults}
            searchQuery={searchQuery}
            isSearchActive={isSearchActive}
            companyName="Your Company"
            companyTagline="Your Tagline Here"
            companyLogo="Y"
          />
        </div>
      </div>

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default App;
