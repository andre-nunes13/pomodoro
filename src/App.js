// File: /src/App.js
import React, { useState, useEffect, useContext, useRef } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import { AppContext } from "./context/AppContext";
import { Box, Button, Stack, Text, Flex } from "@chakra-ui/react";

const App = () => {
  const { keyboardShortcuts } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("timer");
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Posição inicial
  const dragRef = useRef(null);

  // Define a largura do container com base na aba ativa
  const containerWidth =
    activeTab === "history"
      ? { base: "95%", md: "900px" }
      : { base: "95%", md: "640px" };

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

  useEffect(() => {
    document.body.style.cursor = "url('/xp-cursor.cur'), pointer";
    document.querySelectorAll("button").forEach((btn) => {
      btn.style.cursor = "url('/xp-pointer.cur'), pointer";
    });
    document.body.style.overflow = "hidden"; // Bloqueia a barra de scroll
  }, []);

  // Lógica de arrastar
  const handleMouseDown = (e) => {
    if (dragRef.current && (e.target === dragRef.current || dragRef.current.contains(e.target))) {
      const startX = e.clientX - position.x;
      const startY = e.clientY - position.y;

      const handleMouseMove = (e) => {
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        setPosition({ x: newX, y: newY });
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      e.preventDefault();
    }
  };

  return (
    <Box
      minH="100vh"
      bg="xpGray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
      fontFamily="MS Sans Serif"
    >
      <Box
        w={containerWidth}
        maxW="95%"
        bg="xpBlue.100"
        border="2px solid"
        borderColor="xpGray.200"
        boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
        position="absolute"
        left={position.x}
        top={position.y}
        style={{ transition: "transform 0.1s ease" }}
      >
        {/* Barra de título */}
        <Flex
          ref={dragRef}
          onMouseDown={handleMouseDown}
          bgGradient="linear(to-r, xpBlue.200, xpBlue.300)"
          p={1}
          align="center"
          justify="space-between"
          borderBottom="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
          cursor="move"
          userSelect="none"
        >
          <Flex align="center">
            <Box
              as="img"
              src="/xp-icon.png"
              alt="XP Icon"
              w="16px"
              h="16px"
              mr={2}
              ml={1}
            />
            <Text fontSize="sm" fontWeight="bold" color="white">
              Pomodoro Productivity
            </Text>
          </Flex>
          <Stack direction="row" spacing={0}>
            <Button
              size="xs"
              minW="20px"
              h="20px"
              variant="actionGreen"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
              _hover={{ bg: "xpBlue.400" }}
              fontSize="12px"
              p={0}
            >
              _
            </Button>
            <Button
              size="xs"
              minW="20px"
              h="20px"
              variant="actionGreen"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
              _hover={{ bg: "xpBlue.400" }}
              fontSize="12px"
              p={0}
            >
              □
            </Button>
            <Button
              size="xs"
              minW="20px"
              h="20px"
              variant="actionRed"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
              _hover={{ bg: "xpRed.600" }}
              fontSize="12px"
              p={0}
            >
              X
            </Button>
          </Stack>
        </Flex>

        {/* Conteúdo interno */}
        <Box position="relative" p={4} bg="xpBlue.100">
          <Stack
            direction="row"
            justify="center"
            my={2}
            spacing={1}
            p={2}
            bg="xpGray.100"
            borderBottom="1px solid"
            borderColor="xpGray.200"
            boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
          >
            {["timer", "history", "tasks"].map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "active" : "base"}
                size="sm"
                minW="100px"
                border="1px solid"
                borderColor="xpGray.200"
                boxShadow={
                  activeTab === tab
                    ? "inset 1px 1px #fff"
                    : "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                }
                _hover={{ bg: "xpBlue.400" }}
                textTransform="capitalize"
                fontWeight="normal"
              >
                {tab === "timer"
                  ? "Temporizador"
                  : tab === "history"
                  ? "Histórico"
                  : "Tarefas"}
              </Button>
            ))}
          </Stack>

          <Box>
            {activeTab === "timer" && <PomodoroTimer />}
            {activeTab === "history" && <SessionHistory />}
            {activeTab === "tasks" && <TaskList />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
