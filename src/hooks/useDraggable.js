import { useState, useEffect, useCallback } from 'react';

const useDraggable = (dragRef, handleRef, initialPosition = { x: 0, y: 0 }, isDraggable = true) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((event) => {
    if (!isDraggable || !handleRef.current || !dragRef.current) return;

    const handleRect = handleRef.current.getBoundingClientRect();
    const dragRect = dragRef.current.getBoundingClientRect();

    setOffset({
      x: event.clientX - dragRect.left,
      y: event.clientY - dragRect.top,
    });
    setIsDragging(true);
  }, [isDraggable, handleRef, dragRef]);

  const handleMouseMove = useCallback((event) => {
    if (!isDragging || !dragRef.current) return;

    requestAnimationFrame(() => {
      const newX = event.clientX - offset.x;
      const newY = event.clientY - offset.y;

      const dragRect = dragRef.current.getBoundingClientRect();

      // Ensure the draggable element stays within the viewport boundaries
      const boundedX = Math.max(0, Math.min(newX, window.innerWidth - dragRect.width));
      const boundedY = Math.max(0, Math.min(newY, window.innerHeight - dragRect.height));

      setPosition({ x: boundedX, y: boundedY });
    });
  }, [isDragging, offset, dragRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const handleElement = handleRef.current;

    if (handleElement && isDraggable) {
      handleElement.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (handleElement) {
        handleElement.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [handleRef, handleMouseDown, isDraggable]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Effect to update position if initialPosition changes
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);


  return { position, setPosition };
};

export default useDraggable;
