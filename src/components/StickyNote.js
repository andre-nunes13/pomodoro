import React, { useContext, forwardRef } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Checkbox, VStack } from "@chakra-ui/react";

const StickyNote = forwardRef(({ position, onMouseDown }, ref) => {
  const { tasks, setTasks } = useContext(AppContext);

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <Box
      ref={ref}
      position="absolute"
      top={position.y}
      left={position.x}
      w="250px"
      maxH="300px"
      bg="#FFFFCC"
      boxShadow="2px 2px 4px rgba(0, 0, 0, 0.3)"
      p={3}
      fontFamily="'MS Sans Serif', Tahoma, sans-serif"
      fontSize="13px"
      color="#000000"
      cursor="move"
      onMouseDown={onMouseDown}
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
              <span
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.description}
              </span>
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