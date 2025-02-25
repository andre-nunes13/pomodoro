import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Text, Progress, Button, Stack } from "@chakra-ui/react";

const PomodoroTimer = () => {
  const {
    workTime,
    breakTime,
    strictMode,
    sendNotification,
    sessions,
    setSessions,
  } = useContext(AppContext);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      const sessionType = isWorkSession ? "Work" : "Break";
      sendNotification(`${sessionType} Finalizado`, {
        body: `Tempo de ${sessionType.toLowerCase()} concluído!`,
      });
      if (isWorkSession) {
        setSessions([
          ...sessions,
          {
            date: new Date().toLocaleString(),
            duration: workTime,
            category: "Estudo",
          },
        ]);
      }
      setIsWorkSession(!isWorkSession);
      setTimeLeft(isWorkSession ? breakTime * 60 : workTime * 60);
      setIsRunning(true); // Inicia automaticamente após a pausa
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isWorkSession, workTime, breakTime]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => !strictMode && setIsRunning(false);
  const resetTimer = () => {
    if (!strictMode) {
      setIsRunning(false);
      setTimeLeft(isWorkSession ? workTime * 60 : breakTime * 60);
    }
  };

  const progress = ((isWorkSession ? workTime * 60 : breakTime * 60 - timeLeft) / (isWorkSession ? workTime * 60 : breakTime * 60)) * 100;

  return (
    <Box p={6} bg="dark.200" borderRadius={8} boxShadow="md">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        {isWorkSession ? "Trabalho" : "Pausa"}
      </Text>
      <Text fontSize="5xl" fontFamily="mono" mb={4}>
        {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </Text>
      <Progress value={progress} colorScheme="blue" size="sm" mb={4} />
      <Stack direction="row" spacing={4}>
        <Button onClick={startTimer} colorScheme="blue">
          Iniciar
        </Button>
        <Button
          onClick={pauseTimer}
          colorScheme="yellow"
          isDisabled={strictMode}
        >
          Pausar
        </Button>
        <Button
          onClick={resetTimer}
          colorScheme="red"
          isDisabled={strictMode}
        >
          Reiniciar
        </Button>
      </Stack>
    </Box>
  );
};

export default PomodoroTimer;