import React, { useState, useEffect, useContext } from "react"; // Certifique-se de importar useContext
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import AutoTaskGenerator from "./components/AutoTaskGenerator";
import Settings from "./components/Settings";
import { AppContext } from "./context/AppContext"; // Importe o AppContext corretamente
import { Box, Button, Stack, Text } from "@chakra-ui/react";

const App = () => {
  const { keyboardShortcuts } = useContext(AppContext); // Agora deve funcionar, pois App está dentro de AppProvider
  const [activeTab, setActiveTab] = useState("timer");

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement.tagName === "INPUT") return;

      switch (event.key) {
        case keyboardShortcuts.timer:
          setActiveTab("timer");
          break;
        case keyboardShortcuts.history:
          setActiveTab("history");
          break;
        case keyboardShortcuts.tasks:
          setActiveTab("tasks");
          break;
        case keyboardShortcuts.generator:
          setActiveTab("generator");
          break;
        case keyboardShortcuts.settings:
          setActiveTab("settings");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyboardShortcuts]);

  return (
    <Box minH="100vh" bg="dark.100" p={6}>
      <Text fontSize="4xl" fontWeight="bold" textAlign="center" mb={8}>
        Pomodoro Productivity
      </Text>
      <Stack direction="row" justify="center" mb={6} spacing={4}>
        <Button
          onClick={() => setActiveTab("timer")}
          colorScheme={activeTab === "timer" ? "blue" : "dark"}
          variant={activeTab === "timer" ? "solid" : "outline"}
        >
          Temporizador
        </Button>
        <Button
          onClick={() => setActiveTab("history")}
          colorScheme={activeTab === "history" ? "blue" : "dark"}
          variant={activeTab === "history" ? "solid" : "outline"}
        >
          Histórico
        </Button>
        <Button
          onClick={() => setActiveTab("tasks")}
          colorScheme={activeTab === "tasks" ? "blue" : "dark"}
          variant={activeTab === "tasks" ? "solid" : "outline"}
        >
          Tarefas
        </Button>
        <Button
          onClick={() => setActiveTab("generator")}
          colorScheme={activeTab === "generator" ? "blue" : "dark"}
          variant={activeTab === "generator" ? "solid" : "outline"}
        >
          Gerador
        </Button>
        <Button
          onClick={() => setActiveTab("settings")}
          colorScheme={activeTab === "settings" ? "blue" : "dark"}
          variant={activeTab === "settings" ? "solid" : "outline"}
        >
          Configurações
        </Button>
      </Stack>
      <Box maxW="4xl" mx="auto">
        {activeTab === "timer" && <PomodoroTimer />}
        {activeTab === "history" && <SessionHistory />}
        {activeTab === "tasks" && <TaskList />}
        {activeTab === "generator" && <AutoTaskGenerator />}
        {activeTab === "settings" && <Settings />}
      </Box>
    </Box>
  );
};

export default App;