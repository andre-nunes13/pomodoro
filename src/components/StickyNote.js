import React, { useContext, forwardRef, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Checkbox, VStack, useBreakpointValue } from "@chakra-ui/react";
import { useDraggable } from "../hooks/useDraggable"; // Import the hook

// Helper to combine refs
const useCombinedRefs = (...refs) => {
  const targetRef = React.useRef();

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};


const StickyNote = forwardRef(({ initialPosition, isDraggable = true }, ref) => {
  const { tasks, setTasks } = useContext(AppContext);

  const stickyRef = useRef(null);
  // The entire note is draggable, so dragRef and handleRef are the same.
  const { position, setPosition } = useDraggable(stickyRef, stickyRef, initialPosition, isDraggable);
  
  // If initialPosition prop changes, update the hook's state
  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
    }
  }, [initialPosition, setPosition]);

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const width = useBreakpointValue({ base: "80vw", md: "250px" });
  const combinedRef = useCombinedRefs(ref, stickyRef); // Combine forwarded ref and internal ref

  return (
    <Box
      ref={combinedRef} // Use the combined ref
      position="absolute"
      top={`${position.y}px`} // Apply position from the hook
      left={`${position.x}px`} // Apply position from the hook
      // transform is not used by useDraggable, remove if not needed for other purposes
      w={width}
      maxH="300px"
      bg="#FFFFCC"
      boxShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
      p={3}
      fontFamily="'MS Sans Serif', Tahoma, sans-serif"
      fontSize="13px"
      color="#000000"
      cursor={isDraggable ? "move" : "default"} // Update cursor based on isDraggable
      // onMouseDown is no longer needed here as useDraggable handles it
      userSelect="none"
      zIndex={10}
      overflowY="auto"
    >
      {tasks.length > 0 ? (
        <VStack align="start" spacing={1}>
          {tasks.map((task) => (
            <Box key={task.id} display="flex" alignItems="center">
              <Checkbox
                isChecked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                mr={2}
                borderColor="#808080"
                bg="#FFFFCC"
                size="sm"
              />
              <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>{task.description}</span>
            </Box>
          ))}
        </VStack>
      ) : (
        <span>Nenhuma tarefa adicionada</span>
      )}
    </Box>
  );
});

export default StickyNote;