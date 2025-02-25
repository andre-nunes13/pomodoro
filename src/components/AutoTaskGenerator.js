import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Box, Text, Input, Button, Stack, NumberInput, NumberInputField } from "@chakra-ui/react";

const AutoTaskGenerator = () => {
  const { setTasks, tasks } = useContext(AppContext);
  const [topic, setTopic] = useState("");
  const [numTasks, setNumTasks] = useState(5);

  const generateTasks = async () => {
    try {
      const response = await axios.post(
        "https://api.google-ai-studio.com/generate",
        { topic, numTasks },
        { headers: { Authorization: `Bearer ${process.env.REACT_APP_GOOGLE_AI_API_KEY}` } }
      );
      const generatedTasks = response.data.tasks.map((task) => ({
        id: Date.now() + Math.random(),
        description: task,
        completed: false,
        category: "Estudo",
        dueDate: null,
        priority: "Média",
      }));
      setTasks([...tasks, ...generatedTasks]);
    } catch (error) {
      console.error("Erro ao gerar tarefas:", error);
      const mockTasks = Array.from({ length: numTasks }, (_, i) => ({
        id: Date.now() + i,
        description: `Tarefa ${i + 1} sobre ${topic}`,
        completed: false,
        category: "Estudo",
        dueDate: null,
        priority: "Média",
      }));
      setTasks([...tasks, ...mockTasks]);
    }
  };

  return (
    <Box p={6} bg="dark.200" borderRadius={8} boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Gerar Tarefas Automáticas
      </Text>
      <Stack spacing={4}>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Tema ou Tópico"
          bg="dark.300"
          color="white"
          borderRadius={4}
        />
        <NumberInput
          value={numTasks}
          onChange={(_, value) => setNumTasks(value)}
          min={1}
          bg="dark.300"
          color="white"
          borderRadius={4}
        >
          <NumberInputField placeholder="Número de Tarefas" />
        </NumberInput>
        <Button onClick={generateTasks} colorScheme="purple" borderRadius={4}>
          Gerar
        </Button>
      </Stack>
    </Box>
  );
};

export default AutoTaskGenerator;