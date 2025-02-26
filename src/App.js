import React, { useState, useEffect, useContext } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import { AppContext } from "./context/AppContext";
import { Box, Button, Stack, Text, Flex } from "@chakra-ui/react";

const App = () => {
  const { keyboardShortcuts } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("timer");

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement.tagName === "INPUT") return;
      if (!keyboardShortcuts) return;

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

  // Aplica os cursores dinamicamente
  useEffect(() => {
    document.body.style.cursor = "url('/xp-cursor.cur'), pointer";

    document.querySelectorAll("button").forEach((btn) => {
      btn.style.cursor = "url('/xp-pointer.cur'), grab";
    });
  }, []);

  return (
    <Box
      minH="100vh"
      bg="xpGray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <Box
        w={{ base: "95%", md: "600px" }} // Ajuste responsivo
        maxW="95%"
        bg="xpBlue.100"
        border="2px solid"
        borderColor="xpGray.200"
        boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
        p={2} // Adicionado padding
      >
        <Flex
          bgGradient="linear(to-r, #003087, #0052CC)"
          p={{ base: 2, md: 1 }} // Maior padding em telas pequenas
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="xpGray.200"
        >
          <Text fontSize={{ base: "md", md: "sm" }} fontWeight="bold" color="white" ml={2}>
            Pomodoro Productivity
          </Text>
          <Stack direction="row" spacing={1}>
            <Button size="sm" p={2}>_</Button>
            <Button size="sm" p={2}>□</Button>
            <Button size="sm" p={2}>X</Button>
          </Stack>
        </Flex>
  
        <Stack direction="row" justify="center" my={2} spacing={2} p={2} flexWrap="wrap">
          <Button
            onClick={() => setActiveTab("timer")}
            bg={activeTab === "timer" ? "xpBlue.400" : "xpBlue.300"}
            size="md"
            minWidth="90px" // Para garantir toque fácil
            p={3}
          >
            Temporizador
          </Button>
          <Button
            onClick={() => setActiveTab("history")}
            bg={activeTab === "history" ? "xpBlue.400" : "xpBlue.300"}
            size="md"
            minWidth="90px"
            p={3}
          >
            Histórico
          </Button>
          <Button
            onClick={() => setActiveTab("tasks")}
            bg={activeTab === "tasks" ? "xpBlue.400" : "xpBlue.300"}
            size="md"
            minWidth="90px"
            p={3}
          >
            Tarefas
          </Button>
        </Stack>
  
        <Box p={4} bg="xpBlue.100" borderTop="1px solid" borderColor="xpGray.200">
          {activeTab === "timer" && <PomodoroTimer />}
          {activeTab === "history" && <SessionHistory />}
          {activeTab === "tasks" && <TaskList />}
        </Box>
      </Box>
    </Box>
  );
  
};

export default App;
