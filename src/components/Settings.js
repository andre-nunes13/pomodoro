import React, { useContext, forwardRef } from "react";
import { AppContext } from "../context/AppContext";
import {
  Box,
  Flex,
  Button,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";

// Usando forwardRef para passar a referência da barra de título
const SettingsWindow = forwardRef(({ isOpen, onClose, position, onMouseDown }, ref) => {
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
    resetSettings,
    t,
  } = useContext(AppContext);

  if (!isOpen) return null;

  return (
    <Box
      position="absolute"
      top={`${position.y}px`}
      left={`${position.x}px`}
      w="400px"
      h="500px"
      bg="#ECE9D8"
      border="2px solid"
      borderColor="#808080"
      boxShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
      zIndex={20}
    >
      {/* Barra de Título com ref para arrastar */}
      <Flex
        ref={ref} // Passando a referência para a lógica de arrastar
        onMouseDown={onMouseDown} // Adicionado
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
          fontFamily="'MS Sans Serif', Tahoma, sans-serif'"
        >
          {t("Settings")}
        </Text>
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
          onClick={onClose}
        >
          X
        </Button>
      </Flex>

      {/* Conteúdo da Janela */}
      <Tabs isFitted variant="enclosed" h="calc(100% - 30px)">
        <TabList bg="#D4D0C8" borderBottom="1px solid" borderColor="#808080">
          <Tab
            _selected={{ bg: "#ECE9D8", borderTop: "2px solid #FFFFFF", borderBottom: "none" }}
            border="1px solid"
            borderColor="#808080"
            boxShadow="inset 1px 1px #fff"
            fontSize="12px"
          >
            {t("Timer")}
          </Tab>
          <Tab
            _selected={{ bg: "#ECE9D8", borderTop: "2px solid #FFFFFF", borderBottom: "none" }}
            border="1px solid"
            borderColor="#808080"
            boxShadow="inset 1px 1px #fff"
            fontSize="12px"
          >
            {t("Notifications")}
          </Tab>
          <Tab
            _selected={{ bg: "#ECE9D8", borderTop: "2px solid #FFFFFF", borderBottom: "none" }}
            border="1px solid"
            borderColor="#808080"
            boxShadow="inset 1px 1px #fff"
            fontSize="12px"
          >
            {t("Interface")}
          </Tab>
        </TabList>

        <TabPanels h="calc(100% - 40px)" overflowY="auto">
          {/* Aba Timer */}
          <TabPanel p={4}>
            <Stack spacing={4}>
              <Box>
                <Text mb={2} fontSize="sm">{t("Work Time (min)")}</Text>
                <NumberInput
                  value={workTime}
                  onChange={(_, value) => setWorkTime(value)}
                  min={1}
                  max={120}
                  bg="#FFFFFF"
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
                <Text mb={2} fontSize="sm">{t("Short Break Time (min)")}</Text>
                <NumberInput
                  value={breakTime}
                  onChange={(_, value) => setBreakTime(value)}
                  min={1}
                  max={60}
                  bg="#FFFFFF"
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
                <Text mb={2} fontSize="sm">{t("Long Break Time (min)")}</Text>
                <NumberInput
                  value={longBreakTime}
                  onChange={(_, value) => setLongBreakTime(value)}
                  min={1}
                  max={60}
                  bg="#FFFFFF"
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
                <Text mb={2} fontSize="sm">{t("Cycles Before Long Break")}</Text>
                <NumberInput
                  value={cyclesBeforeLongBreak}
                  onChange={(_, value) => setCyclesBeforeLongBreak(value)}
                  min={1}
                  max={10}
                  bg="#FFFFFF"
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
            </Stack>
          </TabPanel>

          {/* Aba Notifications */}
          <TabPanel p={4}>
            <Stack spacing={4}>
              <Checkbox
                isChecked={strictMode}
                onChange={(e) => setStrictMode(e.target.checked)}
                colorScheme="blue"
                borderColor="#808080"
                bg="#ECE9D8"
              >
                {t("Strict Mode (no manual pauses or resets)")}
              </Checkbox>
              <Checkbox
                isChecked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                colorScheme="blue"
                borderColor="#808080"
                bg="#ECE9D8"
              >
                {t("Sound Notifications")}
              </Checkbox>
            </Stack>
          </TabPanel>

          {/* Aba Interface */}
          <TabPanel p={4}>
            <Stack spacing={4}>
              <Box>
                <Text mb={2} fontSize="sm">{t("Language")}</Text>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  bg="#FFFFFF"
                  border="1px solid"
                  borderColor="#808080"
                  boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                >
                  <option value="pt">{t("Portuguese")}</option>
                  <option value="en">{t("English")}</option>
                </Select>
              </Box>
              <Box>
                <Text mb={2} fontSize="sm">{t("Keyboard Shortcuts")}</Text>
                <Stack spacing={2}>
                  {Object.keys(keyboardShortcuts).map((key) => (
                    <Flex key={key} align="center">
                      <Text w="100px" fontSize="sm">
                        {t(key.charAt(0).toUpperCase() + key.slice(1))}
                      </Text>
                      <Input
                        value={keyboardShortcuts[key]}
                        onChange={(e) =>
                          setKeyboardShortcuts({
                            ...keyboardShortcuts,
                            [key]: e.target.value,
                          })
                        }
                        bg="#FFFFFF"
                        border="1px solid"
                        borderColor="#808080"
                        boxShadow="inset 1px 1px 2px rgba(0, 0, 0, 0.2)"
                        maxLength={1}
                        w="50px"
                      />
                    </Flex>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Botões de Controle */}
      <Flex justify="flex-end" p={2} borderTop="1px solid" borderColor="#808080" bg="#ECE9D8">
        <Button
          size="sm"
          bg="#C0C0C0"
          border="1px solid"
          borderColor="#808080"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#D4D0C8" }}
          mr={2}
          onClick={resetSettings}
        >
          {t("Reset")}
        </Button>
        <Button
          size="sm"
          bg="#C0C0C0"
          border="1px solid"
          borderColor="#808080"
          boxShadow="inset 1px 1px #fff, 1px 1px 2px rgba(0, 0, 0, 0.5)"
          _hover={{ bg: "#D4D0C8" }}
          onClick={onClose}
        >
          {t("OK")}
        </Button>
      </Flex>
    </Box>
  );
});

export default SettingsWindow;