import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Hook for handling canvas pan functionality with mouse and touch support
 * Optimized for smooth mobile performance using refs to avoid re-renders
 */
export const usePanCanvas = (canvasRef) => {
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Use refs for values that change frequently during panning to avoid re-renders
  const panStartRef = useRef({ x: 0, y: 0 });
  const panOffsetRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => {
    panOffsetRef.current = panOffset;
  }, [panOffset]);

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.tagName === 'BUTTON';
    if (!isInteractive && canvasRef.current && canvasRef.current.contains(e.target)) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - panOffsetRef.current.x,
        y: e.clientY - panOffsetRef.current.y
      };
      e.preventDefault();
    }
  }, [canvasRef]);

  const handleMouseMove = useCallback((e) => {
    if (rafIdRef.current) return; // Skip if animation frame is pending

    rafIdRef.current = requestAnimationFrame(() => {
      const newOffset = {
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      };
      setPanOffset(newOffset);
      rafIdRef.current = null;
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Touch handlers for mobile - optimized with requestAnimationFrame
  const handleTouchStart = useCallback((e) => {
    const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.tagName === 'BUTTON';
    if (!isInteractive && canvasRef.current && canvasRef.current.contains(e.target) && e.touches.length === 1) {
      const touch = e.touches[0];
      setIsPanning(true);
      panStartRef.current = {
        x: touch.clientX - panOffsetRef.current.x,
        y: touch.clientY - panOffsetRef.current.y
      };
    }
  }, [canvasRef]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length !== 1) return;
    e.preventDefault(); // Prevent scrolling

    if (rafIdRef.current) return; // Skip if animation frame is pending

    const touch = e.touches[0];
    rafIdRef.current = requestAnimationFrame(() => {
      const newOffset = {
        x: touch.clientX - panStartRef.current.x,
        y: touch.clientY - panStartRef.current.y
      };
      setPanOffset(newOffset);
      rafIdRef.current = null;
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const resetView = useCallback(() => {
    setPanOffset({ x: 0, y: 0 });
    panOffsetRef.current = { x: 0, y: 0 };
  }, []);

  // Mouse event listeners
  useEffect(() => {
    if (isPanning) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, handleMouseMove, handleMouseUp]);

  // Touch event listeners
  useEffect(() => {
    if (isPanning) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [isPanning, handleTouchMove, handleTouchEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    isPanning,
    panOffset,
    handleMouseDown,
    handleTouchStart,
    resetView
  };
};
