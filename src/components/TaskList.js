import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Text, Input, Button, Stack, Checkbox, List, ListItem } from "@chakra-ui/react";

const TaskList = () => {
  const { tasks, setTasks } = useContext(AppContext);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          description: newTask,
          completed: false,
          category: "Estudo",
          dueDate: null,
          priority: "Média",
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id) =>
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

  return (
    <Box p={6} bg="dark.200" borderRadius={8} boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Lista de Tarefas
      </Text>
      <Stack direction="row" mb={4} spacing={2}>
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nova tarefa"
          bg="dark.300"
          color="white"
          borderRadius={4}
          flex={1}
        />
        <Button onClick={addTask} colorScheme="green" borderRadius={4}>
          Adicionar
        </Button>
      </Stack>
      <List spacing={2}>
        {tasks.map((task) => (
          <ListItem key={task.id} display="flex" alignItems="center">
            <Checkbox
              isChecked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              mr={2}
            />
            <Text
              className={task.completed ? "line-through text-gray-500" : ""}
              flex={1}
            >
              {task.description}
            </Text>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskList;