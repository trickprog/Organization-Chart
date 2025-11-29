import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for handling canvas pan functionality
 */
export const usePanCanvas = (canvasRef) => {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.tagName === 'BUTTON';
    if (!isInteractive && canvasRef.current && canvasRef.current.contains(e.target)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      e.preventDefault();
    }
  }, [canvasRef, panOffset]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  return {
    isPanning,
    panOffset,
    handleMouseDown,
    resetView
  };
};
