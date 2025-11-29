import React from 'react';
import { Move } from 'lucide-react';

const OrgChartCanvas = ({
  canvasRef,
  chartContainerRef,
  onMouseDown,
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
      style={{
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fafafa',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        cursor: isPanning ? 'grabbing' : 'grab'
      }}
    >
      {/* Pan hint */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs text-gray-500 border border-gray-200 z-10">
        <Move className="w-3 h-3" />
        Drag to pan
      </div>

      {/* Inner container with transform */}
      <div
        ref={chartContainerRef}
        className={`org-chart-canvas-inner ${hasActiveHighlight ? 'org-chart-has-selection' : ''}`}
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'top center',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '40px',
          paddingBottom: '100px',
          minWidth: '100%',
          position: 'relative'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export { OrgChartCanvas };
