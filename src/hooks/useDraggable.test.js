import { renderHook, act } from '@testing-library/react';
import { useDraggable } from './useDraggable'; // Adjust if your path is different

describe('useDraggable Hook', () => {
  let mockDragRef;
  let mockHandleRef;

  beforeEach(() => {
    // Mock the draggable element
    mockDragRef = { current: document.createElement('div') };
    mockDragRef.current.style.width = '100px';
    mockDragRef.current.style.height = '50px';
    // Mock getBoundingClientRect for the draggable element
    mockDragRef.current.getBoundingClientRect = jest.fn(() => ({
      left: mockDragRef.current.offsetLeft || 0, // Use a mock position or track it
      top: mockDragRef.current.offsetTop || 0,   // Use a mock position or track it
      width: 100,
      height: 50,
      right: (mockDragRef.current.offsetLeft || 0) + 100,
      bottom: (mockDragRef.current.offsetTop || 0) + 50,
    }));
    document.body.appendChild(mockDragRef.current);

    // Mock the handle element (can be the same as dragRef or a child)
    mockHandleRef = { current: document.createElement('div') };
    // Mock getBoundingClientRect for the handle element
    mockHandleRef.current.getBoundingClientRect = jest.fn(() => ({
      left: mockHandleRef.current.offsetLeft || 0,
      top: mockHandleRef.current.offsetTop || 0,
      width: 20, // Example handle size
      height: 20,
      right: (mockHandleRef.current.offsetLeft || 0) + 20,
      bottom: (mockHandleRef.current.offsetTop || 0) + 20,
    }));
    // If handle is a child of dragRef, append it. Otherwise, append to body as well.
    mockDragRef.current.appendChild(mockHandleRef.current); 


    // Mock window dimensions
    global.innerWidth = 800;
    global.innerHeight = 600;

    // Mock requestAnimationFrame for immediate execution
    // The mockImplementation calls the callback immediately.
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => { cb(); return 1; });
  });

  afterEach(() => {
    if (mockDragRef.current && mockDragRef.current.parentNode) {
      mockDragRef.current.parentNode.removeChild(mockDragRef.current);
    }
    // Ensure handle is also cleaned up if it wasn't a child of dragRef
    if (mockHandleRef.current && mockHandleRef.current.parentNode && mockHandleRef.current.parentNode !== mockDragRef.current) {
        mockHandleRef.current.parentNode.removeChild(mockHandleRef.current);
    }
    jest.restoreAllMocks(); // Restores all mocks, including requestAnimationFrame
  });

  test('should initialize with initialPosition', () => {
    const initialPosition = { x: 10, y: 20 };
    const { result } = renderHook(() => useDraggable(mockDragRef, mockHandleRef, initialPosition));
    expect(result.current.position).toEqual(initialPosition);
  });

  test('should update position on drag', () => {
    const initialPosition = { x: 50, y: 50 };
    // Set initial "rendered" position for getBoundingClientRect mock
    mockDragRef.current.offsetLeft = initialPosition.x;
    mockDragRef.current.offsetTop = initialPosition.y;
    
    const { result } = renderHook(() => useDraggable(mockDragRef, mockHandleRef, initialPosition));

    act(() => {
      // Simulate mousedown on the handle. clientX/Y are screen coordinates.
      // Let's assume the handle is at the same top-left as the dragRef for simplicity here.
      // Offset calculation: event.clientX - dragRect.left
      // Let's say click is at (60,70) and dragRef.left is 50, dragRef.top is 50
      // Offset will be { x: 60-50=10, y: 70-50=20 }
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, clientX: 60, clientY: 70 });
      mockHandleRef.current.dispatchEvent(mouseDownEvent);
    });

    act(() => {
      // Simulate mousemove. New position: event.clientX - offset.x
      // event.clientX = 100, offset.x = 10 => newX = 90
      // event.clientY = 120, offset.y = 20 => newY = 100
      const mouseMoveEvent = new MouseEvent('mousemove', { bubbles: true, clientX: 100, clientY: 120 });
      window.dispatchEvent(mouseMoveEvent);
      // Update mock element's position for next getBoundingClientRect call
      mockDragRef.current.offsetLeft = 90;
      mockDragRef.current.offsetTop = 100;
    });
    
    expect(result.current.position).toEqual({ x: 90, y: 100 });

    act(() => {
      const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
      window.dispatchEvent(mouseUpEvent);
    });
  });

  test('should respect viewport boundaries (top-left)', () => {
    const initialPosition = { x: 10, y: 10 };
    mockDragRef.current.offsetLeft = initialPosition.x;
    mockDragRef.current.offsetTop = initialPosition.y;
    const { result } = renderHook(() => useDraggable(mockDragRef, mockHandleRef, initialPosition));

    act(() => {
      // Click at (15,15), so offset is (5,5)
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, clientX: 15, clientY: 15 });
      mockHandleRef.current.dispatchEvent(mouseDownEvent);
    });

    act(() => {
      // Try to move to (-50, -50) from origin, clientX = -50 + 5 = -45
      const mouseMoveEvent = new MouseEvent('mousemove', { bubbles: true, clientX: -45, clientY: -45 });
      window.dispatchEvent(mouseMoveEvent);
      mockDragRef.current.offsetLeft = 0; // Expected bounded position
      mockDragRef.current.offsetTop = 0;  // Expected bounded position
    });

    expect(result.current.position).toEqual({ x: 0, y: 0 });
  });

  test('should respect viewport boundaries (bottom-right)', () => {
    const initialPosition = { x: 700, y: 500 }; // Near bottom-right
    mockDragRef.current.offsetLeft = initialPosition.x;
    mockDragRef.current.offsetTop = initialPosition.y;
    const { result } = renderHook(() => useDraggable(mockDragRef, mockHandleRef, initialPosition));
    
    // Draggable element dimensions: width 100, height 50
    // Viewport: innerWidth 800, innerHeight 600
    // Max X: 800 - 100 = 700
    // Max Y: 600 - 50 = 550

    act(() => {
      // Click at (710, 510), so offset is (10,10)
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, clientX: 710, clientY: 510 });
      mockHandleRef.current.dispatchEvent(mouseDownEvent);
    });

    act(() => {
      // Try to move far, e.g., clientX = 800, clientY = 600
      // Expected newX = 800 - 10 = 790 (bounded to 700)
      // Expected newY = 600 - 10 = 590 (bounded to 550)
      const mouseMoveEvent = new MouseEvent('mousemove', { bubbles: true, clientX: 800, clientY: 600 });
      window.dispatchEvent(mouseMoveEvent);
      mockDragRef.current.offsetLeft = 700; // Expected bounded position
      mockDragRef.current.offsetTop = 550;  // Expected bounded position
    });
    
    expect(result.current.position).toEqual({ x: 700, y: 550 });
  });

  test('should not drag if isDraggable is false', () => {
    const initialPosition = { x: 50, y: 50 };
    mockDragRef.current.offsetLeft = initialPosition.x;
    mockDragRef.current.offsetTop = initialPosition.y;

    const { result } = renderHook(() => useDraggable(mockDragRef, mockHandleRef, initialPosition, false));

    act(() => {
      const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, clientX: 60, clientY: 70 });
      mockHandleRef.current.dispatchEvent(mouseDownEvent);
    });

    act(() => {
      const mouseMoveEvent = new MouseEvent('mousemove', { bubbles: true, clientX: 100, clientY: 120 });
      window.dispatchEvent(mouseMoveEvent);
      // Position should not change, so offsetLeft/Top remain initial
    });
    
    expect(result.current.position).toEqual(initialPosition);
  });

  test('should update position when setPosition is called directly', () => {
    const initialPosition = { x: 10, y: 20 };
    const { result } = renderHook(() => useDraggable(mockDragRef, mockHandleRef, initialPosition));
    
    const newProgrammaticPosition = { x: 200, y: 250 };
    act(() => {
      result.current.setPosition(newProgrammaticPosition);
    });
    
    expect(result.current.position).toEqual(newProgrammaticPosition);
  });

  test('should update position if initialPosition prop changes', () => {
    const initialPosition1 = { x: 10, y: 20 };
    const { result, rerender } = renderHook(
      ({ dragRef, handleRef, initialPos, isDraggable }) => useDraggable(dragRef, handleRef, initialPos, isDraggable), 
      { initialProps: { dragRef: mockDragRef, handleRef: mockHandleRef, initialPos: initialPosition1, isDraggable: true } }
    );

    expect(result.current.position).toEqual(initialPosition1);

    const initialPosition2 = { x: 100, y: 120 };
    rerender({ dragRef: mockDragRef, handleRef: mockHandleRef, initialPos: initialPosition2, isDraggable: true });
    
    expect(result.current.position).toEqual(initialPosition2);
  });
});
