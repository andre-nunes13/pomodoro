import React, { useState, useEffect, useContext, useRef } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import Taskbar from "./components/Taskbar";
import { AppContext } from "./context/AppContext";
import { Box, Button, Stack, Text, Flex } from "@chakra-ui/react";

const App = () => {
  const { keyboardShortcuts, activeTab, setActiveTab } = useContext(AppContext);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const dragRef = useRef(null);

  const containerWidth = { base: "95%", md: "640px" };
  const openApps = [{ id: "focusxp", title: "FOCUSXP", icon: "/focusxp-icon.png" }];

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
  }, [keyboardShortcuts, setActiveTab]);

  useEffect(() => {
    document.body.style.cursor = "url('/xp-cursor.cur'), pointer";
    document.querySelectorAll("button").forEach((btn) => {
      btn.style.cursor = "url('/xp-pointer.cur'), pointer";
    });
    document.body.style.overflow = "hidden";
  }, []);

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

  const handleStartClick = () => {
    console.log("Abrir menu Iniciar");
  };

  const handleAppClick = () => {
    setIsMinimized(false); // Restaura a janela ao clicar na Taskbar
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximizeRestore = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 }); // Move para o topo ao maximizar
    } else {
      setPosition({ x: 50, y: 50 }); // Restaura para a posição original ao desmaximizar
    }
  };
  const handleClose = () => setIsMinimized(true); // Simula fechamento

  return (
    <Box minH="100vh" bg="#D4D0C8" display="flex" flexDirection="column">
      {!isMinimized && (
        <Box
          w={isMaximized ? "100%" : containerWidth}
          h={isMaximized ? "100vh" : "auto"}
          position={isMaximized ? "fixed" : "absolute"}
          top={isMaximized ? 0 : position.y}
          left={isMaximized ? 0 : position.x}
          bg="#ECE9D8"
          border="2px solid"
          borderColor="#808080"
          boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
          style={{ transition: "all 0.3s ease" }}
        >
          <Flex
            ref={dragRef}
            onMouseDown={handleMouseDown}
            bgGradient="linear(to-r, #003087, #0052CC)"
            p={1}
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor="#808080"
            boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
            cursor="move"
            userSelect="none"
          >
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="white"
              fontFamily="'MS Sans Serif', Tahoma, sans-serif"
            >
              FOCUSXP
            </Text>
            <Stack direction="row" spacing={0}>
              <Button
                size="xs"
                minW="20px"
                h="20px"
                bg="#008000"
                color="white"
                border="1px solid"
                borderColor="#808080"
                boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
                _hover={{ bg: "#006400" }}
                fontSize="12px"
                p={0}
                onClick={handleMinimize}
              >
                _
              </Button>
              <Button
                size="xs"
                minW="20px"
                h="20px"
                bg="#008000"
                color="white"
                border="1px solid"
                borderColor="#808080"
                boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
                _hover={{ bg: "#006400" }}
                fontSize="12px"
                p={0}
                onClick={handleMaximizeRestore}
              >
                {isMaximized ? "□" : "□"}
              </Button>
              <Button
                size="xs"
                minW="20px"
                h="20px"
                bg="#C00000"
                color="white"
                border="1px solid"
                borderColor="#808080"
                boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
                _hover={{ bg: "#A00000" }}
                fontSize="12px"
                p={0}
                onClick={handleClose}
              >
                X
              </Button>
            </Stack>
          </Flex>

          <Box position="relative" p={4} bg="#ECE9D8">
            <Stack
              direction="row"
              justify="center"
              my={2}
              spacing={1}
              p={2}
              bg="#D4D0C8"
              borderBottom="1px solid"
              borderColor="#808080"
              boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
            >
              {["timer", "history", "tasks"].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  bg={activeTab === tab ? "#D4D0C8" : "#ECE9D8"}
                  color="#000000"
                  size="sm"
                  minW="100px"
                  border="1px solid"
                  borderColor="#808080"
                  boxShadow={
                    activeTab === tab
                      ? "inset 1px 1px #fff"
                      : "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
                  }
                  _hover={{ bg: "#D4D0C8" }}
                  textTransform="capitalize"
                  fontWeight="normal"
                  fontFamily="'MS Sans Serif', Tahoma, sans-serif"
                  fontSize="12px"
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
      )}

      <Taskbar
        openApps={openApps}
        onStartClick={handleStartClick}
        onAppClick={handleAppClick}
      />
    </Box>
  );
};

export default App;