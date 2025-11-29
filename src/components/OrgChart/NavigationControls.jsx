import React from 'react';
import {
  Home,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react';

const NavigationControls = ({
  onGoToRoot,
  onGoUp,
  onPreviousSibling,
  onNextSibling,
  onClearHighlight,
  canGoUp,
  navigationInfo,
  currentViewName,
  isSearchActive,
  searchResultsCount,
  hasActiveHighlight
}) => {
  return (
    <div className="flex justify-start mb-2 sm:mb-4 flex-shrink-0">
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-2 sm:p-3 flex items-center gap-1 sm:gap-2 flex-wrap">
        {/* Root and Up Navigation */}
        <button
          onClick={onGoToRoot}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-colors"
        >
          <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Root</span>
        </button>

        {canGoUp && (
          <button
            onClick={onGoUp}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Back</span>
          </button>
        )}

        {/* Sibling Navigation */}
        {navigationInfo && navigationInfo.total > 1 && (
          <>
            <div className="w-px h-5 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1 hidden sm:block" />
            <button
              onClick={onPreviousSibling}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-colors"
              title={`Previous: ${navigationInfo.prevName}`}
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-50 rounded-lg sm:rounded-xl text-xs sm:text-sm">
              <span className="text-gray-500">{navigationInfo.current}</span>
              <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
              <span className="text-gray-500">{navigationInfo.total}</span>
            </div>

            <button
              onClick={onNextSibling}
              className="p-1.5 sm:p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg sm:rounded-xl transition-colors"
              title={`Next: ${navigationInfo.nextName}`}
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </>
        )}

        {/* Current View Info - Hidden on mobile */}
        <div className="hidden md:block w-px h-6 bg-gray-200 mx-1" />
        <div className="hidden md:block px-3 py-1.5 text-sm">
          <span className="text-gray-400">Viewing: </span>
          <span className="font-medium text-gray-900 truncate max-w-[150px] inline-block align-bottom">
            {currentViewName || 'None'}
          </span>
        </div>

        {/* Search Active Indicator */}
        {isSearchActive && (
          <>
            <div className="w-px h-5 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1" />
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-amber-50 text-amber-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium">
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {searchResultsCount}
            </div>
          </>
        )}

        {/* Clear Path Highlight Button */}
        {hasActiveHighlight && (
          <>
            <div className="w-px h-5 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1" />
            <button
              onClick={onClearHighlight}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors"
            >
              <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export { NavigationControls };
