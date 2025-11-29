import React, { useState, useRef } from "react";
import { ProfessionalOrgChart, EmployeeDetailModal, SearchFilter } from "./components";
import { mockEmployees } from "./data/mockData";
import { Menu } from "lucide-react";
import "./index.css";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const orgChartRef = useRef(null);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
    // Close mobile sidebar when selecting an employee
    setIsMobileSidebarOpen(false);
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
    // Close mobile sidebar when navigating
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="App h-screen bg-gray-50 overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white border-b border-gray-200 flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">Org Chart</h1>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width on desktop, slide-in on mobile */}
      <div className={`
        flex-shrink-0 z-50
        fixed md:relative inset-y-0 left-0
        transform transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SearchFilter
          employees={mockEmployees}
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
          searchResults={searchResults}
          isSearchActive={isSearchActive}
          onEmployeeClick={handleEmployeeClick}
          onNavigateToEmployee={handleNavigateToEmployee}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
      </div>

      {/* Main Content - Takes remaining space */}
      <div className="flex-1 h-[calc(100vh-56px)] md:h-screen overflow-hidden">
        <div className="p-2 sm:p-4 h-full flex flex-col">
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
