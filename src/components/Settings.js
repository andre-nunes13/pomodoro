import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Box, Text, NumberInput, NumberInputField, Checkbox, Stack } from "@chakra-ui/react";

const Settings = () => {
  const {
    workTime,
    setWorkTime,
    breakTime,
    setBreakTime,
    strictMode,
    setStrictMode,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useContext(AppContext);

  return (
    <Box p={6} bg="dark.200" borderRadius={8} boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Configurações
      </Text>
      <Stack spacing={4}>
        <Box>
          <Text mb={1}>Tempo de Trabalho (min):</Text>
          <NumberInput
            value={workTime}
            onChange={(_, value) => setWorkTime(value)}
            min={1}
            bg="dark.300"
            color="white"
            borderRadius={4}
          >
            <NumberInputField />
          </NumberInput>
        </Box>
        <Box>
          <Text mb={1}>Tempo de Pausa (min):</Text>
          <NumberInput
            value={breakTime}
            onChange={(_, value) => setBreakTime(value)}
            min={1}
            bg="dark.300"
            color="white"
            borderRadius={4}
          >
            <NumberInputField />
          </NumberInput>
        </Box>
        <Checkbox
          isChecked={strictMode}
          onChange={() => setStrictMode(!strictMode)}
          colorScheme="blue"
        >
          Modo Estrito
        </Checkbox>
        <Checkbox
          isChecked={notificationsEnabled}
          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          colorScheme="blue"
        >
          Notificações
        </Checkbox>
      </Stack>
    </Box>
  );
};

export default Settings;