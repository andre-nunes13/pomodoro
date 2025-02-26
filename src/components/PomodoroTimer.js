import React, { useState, useEffect, useContext, useRef } from "react";
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

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      if (notificationsEnabled) audioRef.current.play().catch((error) => console.error("Erro ao tocar som:", error));
      if (isWorkSession) {
        setCycleCount((prev) => prev + 1);
        setSessions([
          ...sessions,
          {
            date: new Date().toLocaleString(),
            duration: workTime,
            category: "Estudo",
          },
        ]);
      }
      if (!isWorkSession && cycleCount >= cyclesBeforeLongBreak) {
        setTimeLeft(longBreakTime * 60);
        setCycleCount(0);
      } else {
        setIsWorkSession(!isWorkSession);
        setTimeLeft(isWorkSession ? workTime * 60 : (cycleCount >= cyclesBeforeLongBreak ? longBreakTime * 60 : breakTime * 60));
      }
      setIsRunning(true);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorkSession, workTime, breakTime, longBreakTime, cyclesBeforeLongBreak, cycleCount, notificationsEnabled, sendNotification, sessions]);

  const toggleTimer = () => {
    if (!strictMode || !isRunning) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    if (!strictMode) {
      setIsRunning(false);
      setIsWorkSession(true);
      setTimeLeft(workTime * 60);
      setCycleCount(0);
    }
  };

  const handleConfigClose = () => setIsConfigOpen(false);

  const progress =
    ((isWorkSession ? workTime * 60 : (cycleCount >= cyclesBeforeLongBreak ? longBreakTime * 60 : breakTime * 60) - timeLeft) /
      (isWorkSession ? workTime * 60 : (cycleCount >= cyclesBeforeLongBreak ? longBreakTime * 60 : breakTime * 60))) *
    100;

  return (
    <Box p={6} bg="xpBlue.100" borderRadius={0} boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)">
      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <Text fontSize="3xl" fontWeight="bold">
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
      <Text fontSize="5xl" fontFamily="mono" mb={4}>
        {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </Text>
      <Progress value={progress} colorScheme="blue" size="sm" mb={4} bg="xpGray.200" boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)" />
      <Stack direction="row" spacing={4}>
        <Button
          onClick={toggleTimer}
          colorScheme="blue"
          size="lg"
          leftIcon={isRunning ? <>⏸</> : <>▶</>}
          isDisabled={strictMode && isRunning}
          bg="xpBlue.300"
          border="1px solid"
          borderColor="xpGray.200"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "xpBlue.400" }}
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
        >
          Reiniciar
        </Button>
      </Stack>

      <Modal isOpen={isConfigOpen} onClose={handleConfigClose}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" /> {/* Overlay com opacidade, mas modal sólido */}
        <ModalContent bg="xpBlue.100" border="1px solid" borderColor="xpGray.200" boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)">
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
              >
                Modo Estrito (sem pausas ou reinícios manuais)
              </Checkbox>
              <Checkbox
                isChecked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                colorScheme="blue"
                borderColor="xpGray.200"
                bg="xpBlue.100"
              >
                Notificações Sonoras
              </Checkbox>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleConfigClose} bg="xpBlue.300" border="1px solid" borderColor="xpGray.200" boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PomodoroTimer;