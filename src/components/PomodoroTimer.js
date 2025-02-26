import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  Progress,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

const PomodoroTimer = () => {
  const {
    workTime,
    setWorkTime,
    breakTime,
    setBreakTime,
    longBreakTime,
    setLongBreakTime,
    cyclesBeforeLongBreak,
    setCyclesBeforeLongBreak,
    strictMode,
    setStrictMode,
    notificationsEnabled,
    setNotificationsEnabled,
    sendNotification,
    sessions,
    setSessions,
  } = useContext(AppContext);

  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const audioRef = useRef(new Audio("/sound.mp3"));
  const timerRef = useRef(null); // Referência para o intervalo do timer

  // Função para formatar o tempo em MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // Memorize as funções para evitar re-renderizações desnecessárias
  const toggleTimer = useCallback(() => {
    if (!strictMode || !isRunning) {
      setIsRunning((prev) => !prev);
    }
  }, [strictMode, isRunning]);

  const resetTimer = useCallback(() => {
    if (!strictMode) {
      setIsRunning(false);
      setIsWorkSession(true);
      setTimeLeft(workTime * 60);
      setCycleCount(0);
    }
  }, [strictMode, workTime]);

  const handleConfigClose = useCallback(() => {
    setIsConfigOpen(false);
  }, []);

  // useEffect para gerenciar o timer (iniciar/parar a contagem regressiva)
  useEffect(() => {
    const startTimer = () => {
      if (isRunning && timeLeft > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    startTimer();

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // useEffect para lidar com a mudança de sessão quando timeLeft chega a 0
  useEffect(() => {
    if (timeLeft === 0) {
      if (notificationsEnabled) {
        audioRef.current.play().catch((error) => console.error("Erro ao tocar som:", error));
      }
      if (isWorkSession) {
        setCycleCount((prev) => prev + 1);
        setSessions((prev) => [
          ...prev,
          {
            date: new Date().toLocaleString(),
            duration: workTime,
            category: "Estudo",
          },
        ]);
      }
      const nextSessionTime = isWorkSession
        ? cycleCount >= cyclesBeforeLongBreak - 1
          ? longBreakTime * 60
          : breakTime * 60
        : workTime * 60;
      setIsWorkSession((prev) => !prev);
      setTimeLeft(nextSessionTime);
      setIsRunning(true);
    }
  }, [
    timeLeft,
    isWorkSession,
    workTime,
    breakTime,
    longBreakTime,
    cyclesBeforeLongBreak,
    cycleCount,
    notificationsEnabled,
    sendNotification,
    sessions,
  ]);

  // useEffect para salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem("workTime", workTime);
    localStorage.setItem("breakTime", breakTime);
    localStorage.setItem("longBreakTime", longBreakTime);
    localStorage.setItem("cyclesBeforeLongBreak", cyclesBeforeLongBreak);
    localStorage.setItem("strictMode", JSON.stringify(strictMode));
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
  }, [workTime, breakTime, longBreakTime, cyclesBeforeLongBreak, strictMode, notificationsEnabled]);

  // useEffect para carregar configurações do localStorage ao montar o componente
  useEffect(() => {
    const savedWorkTime = parseInt(localStorage.getItem("workTime")) || 25;
    const savedBreakTime = parseInt(localStorage.getItem("breakTime")) || 5;
    const savedLongBreakTime = parseInt(localStorage.getItem("longBreakTime")) || 15;
    const savedCycles = parseInt(localStorage.getItem("cyclesBeforeLongBreak")) || 4;
    const savedStrictMode = JSON.parse(localStorage.getItem("strictMode")) || false;
    const savedNotifications = JSON.parse(localStorage.getItem("notificationsEnabled")) || true;

    setWorkTime(savedWorkTime);
    setBreakTime(savedBreakTime);
    setLongBreakTime(savedLongBreakTime);
    setCyclesBeforeLongBreak(savedCycles);
    setStrictMode(savedStrictMode);
    setNotificationsEnabled(savedNotifications);
    setTimeLeft(savedWorkTime * 60); // Reinicia o timer com o workTime salvo
  }, [setWorkTime, setBreakTime, setLongBreakTime, setCyclesBeforeLongBreak, setStrictMode, setNotificationsEnabled]);

  // useEffect para atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (document.activeElement.tagName === "INPUT") return;
      switch (event.key) {
        case " ":
          event.preventDefault(); // Evita rolagem da página
          toggleTimer();
          break;
        case "r":
        case "R":
          resetTimer();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer, resetTimer]);

  // Calcular progresso para a Progress bar
  const totalTime = isWorkSession
    ? workTime * 60
    : cycleCount >= cyclesBeforeLongBreak - 1
    ? longBreakTime * 60
    : breakTime * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <Box
      p={6}
      bg="xpBlue.100"
      borderRadius={0}
      boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
      role="timer"
      aria-label="Pomodoro Timer - Mostra o tempo restante para trabalho ou pausa"
    >
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize="3xl" fontWeight="bold" aria-live="polite">
          {isWorkSession ? "Trabalho" : "Pausa"}
        </Text>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<SettingsIcon />}
            variant="outline"
            border="1px solid"
            borderColor="xpGray.200"
            bg="xpBlue.300"
            color="black"
            boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
            _hover={{ bg: "xpBlue.400" }}
            aria-label="Configurações do Temporizador"
          />
          <MenuList bg="xpBlue.100" borderColor="xpGray.200" boxShadow="1px 1px 2px rgba(0, 0, 0, 0.5)">
            <MenuItem onClick={() => setIsConfigOpen(true)} bg="xpBlue.100">
              Configurar Temporizador
            </MenuItem>
          </MenuList>
        </Menu>
      </Stack>
      <Text fontSize="5xl" fontFamily="mono" mb={4} aria-live="polite">
        {formatTime(timeLeft)}
      </Text>
      <Progress
        value={progress}
        colorScheme="blue"
        size="sm"
        mb={4}
        bg="xpGray.200"
        boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
        sx={{ transition: "width 0.5s ease-in-out" }}
        aria-label="Progresso do temporizador"
      />
      <Stack direction="row" spacing={4}>
        <Button
          onClick={toggleTimer}
          colorScheme={isRunning ? "yellow" : "blue"}
          size="lg"
          leftIcon={isRunning ? <>⏸</> : <>▶</>}
          isDisabled={strictMode && isRunning}
          bg={isRunning ? "xpYellow.500" : "xpBlue.300"}
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: isRunning ? "#FFD700" : "xpBlue.400" }}
          _disabled={{ bg: "xpGray.200", cursor: "not-allowed" }}
          aria-label={isRunning ? "Pausar temporizador" : "Iniciar temporizador"}
        >
          {isRunning ? "Pausar" : "Iniciar"}
        </Button>
        <Button
          onClick={resetTimer}
          colorScheme="red"
          size="lg"
          leftIcon={<>⏹</>}
          isDisabled={strictMode}
          bg="xpRed.500"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#FF4040" }}
          _disabled={{ bg: "xpGray.200", cursor: "not-allowed" }}
          aria-label="Reiniciar temporizador"
        >
          Reiniciar
        </Button>
      </Stack>

      <Modal isOpen={isConfigOpen} onClose={handleConfigClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
        <ModalContent
          bg="xpBlue.100"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
          aria-label="Configurações do Temporizador"
        >
          <ModalHeader bg="xpBlue.200" color="white" borderBottom="1px solid" borderColor="xpGray.200">
            Configurações do Temporizador
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Stack spacing={4}>
              <Box>
                <Text mb={2}>Tempo de Trabalho (min):</Text>
                <NumberInput
                  value={workTime}
                  onChange={(_, value) => setWorkTime(value)}
                  min={1}
                  max={120}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  aria-label="Tempo de trabalho em minutos"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text mb={2}>Tempo de Pausa Curta (min):</Text>
                <NumberInput
                  value={breakTime}
                  onChange={(_, value) => setBreakTime(value)}
                  min={1}
                  max={60}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  aria-label="Tempo de pausa curta em minutos"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text mb={2}>Tempo de Pausa Longa (min):</Text>
                <NumberInput
                  value={longBreakTime}
                  onChange={(_, value) => setLongBreakTime(value)}
                  min={1}
                  max={60}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  aria-label="Tempo de pausa longa em minutos"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Box>
                <Text mb={2}>Ciclos Antes da Pausa Longa:</Text>
                <NumberInput
                  value={cyclesBeforeLongBreak}
                  onChange={(_, value) => setCyclesBeforeLongBreak(value)}
                  min={1}
                  max={10}
                  bg="white"
                  color="xpGray.300"
                  border="1px solid"
                  borderColor="xpGray.200"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                  aria-label="Número de ciclos antes da pausa longa"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
              <Checkbox
                isChecked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                colorScheme="blue"
                borderColor="xpGray.200"
                bg="xpBlue.100"
                aria-label="Ativar modo estrito"
              >
                Modo Estrito (sem pausas ou reinícios manuais)
              </Checkbox>
              <Checkbox
                isChecked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                colorScheme="blue"
                borderColor="xpGray.200"
                bg="xpBlue.100"
                aria-label="Ativar notificações sonoras"
              >
                Notificações Sonoras
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleConfigClose}
              colorScheme="blue"
              bg="xpBlue.300"
              border="1px solid"
              borderColor="xpGray.200"
              boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
              _hover={{ bg: "xpBlue.400" }}
              aria-label="Salvar configurações"
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PomodoroTimer;