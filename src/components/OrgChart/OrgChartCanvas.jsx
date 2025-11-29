import React from 'react';
import { Move } from 'lucide-react';

const OrgChartCanvas = ({
  canvasRef,
  chartContainerRef,
  onMouseDown,
  onTouchStart,
  isPanning,
  panOffset,
  hasActiveHighlight,
  children
}) => {
  return (
    <div
      ref={canvasRef}
      className="org-chart-canvas flex-1"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fafafa',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        cursor: isPanning ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
    >
      {/* Pan hint - hidden on mobile */}
      <div className="hidden sm:flex absolute top-3 left-3 items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs text-gray-500 border border-gray-200 z-10">
        <Move className="w-3 h-3" />
        Drag to pan
      </div>

      {/* Inner container with transform - GPU accelerated */}
      <div
        ref={chartContainerRef}
        className={`org-chart-canvas-inner ${hasActiveHighlight ? 'org-chart-has-selection' : ''}`}
        style={{
          transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0)`,
          transformOrigin: 'top center',
          transition: isPanning ? 'none' : 'transform 0.15s ease-out',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '20px',
          paddingBottom: '60px',
          minWidth: '100%',
          position: 'relative',
          willChange: isPanning ? 'transform' : 'auto'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { OrgChartCanvas };
