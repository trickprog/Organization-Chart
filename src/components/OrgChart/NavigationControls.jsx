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
    <div className="flex justify-start mb-4 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-2 flex-wrap">
        {/* Root and Up Navigation */}
        <button
          onClick={onGoToRoot}
          className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" />
          Root
        </button>

        {canGoUp && (
          <button
            onClick={onGoUp}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Sibling Navigation */}
        {navigationInfo && navigationInfo.total > 1 && (
          <>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              onClick={onPreviousSibling}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              title={`Previous: ${navigationInfo.prevName}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 py-1.5 bg-gray-50 rounded-xl text-sm">
              <span className="text-gray-500">{navigationInfo.current}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-500">{navigationInfo.total}</span>
            </div>

            <button
              onClick={onNextSibling}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
              title={`Next: ${navigationInfo.nextName}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Current View Info */}
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <div className="px-3 py-1.5 text-sm">
          <span className="text-gray-400">Viewing: </span>
          <span className="font-medium text-gray-900">
            {currentViewName || 'None'}
          </span>
        </div>

        {/* Search Active Indicator */}
        {isSearchActive && (
          <>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium">
              <Search className="w-3.5 h-3.5" />
              {searchResultsCount} found
            </div>
          </>
        )}

        {/* Clear Path Highlight Button */}
        {hasActiveHighlight && (
          <>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              onClick={onClearHighlight}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl text-sm font-medium transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Path
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export { NavigationControls };
