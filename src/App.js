import React, { useState, useEffect, useContext } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import { AppContext } from "./context/AppContext";
import { Box, Button, Stack, Text } from "@chakra-ui/react";

const App = () => {
  const { keyboardShortcuts } = useContext(AppContext);
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
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyboardShortcuts]);

  return (
    <Box minH="100vh" bg="xpGray.100" p={6}>
      <Box
        bgGradient="linear(to-r, xpBlue.200, xpBlue.300)"
        p={2}
        borderBottom="1px solid"
        borderColor="xpGray.200"
        boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
      >
        <Text fontSize="lg" fontWeight="bold" color="white">
          Pomodoro Productivity
        </Text>
      </Box>
      <Stack direction="row" justify="center" my={4} spacing={2}>
        <Button
          onClick={() => setActiveTab("timer")}
          bg={activeTab === "timer" ? "xpBlue.400" : "xpBlue.300"}
        >
          Temporizador
        </Button>
        <Button
          onClick={() => setActiveTab("history")}
          bg={activeTab === "history" ? "xpBlue.400" : "xpBlue.300"}
        >
          Histórico
        </Button>
        <Button
          onClick={() => setActiveTab("tasks")}
          bg={activeTab === "tasks" ? "xpBlue.400" : "xpBlue.300"}
        >
          Tarefas
        </Button>
      </Stack>
      <Box maxW="4xl" mx="auto" bg="xpBlue.100" p={4} border="1px solid" borderColor="xpGray.200">
        {activeTab === "timer" && <PomodoroTimer />}
        {activeTab === "history" && <SessionHistory />}
        {activeTab === "tasks" && <TaskList />}
      </Box>
    </Box>
  );
};

export default App;