import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Input,
  Button,
  Stack,
  Checkbox,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

const TaskList = () => {
  const { tasks, setTasks } = useContext(AppContext);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const [taskCategory, setTaskCategory] = useState("Estudo");
  const [taskPriority, setTaskPriority] = useState("Média");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks((prevTasks) => [
        ...prevTasks,
        {
          id: Date.now(),
          description: newTask,
          completed: false,
          category: taskCategory,
          priority: taskPriority,
          dueDate: null,
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (task) => {
    setEditingTask(task.id);
    setEditText(task.description);
  };

  const saveEdit = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, description: editText } : task
      )
    );
    setEditingTask(null);
    setEditText("");
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

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
        <Select
          value={taskCategory}
          onChange={(e) => setTaskCategory(e.target.value)}
          bg="dark.300"
          color="white"
          borderRadius={4}
          w="150px"
        >
          <option value="Estudo">Estudo</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Lazer">Lazer</option>
        </Select>
        <Select
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
          bg="dark.300"
          color="white"
          borderRadius={4}
          w="150px"
        >
          <option value="Alta">Alta</option>
          <option value="Média">Média</option>
          <option value="Baixa">Baixa</option>
        </Select>
        <Button onClick={addTask} colorScheme="green" borderRadius={4}>
          Adicionar
        </Button>
      </Stack>
      <Stack spacing={2}>
        {tasks.map((task) => (
          <Box key={task.id} display="flex" alignItems="center" p={2} bg="dark.300" borderRadius={4}>
            <Checkbox
              isChecked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
              mr={2}
            />
            {editingTask === task.id ? (
              <Stack direction="row" flex={1}>
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  bg="dark.400"
                  color="white"
                  borderRadius={4}
                  flex={1}
                />
                <Button onClick={() => saveEdit(task.id)} colorScheme="blue" size="sm">
                  Salvar
                </Button>
              </Stack>
            ) : (
              <Text flex={1} className={task.completed ? "line-through text-gray-500" : ""}>
                {task.description} (Cat: {task.category}, Pri: {task.priority})
              </Text>
            )}
            <Menu>
              <MenuButton as={IconButton} icon={<EditIcon />} variant="ghost" size="sm" />
              <MenuList bg="dark.200" borderColor="dark.300">
                <MenuItem onClick={() => editTask(task)} icon={<EditIcon />}>
                  Editar
                </MenuItem>
                <MenuItem onClick={() => deleteTask(task.id)} icon={<DeleteIcon />} color="red.500">
                  Excluir
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default TaskList;