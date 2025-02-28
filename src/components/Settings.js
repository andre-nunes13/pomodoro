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
    keyboardShortcuts,
    setKeyboardShortcuts,
    language,
    setLanguage,
    t,
  } = useContext(AppContext);

  return (
    <Box
      p={6}
      bg="#ECE9D8" // Fundo azul claro padrão XP
      border="1px solid"
      borderColor="#808080" // Cinza XP
      boxShadow="inset 1px 1px #fff, inset -1px -1px #808080" // Efeito chanfrado XP
      h="calc(100vh - 70px)" // Altura ajustada para caber na janela menos cabeçalho e Taskbar
      maxH="calc(100vh - 70px)"
      overflowY="auto" // Barra de rolagem vertical
      color="#000000" // Texto preto padrão XP
      fontFamily="'MS Sans Serif', Tahoma, sans-serif" // Fonte XP
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {t("Settings")}
      </Text>
      <Stack spacing={4}>
        <Box>
          <Text mb={2} fontSize="sm">
            {t("Work Time (min)")}
          </Text>
          <NumberInput
            value={workTime}
            onChange={(_, value) => setWorkTime(value)}
            min={1}
            max={120}
            bg="#FFFFFF" // Branco para campos de entrada
            color="#000000"
            border="1px solid"
            borderColor="#808080"
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
          <Text mb={2} fontSize="sm">
            {t("Short Break Time (min)")}
          </Text>
          <NumberInput
            value={breakTime}
            onChange={(_, value) => setBreakTime(value)}
            min={1}
            max={60}
            bg="#FFFFFF"
            color="#000000"
            border="1px solid"
            borderColor="#808080"
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
          <Text mb={2} fontSize="sm">
            {t("Long Break Time (min)")}
          </Text>
          <NumberInput
            value={longBreakTime}
            onChange={(_, value) => setLongBreakTime(value)}
            min={1}
            max={60}
            bg="#FFFFFF"
            color="#000000"
            border="1px solid"
            borderColor="#808080"
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
          <Text mb={2} fontSize="sm">
            {t("Cycles Before Long Break")}
          </Text>
          <NumberInput
            value={cyclesBeforeLongBreak}
            onChange={(_, value) => setCyclesBeforeLongBreak(value)}
            min={1}
            max={10}
            bg="#FFFFFF"
            color="#000000"
            border="1px solid"
            borderColor="#808080"
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
          borderColor="#808080"
          bg="#ECE9D8"
          color="#000000"
        >
          {t("Strict Mode (no manual pauses or resets)")}
        </Checkbox>
        <Checkbox
          isChecked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
          colorScheme="blue"
          borderColor="#808080"
          bg="#ECE9D8"
          color="#000000"
        >
          {t("Sound Notifications")}
        </Checkbox>
        <Box>
          <Text mb={2} fontSize="sm">
          <Box>
          <Text mb={2} fontSize="sm">
            {t("Language")}
          </Text>
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            bg="#FFFFFF"
            color="#000000"
            border="1px solid"
            borderColor="#808080"
            boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
          >
            <option value="pt">{t("Portuguese")}</option>
            <option value="en">{t("English")}</option>
          </Select>
        </Box>
            {t("Keyboard Shortcuts")}
          </Text>
          <Stack spacing={2}>
            {Object.keys(keyboardShortcuts).map((key) => (
              <Box key={key}>
                <Text>{t(key.charAt(0).toUpperCase() + key.slice(1))}</Text>
                <Input
                  value={keyboardShortcuts[key]}
                  onChange={(e) =>
                    setKeyboardShortcuts({
                      ...keyboardShortcuts,
                      [key]: e.target.value,
                    })
                  }
                  bg="#FFFFFF"
                  color="#000000"
                  border="1px solid"
                  borderColor="#808080"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
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