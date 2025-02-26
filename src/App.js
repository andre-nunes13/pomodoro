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
        w="600px"
        bg="xpBlue.100"
        border="2px solid"
        borderColor="xpGray.200"
        boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
      >
        {/* Barra de título estilo XP */}
        <Flex
          bgGradient="linear(to-r, #003087, #0052CC)"
          p={1}
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="xpGray.200"
        >
          <Text fontSize="sm" fontWeight="bold" color="white" ml={2}>
            Pomodoro Productivity
          </Text>
          <Stack direction="row" spacing={1}>
            <Button size="xs" bg="xpGray.100" border="1px solid" borderColor="xpGray.200" boxShadow="inset 1px 1px #fff" _hover={{ bg: "xpGray.200" }}>
              _
            </Button>
            <Button size="xs" bg="xpGray.100" border="1px solid" borderColor="xpGray.200" boxShadow="inset 1px 1px #fff" _hover={{ bg: "xpGray.200" }}>
              □
            </Button>
            <Button size="xs" bg="xpRed.500" border="1px solid" borderColor="xpGray.200" boxShadow="inset 1px 1px #fff" _hover={{ bg: "xpRed.600" }}>
              X
            </Button>
          </Stack>
        </Flex>

        {/* Botões de navegação */}
        <Stack direction="row" justify="center" my={2} spacing={2} p={2}>
          <Button onClick={() => setActiveTab("timer")} bg={activeTab === "timer" ? "xpBlue.400" : "xpBlue.300"} size="sm">
            Temporizador
          </Button>
          <Button onClick={() => setActiveTab("history")} bg={activeTab === "history" ? "xpBlue.400" : "xpBlue.300"} size="sm">
            Histórico
          </Button>
          <Button onClick={() => setActiveTab("tasks")} bg={activeTab === "tasks" ? "xpBlue.400" : "xpBlue.300"} size="sm">
            Tarefas
          </Button>
        </Stack>

        {/* Área de conteúdo */}
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
