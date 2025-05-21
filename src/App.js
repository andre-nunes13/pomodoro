import React, { useState, useEffect, useContext, useRef } from "react";
import PomodoroTimer from "./components/PomodoroTimer";
import SessionHistory from "./components/SessionHistory";
import TaskList from "./components/TaskList";
import Achievements from "./components/Achievements";
import SettingsWindow from "./components/Settings";
import StickyNote from "./components/StickyNote";
import Taskbar from "./components/Taskbar";
import { AppContext } from "./context/AppContext";
import { useDraggable } from "./hooks/useDraggable"; // Import the hook
import { Box, Button, Stack, Text, Flex, useBreakpointValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

// Componente RetroTransition (sem alterações)
const RetroTransition = ({ onComplete }) => {
  const pixels = Array.from({ length: 80 }, (_, i) => i);
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
          style={{ background: "#00FF00", borderRadius: "2px" }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: [1, 0], scale: [1, 0.5] }}
          transition={{ duration: 1.5, delay: Math.random() * 0.8, ease: "easeOut" }}
        />
      ))}
    </motion.div>
  );
};

// Componente ParticlesBackground (sem alterações)
const ParticlesBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 1,
    vy: (Math.random() - 0.5) * 1,
    ax: 0,
    ay: 0.03,
  }));

  useEffect(() => {
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    const animateParticles = () => {
      particles.forEach((p) => {
        p.vx += p.ax;
        p.vy += p.ay;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx *= -0.7; } else if (p.x > window.innerWidth) { p.x = window.innerWidth; p.vx *= -0.7; }
        if (p.y < 0) { p.y = 0; p.vy *= -0.7; } else if (p.y > window.innerHeight) { p.y = window.innerHeight; p.vy *= -0.7; }
        const dx = mousePosition.x - p.x;
        const dy = mousePosition.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) { const force = (1 - distance / 200) * 0.015; p.vx += dx * force; p.vy += dy * force; }
      });
    };

    let animationFrameId;
    const animationLoop = () => {
      animateParticles();
      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop(); // Start the animation loop

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      cancelAnimationFrame(animationFrameId); // Cancel the animation frame on cleanup
    };
  }, [particles, mousePosition]);

  return (
    <Box position="absolute" top={0} left={0} w="100vw" h="100vh" pointerEvents="none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{ position: "absolute", width: "6px", height: "6px", background: "#00FF00", boxShadow: "0 0 4px #00FF00" }}
          animate={{ x: particle.x, y: particle.y }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
        />
      ))}
    </Box>
  );
};

// Componente LandingPage (ajustado apenas para mobile)
const LandingPage = ({ onStartClick }) => {
  const fontSize = useBreakpointValue({ base: "2xl", md: "5xl" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.5 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="#000080"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        color="#FFFFFF"
        zIndex={999}
        overflow="hidden"
        fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
        border="2px solid #C0C0C0"
        boxShadow="inset 1px 1px #FFFFFF, inset -1px -1px #808080"
      >
        <ParticlesBackground />
        <Text fontSize={fontSize} fontWeight="bold" textShadow="1px 1px #000000" mb={6}>Focus XP</Text>
        <Button
          onClick={onStartClick}
          size={buttonSize}
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
        <Flex mt={8} fontSize={{ base: "xs", md: "sm" }} opacity={0.8} direction={{ base: "column", md: "row" }} align="center">
          <Text>Made with 💖 by André</Text>
          <Button as="a" href="https://github.com/andre-nunes13/pomodoro" target="_blank" variant="link" color="#FFFFFF" ml={{ md: 2 }} mt={{ base: 2, md: 0 }} _hover={{ color: "#C0C0C0" }}>
            GitHub
          </Button>
        </Flex>
      </Box>
    </motion.div>
  );
};

const App = () => {
  // --- Context Values ---
  const { keyboardShortcuts, activeTab, setActiveTab, t } = useContext(AppContext);

  // --- General App State & UI Calculations ---
  const isMobile = useBreakpointValue({ base: true, md: false });
  const containerWidth = isMobile ? "90vw" : "640px";
  const containerHeight = "auto";

  // --- Main Application Window State, Refs, and Logic ---
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindowRef = useRef(null); // Ref for the draggable window itself
  const dragRef = useRef(null);      // This is the handle for the main app window
  
  const { position: appPosition, setPosition: setAppPosition } = useDraggable(
    appWindowRef,
    dragRef,
    { x: 50, y: 50 }, // Initial position
    !isMaximized && !isMobile // isDraggable condition
  );

  const handleMinimize = () => setIsMinimized(true);
  const handleMaximizeRestore = () => {
    const newMaximizedState = !isMaximized;
    setIsMaximized(newMaximizedState);
    if (newMaximizedState) {
      setAppPosition({ x: 0, y: 0 });
    } else {
      setAppPosition({ x: 50, y: 50 });
    }
  };
  const handleClose = () => setIsMinimized(true);

  // --- StickyNote State ---
  const [isStickyMinimized, setIsStickyMinimized] = useState(false);
  const [stickyPosition, setStickyPosition] = useState({ x: 1250, y: 50 }); // Initial position

  // --- SettingsWindow State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsPosition, setSettingsPosition] = useState({ x: 300, y: 100 }); // Initial position

  // --- Landing Page / Transition State & Logic ---
  const [showLanding, setShowLanding] = useState(localStorage.getItem("firstLoad") !== "false");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleStartLandingClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsTransitioning(false);
      setShowLanding(false);
      localStorage.setItem("firstLoad", "false");
    }, 1800);
  };

  // --- Taskbar Related ---
  const openApps = [
    { id: "focusxp", title: t("FOCUSXP"), icon: "/focusxp-icon.png" },
    { id: "stickynote", title: "Sticky Note", icon: "/sticky-icon.png" },
  ];
  const handleStartClick = () => console.log("Abrir menu Iniciar"); // Placeholder
  const handleAppClick = (appId) => {
    if (appId === "focusxp") setIsMinimized((prev) => !prev);
    else if (appId === "stickynote") setIsStickyMinimized((prev) => !prev);
  };
  
  // --- Global Effects ---
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement.tagName === "INPUT") return;
      if (!keyboardShortcuts) return;
      switch (event.key) {
        case keyboardShortcuts.timer: setActiveTab("timer"); break;
        case keyboardShortcuts.history: setActiveTab("history"); break;
        case keyboardShortcuts.tasks: setActiveTab("tasks"); break;
        case keyboardShortcuts.achievements: setActiveTab("achievements"); break;
        default: break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keyboardShortcuts, setActiveTab]);

  useEffect(() => {
    document.body.style.cursor = "url('/xp-cursor.cur'), pointer";
    document.querySelectorAll("button").forEach((btn) => btn.style.cursor = "url('/xp-pointer.cur'), pointer");
    document.body.style.overflow = "hidden";
  }, []);

  // Note: settingsDragRef was previously nullified/removed, so it's not included in the reordering.
  // Drag/mouse down handlers for individual components (StickyNote, Settings) were removed in previous steps.

  return (
    <Box minH="100vh" backgroundImage="url('/bliss.jpg')" backgroundSize="cover" backgroundPosition="center center" backgroundRepeat="no-repeat" display="flex" flexDirection="column">
      {isTransitioning && <RetroTransition />}
      {showLanding ? (
        <LandingPage onStartClick={handleStartLandingClick} />
      ) : (
        <>
          {!isMinimized && (
            <Box
              ref={appWindowRef} // Assign ref for the draggable element
              w={isMaximized ? "100vw" : containerWidth}
              h={isMaximized ? "100vh" : containerHeight}
              position={isMaximized ? "fixed" : isMobile ? "relative" : "absolute"}
              top={isMaximized ? 0 : isMobile ? "10px" : `${appPosition.y}px`} // Use appPosition
              left={isMaximized ? 0 : isMobile ? "auto" : `${appPosition.x}px`} // Use appPosition
              right={isMobile ? "auto" : undefined}
              mx={isMobile ? "auto" : undefined}
              bg="#ECE9D8"
              border="2px solid"
              borderColor="#808080"
              boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
              style={{ transition: "all 0.3s ease" }}
              maxH={isMobile ? "calc(100vh - 60px)" : "auto"} // Ajuste para taskbar apenas em mobile
              overflowY="auto"
            >
              <Flex
                ref={dragRef} // This is the handle
                // onMouseDown is removed, useDraggable handles this
                bgGradient="linear(to-r, #003087, #0052CC)"
                p={1}
                align="center"
                justify="space-between"
                borderBottom="1px solid"
                borderColor="#808080"
                boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
                cursor={!isMaximized && !isMobile ? "move" : "default"} // Updated cursor logic
                userSelect="none"
              >
                <Text fontSize="sm" fontWeight="bold" color="white" fontFamily="'MS Sans Serif', Tahoma, sans-serif'">
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
                    aria-label="Minimize"
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
                    aria-label={isMaximized ? "Restore" : "Maximize"}
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
                    aria-label="Minimize" // Updated aria-label
                  >
                    X
                  </Button>
                </Stack>
              </Flex>

              <Box position="relative" p={4} bg="#ECE9D8">
                <Stack
                  direction={isMobile ? "column" : "row"}
                  justify="center"
                  my={2}
                  spacing={1}
                  p={2}
                  bg="#D4D0C8"
                  borderBottom="1px solid"
                  borderColor="#808080"
                  boxShadow="inset 1px 1px #fff, inset -1px -1px #808080"
                >
                  {["timer", "history", "tasks", "achievements"].map((tab) => (
                    <Button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      bg={activeTab === tab ? "#D4D0C8" : "#ECE9D8"}
                      color="#000000"
                      size="sm"
                      minW={isMobile ? "80px" : "100px"}
                      border="1px solid"
                      borderColor="#808080"
                      boxShadow={activeTab === tab ? "inset 1px 1px #fff" : "inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"}
                      _hover={{ bg: "#D4D0C8" }}
                      textTransform="capitalize"
                      fontWeight="normal"
                      fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
                      fontSize="12px"
                    >
                      {t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                    </Button>
                  ))}
                </Stack>

                <Box>
                  {activeTab === "timer" && <PomodoroTimer setIsSettingsOpen={setIsSettingsOpen} />}
                  {activeTab === "history" && <SessionHistory />}
                  {activeTab === "tasks" && <TaskList />}
                  {activeTab === "achievements" && <Achievements />}
                </Box>
              </Box>
            </Box>
          )}

          {!isStickyMinimized && (
            <StickyNote
              // ref is handled internally by StickyNote for its own drag logic
              // The forwarded ref (if App needed one for other purposes) would be passed here.
              // For now, App.js doesn't seem to require a ref to StickyNote itself.
              initialPosition={isMobile ? { x: window.innerWidth * 0.5 - 125, y: 100 } : stickyPosition}
              isDraggable={!isMobile}
            />
          )}

          <SettingsWindow
            // ref is handled internally by SettingsWindow for its drag handle.
            // App.js doesn't need a ref to SettingsWindow itself for other purposes.
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            initialPosition={isMobile ? { x: window.innerWidth * 0.5 - (useBreakpointValue({ base: window.innerWidth * 0.9, md: 400 }) / 2) , y: window.innerHeight * 0.1 } : settingsPosition}
            isDraggable={!isMobile}
            // onMouseDown is removed
          />

          <Taskbar
            openApps={openApps}
            onStartClick={handleStartClick}
            onAppClick={handleAppClick}
            setIsSettingsOpen={setIsSettingsOpen}
          />
        </>
      )}
    </Box>
  );
};

export default App;