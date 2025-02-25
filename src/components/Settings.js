import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  Stack,
  Select,
  Input,
} from "@chakra-ui/react";

const Settings = () => {
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
    theme,
    setTheme,
    keyboardShortcuts,
    setKeyboardShortcuts,
  } = useContext(AppContext);

  return (
    <Box p={6} bg="dark.200" borderRadius={8} boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Configurações
      </Text>
      <Stack spacing={4}>
        <Box>
          <Text mb={2}>Tempo de Trabalho (min):</Text>
          <NumberInput
            value={workTime}
            onChange={(_, value) => setWorkTime(value)}
            min={1}
            max={120}
            bg="dark.300"
            color="white"
            borderRadius={4}
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
            bg="dark.300"
            color="white"
            borderRadius={4}
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
            bg="dark.300"
            color="white"
            borderRadius={4}
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
            bg="dark.300"
            color="white"
            borderRadius={4}
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
        >
          Modo Estrito
        </Checkbox>
        <Checkbox
          isChecked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
          colorScheme="blue"
        >
          Notificações Sonoras
        </Checkbox>
        <Box>
          <Text mb={2}>Tema:</Text>
          <Select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            bg="dark.300"
            color="white"
            borderRadius={4}
          >
            <option value="dark">Escuro</option>
            <option value="light">Claro</option>
          </Select>
        </Box>
        <Box>
          <Text mb={2}>Atalhos de Teclado:</Text>
          <Stack spacing={2}>
            {Object.keys(keyboardShortcuts).map((key) => (
              <Box key={key}>
                <Text>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                <Input
                  value={keyboardShortcuts[key]}
                  onChange={(e) =>
                    setKeyboardShortcuts({
                      ...keyboardShortcuts,
                      [key]: e.target.value,
                    })
                  }
                  bg="dark.300"
                  color="white"
                  borderRadius={4}
                  maxLength={1}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Settings;