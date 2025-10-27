import React, { useState } from 'react'
import { ProfessionalOrgChart } from './components/ProfessionalOrgChart'
import { EmployeeDetailModal } from './components/EmployeeCard'
import { SearchFilter } from './components/SearchFilter'
import { mockEmployees } from './data/mockData'
import './index.css'

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee)
    setShowModal(true)
  }

  const handleSearchResults = (results, query) => {
    setSearchResults(results)
    setSearchQuery(query)
    setIsSearchActive(true)
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setSearchQuery('')
    setIsSearchActive(false)
  }

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">HR Organization Chart</h1>
          <p className="text-gray-600">Search and explore your company's organizational structure</p>
        </div>

        {/* Search and Filter Component */}
        <SearchFilter 
          employees={mockEmployees}
          onSearchResults={handleSearchResults}
          onClearSearch={handleClearSearch}
          searchResults={searchResults}
          isSearchActive={isSearchActive}
        />

        {/* Organization Chart */}
        <ProfessionalOrgChart 
          employees={mockEmployees} 
          onEmployeeClick={handleEmployeeClick}
          searchResults={searchResults}
          searchQuery={searchQuery}
          isSearchActive={isSearchActive}
        />

        {/* Employee Detail Modal */}
        <EmployeeDetailModal
          employee={selectedEmployee}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  )
}

export default App
