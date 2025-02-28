import React, { useState, useEffect, useContext, useRef } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import Achievements from "./components/Achievements";
import Settings from "./components/Settings";
import StickyNote from "./components/StickyNote";
import Taskbar from "./components/Taskbar";
import { AppContext } from "./context/AppContext";
import { Box, Button, Stack, Text, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Componente RetroTransition (efeito dissolve pixelado)
const RetroTransition = ({ onComplete }) => {
  const pixels = Array.from({ length: 80 }, (_, i) => i); // Grid de "pixels"

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#000000",
        zIndex: 1000,
        display: "grid",
        gridTemplateColumns: "repeat(20, 1fr)",
        gap: "2px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      onAnimationComplete={onComplete}
    >
      {pixels.map((pixel) => (
        <motion.div
          key={pixel}
          style={{
            background: "#00FF00", // Verde retro
            borderRadius: "2px",
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: [1, 0],
            scale: [1, 0.5],
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </motion.div>
  );
};

// Componente de Partículas com física retro
const ParticlesBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
    ax: 0,
    ay: 0.03, // Gravidade leve
  }));

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);

    const animateParticles = () => {
      particles.forEach((p) => {
        p.vx += p.ax;
        p.vy += p.ay;
        p.x += p.vx;
        p.y += p.vy;

        // Colisão retro com bordas
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -0.7;
        } else if (p.x > window.innerWidth) {
          p.x = window.innerWidth;
          p.vx *= -0.7;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -0.7;
        } else if (p.y > window.innerHeight) {
          p.y = window.innerHeight;
          p.vy *= -0.7;
        }

        // Atração ao cursor
        const dx = mousePosition.x - p.x;
        const dy = mousePosition.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;
        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.015;
          p.vx += dx * force;
          p.vy += dy * force;
        }
      });
    };

    const interval = setInterval(animateParticles, 16); // ~60fps
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      clearInterval(interval);
    };
  }, [particles, mousePosition]);

  return (
    <Box position="absolute" top={0} left={0} w="100vw" h="100vh" pointerEvents="none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: "absolute",
            width: "6px",
            height: "6px",
            background: "#00FF00", // Verde retro
            boxShadow: "0 0 4px #00FF00",
          }}
          animate={{
            x: particle.x,
            y: particle.y,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
        />
      ))}
    </Box>
  );
};

// Componente Landing Page retro minimalista
const LandingPage = ({ onStartClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="#000080" // Azul escuro retro (Windows XP vibe)
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        color="#FFFFFF"
        zIndex={999}
        overflow="hidden"
        fontFamily="'MS Sans Serif', Tahoma, sans-serif"
        border="2px solid #C0C0C0"
        boxShadow="inset 1px 1px #FFFFFF, inset -1px -1px #808080"
      >
        <ParticlesBackground />
        <Text
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="bold"
          textShadow="1px 1px #000000"
          mb={6}
        >
          Focus XP
        </Text>
        <Button
          onClick={onStartClick}
          size="md"
          bg="#C0C0C0"
          color="#000000"
          border="1px solid #808080"
          boxShadow="inset 1px 1px #FFFFFF, inset -1px -1px #000000"
          _hover={{ bg: "#D4D0C8" }}
          _active={{ boxShadow: "inset 1px 1px #808080" }}
          px={4}
          py={2}
        >
          PRESS START
        </Button>
        <Flex mt={8} fontSize="sm" opacity={0.8}>
          <Text>Made with 💖 by André</Text>
          <Button
            as="a"
            href="https://github.com/andre-nunes13/pomodoro"
            target="_blank"
            variant="link"
            color="#FFFFFF"
            ml={2}
            _hover={{ color: "#C0C0C0" }}
          >
            GitHub
          </Button>
        </Flex>
      </Box>
    </motion.div>
  );
};

const App = () => {
  const { keyboardShortcuts, activeTab, setActiveTab, t } = useContext(AppContext);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [stickyPosition, setStickyPosition] = useState({ x: 1250, y: 50 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isStickyMinimized, setIsStickyMinimized] = useState(false);
  const dragRef = useRef(null);
  const stickyDragRef = useRef(null);
  const containerWidth = { base: "95%", md: "640px" };
  const openApps = [
    { id: "focusxp", title: t("FOCUSXP"), icon: "/focusxp-icon.png" },
    { id: "stickynote", title: "Sticky Note", icon: "/sticky-icon.png" },
  ];

  const [showLanding, setShowLanding] = useState(localStorage.getItem("firstLoad") !== "false");
  const [isTransitioning, setIsTransitioning] = useState(false);

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
        case keyboardShortcuts.achievements:
          setActiveTab("achievements");
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

  const handleStickyMouseDown = (e) => {
    if (
      stickyDragRef.current &&
      (e.target === stickyDragRef.current || stickyDragRef.current.contains(e.target))
    ) {
      const startX = e.clientX - stickyPosition.x;
      const startY = e.clientY - stickyPosition.y;

      const handleMouseMove = (e) => {
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;
        setStickyPosition({ x: newX, y: newY });
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

  const handleAppClick = (appId) => {
    if (appId === "focusxp") {
      setIsMinimized((prev) => !prev);
    } else if (appId === "stickynote") {
      setIsStickyMinimized((prev) => !prev);
    }
  };

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximizeRestore = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition({ x: 50, y: 50 });
    }
  };
  const handleClose = () => setIsMinimized(true);

  const handleStartLandingClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setShowLanding(false);
      localStorage.setItem("firstLoad", "false");
    }, 1800); // 1.8s para o dissolve
  };

  return (
    <Box
      minH="100vh"
      backgroundImage="url('/bliss.jpg')"
      backgroundSize="cover"
      backgroundPosition="center center"
      backgroundRepeat="no-repeat"
      display="flex"
      flexDirection="column"
    >
      {isTransitioning && <RetroTransition />}
      {showLanding ? (
        <LandingPage onStartClick={handleStartLandingClick} />
      ) : (
        <>
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
                  {t("FOCUSXP")}
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
                  {["timer", "history", "tasks", "achievements", "settings"].map((tab) => (
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
                      {t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                    </Button>
                  ))}
                </Stack>

                <Box>
                  {activeTab === "timer" && <PomodoroTimer />}
                  {activeTab === "history" && <SessionHistory />}
                  {activeTab === "tasks" && <TaskList />}
                  {activeTab === "achievements" && <Achievements />}
                  {activeTab === "settings" && <Settings />}
                </Box>
              </Box>
            </Box>
          )}

          {!isStickyMinimized && (
            <StickyNote
              ref={stickyDragRef}
              position={stickyPosition}
              onMouseDown={handleStickyMouseDown}
            />
          )}

          <Taskbar
            openApps={openApps}
            onStartClick={handleStartClick}
            onAppClick={handleAppClick}
          />
        </>
      )}
    </Box>
  );
};

export default App;