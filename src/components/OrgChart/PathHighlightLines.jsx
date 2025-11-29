import React from 'react';

const PathHighlightLines = ({ pathLines }) => {
  if (!pathLines || pathLines.length === 0) return null;

  return (
    <>
      {pathLines.map(line => (
        <div
          key={line.id}
          className="path-highlight-line"
          style={{
            position: 'absolute',
            left: `${line.x}px`,
            top: `${line.y}px`,
            width: line.type === 'horizontal' ? `${line.width}px` : '4px',
            height: line.type === 'vertical' ? `${line.height}px` : '4px',
            background: 'linear-gradient(180deg, #f59e0b, #fbbf24)',
            borderRadius: '4px',
            boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)',
            zIndex: 50,
            pointerEvents: 'none'
          }}
        />
      ))}
    </>
  );
};

export { PathHighlightLines };
