import React, { useState, useEffect } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import AutoTaskGenerator from "./components/AutoTaskGenerator";
import Settings from "./components/Settings";
import { AppProvider } from "./context/AppContext";
import { Box, Button, Stack } from "@chakra-ui/react";

const App = () => {
  const [activeTab, setActiveTab] = useState("timer");

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "t":
          setActiveTab("timer");
          break;
        case "h":
          setActiveTab("history");
          break;
        case "l":
          setActiveTab("tasks");
          break;
        case "g":
          setActiveTab("generator");
          break;
        case "s":
          setActiveTab("settings");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <AppProvider>
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
    </AppProvider>
  );
};

export default App;